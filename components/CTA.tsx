const CAL_ATTRS = {
  "data-cal-link": "avisio/15min",
  "data-cal-namespace": "15min",
  "data-cal-config": JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
  }),
};

export default function CTA() {
  return (
    <section
      className="py-20 px-5 text-white text-center"
      id="contact"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Prêt à transformer votre présence Google ?
        </h2>
        <p className="text-lg opacity-95 mb-8">
          Rejoignez les 500+ entreprises qui font confiance à Klevano
        </p>
        <button
          {...CAL_ATTRS}
          className="bg-white text-[#667eea] font-semibold px-10 py-4 rounded-full text-base hover:-translate-y-0.5 hover:shadow-2xl transition-all cursor-pointer"
        >
          Réserver une démo gratuite →
        </button>
      </div>
    </section>
  );
}
