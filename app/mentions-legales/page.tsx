import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Mentions légales — Klevano" };

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16 px-5">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Éditeur du site</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>Raison sociale :</strong> EI Thomas GOUGES<br />
              <strong>Forme juridique :</strong> Entreprise Individuelle (Auto-entrepreneur)<br />
              <strong>SIRET :</strong> 879 413 235 00034<br />
              <strong>Adresse :</strong> 180 Rue des Queyries, 33100 Bordeaux<br />
              <strong>Email :</strong> [À COMPLÉTER — contact@votredomaine.fr]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Directeur de la publication</h2>
            <p className="text-gray-600">Thomas Gouges — EI Thomas GOUGES</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Hébergement</h2>
            <p className="text-gray-600 leading-relaxed">
              Ce site est hébergé par <strong>Vercel Inc.</strong><br />
              340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#667eea] hover:underline">https://vercel.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Propriété intellectuelle</h2>
            <p className="text-gray-600 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est la propriété exclusive de Klevano, sauf mentions contraires. Toute reproduction, distribution, modification ou utilisation à des fins commerciales sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Données personnelles</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question relative au traitement de vos données personnelles, consultez notre{" "}
              <a href="/confidentialite" className="text-[#667eea] hover:underline">Politique de confidentialité</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
