import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — ReviewUp" };

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-5">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <Link href="/" className="text-sm text-[#667eea] hover:underline mb-8 inline-block">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : mars 2026</p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Responsable du traitement</h2>
          <p className="text-gray-600 leading-relaxed">
            EI Thomas GOUGES — 180 Rue des Queyries, 33100 Bordeaux — [À COMPLÉTER : contact@votredomaine.fr]<br />
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits sur vos données personnelles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Données collectées</h2>
          <p className="text-gray-600 leading-relaxed mb-3">Nous collectons les données suivantes :</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>Données de compte :</strong> adresse email, mot de passe (hashé)</li>
            <li><strong>Données de connexion Google :</strong> token OAuth pour accéder à votre fiche Google My Business</li>
            <li><strong>Données de facturation :</strong> gérées exclusivement par Stripe (nous ne stockons pas vos coordonnées bancaires)</li>
            <li><strong>Avis clients :</strong> étoiles, commentaires, email client (si renseigné volontairement)</li>
            <li><strong>Données d'utilisation :</strong> pages visitées, clics sur les liens d'avis (données anonymisées)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Finalités du traitement</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Fournir et améliorer le service ReviewUp</li>
            <li>Gérer votre abonnement et la facturation</li>
            <li>Vous envoyer des notifications liées à votre compte (avis négatifs, réponses clients)</li>
            <li>Analyser les performances de votre fiche Google My Business</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Sous-traitants</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">Prestataire</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">Rôle</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Pays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-2 pr-4">Supabase</td><td className="py-2 pr-4">Base de données, authentification</td><td className="py-2">UE</td></tr>
                <tr><td className="py-2 pr-4">Vercel</td><td className="py-2 pr-4">Hébergement</td><td className="py-2">USA</td></tr>
                <tr><td className="py-2 pr-4">Stripe</td><td className="py-2 pr-4">Paiement</td><td className="py-2">USA</td></tr>
                <tr><td className="py-2 pr-4">Resend</td><td className="py-2 pr-4">Envoi d'emails</td><td className="py-2">USA</td></tr>
                <tr><td className="py-2 pr-4">Google</td><td className="py-2 pr-4">API Google My Business</td><td className="py-2">USA</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Durée de conservation</h2>
          <p className="text-gray-600 leading-relaxed">
            Vos données sont conservées pendant toute la durée de votre abonnement actif, puis pendant 3 ans après la résiliation pour des raisons légales (comptabilité, litiges). Les données des avis clients sont conservées tant que votre compte est actif.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Vos droits</h2>
          <p className="text-gray-600 leading-relaxed">
            Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression, portabilité, opposition, limitation du traitement. Pour exercer ces droits, contactez-nous à : <strong>[À COMPLÉTER : contact@votredomaine.fr]</strong>. Vous pouvez également adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#667eea] hover:underline">www.cnil.fr</a>).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est déposé.
          </p>
        </section>
      </div>
    </div>
  );
}
