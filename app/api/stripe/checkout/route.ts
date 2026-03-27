import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { plan } = await request.json() as { plan: PlanKey };

  if (!PLANS[plan]) {
    return Response.json({ error: "Plan invalide" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#pricing`,
      locale: "fr",
      ...(user?.email && {
        customer_email: user.email,
      }),
      metadata: {
        plan,
        userId: user?.id ?? "",
      },
    });

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
