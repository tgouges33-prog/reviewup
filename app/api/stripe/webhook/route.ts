export const runtime = "nodejs";

import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Utilise le client admin pour bypasser RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const plan = session.metadata?.plan;
    const userId = session.metadata?.user_id;
    const email = session.customer_details?.email ?? null;

    if (!userId) {
      console.error("Webhook: user_id manquant dans les metadata");
      return new Response("user_id manquant", { status: 400 });
    }

    const { error } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      plan,
      status: "active",
      email,
    }, { onConflict: "user_id" });

    if (error) {
      console.error("Supabase upsert error:", JSON.stringify(error));
      return new Response("Supabase error: " + error.message, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    await supabase
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("stripe_subscription_id", subscription.id);
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as any;
    const userId = subscription.metadata?.user_id;
    await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        period_end: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return new Response("ok", { status: 200 });
}
