"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_LABELS, type BusinessType } from "@/lib/business-prompts";

const STEPS = ["Votre entreprise", "Votre secteur", "Lien Google", "Connecter GMB"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    business_type: "restaurant" as BusinessType,
    google_review_url: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function finish(skipGmb = false) {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name: form.business_name,
        business_type: form.business_type,
        onboarding_completed: true,
      }),
    });
    if (form.google_review_url.trim()) {
      await fetch("/api/review-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: form.business_name,
          google_review_url: form.google_review_url,
          logo_url: null,
          primary_color: "#667eea",
          notification_email: null,
        }),
      });
    }
    if (!skipGmb) {
      router.push("/dashboard/gmb-connect");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-16"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  i <= step ? "text-white" : "bg-gray-100 text-gray-400"
                }`}
                style={i <= step ? { background: "linear-gradient(135deg, #667eea, #764ba2)" } : {}}
              >
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 flex-1 rounded-full transition-all ${i < step ? "bg-[#667eea]" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Bienvenue sur Klevano 🎉</h1>
        <p className="text-gray-500 text-sm mb-8">Configurons votre compte en quelques étapes rapides</p>

        {/* Étape 1 — Nom */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de votre établissement</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => update("business_name", e.target.value)}
                placeholder="Ex : Boulangerie Martin"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
                autoFocus
              />
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!form.business_name.trim()}
              className="w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Étape 2 — Secteur */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(BUSINESS_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => update("business_type", key)}
                    className={`px-4 py-3 rounded-xl text-sm border-2 transition-all cursor-pointer text-left ${
                      form.business_type === key
                        ? "border-[#667eea] text-[#667eea] bg-[#667eea]/5 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-[#667eea]/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition cursor-pointer"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-full font-semibold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 — Lien Google avis */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre lien Google pour collecter des avis
              </label>
              <input
                type="url"
                value={form.google_review_url}
                onChange={(e) => update("google_review_url", e.target.value)}
                placeholder="https://g.page/r/votre-fiche/review"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
                autoFocus
              />
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-3 text-sm text-blue-700 space-y-1">
                <p className="font-semibold">Comment trouver ce lien ?</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-blue-600">
                  <li>Ouvrez <strong>Google Maps</strong> et cherchez votre établissement</li>
                  <li>Cliquez sur votre fiche → <strong>"Demander des avis"</strong></li>
                  <li>Copiez le lien qui apparaît</li>
                </ol>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition cursor-pointer"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-full font-semibold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                {form.google_review_url.trim() ? "Continuer →" : "Passer →"}
              </button>
            </div>
          </div>
        )}

        {/* Étape 4 — Connecter GMB */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-[#f8f9ff] rounded-xl p-6 text-center border border-[#667eea]/20">
              <div className="text-4xl mb-3">🔗</div>
              <p className="font-semibold text-gray-900 mb-2">Connectez votre Google My Business</p>
              <p className="text-sm text-gray-500 mb-5">
                Klevano analysera automatiquement votre fiche, votre score d'optimisation et vos avis existants.
              </p>
              <button
                onClick={() => finish(false)}
                disabled={saving}
                className="w-full py-3 rounded-full font-semibold text-sm text-white cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                {saving ? "Enregistrement..." : "Connecter mon compte Google →"}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition cursor-pointer"
              >
                ← Retour
              </button>
              <button
                onClick={() => finish(true)}
                disabled={saving}
                className="flex-1 py-3 rounded-full text-sm border border-gray-200 text-gray-500 hover:border-gray-300 transition cursor-pointer disabled:opacity-60"
              >
                Passer cette étape
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
