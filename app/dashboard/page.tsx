import { createClient } from "@/lib/supabase/server";

const stats = [
  { label: "Note moyenne", value: "4.8", icon: "⭐", change: "+0.2", up: true },
  { label: "Avis ce mois", value: "38", icon: "💬", change: "+12%", up: true },
  { label: "Réponses IA", value: "34", icon: "🤖", change: "89%", up: true },
  { label: "Vues fiche", value: "1 240", icon: "👁️", change: "+23%", up: true },
];

const recentReviews = [
  { name: "Marie D.", stars: 5, text: "Excellent service ! Je reviendrai sans hésiter.", date: "Il y a 2h", replied: true },
  { name: "Jacques P.", stars: 5, text: "Très professionnel, livraison rapide.", date: "Il y a 5h", replied: true },
  { name: "Sophie L.", stars: 4, text: "Bon rapport qualité-prix, je recommande.", date: "Il y a 1j", replied: false },
  { name: "Marc T.", stars: 3, text: "Service correct mais délai un peu long.", date: "Il y a 2j", replied: false },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName = user?.email?.split("@")[0] ?? "vous";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour, {firstName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Voici l'état de votre fiche Google My Business</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.up ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* GMB status + recent reviews */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent reviews */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Avis récents</h2>
            <a href="/dashboard/reviews" className="text-sm text-[#667eea] hover:underline">Voir tout →</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentReviews.map((r) => (
              <div key={r.name} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{r.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{r.date}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 ${r.replied ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}>
                    {r.replied ? "✓ Répondu" : "En attente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GMB Health */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Santé de la fiche</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {[
              { label: "Description", score: 100 },
              { label: "Photos", score: 75 },
              { label: "Horaires", score: 100 },
              { label: "Catégories", score: 60 },
              { label: "Avis récents", score: 85 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.score}%`,
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-900">Score global</span>
                <span className="font-bold text-[#667eea]">84%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
