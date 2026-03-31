import { createClient } from "@/lib/supabase/server";
import CollectClient from "./CollectClient";

export default async function CollectPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: link } = await supabase
    .from("review_links")
    .select("*")
    .eq("user_id", session?.user?.id ?? "")
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("id", session?.user?.id ?? "")
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Collecte d'avis</h1>
        <p className="text-gray-500 text-sm mt-1">Générez votre lien unique et QR code pour collecter des avis clients</p>
      </div>
      <CollectClient initialLink={link ?? null} defaultBusinessName={profile?.business_name ?? ""} />
    </div>
  );
}
