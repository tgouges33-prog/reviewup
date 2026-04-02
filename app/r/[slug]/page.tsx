import { createClient } from "@/lib/supabase/server";
import ReviewForm from "./ReviewForm";

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
}) {
  const { slug } = await params;
  const { src } = await searchParams;
  const supabase = await createClient();

  const { data: link } = await supabase
    .from("review_links")
    .select("id, user_id, business_name, google_review_url, logo_url, primary_color")
    .eq("slug", slug)
    .single();

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">❓</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Lien introuvable</h1>
          <p className="text-gray-500 text-sm">Ce lien n'existe pas ou a été désactivé.</p>
        </div>
      </div>
    );
  }

  // Vérifier que l'abonnement est toujours valide
  const now = new Date().toISOString();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, cancel_at_period_end, period_end")
    .eq("user_id", link.user_id)
    .single();

  const isActive = subscription?.status === "active" && (
    !subscription.cancel_at_period_end ||
    (subscription.period_end && subscription.period_end > now)
  );

  if (!isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Lien désactivé</h1>
          <p className="text-gray-500 text-sm">Ce lien de collecte d'avis n'est plus actif.</p>
        </div>
      </div>
    );
  }

  // Tracker la visite
  await supabase.from("link_events").insert({
    link_id: link.id,
    event_type: "view",
    source: src === "qr" ? "qr" : "link",
  });

  return <ReviewForm link={link} source={src ?? "link"} />;
}
