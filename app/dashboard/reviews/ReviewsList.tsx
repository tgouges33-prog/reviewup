"use client";

import { useState } from "react";
import { BUSINESS_LABELS, type BusinessType } from "@/lib/business-prompts";

const MOCK_REVIEWS = [
  { id: "1", name: "Marie D.", stars: 5, text: "Excellent service ! Je reviendrai sans hésiter.", date: "Il y a 2h", replied: false, response: "" },
  { id: "2", name: "Jacques P.", stars: 5, text: "Très professionnel, livraison rapide.", date: "Il y a 5h", replied: false, response: "" },
  { id: "3", name: "Sophie L.", stars: 4, text: "Bon rapport qualité-prix, je recommande.", date: "Il y a 1j", replied: false, response: "" },
  { id: "4", name: "Marc T.", stars: 3, text: "Service correct mais délai un peu long.", date: "Il y a 2j", replied: false, response: "" },
  { id: "5", name: "Claire B.", stars: 5, text: "Parfait ! Rien à redire, équipe sympa.", date: "Il y a 3j", replied: true, response: "Merci beaucoup Claire, à très bientôt !" },
  { id: "6", name: "Pierre M.", stars: 2, text: "Déçu par la qualité cette fois-ci.", date: "Il y a 4j", replied: false, response: "" },
];

export default function ReviewsList() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [businessName, setBusinessName] = useState("Mon Établissement");
  const [generating, setGenerating] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("Tous");

  async function generateResponse(review: typeof MOCK_REVIEWS[0]) {
    setGenerating(review.id);
    try {
      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText: review.text,
          reviewerName: review.name,
          stars: review.stars,
          businessType,
          businessName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Erreur : ${data.error || res.statusText}`);
      } else if (data.response) {
        setReviews((prev) =>
          prev.map((r) => r.id === review.id ? { ...r, response: data.response } : r)
        );
        setEditingId(review.id);
      }
    } catch (e: any) {
      alert(`Erreur réseau : ${e.message}`);
    }
    setGenerating(null);
  }

  function confirmResponse(id: string) {
    setReviews((prev) =>
      prev.map((r) => r.id === id ? { ...r, replied: true } : r)
    );
    setEditingId(null);
  }

  const filters = ["Tous", "En attente", "Répondus", "5 ★", "4 ★", "3 ★ et -"];
  const filtered = reviews.filter((r) => {
    if (filter === "En attente") return !r.replied;
    if (filter === "Répondus") return r.replied;
    if (filter === "5 ★") return r.stars === 5;
    if (filter === "4 ★") return r.stars === 4;
    if (filter === "3 ★ et -") return r.stars <= 3;
    return true;
  });

  return (
    <div>
      {/* Business config bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <span className="text-sm text-gray-500 whitespace-nowrap">Secteur :</span>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value as BusinessType)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#667eea] transition"
          >
            {Object.entries(BUSINESS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <span className="text-sm text-gray-500 whitespace-nowrap">Établissement :</span>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nom de votre établissement"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#667eea] transition"
          />
        </div>
        <p className="text-xs text-gray-400">Ces infos guident l'IA pour personnaliser les réponses</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
              filter === f
                ? "border-[#667eea] text-[#667eea] bg-[#667eea]/5 font-medium"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#667eea] hover:text-[#667eea]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                    <span className="text-gray-400 text-xs">· {r.date}</span>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 font-medium ${
                r.replied ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"
              }`}>
                {r.replied ? "✓ Répondu" : "En attente"}
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>

            {/* Réponse existante */}
            {r.replied && r.response && (
              <div className="mt-3 ml-12 bg-[#f8f9ff] rounded-lg p-3 border-l-4 border-[#667eea]">
                <p className="text-xs font-semibold text-[#667eea] mb-1">Votre réponse</p>
                <p className="text-sm text-gray-600">{r.response}</p>
              </div>
            )}

            {/* Réponse en cours d'édition */}
            {!r.replied && editingId === r.id && r.response && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#667eea] mb-2">✨ Réponse générée par l'IA — modifiez si besoin</p>
                <textarea
                  value={r.response}
                  onChange={(e) =>
                    setReviews((prev) =>
                      prev.map((rev) => rev.id === r.id ? { ...rev, response: e.target.value } : rev)
                    )
                  }
                  rows={4}
                  className="w-full border border-[#667eea]/30 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition resize-none"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => confirmResponse(r.id)}
                    className="px-5 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                  >
                    ✓ Valider & publier
                  </button>
                  <button
                    onClick={() => generateResponse(r)}
                    disabled={!!generating}
                    className="px-5 py-2 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[#667eea] hover:text-[#667eea] transition-all cursor-pointer disabled:opacity-50"
                  >
                    🔄 Regénérer
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-5 py-2 rounded-full text-sm border border-gray-200 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Boutons action */}
            {!r.replied && editingId !== r.id && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => generateResponse(r)}
                  disabled={generating === r.id}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  {generating === r.id ? (
                    <>
                      <span className="animate-spin">⏳</span> Génération...
                    </>
                  ) : (
                    <>🤖 Répondre avec l'IA</>
                  )}
                </button>
                <button
                  onClick={() => setEditingId(r.id)}
                  className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[#667eea] hover:text-[#667eea] transition-all cursor-pointer"
                >
                  ✏️ Répondre manuellement
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
