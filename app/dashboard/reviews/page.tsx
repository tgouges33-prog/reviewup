const reviews = [
  { name: "Marie D.", stars: 5, text: "Excellent service ! Je reviendrai sans hésiter.", date: "Il y a 2h", replied: true, response: "Merci beaucoup Marie ! C'est un plaisir de vous accueillir." },
  { name: "Jacques P.", stars: 5, text: "Très professionnel, livraison rapide.", date: "Il y a 5h", replied: true, response: "Merci Jacques pour votre confiance !" },
  { name: "Sophie L.", stars: 4, text: "Bon rapport qualité-prix, je recommande.", date: "Il y a 1j", replied: false, response: "" },
  { name: "Marc T.", stars: 3, text: "Service correct mais délai un peu long.", date: "Il y a 2j", replied: false, response: "" },
  { name: "Claire B.", stars: 5, text: "Parfait ! Rien à redire, équipe sympa.", date: "Il y a 3j", replied: true, response: "Un grand merci Claire, à très bientôt !" },
  { name: "Pierre M.", stars: 2, text: "Déçu par la qualité cette fois-ci.", date: "Il y a 4j", replied: false, response: "" },
];

export default function ReviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Avis Google</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez et répondez à vos avis clients</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["Tous", "En attente", "Répondus", "5 ★", "4 ★", "3 ★ et -"].map((f) => (
          <button
            key={f}
            className="px-4 py-2 rounded-full text-sm border border-gray-200 bg-white hover:border-[#667eea] hover:text-[#667eea] transition-all"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.name + r.date} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-sm font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                      <span className="text-gray-400 text-xs">· {r.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3">{r.text}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 ${r.replied ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}>
                {r.replied ? "✓ Répondu" : "En attente"}
              </span>
            </div>

            {r.replied && r.response && (
              <div className="mt-3 ml-12 bg-[#f8f9ff] rounded-lg p-3 border-l-4 border-[#667eea]">
                <p className="text-xs font-semibold text-[#667eea] mb-1">Votre réponse</p>
                <p className="text-sm text-gray-600">{r.response}</p>
              </div>
            )}

            {!r.replied && (
              <div className="mt-4 flex gap-3">
                <button
                  className="px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                >
                  🤖 Répondre avec l'IA
                </button>
                <button className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[#667eea] hover:text-[#667eea] transition-all cursor-pointer">
                  ✏️ Répondre manuellement
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
