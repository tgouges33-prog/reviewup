import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Examples from "@/components/Examples";
import Reviews from "@/components/Reviews";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Klevano",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://klevano.com",
  description: "Klevano optimise automatiquement votre fiche Google My Business, collecte vos avis clients et booste votre référencement local.",
  offers: [
    {
      "@type": "Offer",
      name: "Essentiel",
      price: "99",
      priceCurrency: "EUR",
      description: "Optimisation GMB, scoring, suggestions IA",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "169",
      priceCurrency: "EUR",
      description: "Collecte d'avis, lien marque blanche, notifications email",
    },
  ],
  author: {
    "@type": "Organization",
    name: "Klevano",
    url: "https://klevano.com",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Features />
        <Examples />
        <Reviews />
        <Stats />
        <Services />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
