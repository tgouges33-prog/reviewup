import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:opacity-80">
            ⭐ ReviewUp
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Connectez-vous à votre compte</p>
        </div>

        <form className="space-y-5" action="/dashboard">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="vous@exemple.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            Se connecter →
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Pas encore de compte ?{" "}
          <span className="text-[#667eea] font-medium cursor-pointer hover:underline">
            Commencer gratuitement
          </span>
        </p>
      </div>
    </div>
  );
}
