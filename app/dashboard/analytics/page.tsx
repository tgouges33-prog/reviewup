import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations, getReviews, getLocationPerformance } from "@/lib/gmb";
import Link from "next/link";

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const STOP_WORDS = new Set([
  "le", "la", "les", "de", "du", "des", "un", "une", "et", "en", "est", "au", "aux",
  "je", "il", "elle", "nous", "vous", "ils", "ce", "se", "sa", "son", "mon", "ma",
  "très", "plus", "bien", "tout", "avec", "pour", "par", "sur", "dans", "qui", "que",
  "pas", "ne", "je", "on", "y", "a", "à", "ou", "mais", "si", "car", "car", "comme",
  "été", "avoir", "être", "fait", "the", "this", "and", "for", "are", "was",
]);

function extractKeywords(reviews: any[]): { word: string; count: number }[] {
  const freq: Record<string, number> = {};
  for (const r of reviews) {
    const text: string = r.comment ?? "";
    const words = text
      .toLowerCase()
      .replace(/[^a-zàâäéèêëîïôùûüç\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
    for (const w of words) {
      freq[w] = (freq[w] ?? 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
}

function groupByMonth(reviews: any[]): number[] {
  const counts = new Array(12).fill(0);
  for (const r of reviews) {
    if (r.createTime) {
      const month = new Date(r.createTime).getMonth();
      counts[month]++;
    }
  }
  return counts;
}

function sumMetric(timeSeries: any[], metricType: string): number {
  const serie = timeSeries?.find((s: any) => s.dailyMetric === metricType);
  if (!serie) return 0;
  return (serie.dailySubEntityData ?? serie.timeSeries?.datedValues ?? []).reduce(
    (sum: number, d: any) => sum + (Number(d.value) || 0),
    0
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token, location_name")
    .eq("user_id", session?.user?.id ?? "")
    .single();

  const accessToken = tokenData?.access_token ?? session?.provider_token;
  let locationName: string = tokenData?.location_name ?? "";

  let reviews: any[] = [];
  let gmbConnected = false;
  let totalViews = 0;

  if (accessToken) {
    try {
      if (!locationName) {
        const accounts = await getAccounts(accessToken);
        const firstAccount = accounts?.accounts?.[0]?.name;
        if (firstAccount) {
          const locations = await getLocations(accessToken, firstAccount);
          locationName = locations?.locations?.[0]?.name ?? "";
        }
      }

      if (locationName) {
        const data = await getReviews(accessToken, locationName);
        reviews = data.reviews ?? [];
        gmbConnected = true;

        try {
          const perf = await getLocationPerformance(accessToken, locationName);
          const series = perf?.multiDailyMetricTimeSeries ?? [];
          totalViews =
            sumMetric(series, "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH") +
            sumMetric(series, "BUSINESS_IMPRESSIONS_MOBILE_SEARCH") +
            sumMetric(series, "BUSINESS_IMPRESSIONS_DESKTOP_MAPS") +
            sumMetric(series, "BUSINESS_IMPRESSIONS_MOBILE_MAPS");
        } catch {
          // vues non disponibles
        }
      }
    } catch {
      // GMB non disponible
    }
  }

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((s, r) => s + (STAR_MAP[r.starRating] ?? 0), 0) / totalReviews).toFixed(1)
      : null;
  const repliedCount = reviews.filter((r) => !!r.reviewReply).length;
  const replyRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : null;

  const reviewData = groupByMonth(reviews);
  const maxVal = Math.max(...reviewData, 1);
  const keywords = extractKeywords(reviews);

  if (!gmbConnected) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Performance de votre fiche sur les 12 derniers mois</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-10 text-center max-w-lg mx-auto mt-8">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="font-semibold text-gray-900 text-lg mb-2">Compte Google non connecté</h2>
          <p className="text-gray-500 text-sm mb-6">
            Connectez votre compte Google My Business pour afficher vos vraies statistiques.
          </p>
          <Link
            href="/dashboard/gmb-connect"
            className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            Connecter mon compte GMB →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Performance de votre fiche sur les 12 derniers mois</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Avis total", value: String(totalReviews), icon: "⭐" },
          { label: "Note moyenne", value: avgRating ?? "--", icon: "📊" },
          { label: "Taux de réponse", value: replyRate !== null ? `${replyRate}%` : "--", icon: "💬" },
          { label: "Vues (28j)", value: totalViews > 0 ? totalViews.toLocaleString("fr-FR") : "--", icon: "👁️" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <div className="text-3xl mb-2">{k.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900">{k.value}</p>
            <p className="text-sm text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart avis par mois */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Avis collectés par mois (année en cours)</h2>
          <div className="flex items-end gap-2 h-40">
            {reviewData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {val > 0 && <span className="text-xs text-gray-500 font-medium">{val}</span>}
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80"
                  style={{
                    height: `${Math.max((val / maxVal) * 120, val > 0 ? 4 : 0)}px`,
                    background: "linear-gradient(180deg, #667eea, #764ba2)",
                  }}
                />
                <span className="text-xs text-gray-400">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
          {totalReviews === 0 && (
            <p className="text-center text-gray-400 text-sm mt-4">Aucun avis pour l'instant.</p>
          )}
        </div>

        {/* Top keywords */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Mots-clés fréquents</h2>
          {keywords.length === 0 ? (
            <p className="text-gray-400 text-sm">Pas assez d'avis pour extraire des mots-clés.</p>
          ) : (
            <div className="space-y-4">
              {keywords.map((k) => (
                <div key={k.word}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">"{k.word}"</span>
                    <span className="text-gray-500">{k.count} fois</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(k.count / keywords[0].count) * 100}%`,
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
