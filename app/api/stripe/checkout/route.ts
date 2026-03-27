export const runtime = "nodejs";

import { PLANS, type PlanKey } from "@/lib/stripe";

export async function POST(request: Request) {
  const { plan } = await request.json() as { plan: PlanKey };

  if (!PLANS[plan]) {
    return Response.json({ error: "Plan invalide" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reviewup-three.vercel.app";
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
      console.error("Stripe API error:", JSON.stringify(data));
      return Response.json({ error: data.error?.message, detail: data.error }, { status: 500 });
    }

    return Response.json({ url: data.url });
  } catch (error: any) {
    console.error("Fetch error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
