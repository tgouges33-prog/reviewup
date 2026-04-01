import { createClient } from "@/lib/supabase/server";
import GmbManager from "./GmbManager";
import Link from "next/link";

export default async function GmbPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", session?.user?.id ?? "")
    .eq("status", "active")
    .single();

  const isPro = subscription?.plan === "pro";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ma fiche Google My Business</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isPro ? "Gérez et optimisez votre fiche directement depuis Klevano" : "Modifiez les informations de base de votre fiche"}
          </p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${isPro ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
          {isPro ? "✦ Plan Pro" : "Plan Essentiel"}
        </span>
      </div>

      <GmbManager isPro={isPro} />
    </div>
  );
}
