import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session?.user?.id ?? "")
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", session?.user?.id ?? "")
    .eq("status", "active")
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez votre compte et vos préférences</p>
      </div>
      <SettingsForm
        initialProfile={profile}
        email={session?.user?.email ?? ""}
        plan={subscription?.plan ?? null}
      />
    </div>
  );
}
