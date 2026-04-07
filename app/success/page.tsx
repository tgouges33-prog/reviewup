"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SuccessPage() {
  const [status, setStatus] = useState<"waiting" | "ready" | "timeout">("waiting");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus("ready"); // pas connecté → page "créer un compte"
        return;
      }

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .single();

      if (subscription) {
        router.push("/dashboard");
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setStatus("timeout");
        return;
      }

      setTimeout(check, 1500);
    };

    check();
  }, []);

  if (status === "waiting") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-pulse">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Paiement confirmé !</h1>
          <p className="text-gray-500 mb-2">Activation de votre abonnement en cours...</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#667eea", animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Paiement confirmé !</h1>
          <p className="text-gray-500 mb-6">Votre abonnement est en cours d'activation. Accédez à votre dashboard dans quelques instants.</p>
          <a
            href="/dashboard"
            className="block w-full py-3 rounded-full font-semibold text-white text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            Accéder au dashboard →
          </a>
        </div>
      </div>
    );
  }

  // Non connecté → créer un compte
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Paiement confirmé !</h1>
        <p className="text-gray-500 mb-2">
          Créez votre compte avec <strong>la même adresse email</strong> que vous avez utilisée pour payer.
        </p>
        <p className="text-gray-400 text-sm mb-8">Votre abonnement sera automatiquement activé.</p>
        <a
          href="/login"
          className="block w-full py-3 rounded-full font-semibold text-white text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          Créer mon compte →
        </a>
      </div>
    </div>
  );
}
