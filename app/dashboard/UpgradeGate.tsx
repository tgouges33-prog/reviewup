"use client";

import { useState } from "react";

export default function UpgradeGate({ feature }: { feature: string }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(`Erreur : ${data.error}`);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5">
      <div className="bg-white rounded-2xl border border-[#667eea]/20 shadow-lg p-10 max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5" style={{ background: "linear-gradient(135deg, #667eea20, #764ba220)" }}>
          🔒
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Mettez à niveau votre compte</h2>
        <p className="text-gray-500 text-sm mb-1">
          <strong className="text-gray-700">{feature}</strong> est inclus dans l'offre Pro.
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Collecte d'avis, optimisation complète, analytics — tout en un.
        </p>

        <div className="bg-[#f8f9ff] rounded-xl border border-[#667eea]/20 p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#667eea] bg-[#667eea]/10 px-2 py-0.5 rounded-full">⭐ Recommandé</span>
          </div>
          <p className="font-bold text-gray-900 mt-2">Plan Pro — 169€/mois</p>
          <ul className="mt-2 space-y-1">
            {["Optimisation GMB complète", "Collecte d'avis automatique", "Avis & feedbacks", "Analytics avancés", "Rappels automatiques"].map(f => (
              <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                <span className="text-[#667eea]">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-3 rounded-full font-bold text-white text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          {loading ? "Redirection..." : "Mettre à niveau →"}
        </button>
        <p className="text-xs text-gray-400 mt-3">Sans engagement · Résiliez à tout moment</p>
      </div>
    </div>
  );
}
