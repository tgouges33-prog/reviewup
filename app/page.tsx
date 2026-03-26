import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Examples from "@/components/Examples";
import Reviews from "@/components/Reviews";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Examples />
        <Reviews />
        <Stats />
        <Services />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
