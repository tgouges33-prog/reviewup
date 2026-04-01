import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPost } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Klevano`,
    description: post.description,
    alternates: { canonical: `https://klevano.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://klevano.com/blog/${slug}`,
      siteName: "Klevano",
      locale: "fr_FR",
      type: "article",
      publishedTime: post.date,
    },
  };
}

const categoryColors: Record<string, string> = {
  "Optimisation GMB": "bg-purple-100 text-purple-700",
  "Collecte d'avis": "bg-blue-100 text-blue-700",
  "Référencement local": "bg-green-100 text-green-700",
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Klevano", url: "https://klevano.com" },
    publisher: { "@type": "Organization", name: "Klevano", url: "https://klevano.com" },
    url: `https://klevano.com/blog/${post.slug}`,
    mainEntityOfPage: `https://klevano.com/blog/${post.slug}`,
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="py-14 px-5 bg-[#f8f9ff] border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <Link href="/blog" className="text-sm text-[#667eea] hover:underline">← Blog</Link>
              <span className="text-gray-300">/</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-500 text-lg mb-6">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>
                {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span>·</span>
              <span>{post.readTime} de lecture</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="py-14 px-5">
          <div className="max-w-3xl mx-auto prose-like">
            {post.sections.map((section, i) => {
              if (section.type === "h2") {
                return (
                  <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                    {section.content as string}
                  </h2>
                );
              }
              if (section.type === "h3") {
                return (
                  <h3 key={i} className="text-xl font-semibold text-gray-800 mt-8 mb-3">
                    {section.content as string}
                  </h3>
                );
              }
              if (section.type === "p") {
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-5 text-base">
                    {section.content as string}
                  </p>
                );
              }
              if (section.type === "ul") {
                return (
                  <ul key={i} className="mb-6 space-y-2">
                    {(section.content as string[]).map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-600 text-sm">
                        <span className="text-[#667eea] font-bold mt-0.5 flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (section.type === "tip") {
                return (
                  <div key={i} className="bg-purple-50 border-l-4 border-[#667eea] rounded-r-xl px-6 py-4 mb-6">
                    <p className="text-sm text-purple-800 leading-relaxed">
                      <strong>💡 Astuce :</strong> {section.content as string}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>

        {/* CTA */}
        <section className="py-14 px-5 bg-[#f8f9ff] border-t border-gray-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Automatisez tout ça avec Klevano</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Optimisation GMB, collecte d'avis, réponses automatiques — tout en un, sans effort.
            </p>
            <Link
              href="/#pricing"
              className="inline-block py-3 px-8 rounded-full font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              Démarrer maintenant →
            </Link>
          </div>
        </section>

        {/* Other articles */}
        <section className="py-14 px-5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Autres articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {posts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 2)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.category}
                    </span>
                    <p className="font-semibold text-gray-900 mt-3 text-sm leading-snug">{p.title}</p>
                    <p className="text-[#667eea] text-xs mt-2 font-semibold">Lire →</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
