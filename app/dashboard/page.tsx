import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations, getReviews } from "@/lib/gmb";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const firstName = session?.user?.email?.split("@")[0] ?? "vous";

  // Fetch GMB token
  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token, location_name")
    .eq("user_id", session?.user?.id ?? "")
    .single();

  const { data: reviewLink } = await supabase
    .from("review_links")
    .select("id, google_review_url, logo_url")
    .eq("user_id", session?.user?.id ?? "")
    .single();

  const accessToken = tokenData?.access_token ?? session?.provider_token;

  let reviews: any[] = [];
  let gmbConnected = false;

  if (accessToken) {
    try {
      let locationName: string = tokenData?.location_name ?? "";
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
      }
    } catch {
      // GMB not available, show placeholder stats
    }
  }

  const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (STAR_MAP[r.starRating] ?? 0), 0) / totalReviews).toFixed(1)
    : null;
  const repliedCount = reviews.filter((r: any) => !!r.reviewReply).length;
  const replyRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : null;

  const stats = gmbConnected ? [
    { label: "Note moyenne", value: avgRating ?? "--", icon: "⭐" },
    { label: "Total avis", value: String(totalReviews), icon: "💬" },
    { label: "Avis répondus", value: String(repliedCount), icon: "🤖" },
    { label: "Taux de réponse", value: replyRate !== null ? `${replyRate}%` : "--", icon: "📊" },
  ] : [
    { label: "Note moyenne", value: "--", icon: "⭐" },
    { label: "Total avis", value: "--", icon: "💬" },
    { label: "Avis répondus", value: "--", icon: "🤖" },
    { label: "Taux de réponse", value: "--", icon: "📊" },
  ];

  const recentReviews = reviews.slice(0, 4).map((r: any) => ({
    name: r.reviewer?.displayName ?? "Anonyme",
    stars: STAR_MAP[r.starRating] ?? 0,
    text: r.comment ?? "",
    date: new Date(r.createTime).toLocaleDateString("fr-FR"),
    replied: !!r.reviewReply,
  }));

  // Checklist items
  const checklist = [
    { label: "Connecter Google My Business", done: gmbConnected, href: "/dashboard/gmb-connect" },
    { label: "Configurer votre lien de collecte d'avis", done: !!reviewLink?.google_review_url, href: "/dashboard/collect" },
    { label: "Ajouter votre logo", done: !!reviewLink?.logo_url, href: "/dashboard/collect" },
    { label: "Envoyer votre premier lien d'avis à un client", done: false, href: "/dashboard/collect" },
  ];
  const checklistDone = checklist.filter((c) => c.done).length;
  const showChecklist = checklistDone < checklist.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour, {firstName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Voici l'état de votre fiche Google My Business</p>
      </div>

      {/* Checklist de démarrage */}
      {showChecklist && (
        <div className="mb-6 bg-white border border-[#667eea]/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900">🚀 Démarrage rapide</p>
              <p className="text-xs text-gray-400 mt-0.5">{checklistDone}/{checklist.length} étapes complétées</p>
            </div>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(checklistDone / checklist.length) * 100}%`, background: "linear-gradient(90deg, #667eea, #764ba2)" }}
              />
            </div>
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <Link key={item.label} href={item.done ? "#" : item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  item.done ? "bg-green-50 text-gray-400 cursor-default" : "bg-[#f8f9ff] text-gray-700 hover:bg-[#667eea]/10"
                }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  item.done ? "bg-green-500 text-white" : "border-2 border-[#667eea] text-[#667eea]"
                }`}>
                  {item.done ? "✓" : "→"}
                </span>
                <span className={item.done ? "line-through" : "font-medium"}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!gmbConnected && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <p className="font-semibold text-orange-800 text-sm">Compte Google My Business non connecté</p>
              <p className="text-orange-600 text-xs mt-0.5">Connectez votre fiche pour afficher vos vraies statistiques</p>
            </div>
          </div>
          <Link
            href="/dashboard/gmb-connect"
            className="px-4 py-2 rounded-full text-white text-sm font-medium flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            Connecter →
          </Link>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent reviews */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Avis récents</h2>
            <Link href="/dashboard/reviews" className="text-sm text-[#667eea] hover:underline">Voir tout →</Link>
          </div>
          {recentReviews.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              {gmbConnected ? "Aucun avis pour l'instant." : "Connectez votre GMB pour voir vos avis."}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentReviews.map((r, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{r.name}</span>
                        <span className="text-amber-400 text-xs">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.text}</p>
                      <p className="text-gray-400 text-xs mt-1">{r.date}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 ${r.replied ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}>
                      {r.replied ? "✓ Répondu" : "En attente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              { label: "Avis récents", score: totalReviews > 0 ? Math.min(100, totalReviews * 5) : 0 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.score}%`, background: "linear-gradient(90deg, #667eea, #764ba2)" }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-900">Score global</span>
                <span className="font-bold text-[#667eea]">
                  {Math.round((100 + 75 + 100 + 60 + (totalReviews > 0 ? Math.min(100, totalReviews * 5) : 0)) / 5)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
