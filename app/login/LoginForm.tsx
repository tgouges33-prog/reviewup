"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

// GMB scopes needed for Google My Business API access
const GMB_SCOPES = [
  "https://www.googleapis.com/auth/business.manage",
].join(" ");

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
      }
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoadingGoogle(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: GMB_SCOPES,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:opacity-80">
          ⭐ ReviewUp
        </Link>
        <p className="text-gray-500 mt-2 text-sm">
          {mode === "login" ? "Connectez-vous à votre compte" : "Créez votre compte gratuit"}
        </p>
      </div>

      {/* Google OAuth button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loadingGoogle}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-5 cursor-pointer disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loadingGoogle ? "Redirection..." : "Continuer avec Google (GMB)"}
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">ou par email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          {loading ? "..." : mode === "login" ? "Se connecter →" : "Créer mon compte →"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          className="text-[#667eea] font-medium hover:underline cursor-pointer"
        >
          {mode === "login" ? "Commencer gratuitement" : "Se connecter"}
        </button>
      </p>
    </div>
  );
}
