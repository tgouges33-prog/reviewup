const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
const reviewData = [4, 6, 8, 7, 12, 15, 11, 18, 22, 28, 34, 38];
const maxVal = Math.max(...reviewData);

const topKeywords = [
  { word: "service", count: 42 },
  { word: "rapide", count: 35 },
  { word: "professionnel", count: 31 },
  { word: "qualité", count: 28 },
  { word: "accueil", count: 24 },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Performance de votre fiche sur les 12 derniers mois</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Avis total", value: "127", icon: "⭐" },
          { label: "Note moyenne", value: "4.8", icon: "📊" },
          { label: "Taux de réponse", value: "89%", icon: "💬" },
          { label: "Vues / mois", value: "1 240", icon: "👁️" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <div className="text-3xl mb-2">{k.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900">{k.value}</p>
            <p className="text-sm text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Avis collectés par mois</h2>
          <div className="flex items-end gap-2 h-40">
            {reviewData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{val}</span>
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80"
                  style={{
                    height: `${(val / maxVal) * 120}px`,
                    background: "linear-gradient(180deg, #667eea, #764ba2)",
                  }}
                />
                <span className="text-xs text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top keywords */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Mots-clés fréquents</h2>
          <div className="space-y-4">
            {topKeywords.map((k) => (
              <div key={k.word}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">"{k.word}"</span>
                  <span className="text-gray-500">{k.count} fois</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(k.count / topKeywords[0].count) * 100}%`,
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
