const CAL_ATTRS = {
  "data-cal-link": "avisio/15min",
  "data-cal-namespace": "15min",
  "data-cal-config": JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
  }),
};

export default function Hero() {
  return (
    <section
      className="text-white py-24 px-5 text-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div
        className="absolute -top-1/2 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
      <div className="relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
          Dominez votre présence Google My Business
        </h1>
        <p className="text-lg md:text-xl opacity-95 mb-8">
          Automatisez l'optimisation de votre fiche GMB, collectez des avis et
          augmentez vos clients locaux avec Klevano
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="bg-white text-[#667eea] font-semibold px-10 py-4 rounded-full text-base hover:-translate-y-0.5 hover:shadow-2xl transition-all cursor-pointer"
          >
            Voir les offres →
          </a>
          <button
            {...CAL_ATTRS}
            className="border-2 border-white/60 text-white font-medium px-8 py-4 rounded-full text-base hover:bg-white/10 transition-all cursor-pointer"
          >
            Réserver une démo
          </button>
        </div>
      </div>
    </section>
  );
}
