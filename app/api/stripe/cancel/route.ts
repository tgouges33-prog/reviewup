export const runtime = "nodejs";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", session.user.id)
    .eq("status", "active")
    .single();

  if (!subscription?.stripe_subscription_id) {
    return Response.json({ error: "Aucun abonnement actif trouvé" }, { status: 404 });
  }

  const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subscription.stripe_subscription_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY!}` },
  });

  if (!res.ok) {
    const err = await res.json() as any;
    return Response.json({ error: err.error?.message ?? "Erreur Stripe" }, { status: 500 });
  }

  await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("user_id", session.user.id);

  return Response.json({ ok: true });
}
