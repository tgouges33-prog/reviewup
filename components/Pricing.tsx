"use client";

import { useState } from "react";

const plans = [
  {
    key: "essentiel",
    name: "Essentiel",
    price: "99",
    subtitle: "Pour les petites entreprises",
    featured: false,
    cta: "Démarrer maintenant →",
    features: [
      "1 fiche GMB optimisée",
      "IA d'optimisation auto",
      "Collecte d'avis auto",
      "Réponses IA aux avis",
      "Analytics basique",
      "Support par email",
    ],
  },
  {
    key: "pro",
    name: "Professionnel",
    price: "149",
    subtitle: "Pour les agences & multi-établissements",
    featured: true,
    cta: "Essayer maintenant →",
    features: [
      "Fiches GMB illimitées",
      "IA avancée multi-fiches",
      "Collecte d'avis premium",
      "Réponses IA intelligentes",
      "Analytics avancée + rapports",
      "Support prioritaire 24/7",
      "Optimisation SEO local avancée",
      "Onboarding personnalisé",
    ],
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
          Deux formules pour maximiser votre potentiel
        </h2>
        <p className="text-center text-gray-500 mb-14">
          Sans engagement — Résiliez à tout moment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.key}
              className={`relative bg-white rounded-2xl p-10 text-center transition-all ${
                p.featured
                  ? "border-2 border-[#667eea] shadow-2xl scale-105"
                  : "border-2 border-gray-200 hover:shadow-xl"
              }`}
            >
              {p.featured && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  Recommandé
                </span>
              )}
              <h3 className="text-2xl font-bold mb-1">{p.name}</h3>
              <p className="text-[#667eea] text-5xl font-extrabold my-5">
                {p.price}€<span className="text-gray-400 text-base font-normal">/mois</span>
              </p>
              <p className="text-gray-500 text-sm mb-8">{p.subtitle}</p>
              <ul className="text-left mb-8 space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-gray-600 border-b border-gray-100 pb-3 last:border-0"
                  >
                    <span className="text-[#667eea] font-bold text-base">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(p.key)}
                disabled={loading === p.key}
                className="w-full py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                {loading === p.key ? "Redirection..." : p.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          Paiement sécurisé par Stripe · CB, Apple Pay, Google Pay acceptés
        </p>
      </div>
    </section>
  );
}
