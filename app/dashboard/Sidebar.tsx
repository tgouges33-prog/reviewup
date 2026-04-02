"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/dashboard", icon: "📊", label: "Vue générale", pro: false },
  { href: "/dashboard/optimization", icon: "🚀", label: "Optimisation GMB", pro: false },
  { href: "/dashboard/collect", icon: "💌", label: "Collecte d'avis", pro: true },
  { href: "/dashboard/reviews", icon: "⭐", label: "Avis & Feedbacks", pro: false },
  { href: "/dashboard/analytics", icon: "📈", label: "Analytics", pro: false },
  { href: "/dashboard/gmb", icon: "🏢", label: "Ma fiche GMB", pro: false },
  { href: "/dashboard/gmb-connect", icon: "🔗", label: "Connexion GMB", pro: false },
  { href: "/dashboard/settings", icon: "⚙️", label: "Paramètres", pro: false },
];

export default function Sidebar({ userEmail, isPro, onClose }: { userEmail: string; isPro?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col text-white min-h-screen"
      style={{ background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)" }}
    >
      {/* Bouton fermer sur mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-white/70 hover:text-white p-1 cursor-pointer"
          aria-label="Fermer"
        >
          ✕
        </button>
      )}
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/20">
        <Link href="/" className="hover:opacity-90 transition-opacity cursor-pointer" style={{ display: "inline-flex" }}>
          <Logo variant="light" height={30} />
        </Link>
        <p className="text-xs opacity-60 mt-1 truncate">{userEmail}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.pro && !isPro && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Pro</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all w-full cursor-pointer"
        >
          <span>🚪</span> Se déconnecter
        </button>
      </div>
    </aside>
  );
}
