"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Tarifs", href: "#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

const CAL_ATTRS = {
  "data-cal-link": "avisio/15min",
  "data-cal-namespace": "15min",
  "data-cal-config": JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
  }),
};

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 text-white shadow-lg"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity cursor-pointer" style={{ display: "inline-flex" }}>
          <Logo variant="light" height={36} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {l.label}
              </a>
            )
          )}
          <Link
            href="/login"
            className="text-sm font-medium border border-white/50 px-4 py-2 rounded-full hover:bg-white/15 hover:border-white transition-all"
          >
            Se connecter
          </Link>
          <button
            {...CAL_ATTRS}
            className="bg-white text-[#667eea] font-bold text-sm px-5 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer"
          >
            Commencer →
          </button>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4 border-t border-white/20 pt-4">
          {NAV_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium hover:opacity-80"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium hover:opacity-80"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            )
          )}
          <Link href="/login" className="text-sm font-medium hover:opacity-80">
            Se connecter
          </Link>
          <button
            {...CAL_ATTRS}
            className="bg-white text-[#667eea] font-bold text-sm px-5 py-2.5 rounded-full w-full cursor-pointer"
          >
            Commencer →
          </button>
        </div>
      )}
    </header>
  );
}
