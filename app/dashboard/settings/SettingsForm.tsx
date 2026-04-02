"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BUSINESS_LABELS, type BusinessType } from "@/lib/business-prompts";

type Profile = {
  business_name?: string;
  business_type?: string;
  phone?: string;
} | null;

export default function SettingsForm({
  initialProfile,
  email,
  plan,
}: {
  initialProfile: Profile;
  email: string;
  plan: string | null;
}) {
  const [form, setForm] = useState({
    business_name: initialProfile?.business_name ?? "",
    business_type: (initialProfile?.business_type ?? "autre") as BusinessType,
    phone: initialProfile?.phone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleCancelSubscription() {
    if (!confirm("Êtes-vous sûr de vouloir résilier votre abonnement ? Vous perdrez accès au dashboard à la fin de la période en cours.")) return;
    setCanceling(true);
    const res = await fetch("/api/stripe/cancel", { method: "POST" });
    const data = await res.json();
    if (data.ok) {
      alert("Abonnement résilié. Vous gardez accès jusqu'à la fin de la période payée.");
      router.refresh();
    } else {
      alert(`Erreur : ${data.error}`);
    }
    setCanceling(false);
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await fetch("/api/account/delete", { method: "DELETE" });
    await supabase.auth.signOut();
    router.push("/");
  }

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, onboarding_completed: true }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Plan actuel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Mon abonnement</h2>
        <div className="flex items-center justify-between p-4 bg-[#f8f9ff] rounded-xl border border-gray-200">
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Plan {plan === "pro" ? "Professionnel" : plan === "essentiel" ? "Essentiel" : "Aucun"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {plan === "pro" ? "169€/mois · Toutes les fonctionnalités" : plan === "essentiel" ? "99€/mois · Optimisation GMB" : "Aucun abonnement actif"}
            </p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${plan ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
            {plan ? "Actif" : "Inactif"}
          </span>
        </div>
        {plan !== "pro" && (
          <Link
            href="/#pricing"
            className="inline-block mt-3 text-sm text-[#667eea] hover:underline font-medium"
          >
            Passer au Plan Pro →
          </Link>
        )}
      </div>

      {/* Informations entreprise */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Informations de l'entreprise</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'établissement</label>
            <input
              type="text"
              value={form.business_name}
              onChange={(e) => update("business_name", e.target.value)}
              placeholder="Votre établissement"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Secteur d'activité</label>
            <select
              value={form.business_type}
              onChange={(e) => update("business_type", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            >
              {Object.entries(BUSINESS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Ex : 06 12 34 56 78"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            {saved && <span className="text-green-600 text-sm">✓ Modifications enregistrées</span>}
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
        <h2 className="font-semibold text-red-600 mb-4">Zone de danger</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Résilier mon abonnement</p>
              <p className="text-xs text-gray-500 mt-0.5">Vous gardez accès jusqu'à la fin de la période payée</p>
            </div>
            <button
              onClick={handleCancelSubscription}
              disabled={canceling || !plan}
              className="px-4 py-2 rounded-full text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              {canceling ? "Résiliation..." : "Résilier"}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Supprimer mon compte</p>
              <p className="text-xs text-gray-500 mt-0.5">Action irréversible — toutes vos données seront supprimées</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              {deleting ? "Suppression..." : confirmDelete ? "Confirmer la suppression" : "Supprimer"}
            </button>
          </div>
          {confirmDelete && (
            <p className="text-xs text-red-500 text-center">
              Cliquez à nouveau sur "Confirmer la suppression" pour supprimer définitivement votre compte.
              <button onClick={() => setConfirmDelete(false)} className="ml-2 underline cursor-pointer">Annuler</button>
            </p>
          )}
        </div>
      </div>

      {/* GMB Connection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Connexion Google My Business</h2>
        <div className="flex items-center justify-between p-4 bg-[#f8f9ff] rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Gérez votre connexion GMB</p>
              <p className="text-xs text-gray-500">Vérifiez l'état de votre fiche connectée</p>
            </div>
          </div>
          <Link
            href="/dashboard/gmb-connect"
            className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            Gérer →
          </Link>
        </div>
      </div>

    </div>
  );
}
