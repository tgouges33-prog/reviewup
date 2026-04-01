import Link from "next/link";
import { posts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Référencement local & Google My Business | Klevano",
  description: "Conseils, guides et stratégies pour optimiser votre fiche Google My Business, collecter des avis clients et booster votre référencement local.",
  alternates: { canonical: "https://klevano.com/blog" },
  openGraph: {
    title: "Blog Klevano — Référencement local & Google My Business",
    description: "Conseils et guides pour booster votre visibilité locale sur Google.",
    url: "https://klevano.com/blog",
    siteName: "Klevano",
    locale: "fr_FR",
    type: "website",
  },
};

const categoryColors: Record<string, string> = {
  "Optimisation GMB": "bg-purple-100 text-purple-700",
  "Collecte d'avis": "bg-blue-100 text-blue-700",
  "Référencement local": "bg-green-100 text-green-700",
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8f9ff]">
        {/* Hero */}
        <section className="py-16 px-5 text-center bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-[#667eea] uppercase tracking-widest mb-3">Blog</p>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Référencement local & Google My Business
            </h1>
            <p className="text-lg text-gray-500">
              Guides pratiques, conseils d'experts et stratégies pour attirer plus de clients locaux.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 px-5">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {sorted.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.readTime} de lecture</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug flex-1">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm mb-5 line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="text-[#667eea] text-sm font-semibold">Lire l'article →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-5 text-center">
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <h2 className="text-2xl font-bold mb-3">Prêt à booster votre visibilité locale ?</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Klevano optimise automatiquement votre fiche GMB et collecte vos avis clients.
            </p>
            <Link
              href="/#pricing"
              className="inline-block py-3 px-8 rounded-full font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              Voir les tarifs →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
