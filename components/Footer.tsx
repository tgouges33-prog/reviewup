import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-5 text-center text-sm">
      <p className="mb-2">© 2026 Klevano — Optimisation Google My Business</p>
      <p className="text-gray-400 mb-2 space-x-3">
        <Link href="/mentions-legales" className="underline hover:text-white transition-colors">Mentions légales</Link>
        <span>·</span>
        <Link href="/confidentialite" className="underline hover:text-white transition-colors">Politique de confidentialité</Link>
        <span>·</span>
        <Link href="/cgu" className="underline hover:text-white transition-colors">CGU</Link>
      </p>
    </footer>
  );
}
