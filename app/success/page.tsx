import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SuccessPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Paiement confirmé !
        </h1>
        <p className="text-gray-500 mb-2">
          Créez votre compte avec <strong>la même adresse email</strong> que vous avez utilisée pour payer.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Votre abonnement sera automatiquement activé.
        </p>
        <Link
          href="/login"
          className="block w-full py-3 rounded-full font-semibold text-white text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          Créer mon compte →
        </Link>
      </div>
    </div>
  );
}
