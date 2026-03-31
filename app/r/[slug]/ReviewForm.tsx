"use client";

import { useState } from "react";
import Image from "next/image";

type LinkData = {
  id: string;
  business_name: string;
  google_review_url: string;
  logo_url: string | null;
  primary_color: string | null;
};

export default function ReviewForm({ link, source }: { link: LinkData; source: string }) {
  const color = link.primary_color || "#667eea";
  const gradient = `linear-gradient(135deg, ${color}, ${color}cc)`;

  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"rating" | "comment" | "redirect" | "thanks">("rating");
  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback(skipComment = false) {
    setSubmitting(true);
    await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link_id: link.id, stars, comment: skipComment ? "" : comment }),
    });
    setSubmitting(false);
    setStep("thanks");
  }

  async function handleStarClick(s: number) {
    setStars(s);
    if (s >= 4) {
      // Enregistrer le feedback positif
      await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: link.id, stars: s, comment: "" }),
      });
      setStep("redirect");
    } else {
      setStep("comment");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: gradient }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

        {/* Logo ou nom */}
        {link.logo_url ? (
          <div className="mb-6">
            <Image src={link.logo_url} alt={link.business_name} width={120} height={60} className="mx-auto object-contain" />
          </div>
        ) : (
          <p className="font-bold text-gray-900 text-lg mb-6">{link.business_name}</p>
        )}

        {step === "rating" && (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Comment s'est passée votre expérience ?</h1>
            <p className="text-gray-500 text-sm mb-8">Votre avis nous aide à nous améliorer</p>
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStarClick(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="text-4xl transition-transform hover:scale-110 cursor-pointer"
                  style={{ color: s <= (hover || stars) ? "#f59e0b" : "#d1d5db" }}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Cliquez sur une étoile pour noter</p>
          </>
        )}

        {step === "comment" && (
          <>
            <div className="text-3xl mb-4" style={{ color: "#f59e0b" }}>
              {"★".repeat(stars)}
              <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - stars)}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre note</h1>
            <p className="text-gray-500 text-sm mb-6">
              Pouvez-vous nous en dire plus ? Votre retour nous aide à nous améliorer.
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dites-nous ce qui s'est passé..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none transition resize-none mb-4"
              style={{ outlineColor: color }}
            />
            <button
              onClick={() => submitFeedback(false)}
              disabled={submitting}
              className="w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60"
              style={{ background: gradient }}
            >
              {submitting ? "Envoi..." : "Envoyer mon avis →"}
            </button>
            <button
              onClick={() => submitFeedback(true)}
              disabled={submitting}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer block w-full"
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
            {link.google_review_url ? (
              <a
                href={link.google_review_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all mb-3"
                style={{ background: gradient }}
                onClick={() => {
                  fetch("/api/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ link_id: link.id, event_type: "google_click", source }),
                  });
                }}
              >
                Laisser un avis sur Google →
              </a>
            ) : null}
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
              Votre avis a bien été transmis à {link.business_name}. Nous prenons en compte chaque retour.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
