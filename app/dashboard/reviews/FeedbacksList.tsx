"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Feedback = {
  id: string;
  stars: number;
  comment: string | null;
  status: string;
  created_at: string;
  customer_email: string | null;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  nouveau: { label: "Nouveau", color: "bg-red-100 text-red-600" },
  en_cours: { label: "En cours", color: "bg-orange-100 text-orange-600" },
  traite: { label: "Traité", color: "bg-green-100 text-green-600" },
  google: { label: "→ Google", color: "bg-blue-100 text-blue-600" },
};

export default function FeedbacksList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [noLink, setNoLink] = useState(false);
  const [filter, setFilter] = useState("tous");
  const [updating, setUpdating] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetch("/api/feedbacks")
      .then((r) => r.json())
      .then((data) => {
        if (data.feedbacks?.length === 0 && !data.error) setNoLink(false);
        setFeedbacks(data.feedbacks ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function sendReply(feedback: Feedback) {
    if (!replyText.trim()) return;
    setSendingReply(true);
    const res = await fetch("/api/feedbacks/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback_id: feedback.id, reply_text: replyText }),
    });
    const data = await res.json();
    if (data.ok) {
      setFeedbacks((prev) => prev.map((f) => f.id === feedback.id ? { ...f, status: "traite" } : f));
      setReplyingId(null);
      setReplyText("");
    }
    setSendingReply(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch("/api/feedbacks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setFeedbacks((prev) => prev.map((f) => f.id === id ? { ...f, status } : f));
    setUpdating(null);
  }

  const filters = ["tous", "nouveau", "en_cours", "traite", "google"];
  const filtered = filter === "tous" ? feedbacks : feedbacks.filter((f) => f.status === filter);

  const stats = {
    total: feedbacks.length,
    nouveaux: feedbacks.filter((f) => f.status === "nouveau").length,
    avg: feedbacks.length > 0
      ? (feedbacks.reduce((s, f) => s + f.stars, 0) / feedbacks.length).toFixed(1)
      : null,
    google: feedbacks.filter((f) => f.status === "google").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        <span className="animate-spin mr-2">⏳</span> Chargement...
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">💌</div>
        <h2 className="font-semibold text-gray-900 text-lg mb-2">Aucun feedback pour l'instant</h2>
        <p className="text-gray-500 text-sm mb-6">
          Générez votre lien de collecte et partagez-le à vos clients.
        </p>
        <Link
          href="/dashboard/collect"
          className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          Configurer ma collecte d'avis →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total feedbacks", value: String(stats.total), icon: "💬" },
          { label: "Non traités", value: String(stats.nouveaux), icon: "🔴", alert: stats.nouveaux > 0 },
          { label: "Note moyenne", value: stats.avg ? `${stats.avg} ★` : "--", icon: "⭐" },
          { label: "Redirigés Google", value: String(stats.google), icon: "🔵" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border shadow-sm p-4 text-center ${s.alert ? "border-red-200" : "border-gray-200"}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className={`text-2xl font-extrabold ${s.alert ? "text-red-500" : "text-gray-900"}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer capitalize ${
              filter === f
                ? "border-[#667eea] text-[#667eea] bg-[#667eea]/5 font-medium"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#667eea]"
            }`}
          >
            {f === "tous" ? "Tous" : STATUS_LABELS[f]?.label ?? f}
            {f !== "tous" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({feedbacks.filter((fb) => fb.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            Aucun feedback dans cette catégorie.
          </div>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-400 text-sm">
                      {"★".repeat(f.stars)}
                      <span className="text-gray-200">{"★".repeat(5 - f.stars)}</span>
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_LABELS[f.status]?.color ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABELS[f.status]?.label ?? f.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(f.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {f.comment ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{f.comment}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Aucun commentaire</p>
                  )}
                  {f.customer_email && (
                    <p className="text-xs text-gray-400 mt-1">📧 {f.customer_email}</p>
                  )}
                </div>

                {/* Bouton répondre */}
                {f.customer_email && f.status !== "google" && (
                  <button
                    onClick={() => { setReplyingId(replyingId === f.id ? null : f.id); setReplyText(""); }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs border border-[#667eea]/30 text-[#667eea] hover:bg-[#667eea]/5 transition-all cursor-pointer"
                  >
                    ✉️ Répondre
                  </button>
                )}

                {/* Actions statut */}
                {f.status !== "google" && (
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {f.status !== "nouveau" && (
                      <button
                        onClick={() => updateStatus(f.id, "nouveau")}
                        disabled={updating === f.id}
                        className="px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Nouveau
                      </button>
                    )}
                    {f.status !== "en_cours" && (
                      <button
                        onClick={() => updateStatus(f.id, "en_cours")}
                        disabled={updating === f.id}
                        className="px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all cursor-pointer disabled:opacity-50"
                      >
                        En cours
                      </button>
                    )}
                    {f.status !== "traite" && (
                      <button
                        onClick={() => updateStatus(f.id, "traite")}
                        disabled={updating === f.id}
                        className="px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-500 transition-all cursor-pointer disabled:opacity-50"
                      >
                        ✓ Traité
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Formulaire réponse */}
              {replyingId === f.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">Répondre à {f.customer_email}</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Votre message au client..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] transition resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendReply(f)}
                      disabled={sendingReply || !replyText.trim()}
                      className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                    >
                      {sendingReply ? "Envoi..." : "✉️ Envoyer la réponse"}
                    </button>
                    <button
                      onClick={() => setReplyingId(null)}
                      className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
