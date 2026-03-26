export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Configurez votre compte et votre fiche GMB</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* GMB Connection */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Connexion Google My Business</h2>
          <div className="flex items-center justify-between p-4 bg-[#f8f9ff] rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Fiche non connectée</p>
                <p className="text-xs text-gray-500">Connectez votre compte Google pour commencer</p>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              Connecter →
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "Nouvel avis reçu", desc: "Être notifié par email à chaque nouvel avis" },
              { label: "Réponse IA générée", desc: "Confirmer chaque réponse avant envoi" },
              { label: "Rapport hebdomadaire", desc: "Recevoir un résumé chaque lundi" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.label}</p>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                </div>
                <div className="w-10 h-6 bg-[#667eea] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Mon compte</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'entreprise</label>
              <input
                type="text"
                placeholder="Votre entreprise"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email de contact</label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
              />
            </div>
            <button
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
