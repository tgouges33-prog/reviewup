export const runtime = "nodejs";

import { PLANS, type PlanKey } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { plan } = await request.json() as { plan: PlanKey };

  if (!PLANS[plan]) {
    return Response.json({ error: "Plan invalide" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const appUrl = new URL(request.url).origin;
  const secretKey = process.env.STRIPE_SECRET_KEY!;

  const params = new URLSearchParams({
    mode: "subscription",
    "payment_method_types[0]": "card",
    "line_items[0][price]": PLANS[plan].priceId,
    "line_items[0][quantity]": "1",
    success_url: `${appUrl}/success`,
    cancel_url: `${appUrl}/#pricing`,
    locale: "fr",
    "metadata[plan]": plan,
    "metadata[user_id]": session.user.id,
    "subscription_data[metadata][plan]": plan,
    "subscription_data[metadata][user_id]": session.user.id,
  });

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      console.error("Stripe API error:", data.error?.message);
      return Response.json({ error: data.error?.message }, { status: 500 });
    }

    return Response.json({ url: data.url });
  } catch (error: any) {
    console.error("Fetch error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
