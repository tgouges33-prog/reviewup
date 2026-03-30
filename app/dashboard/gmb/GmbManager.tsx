"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Location = {
  title?: string;
  profile?: { description?: string };
  phoneNumbers?: { primaryPhone?: string };
  websiteUri?: string;
  regularHours?: {
    periods?: Array<{
      openDay: string;
      closeDay: string;
      openTime: { hours: number; minutes?: number };
      closeTime: { hours: number; minutes?: number };
    }>;
  };
  categories?: { primaryCategory?: { displayName?: string } };
  storefrontAddress?: { addressLines?: string[]; locality?: string; postalCode?: string };
};

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche",
};

function formatTime(t: { hours: number; minutes?: number }) {
  return `${String(t.hours).padStart(2, "0")}:${String(t.minutes ?? 0).padStart(2, "0")}`;
}

export default function GmbManager({ isPro }: { isPro: boolean }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [gmbRequired, setGmbRequired] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  // Stats (Pro only)
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/gmb/location")
      .then((r) => r.json())
      .then((data) => {
        if (data.gmb_required) {
          setGmbRequired(true);
        } else if (data.error) {
          setError(data.error);
        } else {
          const loc = data.location;
          setLocation(loc);
          setTitle(loc.title ?? "");
          setDescription(loc.profile?.description ?? "");
          setPhone(loc.phoneNumbers?.primaryPhone ?? "");
          setWebsite(loc.websiteUri ?? "");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    if (isPro) {
      setStatsLoading(true);
      fetch("/api/gmb/stats")
        .then((r) => r.json())
        .then((data) => { if (!data.error && !data.gmb_required) setStats(data.stats); })
        .finally(() => setStatsLoading(false));
    }
  }, [isPro]);

  async function saveField(section: string, fields: Record<string, any>, updateMask: string) {
    setSaving(section);
    try {
      const res = await fetch("/api/gmb/location", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, updateMask }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Erreur : ${data.error}`);
      } else {
        setLocation(data.location);
        setSaved(section);
        setTimeout(() => setSaved(null), 3000);
      }
    } catch (e: any) {
      alert(`Erreur réseau : ${e.message}`);
    }
    setSaving(null);
  }

  function sumMetric(stats: any, metricName: string): number {
    const series = stats?.multiDailyMetricTimeSeries?.find((s: any) =>
      s.dailyMetric === metricName
    );
    if (!series) return 0;
    return (series.timeSeries?.datedValues ?? []).reduce(
      (sum: number, v: any) => sum + (parseInt(v.value ?? "0") || 0), 0
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        <span className="animate-spin mr-2">⏳</span> Chargement de la fiche...
      </div>
    );
  }

  if (gmbRequired) {
    return (
      <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-10 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🔗</div>
        <h2 className="font-semibold text-gray-900 text-lg mb-2">Compte Google non connecté</h2>
        <p className="text-gray-500 text-sm mb-6">Connectez votre compte Google My Business pour gérer votre fiche.</p>
        <Link
          href="/dashboard/gmb-connect"
          className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          Connecter mon compte GMB →
        </Link>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-sm">Erreur : {error}</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Stats Pro */}
      {isPro && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📊 Statistiques des 28 derniers jours
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Pro</span>
          </h2>
          {statsLoading ? (
            <p className="text-sm text-gray-400">Chargement des stats...</p>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Vues (Maps)", value: sumMetric(stats, "BUSINESS_IMPRESSIONS_MOBILE_MAPS") + sumMetric(stats, "BUSINESS_IMPRESSIONS_DESKTOP_MAPS"), icon: "📍" },
                { label: "Vues (Recherche)", value: sumMetric(stats, "BUSINESS_IMPRESSIONS_MOBILE_SEARCH") + sumMetric(stats, "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH"), icon: "🔍" },
                { label: "Clics site web", value: sumMetric(stats, "WEBSITE_CLICKS"), icon: "🌐" },
                { label: "Clics appel", value: sumMetric(stats, "CALL_CLICKS"), icon: "📞" },
              ].map((s) => (
                <div key={s.label} className="bg-[#f8f9ff] rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p className="text-2xl font-extrabold text-gray-900">{s.value.toLocaleString("fr-FR")}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Statistiques non disponibles pour cette fiche.</p>
          )}
        </div>
      )}

      {/* Titre */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">🏢 Nom de l'établissement</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition mb-4"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveField("title", { title }, "title")}
            disabled={saving === "title"}
            className="px-5 py-2 rounded-full text-sm font-medium text-white cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            {saving === "title" ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          {saved === "title" && <span className="text-green-600 text-sm">✓ Sauvegardé sur Google</span>}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">📝 Description</h2>
        <p className="text-xs text-gray-400 mb-4">750 caractères max — apparaît sur votre fiche Google</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={750}
          rows={5}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition resize-none mb-1"
        />
        <p className="text-xs text-gray-400 mb-4 text-right">{description.length}/750</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveField("description", { profile: { description } }, "profile.description")}
            disabled={saving === "description"}
            className="px-5 py-2 rounded-full text-sm font-medium text-white cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            {saving === "description" ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          {saved === "description" && <span className="text-green-600 text-sm">✓ Sauvegardé sur Google</span>}
        </div>
      </div>

      {/* Téléphone & Site */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">📞 Téléphone & Site web</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Téléphone principal</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : +33612345678"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Site web</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://monsite.fr"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveField("contact", {
              phoneNumbers: { primaryPhone: phone },
              websiteUri: website,
            }, "phoneNumbers,websiteUri")}
            disabled={saving === "contact"}
            className="px-5 py-2 rounded-full text-sm font-medium text-white cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            {saving === "contact" ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          {saved === "contact" && <span className="text-green-600 text-sm">✓ Sauvegardé sur Google</span>}
        </div>
      </div>

      {/* Adresse (lecture seule) */}
      {location?.storefrontAddress && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-3">📍 Adresse</h2>
          <p className="text-sm text-gray-600">
            {location.storefrontAddress.addressLines?.join(", ")}{" "}
            {location.storefrontAddress.postalCode} {location.storefrontAddress.locality}
          </p>
          <p className="text-xs text-gray-400 mt-2">Pour modifier l'adresse, rendez-vous directement sur Google My Business.</p>
        </div>
      )}

      {/* Horaires */}
      {location?.regularHours?.periods && location.regularHours.periods.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">🕐 Horaires d'ouverture</h2>
          <div className="space-y-2">
            {location.regularHours.periods.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                <span className="font-medium text-gray-700 w-28">{DAY_LABELS[p.openDay] ?? p.openDay}</span>
                <span className="text-gray-600">{formatTime(p.openTime)} — {formatTime(p.closeTime)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">La modification des horaires sera disponible prochainement.</p>
        </div>
      )}

      {/* Catégorie */}
      {location?.categories?.primaryCategory && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-3">🏷️ Catégorie principale</h2>
          <p className="text-sm text-gray-600">{location.categories.primaryCategory.displayName}</p>
          <p className="text-xs text-gray-400 mt-2">Pour modifier les catégories, rendez-vous directement sur Google My Business.</p>
        </div>
      )}

      {/* Avis — Pro only */}
      {isPro && (
        <div className="bg-white rounded-xl border border-[#667eea]/30 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            💬 Gestion des avis
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Pro</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">Répondez à vos avis avec l'IA et publiez directement sur Google.</p>
          <Link
            href="/dashboard/reviews"
            className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-medium hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            Gérer les avis →
          </Link>
        </div>
      )}

      {/* Upgrade banner — Essentiel only */}
      {!isPro && (
        <div
          className="rounded-xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <h3 className="font-bold text-lg mb-1">✦ Passez au Plan Professionnel</h3>
          <p className="text-white/80 text-sm mb-4">
            Accédez aux statistiques complètes, à la gestion des avis avec IA, et à l'optimisation avancée de votre fiche.
          </p>
          <Link
            href="/#pricing"
            className="inline-block bg-white text-[#667eea] font-semibold px-5 py-2.5 rounded-full text-sm hover:-translate-y-0.5 transition-all"
          >
            Voir l'offre Pro →
          </Link>
        </div>
      )}
    </div>
  );
}
