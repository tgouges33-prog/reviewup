const templates = [
  {
    stars: 5,
    label: "Avis 5 étoiles",
    preview: "Merci beaucoup [Prénom] pour votre avis enthousiaste ! C'est une vraie fierté pour toute notre équipe...",
  },
  {
    stars: 4,
    label: "Avis 4 étoiles",
    preview: "Merci [Prénom] pour votre retour positif ! Nous sommes ravis que votre expérience ait été satisfaisante...",
  },
  {
    stars: 3,
    label: "Avis neutre",
    preview: "Merci [Prénom] pour votre retour. Nous prenons note de vos remarques et travaillons à améliorer...",
  },
  {
    stars: 2,
    label: "Avis négatif",
    preview: "Bonjour [Prénom], nous sommes désolés que votre expérience n'ait pas été à la hauteur de vos attentes...",
  },
];

export default function ResponsesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Réponses IA</h1>
        <p className="text-gray-500 text-sm mt-1">Modèles de réponses générés automatiquement par l'IA</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Réponses générées", value: "34" },
          { label: "Temps moyen", value: "8 sec" },
          { label: "Taux satisfaction", value: "96%" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <p className="text-2xl font-extrabold text-[#667eea]">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Templates */}
      <h2 className="font-semibold text-gray-900 mb-4">Modèles de réponses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((t) => (
          <div key={t.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-400">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</span>
              <span className="font-semibold text-sm text-gray-900">{t.label}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 italic">"{t.preview}"</p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                ✏️ Modifier
              </button>
              <button className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[#667eea] hover:text-[#667eea] transition-all cursor-pointer">
                👁️ Aperçu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
