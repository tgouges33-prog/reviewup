"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    key: "free",
    name: "Gratuit",
    price: "0",
    subtitle: "Pour voir où vous en êtes",
    featured: false,
    cta: "Commencer gratuitement →",
    features: [
      "Connexion Google My Business",
      "Score de santé de la fiche",
    ],
    locked: [
      "Recommandations verrouillées",
      "Optimisation GMB verrouillée",
      "Collecte d'avis verrouillée",
    ],
  },
  {
    key: "essentiel",
    name: "Essentiel",
    price: "99",
    subtitle: "Optimisation GMB complète",
    featured: false,
    cta: "Démarrer →",
    features: [
      "Tout le plan Gratuit",
      "Recommandations IA complètes",
      "Checklist d'optimisation déverrouillée",
      "Suggestions de description optimisée",
      "Suivi de l'évolution de la fiche",
      "Support par email",
    ],
    locked: [],
  },
  {
    key: "pro",
    name: "Pro",
    price: "169",
    subtitle: "GMB + Collecte d'avis automatique",
    featured: true,
    cta: "Mettre à niveau →",
    features: [
      "Tout le plan Essentiel",
      "Lien de collecte d'avis personnalisé",
      "Envoi email aux clients",
      "Rappels automatiques",
      "Avis & Feedbacks centralisés",
      "Analytics avancés",
      "Support prioritaire",
    ],
    locked: [],
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planKey: string) {
    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Erreur : ${data.error}`);
        setLoading(null);
      }
    } catch {
      alert("Erreur réseau. Réessayez.");
      setLoading(null);
    }
  }

  return (
    <section className="py-20 px-5 bg-[#f8f9ff]" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Commencez gratuitement, évoluez selon vos besoins
        </h2>
        <p className="text-center text-gray-500 mb-14">
          Sans engagement · Résiliez à tout moment · Paiement sécurisé Stripe
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.key}
              className={`relative bg-white rounded-2xl p-8 flex flex-col transition-all ${
                p.featured
                  ? "border-2 border-[#667eea] shadow-2xl md:-mt-4 md:mb-4"
                  : "border-2 border-gray-200 hover:shadow-lg"
              }`}
            >
              {p.featured && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  ⭐ Recommandé
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-4xl font-extrabold my-3" style={{ color: "#667eea" }}>
                {p.price}€<span className="text-gray-400 text-sm font-normal">/mois</span>
              </p>
              <p className="text-gray-500 text-xs mb-6">{p.subtitle}</p>

              <ul className="space-y-2 mb-4 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: "#667eea" }}>✓</span>
                    {f}
                  </li>
                ))}
                {p.locked.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="flex-shrink-0 mt-0.5">🔒</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {p.key === "free" ? (
                  <Link
                    href="/login"
                    className="block w-full py-3 rounded-full font-semibold text-sm text-center border-2 border-[#667eea] text-[#667eea] hover:bg-[#667eea]/5 transition-all"
                  >
                    {p.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleCheckout(p.key)}
                    disabled={loading === p.key}
                    className="w-full py-3 rounded-full font-bold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                  >
                    {loading === p.key ? "Redirection..." : p.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          CB, Apple Pay, Google Pay acceptés
        </p>
      </div>
    </section>
  );
}
