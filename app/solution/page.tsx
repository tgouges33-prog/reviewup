import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre solution – Klevano | Optimisation GMB & Collecte d'avis",
  description: "Découvrez comment Klevano aide les entreprises locales à optimiser leur fiche Google My Business, collecter des avis clients et attirer plus de clients automatiquement.",
};

const problems = [
  {
    icon: "😰",
    title: "Votre fiche GMB est incomplète",
    desc: "Une fiche mal remplie perd jusqu'à 70% de visibilité sur Google. La plupart des entreprises ne le savent même pas.",
  },
  {
    icon: "💸",
    title: "Vos concurrents captent vos clients",
    desc: "Ils ont plus d'avis, une meilleure note, et apparaissent avant vous sur Maps. Résultat : ils prennent vos clients.",
  },
  {
    icon: "⏰",
    title: "Vous n'avez pas le temps de gérer ça",
    desc: "Répondre aux avis, optimiser les infos, relancer les clients satisfaits… c'est chronophage et souvent oublié.",
  },
];

const steps = [
  {
    num: "01",
    title: "Connectez votre fiche Google My Business",
    desc: "En 2 clics, Klevano accède à votre fiche et analyse en profondeur ce qui freine votre visibilité locale.",
    features: ["Diagnostic complet automatique", "Score de santé de votre fiche", "Identification des points faibles"],
    color: "#667eea",
  },
  {
    num: "02",
    title: "Optimisez avec les recommandations IA",
    desc: "Notre IA génère des suggestions concrètes adaptées à votre secteur pour améliorer chaque aspect de votre fiche.",
    features: ["Suggestions de description optimisées", "Recommandations par secteur", "Checklist d'actions prioritaires"],
    color: "#764ba2",
  },
  {
    num: "03",
    title: "Collectez des avis en automatique",
    desc: "Envoyez un lien personnalisé à vos clients satisfaits. Ils déposent un avis en 30 secondes, vous récupérez de la crédibilité.",
    features: ["Lien de collecte à votre image", "Envoi par email ou SMS", "Rappels automatiques"],
    color: "#667eea",
  },
  {
    num: "04",
    title: "Pilotez tout depuis un seul dashboard",
    desc: "Avis reçus, taux de réponse, évolution de votre note, statistiques de collecte — tout est centralisé et clair.",
    features: ["Tableau de bord temps réel", "Réponses automatiques aux avis", "Export des données"],
    color: "#764ba2",
  },
];

const results = [
  { value: "+42%", label: "de visibilité locale en moyenne après 30 jours" },
  { value: "3×", label: "plus d'avis collectés vs une demande manuelle" },
  { value: "15 min", label: "par semaine suffisent pour gérer votre présence GMB" },
  { value: "89%", label: "des clients font confiance aux avis Google avant d'acheter" },
];

const useCases = [
  { icon: "🍽️", type: "Restaurateurs", pain: "Peu d'avis, concurrence rude sur Maps", gain: "Flux constant de nouveaux avis, meilleur positionnement local" },
  { icon: "💆", type: "Salons & Spas", pain: "Clients satisfaits qui ne pensent pas à laisser un avis", gain: "Lien de collecte envoyé automatiquement après chaque RDV" },
  { icon: "🔧", type: "Artisans & Services", pain: "Fiche GMB abandonnée, pas le temps de la gérer", gain: "Fiche optimisée en 1h, puis pilotée automatiquement" },
  { icon: "🏥", type: "Santé & Bien-être", pain: "Réputation difficile à construire en ligne", gain: "Avis authentiques qui rassurent les nouveaux patients" },
  { icon: "🛍️", type: "Commerce de proximité", pain: "Invisible face aux grandes enseignes sur Google", gain: "Visibilité locale boostée grâce à une fiche GMB parfaite" },
  { icon: "🏋️", type: "Fitness & Coaching", pain: "Potentiels clients qui ne trouvent pas l'établissement", gain: "Fiche complète, bien notée, facilement trouvable" },
];

export default function SolutionPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section
          className="text-white py-24 px-5 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          <div className="absolute -top-1/2 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10 bg-white" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
              La solution complète pour votre visibilité locale
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Attirez plus de clients grâce à Google My Business — sans y passer des heures
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Klevano optimise votre fiche GMB, automatise la collecte d'avis et vous donne une vision claire de votre réputation locale. En 15 minutes par semaine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="bg-white text-[#667eea] font-bold px-10 py-4 rounded-full text-base hover:-translate-y-0.5 hover:shadow-2xl transition-all"
              >
                Commencer gratuitement →
              </Link>
              <Link
                href="/#pricing"
                className="border-2 border-white/50 text-white font-medium px-8 py-4 rounded-full text-base hover:bg-white/10 transition-all"
              >
                Voir les tarifs
              </Link>
            </div>
            <p className="text-white/60 text-xs mt-4">Gratuit sans carte bancaire · Mettez à niveau quand vous voulez</p>
          </div>
        </section>

        {/* PROBLÈME */}
        <section className="py-20 px-5 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Vous perdez des clients sans le savoir
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                97% des consommateurs cherchent une entreprise locale sur Google avant de se déplacer. Si votre fiche n'est pas optimale, ils vont chez votre concurrent.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {problems.map((p) => (
                <div key={p.title} className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION ÉTAPE PAR ÉTAPE */}
        <section className="py-20 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-gray-500 text-lg">Simple, rapide, efficace. Résultats visibles dès les premières semaines.</p>
            </div>
            <div className="space-y-16">
              {steps.map((step, i) => (
                <div key={step.num} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10`}>
                  {/* Texte */}
                  <div className="flex-1">
                    <span className="text-5xl font-extrabold opacity-10" style={{ color: step.color }}>{step.num}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{step.title}</h3>
                    <p className="text-gray-500 mb-5 leading-relaxed">{step.desc}</p>
                    <ul className="space-y-2">
                      {step.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: step.color }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Mockup UI */}
                  <div className="flex-1 w-full">
                    <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-100" style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #f0f0ff 100%)" }}>
                      {step.num === "01" && <MockupDiagnostic />}
                      {step.num === "02" && <MockupOptimisation />}
                      {step.num === "03" && <MockupCollecte />}
                      {step.num === "04" && <MockupDashboard />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RÉSULTATS */}
        <section className="py-20 px-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Des résultats concrets</h2>
              <p className="text-white/80 text-lg">Ce que nos clients observent après avoir utilisé Klevano</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {results.map((r) => (
                <div key={r.label} className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-4xl font-extrabold text-white mb-2">{r.value}</p>
                  <p className="text-white/70 text-sm leading-snug">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAS D'USAGE */}
        <section className="py-20 px-5 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Pour tous les commerces locaux
              </h2>
              <p className="text-gray-500 text-lg">Klevano s'adapte à votre secteur et à vos besoins spécifiques</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {useCases.map((u) => (
                <div key={u.type} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="text-3xl mb-3">{u.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-3">{u.type}</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2 text-sm">
                      <span className="text-red-400 font-medium flex-shrink-0">Avant :</span>
                      <span className="text-gray-500">{u.pain}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-green-500 font-medium flex-shrink-0">Après :</span>
                      <span className="text-gray-700">{u.gain}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 px-5 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Prêt à dominer votre zone de chalandise ?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Rejoignez les entreprises qui utilisent Klevano pour être trouvées, choisies et recommandées.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="text-white font-bold px-10 py-4 rounded-full text-base hover:-translate-y-0.5 hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                Commencer gratuitement →
              </Link>
              <Link
                href="/#pricing"
                className="text-[#667eea] font-medium px-8 py-4 rounded-full text-base border border-[#667eea]/30 hover:bg-[#667eea]/5 transition-all"
              >
                Voir les offres
              </Link>
            </div>
            <p className="text-gray-400 text-xs mt-4">Gratuit sans carte bancaire · Mettez à niveau quand vous voulez</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

/* ── Mockups UI ── */

function MockupDiagnostic() {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Santé de votre fiche GMB</p>
      <div className="space-y-3">
        {[
          { label: "Description", score: 40, color: "#ef4444" },
          { label: "Photos", score: 20, color: "#ef4444" },
          { label: "Horaires", score: 100, color: "#22c55e" },
          { label: "Catégories", score: 60, color: "#f59e0b" },
          { label: "Avis récents", score: 30, color: "#ef4444" },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 font-medium">{item.label}</span>
              <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600 font-medium text-center">
        Score global : 50% — 3 points critiques à corriger
      </div>
    </div>
  );
}

function MockupOptimisation() {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Recommandations IA</p>
      <div className="space-y-3">
        {[
          { priority: "Critique", text: "Ajoutez une description de 250+ mots avec vos mots-clés", color: "#ef4444", bg: "#fef2f2" },
          { priority: "Important", text: "Téléchargez au moins 10 photos de qualité", color: "#f59e0b", bg: "#fffbeb" },
          { priority: "Important", text: "Répondez aux 8 avis sans réponse", color: "#f59e0b", bg: "#fffbeb" },
          { priority: "Conseil", text: "Ajoutez vos attributs (WiFi, parking, accessibilité)", color: "#667eea", bg: "#f0f0ff" },
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: r.bg, borderColor: r.color + "30" }}>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: r.color, background: r.color + "20" }}>{r.priority}</span>
            <span className="text-xs text-gray-700">{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupCollecte() {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Lien de collecte d'avis</p>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 text-center shadow-sm">
        <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
          ⭐
        </div>
        <p className="font-bold text-gray-900 text-sm">Votre avis compte !</p>
        <p className="text-xs text-gray-400 mt-1 mb-3">Êtes-vous satisfait de votre expérience ?</p>
        <div className="flex justify-center gap-2">
          {[1,2,3,4,5].map((s) => <span key={s} className="text-amber-400 text-xl">★</span>)}
        </div>
        <div className="mt-3 px-4 py-2 rounded-full text-xs text-white font-medium" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
          Laisser un avis Google →
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>📧 Lien envoyé : 47</span>
        <span>⭐ Avis collectés : 31</span>
        <span>📈 Taux : 66%</span>
      </div>
    </div>
  );
}

function MockupDashboard() {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Vue générale</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Note moyenne", value: "4.8 ⭐" },
          { label: "Total avis", value: "127" },
          { label: "Avis ce mois", value: "+23" },
          { label: "Taux réponse", value: "94%" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
            <p className="font-extrabold text-gray-900 text-lg">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-700 mb-2">Dernier avis</p>
        <div className="flex gap-1 text-amber-400 text-xs mb-1">★★★★★</div>
        <p className="text-xs text-gray-500 line-clamp-2">"Excellent service, je recommande vivement ! L'équipe est très professionnelle et à l'écoute."</p>
        <span className="text-xs text-green-500 mt-1 block">✓ Réponse automatique envoyée</span>
      </div>
    </div>
  );
}
