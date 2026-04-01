import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CalInit from "@/components/CalInit";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Klevano — Optimisation Google My Business automatisée",
  description:
    "Automatisez l'optimisation de votre fiche GMB, collectez des avis et augmentez vos clients locaux avec Klevano.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={geist.className}>
      <body className="bg-white text-gray-900 antialiased">
        <CalInit />
        {children}
      </body>
    </html>
  );
}
