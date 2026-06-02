#!/usr/bin/env node
'use strict';

// send-leads.js — Scrape les emails depuis les sites web du CSV + envoie via Brevo
// Usage: node scripts/send-leads.js --input leads.csv --sender "Thomas" --senderemail "thomas@klevano.com"

const https = require('https');
const http = require('http');
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
  const result = { input: 'leads.csv', sender: 'Thomas', senderemail: '', dryrun: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':       result.input = args[++i]; break;
      case '--sender':      result.sender = args[++i]; break;
      case '--senderemail': result.senderemail = args[++i]; break;
      case '--dryrun':      result.dryrun = true; break;
    }
  }
  return result;
}

function parseCsv(content) {
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const cols = line.split(';').map(c => c.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] || ''; });
    return obj;
  });
}

function fetchUrl(rawUrl, timeout = 8000) {
  return new Promise((resolve, reject) => {
    let url;
    try { url = new URL(rawUrl); } catch { return reject(new Error('URL invalide')); }
    const mod = url.protocol === 'https:' ? https : http;
    const options = { hostname: url.hostname, path: url.pathname + url.search, method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Klevano/1.0)', 'Accept': 'text/html' },
      timeout };
    const req = mod.request(options, (res) => {
      // Suivre les redirections (max 2)
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : url.origin + res.headers.location;
        return fetchUrl(next, timeout).then(resolve).catch(reject);
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; if (data.length > 200000) res.destroy(); });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function extractEmails(html) {
  const found = new Set();
  // mailto: links
  const mailtoRe = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi;
  let m;
  while ((m = mailtoRe.exec(html)) !== null) found.add(m[1].toLowerCase());
  // emails dans le texte
  const emailRe = /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/g;
  while ((m = emailRe.exec(html)) !== null) {
    const email = m[1].toLowerCase();
    // Filtrer les faux positifs courants
    if (!email.includes('example') && !email.includes('test@') && !email.endsWith('.png') &&
        !email.endsWith('.jpg') && !email.includes('sentry') && !email.includes('wix') &&
        !email.includes('wordpress') && !email.includes('schema') && !email.includes('@2x')) {
      found.add(email);
    }
  }
  return [...found];
}

async function scrapeEmail(website) {
  if (!website) return null;
  const base = website.startsWith('http') ? website : 'https://' + website;
  // Essayer la page d'accueil puis /contact
  const urls = [base, base.replace(/\/$/, '') + '/contact', base.replace(/\/$/, '') + '/contact-us',
                base.replace(/\/$/, '') + '/nous-contacter', base.replace(/\/$/, '') + '/a-propos'];
  for (const url of urls) {
    try {
      const html = await fetchUrl(url);
      const emails = extractEmails(html);
      if (emails.length > 0) return emails[0];
    } catch {}
  }
  return null;
}

function buildEmail(lead, senderName, senderEmail) {
  const name = lead['Nom'] || 'votre établissement';
  const subject = `${name} — votre visibilité Google`;
  const html = `
<p>Bonjour,</p>

<p>J'ai regardé la fiche Google de <strong>${name}</strong> et j'ai remarqué que vous avez
${lead["Nombre d'avis"] || 'peu d\''}  avis — vos concurrents directs en ont souvent 2 à 3 fois plus.</p>

<p>En pratique, ça veut dire que quand quelqu'un cherche un charpentier près de chez vous sur Google,
vous apparaissez peut-être derrière des concurrents qui ne sont pas forcément meilleurs que vous.</p>

<p><strong>Klevano</strong> automatise exactement ça : collecte d'avis, optimisation de la fiche Google,
suivi de votre classement. Nos clients gagnent en moyenne 2 positions sur Google Maps en 60 jours.</p>

<p>Est-ce que ça vous intéresse de voir ce que ça donnerait pour ${name} ?
Je peux vous montrer un <strong>audit gratuit en 15 minutes</strong> cette semaine.</p>

<p>Bonne journée,<br>
${senderName}<br>
Klevano — <a href="https://klevano.com">klevano.com</a></p>

<p style="color:#999;font-size:12px;">Pour ne plus recevoir ces emails, répondez simplement "stop".</p>
  `.trim();

  const text = `Bonjour,\n\nJ'ai regardé la fiche Google de ${name} et j'ai remarqué que vous avez ${lead["Nombre d'avis"] || 'peu d\''} avis — vos concurrents directs en ont souvent 2 à 3 fois plus.\n\nKlevano automatise la collecte d'avis et l'optimisation de votre fiche Google. Nos clients gagnent en moyenne 2 positions sur Maps en 60 jours.\n\nUn audit gratuit de 15 minutes cette semaine ?\n\nBonne journée,\n${senderName}\nKlevano — klevano.com`;

  return { subject, html, text };
}

function sendBrevoEmail(to, subject, html, text, senderName, senderEmail, apiKey) {
  const body = JSON.stringify({
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
  });
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey, 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data || '{}'));
        else reject(new Error(`Brevo ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  loadDotEnv();
  const args = parseArgs();

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) { console.error('\nBREVO_API_KEY manquant dans .env.local\n'); process.exit(1); }

  if (!args.senderemail) {
    console.error('\nErreur : --senderemail requis');
    console.error('Exemple : node scripts/send-leads.js --input leads.csv --sender "Thomas" --senderemail "thomas@klevano.com"\n');
    process.exit(1);
  }

  const csvPath = path.resolve(process.cwd(), args.input);
  if (!fs.existsSync(csvPath)) { console.error(`\nFichier introuvable : ${csvPath}\n`); process.exit(1); }

  const leads = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  // Trier par priorité (Très Chaud d'abord)
  leads.sort((a, b) => (parseInt(a['Priorité']) || 9) - (parseInt(b['Priorité']) || 9));

  console.log(`\n${leads.length} prospects chargés depuis ${args.input}`);
  if (args.dryrun) console.log('MODE DRY RUN — aucun email ne sera envoyé\n');
  console.log('');

  let sent = 0, skipped = 0, noEmail = 0;
  const results = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const name = lead['Nom'] || '?';
    const score = lead['Score prospect'] || '?';
    const website = lead['Site Web'] || '';

    process.stdout.write(`[${i + 1}/${leads.length}] ${name} (${score})`);

    if (!website) {
      process.stdout.write(' → Pas de site web, email introuvable\n');
      results.push({ name, score, email: '', status: 'Pas de site' });
      noEmail++;
      continue;
    }

    process.stdout.write(' → Recherche email...');
    const email = await scrapeEmail(website);

    if (!email) {
      process.stdout.write(' introuvable\n');
      results.push({ name, score, email: '', status: 'Email introuvable' });
      noEmail++;
      continue;
    }

    process.stdout.write(` ${email}`);

    const { subject, html, text } = buildEmail(lead, args.sender, args.senderemail);

    if (args.dryrun) {
      process.stdout.write(' → [DRY RUN OK]\n');
      results.push({ name, score, email, status: 'Dry run' });
      sent++;
    } else {
      try {
        await sendBrevoEmail(email, subject, html, text, args.sender, args.senderemail, brevoKey);
        process.stdout.write(' → Envoyé ✓\n');
        results.push({ name, score, email, status: 'Envoyé' });
        sent++;
        await wait(1500); // Respecter les limites Brevo
      } catch (err) {
        process.stdout.write(` → Erreur: ${err.message}\n`);
        results.push({ name, score, email, status: 'Erreur: ' + err.message });
        skipped++;
      }
    }
  }

  console.log('\n======================================================');
  console.log('  RÉSUMÉ');
  console.log('======================================================');
  console.log(`  Emails envoyés      : ${sent}`);
  console.log(`  Email introuvable   : ${noEmail}`);
  console.log(`  Erreurs             : ${skipped}`);
  console.log('======================================================\n');

  // Sauvegarder le rapport
  const reportPath = path.resolve(process.cwd(), 'rapport-envoi.txt');
  const reportLines = results.map(r => `[${r.status}] ${r.name} (${r.score}) — ${r.email || 'pas d\'email'}`);
  fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8');
  console.log(`Rapport sauvegardé : ${reportPath}\n`);
}

main().catch(err => { console.error('\nErreur : ' + err.message); process.exit(1); });
