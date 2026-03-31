"use client";

import { useState, use } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"rating" | "comment" | "redirect" | "thanks">("rating");
  const [submitting, setSubmitting] = useState(false);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("votre établissement");
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const supabase = createClient();

  // Charger les infos du lien
  if (!loaded) {
    setLoaded(true);
    supabase
      .from("review_links")
      .select("id, business_name, google_review_url")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); return; }
        setLinkId(data.id);
        setGoogleUrl(data.google_review_url);
        if (data.business_name) setBusinessName(data.business_name);
      });
  }

  async function handleStarClick(s: number) {
    setStars(s);
    if (s >= 4) {
      setStep("redirect");
    } else {
      setStep("comment");
    }
  }

  async function submitFeedback() {
    if (!linkId) return;
    setSubmitting(true);
    await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link_id: linkId, stars, comment }),
    });
    setSubmitting(false);
    setStep("thanks");
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">❓</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Lien introuvable</h1>
          <p className="text-gray-500 text-sm">Ce lien n'existe pas ou a été désactivé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

        {step === "rating" && (
          <>
            <div className="text-5xl mb-4">⭐</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Votre avis sur {businessName}</h1>
            <p className="text-gray-500 text-sm mb-8">Comment s'est passée votre expérience ?</p>
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStarClick(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="text-4xl transition-transform hover:scale-110 cursor-pointer"
                >
                  {s <= (hover || stars) ? "★" : "☆"}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Cliquez sur une étoile pour noter</p>
          </>
        )}

        {step === "comment" && (
          <>
            <div className="text-amber-400 text-3xl mb-4">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre note</h1>
            <p className="text-gray-500 text-sm mb-6">
              Pouvez-vous nous en dire plus ? Votre retour nous aide à nous améliorer.
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dites-nous ce qui s'est passé..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition resize-none mb-4"
            />
            <button
              onClick={submitFeedback}
              disabled={submitting}
              className="w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {submitting ? "Envoi..." : "Envoyer mon avis →"}
            </button>
            <button
              onClick={submitFeedback}
              disabled={submitting}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Passer cette étape
            </button>
          </>
        )}

        {step === "redirect" && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Super, merci !</h1>
            <p className="text-gray-500 text-sm mb-8">
              Votre expérience est précieuse. Partagez-la sur Google pour aider d'autres personnes à nous trouver.
            </p>
            {googleUrl ? (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all mb-3"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                onClick={() => {
                  // Enregistrer aussi en base pour les stats
                  if (linkId) fetch("/api/feedbacks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ link_id: linkId, stars, comment: "", status: "google" }),
                  });
                }}
              >
                Laisser un avis sur Google →
              </a>
            ) : (
              <p className="text-gray-400 text-sm">Merci pour votre retour positif !</p>
            )}
            <button
              onClick={() => setStep("thanks")}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Non merci
            </button>
          </>
        )}

        {step === "thanks" && (
          <>
            <div className="text-5xl mb-4">🙏</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre retour !</h1>
            <p className="text-gray-500 text-sm">
              Votre avis a bien été transmis à l'équipe de {businessName}. Nous prenons en compte chaque retour.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
