"use client";

import { useState } from "react";

const plans = [
  {
    key: "essentiel",
    name: "Essentiel",
    price: "99",
    subtitle: "Pour les petites entreprises",
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
    price: "169",
    subtitle: "Pour les agences & multi-établissements",
    featured: true,
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

export default function Paywall() {
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
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center px-5 py-16">
      <div className="text-center mb-12 max-w-xl">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Activez votre abonnement
        </h1>
        <p className="text-gray-500">
          Choisissez une formule pour accéder à votre dashboard ReviewUp et commencer à optimiser votre présence Google.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
        {plans.map((p) => (
          <div
            key={p.key}
            className={`relative bg-white rounded-2xl p-8 text-center transition-all ${
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
            <h3 className="text-xl font-bold mb-1">{p.name}</h3>
            <p className="text-[#667eea] text-4xl font-extrabold my-4">
              {p.price}€<span className="text-gray-400 text-sm font-normal">/mois</span>
            </p>
            <p className="text-gray-500 text-sm mb-6">{p.subtitle}</p>
            <ul className="text-left mb-6 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-[#667eea] font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(p.key)}
              disabled={loading === p.key}
              className="w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              {loading === p.key ? "Redirection..." : "Choisir cette offre →"}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Paiement sécurisé par Stripe · Sans engagement · Résiliez à tout moment
      </p>
    </div>
  );
}
