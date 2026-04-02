import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CalInit from "@/components/CalInit";

const geist = Geist({ subsets: ["latin"], display: "swap", preload: true });

export const metadata: Metadata = {
  title: "Klevano — Optimisation Google My Business & Collecte d'Avis Clients",
  description:
    "Klevano optimise automatiquement votre fiche Google My Business, collecte vos avis clients et booste votre référencement local. Essayez gratuitement.",
  keywords: [
    "optimisation Google My Business",
    "collecte avis clients",
    "gestion avis Google",
    "référencement local",
    "fiche GMB",
    "avis Google entreprise",
    "logiciel réputation en ligne",
    "améliorer note Google",
    "avis clients automatique",
    "SEO local France",
  ],
  authors: [{ name: "Klevano" }],
  creator: "Klevano",
  metadataBase: new URL("https://klevano.com"),
  alternates: { canonical: "https://klevano.com" },
  openGraph: {
    title: "Klevano — Optimisation Google My Business & Avis Clients",
    description:
      "Automatisez l'optimisation de votre fiche GMB, collectez des avis 5 étoiles et boostez votre référencement local.",
    url: "https://klevano.com",
    siteName: "Klevano",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klevano — Optimisation Google My Business",
    description: "Boostez votre fiche GMB et collectez des avis clients automatiquement.",
  },
  verification: { google: "G9WLPeiiVCSKwr4tBkoyazbBg8Ni-68hljvgDpojqzQ" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={geist.className}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PG4GS2MS');` }} />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PG4GS2MS" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        <CalInit />
        {children}
      </body>
    </html>
  );
}
