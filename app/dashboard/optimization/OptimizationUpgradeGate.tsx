"use client";

import { useState } from "react";

export default function OptimizationUpgradeGate() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert(`Erreur : ${data.error}`); setLoading(false); }
  }

  return (
    <div className="bg-white rounded-xl border border-[#667eea]/20 shadow-sm p-8 text-center relative overflow-hidden">
      {/* Fond flou simulé */}
      <div className="absolute inset-0 flex flex-col gap-3 p-6 pointer-events-none opacity-20 blur-sm">
        {["Rédigez une description optimisée avec vos mots-clés locaux", "Ajoutez des catégories secondaires pour élargir votre visibilité", "Répondez aux avis pour améliorer votre score"].map((t, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 text-left text-xs text-gray-600">{t}</div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4" style={{ background: "linear-gradient(135deg, #667eea20, #764ba220)" }}>
          🔒
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">Suggestions IA verrouillées</h3>
        <p className="text-gray-500 text-sm mb-5 max-w-xs mx-auto">
          Mettez à niveau pour accéder aux recommandations personnalisées et booster votre positionnement Google.
        </p>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="px-8 py-3 rounded-full font-bold text-white text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          {loading ? "Redirection..." : "Mettre à niveau →"}
        </button>
        <p className="text-xs text-gray-400 mt-2">Plan Pro recommandé · 169€/mois · Sans engagement</p>
      </div>
    </div>
  );
}
