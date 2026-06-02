#!/usr/bin/env node
'use strict';

// scraper-leads.js — Scraping de prospects GMB via Google Places API (New)
// Usage: node scripts/scraper-leads.js --category coiffeur --city Bordeaux --max 20

const https = require('https');
const fs = require('fs');
const path = require('path');

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { category: null, city: null, max: 20, output: 'leads.csv' };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--category': result.category = args[++i]; break;
      case '--city':     result.city = args[++i]; break;
      case '--max':      result.max = parseInt(args[++i], 10) || 20; break;
      case '--output':   result.output = args[++i]; break;
    }
  }
  return result;
}

function httpsPost(url, body, headers) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr), ...headers },
    };
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Réponse API invalide : ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function textSearch(query, apiKey, pageToken) {
  const body = { textQuery: query, languageCode: 'fr', pageSize: 20 };
  if (pageToken) body.pageToken = pageToken;
  const fields = 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,nextPageToken';
  return httpsPost(
    'https://places.googleapis.com/v1/places:searchText',
    body,
    { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': fields }
  );
}

function scoreLead(place) {
  const avis = place.userRatingCount || 0;
  const note = place.rating || 0;
  const hasSite = !!place.websiteUri;
  let score = 0;
  if (avis < 50) score += 2;
  if (note < 4.0 && note > 0) score += 2;
  if (!hasSite) score += 2;
  if (score >= 4) return { scoreLabel: 'Très Chaud', priorite: 1 };
  if (score >= 2) return { scoreLabel: 'Chaud', priorite: 2 };
  return { scoreLabel: 'Tiède', priorite: 3 };
}

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function generateCsv(leads) {
  const BOM = '\uFEFF';
  const headers = ['Nom', 'Adresse', 'Téléphone', 'Site Web', 'Note Google', "Nombre d'avis", 'Score prospect', 'Priorité'];
  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(';') || str.includes('"') || str.includes('\n'))
      return '"' + str.replace(/"/g, '""') + '"';
    return str;
  };
  const rows = leads.map((l) => [
    escape(l.name), escape(l.address), escape(l.phone), escape(l.website),
    escape(l.rating), escape(l.totalRatings), escape(l.scoreLabel), escape(l.priorite),
  ].join(';'));
  return BOM + [headers.join(';'), ...rows].join('\r\n');
}

async function main() {
  loadDotEnv();
  const args = parseArgs();

  if (!args.category || !args.city) {
    console.error('\nErreur : --category et --city sont requis.');
    console.error('Exemple : node scripts/scraper-leads.js --category coiffeur --city Bordeaux --max 20\n');
    process.exit(1);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('\nClé API manquante — ajoutez GOOGLE_PLACES_API_KEY dans .env.local\n');
    process.exit(1);
  }

  const query = `${args.category} ${args.city}`;
  console.log(`\nRecherche : "${query}" (max ${args.max} résultats)`);
  console.log('Appel Google Places API (New)...\n');

  const places = [];
  let pageToken = null;
  let page = 0;

  while (places.length < args.max) {
    if (page > 0) await wait(2000);
    let response;
    try { response = await textSearch(query, apiKey, pageToken); }
    catch (err) { console.error('Erreur recherche : ' + err.message); break; }

    if (response.error) {
      console.error('\nErreur API : ' + (response.error.message || JSON.stringify(response.error)));
      process.exit(1);
    }
    if (!response.places || response.places.length === 0) {
      console.log('Aucun résultat trouvé.'); break;
    }

    for (const r of response.places) {
      if (places.length >= args.max) break;
      places.push(r);
    }
    pageToken = response.nextPageToken || null;
    page++;
    if (!pageToken || places.length >= args.max) break;
  }

  console.log(`${places.length} établissement(s) trouvé(s).\n`);

  const leads = [];
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const name = p.displayName?.text || p.displayName || 'Inconnu';
    const { scoreLabel, priorite } = scoreLead(p);
    process.stdout.write(`  [${i + 1}/${places.length}] ${name} → ${scoreLabel}\n`);
    leads.push({
      name,
      address: p.formattedAddress || '',
      phone: p.nationalPhoneNumber || '',
      website: p.websiteUri || '',
      rating: p.rating !== undefined ? p.rating : '',
      totalRatings: p.userRatingCount !== undefined ? p.userRatingCount : '',
      scoreLabel,
      priorite,
    });
  }

  const csvContent = generateCsv(leads);
  const outputPath = path.resolve(process.cwd(), args.output);
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  const tresChaud = leads.filter((l) => l.scoreLabel === 'Très Chaud').length;
  const chaud = leads.filter((l) => l.scoreLabel === 'Chaud').length;
  const tiede = leads.filter((l) => l.scoreLabel === 'Tiède').length;

  console.log('\n======================================================');
  console.log('  RÉSUMÉ');
  console.log('======================================================');
  console.log(`  Total trouvés       : ${leads.length}`);
  console.log(`  Très Chaud (P1)     : ${tresChaud}`);
  console.log(`  Chaud      (P2)     : ${chaud}`);
  console.log(`  Tiède      (P3)     : ${tiede}`);
  console.log(`  Fichier CSV généré  : ${outputPath}`);
  console.log('======================================================\n');
}

main().catch((err) => { console.error('\nErreur : ' + err.message); process.exit(1); });
