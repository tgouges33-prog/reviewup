import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";
import Paywall from "./Paywall";

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
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!subscription) {
    return <Paywall />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <Sidebar userEmail={user.email ?? ""} />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
