"use client";

import { useState } from "react";

type Props = {
  gmbData: {
    title?: string;
    description?: string;
    categories?: string[];
    hasPhotos: boolean;
    hasHours: boolean;
    hasPhone: boolean;
    hasWebsite: boolean;
  };
  score: number;
  locationName: string;
};

export default function OptimizationClient({ gmbData, score, locationName }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function generateSuggestions() {
    setLoading(true);
    try {
      const res = await fetch("/api/gmb/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gmbData),
      });
      const data = await res.json();
      if (data.suggestions?.length) {
        setSuggestions(data.suggestions);
        setDone(true);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-gray-900">Suggestions IA</h2>
          <p className="text-xs text-gray-400 mt-0.5">Recommandations personnalisées pour {locationName || "votre fiche"}</p>
        </div>
        {!done && (
          <button
            onClick={generateSuggestions}
            disabled={loading}
            className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            {loading ? <><span className="animate-spin">⏳</span> Analyse...</> : "✨ Analyser ma fiche"}
          </button>
        )}
        {done && (
          <button
            onClick={() => { setDone(false); setSuggestions([]); generateSuggestions(); }}
            disabled={loading}
            className="text-xs text-[#667eea] hover:underline cursor-pointer disabled:opacity-50"
          >
            🔄 Régénérer
          </button>
        )}
      </div>

      {!done && !loading && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <div className="text-4xl mb-3">🤖</div>
          <p>Cliquez sur "Analyser ma fiche" pour obtenir des suggestions personnalisées basées sur vos données GMB réelles.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <div className="text-4xl mb-3 animate-pulse">🤖</div>
          <p>Analyse de votre fiche en cours...</p>
        </div>
      )}

      {done && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex gap-3 p-4 bg-[#f8f9ff] rounded-xl border border-[#667eea]/10">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{s.replace(/^\d\.\s*/, "")}</p>
            </div>
          ))}

          <div className="mt-4 p-4 rounded-xl border border-[#667eea]/20 bg-[#667eea]/5 text-center">
            <p className="text-sm text-gray-600 mb-3">
              {score < 80
                ? "Vous souhaitez déléguer l'optimisation de votre fiche à notre équipe ?"
                : "Votre fiche est bien optimisée. Notre équipe peut prendre le relais pour maintenir votre positionnement."}
            </p>
            <a
              href="mailto:contact@reviewup.fr?subject=Demande d'optimisation GMB"
              className="inline-block px-5 py-2 rounded-full text-sm font-medium text-white hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              Déléguer à ReviewUp →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
