const features = [
  { icon: "🤖", title: "Optimisation automatique", desc: "Notre IA optimise automatiquement votre fiche 24/7 pour les meilleurs résultats" },
  { icon: "📊", title: "Analytics temps réel", desc: "Suivez vos avis, classement et engagement avec des dashboards détaillés" },
  { icon: "🎯", title: "Gestion centralisée", desc: "Gérez plusieurs fiches GMB depuis une seule plateforme intuitive" },
  { icon: "💬", title: "Réponse IA aux avis", desc: "Réponses automatiques intelligentes et professionnelles en moins de 10 secondes" },
  { icon: "📱", title: "Optimisation mobile", desc: "Votre fiche est automatiquement optimisée pour tous les appareils" },
  { icon: "🔍", title: "SEO local avancé", desc: "Augmentez votre visibilité dans les résultats locaux automatiquement" },
];

export default function Features() {
  return (
    <section className="py-20 px-5 bg-[#f8f9ff]" id="features">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Pourquoi ReviewUp ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-gray-200 p-7 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
