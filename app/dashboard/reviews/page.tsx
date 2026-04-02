import { createClient } from "@/lib/supabase/server";
import ReviewsTabsClient from "./ReviewsTabsClient";
import UpgradeGate from "../UpgradeGate";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", session?.user?.id ?? "")
    .eq("status", "active")
    .single();

  if (subscription?.plan !== "pro") {
    return <UpgradeGate feature="Avis & Feedbacks" />;
  }

  return <ReviewsTabsClient />;
}
