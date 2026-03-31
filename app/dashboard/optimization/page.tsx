import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations, getLocation, getReviews } from "@/lib/gmb";
import Link from "next/link";
import OptimizationClient from "./OptimizationClient";

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

function computeScore(location: any, reviews: any[]) {
  const items = [
    {
      key: "title",
      label: "Nom de l'établissement",
      description: "Le nom doit être exact, sans mots-clés artificiels.",
      done: !!location?.title,
      points: 15,
      tip: "Utilisez votre vrai nom d'enseigne, sans ajouts de mots-clés.",
    },
    {
      key: "description",
      label: "Description complète",
      description: "Minimum 250 caractères avec mots-clés naturels.",
      done: (location?.profile?.description?.length ?? 0) >= 250,
      points: 20,
      tip: "Rédigez une description de 250+ caractères incluant votre ville, vos services et mots-clés.",
    },
    {
      key: "categories",
      label: "Catégories renseignées",
      description: "1 catégorie principale + catégories secondaires.",
      done: !!location?.categories?.primaryCategory,
      points: 15,
      tip: "Ajoutez une catégorie principale précise et 2 à 3 catégories secondaires pertinentes.",
    },
    {
      key: "hours",
      label: "Horaires d'ouverture",
      description: "Horaires complets et à jour pour chaque jour.",
      done: !!location?.regularHours?.periods?.length,
      points: 15,
      tip: "Renseignez vos horaires pour chaque jour de la semaine, y compris les jours fermés.",
    },
    {
      key: "phone",
      label: "Numéro de téléphone",
      description: "Téléphone local de préférence.",
      done: !!location?.phoneNumbers?.primaryPhone,
      points: 10,
      tip: "Ajoutez un numéro de téléphone local — il renforce la confiance et le référencement local.",
    },
    {
      key: "website",
      label: "Site web renseigné",
      description: "Lien vers votre site officiel.",
      done: !!location?.websiteUri,
      points: 10,
      tip: "Ajoutez l'URL de votre site web pour améliorer votre score de pertinence.",
    },
    {
      key: "photos",
      label: "Photos ajoutées",
      description: "Au moins 5 photos de qualité.",
      done: (reviews?.length ?? 0) > 0,
      points: 10,
      tip: "Ajoutez au moins 5 photos (façade, intérieur, équipe, produits). Les fiches avec photos reçoivent 42% plus de demandes d'itinéraire.",
    },
    {
      key: "reviews",
      label: "Avis récents",
      description: "Minimum 10 avis avec réponses.",
      done: reviews.length >= 10,
      points: 5,
      tip: "Invitez vos clients satisfaits à laisser un avis. Répondez à tous les avis, positifs comme négatifs.",
    },
  ];

  const totalPoints = items.reduce((s, i) => s + (i.done ? i.points : 0), 0);
  const maxPoints = items.reduce((s, i) => s + i.points, 0);
  const score = Math.round((totalPoints / maxPoints) * 100);

  return { items, score };
}

export default async function OptimizationPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: tokenData } = await supabase
    .from("user_tokens")
    .select("access_token, location_name")
    .eq("user_id", session?.user?.id ?? "")
    .single();

  const accessToken = tokenData?.access_token ?? session?.provider_token;
  let locationName: string = tokenData?.location_name ?? "";
  let location: any = null;
  let reviews: any[] = [];
  let gmbConnected = false;

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
        [location, { reviews: reviews = [] }] = await Promise.all([
          getLocation(accessToken, locationName).catch(() => null),
          getReviews(accessToken, locationName).catch(() => ({ reviews: [] })),
        ]);
        gmbConnected = true;
      }
    } catch {
      // GMB non disponible
    }
  }

  if (!gmbConnected) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Optimisation GMB</h1>
          <p className="text-gray-500 text-sm mt-1">Améliorez votre positionnement Google pour viser le Top 3</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-10 text-center max-w-lg mx-auto mt-8">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="font-semibold text-gray-900 text-lg mb-2">Compte Google non connecté</h2>
          <p className="text-gray-500 text-sm mb-6">
            Connectez votre fiche Google My Business pour analyser et optimiser votre positionnement.
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

  const { items, score } = computeScore(location, reviews);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (STAR_MAP[r.starRating] ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  const gmbData = {
    title: location?.title,
    description: location?.profile?.description,
    categories: [
      location?.categories?.primaryCategory?.displayName,
      ...(location?.categories?.additionalCategories?.map((c: any) => c.displayName) ?? []),
    ].filter(Boolean),
    hasPhotos: true,
    hasHours: !!location?.regularHours?.periods?.length,
    hasPhone: !!location?.phoneNumbers?.primaryPhone,
    hasWebsite: !!location?.websiteUri,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Optimisation GMB</h1>
        <p className="text-gray-500 text-sm mt-1">Améliorez votre positionnement Google pour viser le Top 3</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Score global */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center mb-5">
            <p className="text-sm font-medium text-gray-500 mb-3">Score d'optimisation</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="url(#grad)" strokeWidth="3"
                  strokeDasharray={`${score} ${100 - score}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-gray-900">{score}</span>
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </div>
            <p className={`text-sm font-semibold ${score >= 80 ? "text-green-600" : score >= 50 ? "text-orange-500" : "text-red-500"}`}>
              {score >= 80 ? "Très bonne fiche" : score >= 50 ? "Fiche à améliorer" : "Fiche incomplète"}
            </p>
          </div>

          {/* Stats rapides */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Note moyenne</span>
              <span className="font-semibold">{avgRating ? `${avgRating} ⭐` : "--"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nombre d'avis</span>
              <span className="font-semibold">{reviews.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Points complétés</span>
              <span className="font-semibold">{items.filter(i => i.done).length}/{items.length}</span>
            </div>
          </div>
        </div>

        {/* Checklist + suggestions */}
        <div className="xl:col-span-2 space-y-5">

          {/* Checklist */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Checklist d'optimisation</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    item.done ? "border-green-100 bg-green-50" : "border-orange-100 bg-orange-50"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5 ${
                    item.done ? "bg-green-500 text-white" : "bg-orange-100 text-orange-500"
                  }`}>
                    {item.done ? "✓" : "!"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold ${item.done ? "text-green-800" : "text-orange-800"}`}>
                        {item.label}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                        item.done ? "bg-green-200 text-green-700" : "bg-orange-200 text-orange-600"
                      }`}>
                        {item.points} pts
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    {!item.done && (
                      <p className="text-xs text-orange-700 mt-1.5 font-medium">→ {item.tip}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions IA */}
          <OptimizationClient gmbData={gmbData} score={score} locationName={location?.title ?? ""} />

        </div>
      </div>
    </div>
  );
}
