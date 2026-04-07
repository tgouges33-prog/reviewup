import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "./DashboardShell";
import SupportChat from "@/components/SupportChat";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Relier l'abonnement à l'utilisateur s'il a payé avant de créer son compte
  await supabase
    .from("subscriptions")
    .update({ user_id: user.id })
    .eq("email", user.email!)
    .is("user_id", null);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan, cancel_at_period_end, period_end")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const now = new Date().toISOString();
  const hasActiveSubscription = subscription && (
    !subscription.cancel_at_period_end ||
    (subscription.period_end && subscription.period_end > now)
  );

  const plan = hasActiveSubscription ? (subscription.plan ?? "free") : "free";
  const isPro = plan === "pro";

  return (
    <>
      <DashboardShell userEmail={user.email ?? ""} isPro={isPro}>{children}</DashboardShell>
      <SupportChat userEmail={user.email ?? ""} />
    </>
  );
}
