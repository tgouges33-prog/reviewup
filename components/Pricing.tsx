const plans = [
  {
    name: "Essentiel",
    price: "99",
    subtitle: "Pour les petites entreprises",
    featured: false,
    features: [
      "1 fiche GMB optimisée",
      "IA d'optimisation auto",
      "Collecte d'avis auto",
      "Réponses IA aux avis",
      "Analytics basique",
      "Support par email",
    ],
  },
  {
    name: "Professionnel",
    price: "149",
    subtitle: "Pour les agences & multi-établissements",
    featured: true,
    features: [
      "Fiches GMB illimitées",
      "IA avancée multi-fiches",
      "Collecte d'avis premium",
      "Réponses IA intelligentes",
      "Analytics avancée + rapports",
      "Support prioritaire 24/7",
      "Optimisation SEO local avancée",
      "Onboarding personnalisé",
    ],
  },
];

const CAL_ATTRS = {
  "data-cal-link": "avisio/15min",
  "data-cal-namespace": "15min",
  "data-cal-config": JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
  }),
};

export default function Pricing() {
  return (
    <section className="py-20 px-5 bg-[#f8f9ff]" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Deux formules pour maximiser votre potentiel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative bg-white rounded-2xl p-10 text-center transition-all ${
                p.featured
                  ? "border-2 border-[#667eea] shadow-2xl scale-105"
                  : "border-2 border-gray-200 hover:shadow-xl"
              }`}
            >
              {p.featured && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  Recommandé
                </span>
              )}
              <h3 className="text-2xl font-bold mb-1">{p.name}</h3>
              <p className="text-[#667eea] text-5xl font-extrabold my-5">
                {p.price}€<span className="text-gray-400 text-base font-normal">/mois</span>
              </p>
              <p className="text-gray-500 text-sm mb-8">{p.subtitle}</p>
              <ul className="text-left mb-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600 border-b border-gray-100 pb-3 last:border-0">
                    <span className="text-[#667eea] font-bold text-base">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                {...CAL_ATTRS}
                className="w-full py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                {p.featured ? "Essayer →" : "Démarrer →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
