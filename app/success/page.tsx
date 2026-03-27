import Link from "next/link";

export default function SuccessPage() {
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
        <p className="text-gray-500 mb-8">
          Bienvenue sur ReviewUp. Votre abonnement est actif.
          Connectez maintenant votre fiche Google My Business.
        </p>
        <Link
          href="/dashboard"
          className="block w-full py-3 rounded-full font-semibold text-white text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          Accéder au dashboard →
        </Link>
        <Link href="/" className="block mt-4 text-sm text-gray-400 hover:text-gray-600">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
