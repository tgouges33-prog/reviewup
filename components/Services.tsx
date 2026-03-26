const services = [
  { n: "1", title: "Optimisation intelligente", desc: "IA qui optimise automatiquement votre contenu, photos et descriptions 24/7" },
  { n: "2", title: "Collecte d'avis automatisée", desc: "Invitation intelligente de vos clients satisfaits à laisser des avis" },
  { n: "3", title: "Réponses IA aux avis", desc: "Générez des réponses professionnelles personnalisées en quelques secondes" },
  { n: "4", title: "Monitoring 24/7", desc: "Surveillance continue avec alertes instantanées sur chaque nouvel avis" },
  { n: "5", title: "Analytics détaillées", desc: "Dashboards en temps réel avec KPIs, tendances et recommandations" },
  { n: "6", title: "Support prioritaire", desc: "Accompagnement personnalisé d'experts GMB pour maximiser vos résultats" },
];

export default function Services() {
  return (
    <section className="py-20 px-5 bg-white" id="services">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Nos services d'optimisation automatique
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s) => (
            <div key={s.n} className="flex gap-5">
              <span
                className="text-3xl font-extrabold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.n}
              </span>
              <div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
