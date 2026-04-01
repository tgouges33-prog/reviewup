import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Conditions générales d'utilisation — ReviewUp" };

export default function CGU() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16 px-5">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions générales d'utilisation</h1>
          <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : mars 2026</p>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Objet</h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme ReviewUp, service SaaS d'optimisation de fiches Google My Business et de collecte d'avis clients, édité par EI Thomas GOUGES (SIRET : 879 413 235 00034).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Accès au service</h2>
            <p className="text-gray-600 leading-relaxed">
              L'accès à ReviewUp est réservé aux professionnels (B2B) disposant d'un abonnement actif. L'utilisation du service implique l'acceptation sans réserve des présentes CGU. ReviewUp se réserve le droit de modifier ces conditions à tout moment, avec notification par email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Abonnements et tarifs</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Offre Essentiel (99 €/mois HT) :</strong> module d'optimisation de fiche GMB, scoring, suggestions IA</li>
              <li><strong>Offre Pro (169 €/mois HT) :</strong> inclut l'Essentiel + collecte d'avis, lien marque blanche, notifications email, filtrage avis privés</li>
              <li>Les abonnements sont facturés mensuellement et renouvelés automatiquement</li>
              <li>Résiliation possible à tout moment, effective à la fin de la période en cours</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Droit de rétractation</h2>
            <p className="text-gray-600 leading-relaxed">
              Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de 14 jours à compter de la souscription pour exercer votre droit de rétractation, sans avoir à justifier de motif. Pour l'exercer, contactez-nous à [À COMPLÉTER : contact@votredomaine.fr]. Ce droit ne s'applique pas aux abonnements dont l'exécution a commencé avec votre accord avant la fin du délai de rétractation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Obligations de l'utilisateur</h2>
            <p className="text-gray-600 leading-relaxed mb-2">L'utilisateur s'engage à :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Utiliser le service conformément à sa destination et aux lois en vigueur</li>
              <li>Ne pas tenter de manipuler ou falsifier des avis Google</li>
              <li>Respecter les conditions d'utilisation de Google My Business</li>
              <li>Ne pas partager ses identifiants de connexion avec des tiers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Limitation de responsabilité</h2>
            <p className="text-gray-600 leading-relaxed">
              ReviewUp est un outil d'aide à l'optimisation. Nous ne garantissons pas l'amélioration du positionnement Google. Les suggestions IA sont indicatives et ne constituent pas un conseil professionnel certifié. ReviewUp ne peut être tenu responsable d'une interruption de service due à des tiers (Google, Vercel, Stripe).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Propriété des données</h2>
            <p className="text-gray-600 leading-relaxed">
              Les données de votre fiche GMB et les avis collectés via ReviewUp vous appartiennent. En cas de résiliation, vous pouvez demander l'export de vos données dans les 30 jours suivant la clôture de votre compte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">8. Droit applicable</h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents. À défaut de résolution amiable, tout litige sera porté devant le Tribunal de Commerce compétent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">9. Contact</h2>
            <p className="text-gray-600">
              Pour toute question : <strong>[À COMPLÉTER : contact@votredomaine.fr]</strong>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
