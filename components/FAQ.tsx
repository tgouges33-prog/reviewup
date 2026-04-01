"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Qu'est-ce que Google My Business et pourquoi l'optimiser ?",
    a: "Google My Business (GMB) est la fiche qui apparaît dans Google Maps et les résultats locaux quand un client cherche votre activité. Une fiche bien optimisée vous rend visible en priorité face à vos concurrents locaux et génère plus d'appels, visites et clients.",
  },
  {
    q: "Comment Klevano collecte-t-il les avis clients ?",
    a: "Klevano génère un lien personnalisé (ou QR code) que vous partagez à vos clients. Les clients satisfaits (4-5 étoiles) sont redirigés vers Google pour laisser un avis public. Les avis négatifs (1-3 étoiles) restent privés et vous permettent de répondre directement au client.",
  },
  {
    q: "Dois-je connecter mon compte Google My Business ?",
    a: "Oui, vous connectez votre compte Google via OAuth sécurisé. Klevano accède à votre fiche pour analyser votre score d'optimisation et vous proposer des suggestions d'amélioration personnalisées par IA.",
  },
  {
    q: "Quelle est la différence entre l'offre Essentiel et Pro ?",
    a: "L'offre Essentiel (99€/mois) couvre l'optimisation de votre fiche GMB avec scoring, checklist et suggestions IA. L'offre Pro (169€/mois) ajoute la collecte d'avis clients, le lien en marque blanche, les notifications d'avis négatifs et la possibilité de répondre aux clients par email.",
  },
  {
    q: "Combien de temps avant de voir des résultats ?",
    a: "Les premières améliorations de visibilité locale sont généralement visibles en 2 à 4 semaines après l'optimisation de la fiche. La collecte d'avis produit des effets dès les premières semaines en augmentant votre note moyenne sur Google.",
  },
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, vous pouvez résilier à tout moment depuis votre dashboard. Votre accès reste actif jusqu'à la fin de la période en cours. Aucun engagement minimum, aucun frais de résiliation.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="py-20 px-5 bg-[#f8f9ff]" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Questions fréquentes sur l'optimisation Google My Business
        </h2>
        <p className="text-gray-500 text-center mb-12 text-lg">
          Tout ce que vous devez savoir sur Klevano et la gestion de votre réputation en ligne.
        </p>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base">{faq.q}</span>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    transform: open === i ? "rotate(45deg)" : "none",
                  }}
                >+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
