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

  // Annuler à la fin de la période payée (pas immédiatement)
  const body = new URLSearchParams({ cancel_at_period_end: "true" });
  const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subscription.stripe_subscription_id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY!}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.json() as any;
    return Response.json({ error: err.error?.message ?? "Erreur Stripe" }, { status: 500 });
  }

  const stripeData = await res.json() as any;
  const periodEnd = stripeData.current_period_end
    ? new Date(stripeData.current_period_end * 1000).toISOString()
    : null;

  await supabase
    .from("subscriptions")
    .update({ cancel_at_period_end: true, period_end: periodEnd })
    .eq("user_id", session.user.id);

  return Response.json({ ok: true });
}
