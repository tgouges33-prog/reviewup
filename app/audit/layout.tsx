import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit GMB gratuit — Évaluez votre fiche Google My Business | Klevano",
  description: "Évaluez votre fiche Google My Business en 2 minutes. Score personnalisé, recommandations concrètes et plan d'action gratuit.",
  alternates: { canonical: "https://klevano.com/audit" },
  openGraph: {
    title: "Audit GMB gratuit | Klevano",
    description: "Évaluez votre fiche Google My Business en 2 minutes. Score personnalisé + recommandations concrètes.",
    url: "https://klevano.com/audit",
    siteName: "Klevano",
    locale: "fr_FR",
    type: "website",
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
