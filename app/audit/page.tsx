"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const QUESTIONS = [
  "Votre fiche Google My Business est-elle vérifiée ?",
  "Avez-vous plus de 20 avis Google ?",
  "Votre note moyenne est-elle supérieure à 4,0 ?",
  "Avez-vous publié des photos dans les 30 derniers jours ?",
  "Votre description d'entreprise fait-elle plus de 200 caractères ?",
  "Avez-vous sélectionné plus d'une catégorie Google ?",
  "Répondez-vous à tous vos avis Google ?",
  "Publiez-vous des Google Posts régulièrement ?",
];

const RECOMMENDATIONS: Record<number, string> = {
  0: "Vérifiez votre fiche Google My Business pour gagner en crédibilité et apparaître dans les résultats locaux.",
  1: "Mettez en place une stratégie de collecte d'avis : envoyez des liens de demande d'avis à vos clients après chaque visite.",
  2: "Répondez à tous vos avis négatifs et encouragez vos clients satisfaits à laisser un avis positif.",
  3: "Publiez au moins 4 à 6 nouvelles photos de qualité chaque mois pour montrer l'activité de votre établissement.",
  4: "Rédigez une description complète (200+ caractères) mettant en avant vos services, votre zone et vos atouts.",
  5: "Ajoutez des catégories secondaires pertinentes pour élargir votre visibilité sur des requêtes connexes.",
  6: "Répondez systématiquement à chaque avis — cela améliore votre réputation et votre référencement local.",
  7: "Publiez des Google Posts hebdomadaires (offres, événements, actualités) pour dynamiser votre fiche.",
};

function getScoreColor(score: number) {
  if (score < 40) return { bar: "#ef4444", label: "Faible", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
  if (score <= 70) return { bar: "#f97316", label: "Moyen", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" };
  return { bar: "#22c55e", label: "Bon", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
}

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [answers, setAnswers] = useState<boolean[]>(Array(8).fill(false));
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const currentQuestion = step - 1;
  const score = answers.filter(Boolean).length * 12.5;
  const scoreColor = getScoreColor(score);

  const topRecommendations = answers
    .map((answer, i) => (!answer ? i : null))
    .filter((i) => i !== null)
    .slice(0, 3) as number[];

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !city.trim()) return;
    setStep(1);
  }

  function handleAnswer(answer: boolean) {
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);
    if (step < 8) setStep(step + 1);
    else setStep(9);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSendingEmail(true);
    try {
      await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessName, city, score, answers }),
      });
    } catch {}
    setSendingEmail(false);
    setEmailSent(true);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f7ff 0%, #f0ebff 100%)" }}>
        <div className="text-white py-10 px-5 text-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Audit Google My Business gratuit</h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Évaluez votre fiche en 2 minutes. Score personnalisé + 3 recommandations concrètes. Gratuit.
          </p>
        </div>

        <div className="max-w-xl mx-auto px-5 py-10">
          {/* Étape 0 : formulaire intro */}
          {step === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Démarrez votre audit</h2>
              <p className="text-gray-500 text-sm mb-6">Gratuit, sans inscription, résultat immédiat.</p>
              <form onSubmit={handleStart} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de votre établissement
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ex : Boulangerie Martin"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex : Bordeaux"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] transition"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 text-white font-bold py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  Démarrer l&apos;audit gratuit →
                </button>
              </form>
            </div>
          )}

          {/* Étapes 1-8 : questions */}
          {step >= 1 && step <= 8 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Question {step} / 8</span>
                  <span>{Math.round((step / 8) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(step / 8) * 100}%`,
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
                {businessName} · {city}
              </p>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-8 leading-snug">
                {QUESTIONS[currentQuestion]}
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  ✅ Oui
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  ❌ Non
                </button>
              </div>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer w-full text-center"
                >
                  ← Question précédente
                </button>
              )}
            </div>
          )}

          {/* Étape 9 : résultats */}
          {step === 9 && (
            <div className="flex flex-col gap-6">
              {/* Score */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                  {businessName} · {city}
                </p>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Votre score GMB</h2>
                <div
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 mb-4"
                  style={{ borderColor: scoreColor.bar }}
                >
                  <div>
                    <span className="text-4xl font-bold" style={{ color: scoreColor.bar }}>
                      {score}
                    </span>
                    <span className="text-lg text-gray-400">/100</span>
                  </div>
                </div>
                <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border mb-6 ${scoreColor.bg} ${scoreColor.border} ${scoreColor.text}`}>
                  Niveau : {scoreColor.label}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${score}%`, background: scoreColor.bar }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span><span>40</span><span>70</span><span>100</span>
                </div>
              </div>

              {/* Recommandations */}
              {topRecommendations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Vos {topRecommendations.length} priorités d&apos;action
                  </h3>
                  <div className="flex flex-col gap-4">
                    {topRecommendations.map((qi, idx) => (
                      <div key={qi} className="flex gap-3 items-start">
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-0.5">{QUESTIONS[qi]}</p>
                          <p className="text-sm text-gray-700">{RECOMMENDATIONS[qi]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capture email */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {!emailSent ? (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Recevez votre rapport complet par email
                    </h3>
                    <p className="text-sm text-gray-500 mb-5">
                      Plan d&apos;action détaillé, checklist GMB et conseils personnalisés. Gratuit.
                    </p>
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] transition"
                      />
                      <button
                        type="submit"
                        disabled={sendingEmail}
                        className="text-white font-bold py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                      >
                        {sendingEmail ? "Envoi en cours…" : "Envoyer mon rapport"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Rapport envoyé !</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Vérifiez votre boîte mail. Pensez à regarder dans vos spams.
                    </p>
                    <a
                      href="https://klevano.com/#pricing"
                      className="inline-block text-white font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all"
                      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                    >
                      Voir les offres Klevano →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
