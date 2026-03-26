const reviews = [
  { name: "Marie D.", date: "Il y a 3 jours", text: "Excellent service et personnel très accueillant. Je reviendrais sans hésiter!" },
  { name: "Jacques P.", date: "Il y a 5 jours", text: "Qualité impeccable et livraison ultra rapide. Bravo à toute l'équipe!" },
  { name: "Sophie L.", date: "Il y a 1 semaine", text: "Rapport qualité-prix imbattable. Recommandé à tous mes amis!" },
];

export default function Reviews() {
  return (
    <section className="py-20 px-5 bg-[#f8f9ff]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Exemples d'avis collectés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-amber-400 text-sm mt-0.5">★★★★★</p>
                  <p className="text-gray-400 text-xs mt-1">{r.date}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
