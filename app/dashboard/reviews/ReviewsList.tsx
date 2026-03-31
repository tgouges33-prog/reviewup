"use client";

import { useState, useEffect } from "react";
import { BUSINESS_LABELS, type BusinessType } from "@/lib/business-prompts";
import Link from "next/link";

type Review = {
  id: string;
  name: string;
  stars: number;
  text: string;
  date: string;
  replied: boolean;
  response: string;
  reviewName: string;
};

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [gmbRequired, setGmbRequired] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [businessName, setBusinessName] = useState("Mon Établissement");
  const [generating, setGenerating] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    fetch("/api/gmb/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.gmb_required) {
          setGmbRequired(true);
        } else if (data.error) {
          setFetchError(data.error);
        } else {
          setReviews(data.reviews ?? []);
        }
      })
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function generateResponse(review: Review) {
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

  async function publishResponse(review: Review) {
    if (!review.response) return;
    setPublishing(review.id);
    try {
      const res = await fetch("/api/gmb/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewName: review.reviewName, comment: review.response }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Erreur publication : ${data.error || res.statusText}`);
      } else {
        setReviews((prev) =>
          prev.map((r) => r.id === review.id ? { ...r, replied: true } : r)
        );
        setEditingId(null);
      }
    } catch (e: any) {
      alert(`Erreur réseau : ${e.message}`);
    }
    setPublishing(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        <span className="animate-spin mr-2">⏳</span> Chargement des avis...
      </div>
    );
  }

  if (gmbRequired) {
    return (
      <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-10 text-center max-w-lg mx-auto mt-8">
        <div className="text-5xl mb-4">🔗</div>
        <h2 className="font-semibold text-gray-900 text-lg mb-2">Compte Google non connecté</h2>
        <p className="text-gray-500 text-sm mb-6">
          Connectez votre compte Google My Business pour afficher et gérer vos vrais avis.
        </p>
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

  if (fetchError) {
    return (
      <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-10 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🔄</div>
        <h2 className="font-semibold text-gray-900 text-lg mb-2">Reconnexion Google requise</h2>
        <p className="text-gray-500 text-sm mb-6">
          Votre session Google a expiré. Reconnectez votre compte pour accéder à vos avis.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          Reconnecter mon compte Google →
        </Link>
      </div>
    );
  }

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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-gray-400 text-sm">
          Aucun avis dans cette catégorie.
        </div>
      ) : (
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

              {r.replied && r.response && (
                <div className="mt-3 ml-12 bg-[#f8f9ff] rounded-lg p-3 border-l-4 border-[#667eea]">
                  <p className="text-xs font-semibold text-[#667eea] mb-1">Votre réponse</p>
                  <p className="text-sm text-gray-600">{r.response}</p>
                </div>
              )}

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
                      onClick={() => publishResponse(r)}
                      disabled={publishing === r.id}
                      className="px-5 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
                      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                    >
                      {publishing === r.id ? <><span className="animate-spin">⏳</span> Publication...</> : "✓ Valider & publier sur Google"}
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

              {!r.replied && editingId !== r.id && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => generateResponse(r)}
                    disabled={generating === r.id}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                  >
                    {generating === r.id ? (
                      <><span className="animate-spin">⏳</span> Génération...</>
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
      )}
    </div>
  );
}
