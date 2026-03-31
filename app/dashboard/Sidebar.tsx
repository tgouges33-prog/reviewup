"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", icon: "📊", label: "Vue générale" },
  { href: "/dashboard/optimization", icon: "🚀", label: "Optimisation GMB" },
  { href: "/dashboard/reviews", icon: "⭐", label: "Avis & Feedbacks" },
  { href: "/dashboard/analytics", icon: "📈", label: "Analytics" },
  { href: "/dashboard/gmb", icon: "🏢", label: "Ma fiche GMB" },
  { href: "/dashboard/gmb-connect", icon: "🔗", label: "Connexion GMB" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Paramètres" },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
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
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/20">
        <Link href="/" className="text-xl font-bold">⭐ ReviewUp</Link>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
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
