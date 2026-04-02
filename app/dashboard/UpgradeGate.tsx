import Link from "next/link";

export default function UpgradeGate({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Fonctionnalité Pro</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        <strong>{feature}</strong> est disponible uniquement avec l'offre Professionnelle à 169€/mois.
      </p>
      <Link
        href="/dashboard/settings"
        className="px-8 py-3 rounded-full font-semibold text-white text-sm hover:-translate-y-0.5 transition-all"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        Passer à l'offre Pro →
      </Link>
    </div>
  );
}
