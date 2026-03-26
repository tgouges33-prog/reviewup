import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <header
        className="text-white py-4 px-6 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <Link href="/" className="text-xl font-bold">⭐ ReviewUp</Link>
        <span className="text-sm opacity-80">Dashboard</span>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenue sur votre dashboard 👋</h1>
        <p className="text-gray-500 mb-8">
          Votre espace de gestion GMB arrive bientôt. En attendant, réservez votre onboarding.
        </p>
        <Link
          href="/"
          className="inline-block text-[#667eea] border border-[#667eea] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#667eea] hover:text-white transition-all"
        >
          ← Retour à l'accueil
        </Link>
      </main>
    </div>
  );
}
