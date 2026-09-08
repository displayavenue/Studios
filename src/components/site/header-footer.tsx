"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Search, User, X, MessageCircle } from "lucide-react";
import { BRAND, MARKETPLACE_NAV, MOBILE_NAV } from "@/config/site";
import { LanguageToggle } from "@/components/site/i18n";
import { ACTIVITY_TICKER } from "@/content/marketplace-astrologers";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--jk-line)] bg-white/95 text-[var(--jk-ink)] backdrop-blur-md">
      <div className="container-jk flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="focus-ring rounded-lg p-2 hover:bg-black/5 lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 truncate">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--at-yellow)] text-[var(--jk-ink)] shadow-sm">
              <span className="text-lg font-bold" aria-hidden>
                ✦
              </span>
            </span>
            <span className="text-lg font-bold tracking-tight text-[var(--jk-ink)] sm:text-xl">
              {BRAND.name}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 text-[13px] font-medium xl:flex" aria-label="Main">
          {MARKETPLACE_NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {"children" in item && item.children ? (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[var(--jk-ink)]/80 hover:bg-black/5 hover:text-[var(--jk-ink)]"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                  {openMenu === item.label && (
                    <div className="absolute left-0 top-full z-50 min-w-[14rem] rounded-xl border border-[var(--jk-line)] bg-white p-2 shadow-lg">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block rounded-lg px-3 py-2 text-sm text-[var(--jk-ink)] hover:bg-[var(--at-yellow)]/20"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-lg px-2.5 py-2 text-[var(--jk-ink)]/80 hover:bg-black/5 hover:text-[var(--jk-ink)]"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link href="/services" className="focus-ring rounded-lg p-2 text-[var(--jk-ink)]/70 hover:bg-black/5" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <Link
            href="/login"
            className="focus-ring hidden rounded-lg p-2 text-[var(--jk-ink)]/70 hover:bg-black/5 sm:inline-flex"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            href="/chat-with-astrologer"
            className="at-cta inline-flex h-9 items-center gap-1 px-3 text-xs sm:px-4 sm:text-sm"
          >
            <MessageCircle className="hidden h-3.5 w-3.5 sm:block" />
            Talk now
            <span className="hidden font-normal opacity-80 md:inline">| First Chat Free</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden border-t border-[var(--jk-line)] bg-[var(--at-cream)]">
        <div className="at-ticker whitespace-nowrap py-1.5 text-xs text-[var(--jk-muted)]">
          {[...ACTIVITY_TICKER, ...ACTIVITY_TICKER].map((line, i) => (
            <span key={`${line}-${i}`} className="mx-6 inline-block">
              <span className="text-[var(--at-yellow-ink)]">✦</span> {line}
            </span>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" role="dialog" aria-modal>
          <div className="h-full w-[min(100vw-3rem,20rem)] bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold">{BRAND.name}</span>
              <button className="focus-ring rounded p-2" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 text-sm" aria-label="Mobile">
              {MARKETPLACE_NAV.flatMap((item) =>
                "children" in item && item.children
                  ? item.children.map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-[var(--at-yellow)]/20">
                        {c.label}
                      </Link>
                    ))
                  : [
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-2 py-2 hover:bg-[var(--at-yellow)]/20"
                      >
                        {item.label}
                      </Link>,
                    ],
              )}
              <hr className="my-2 border-[var(--jk-line)]" />
              <Link href="/login" onClick={() => setOpen(false)} className="px-2 py-2">
                Login
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="px-2 py-2 font-semibold text-[var(--at-yellow-ink)]">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const cols = [
    {
      title: "Consult",
      links: [
        { href: "/chat-with-astrologer", label: "Chat with Astrologer" },
        { href: "/talk-to-astrologer", label: "Call with Astrologer" },
        { href: "/experts", label: "All experts" },
      ],
    },
    {
      title: "Free tools",
      links: [
        { href: "/free-kundli", label: "Free Kundli" },
        { href: "/horoscope", label: "Daily Horoscope" },
        { href: "/services/guna-milan", label: "Kundali Matching" },
      ],
    },
    {
      title: "Reports",
      links: [
        { href: "/services", label: "All PDF reports" },
        { href: "/membership", label: "Membership" },
        { href: "/stories", label: "Sample stories" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
        { href: "/legal/privacy", label: "Privacy" },
        { href: "/legal/terms", label: "Terms" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--jk-line)] bg-white text-[var(--jk-ink)]">
      <div className="container-jk py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--at-yellow)] font-bold">✦</span>
              <span className="text-lg font-bold">{BRAND.name}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--jk-muted)]">{BRAND.tagline}</p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--jk-muted)]">
              Marketplace UI inspired by leading astrology apps. Sample experts are labeled. Reports use real Lahiri chart math.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--jk-muted)]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[var(--jk-ink)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--jk-line)] pt-6 text-xs text-[var(--jk-muted)] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Interpretive astrology for reflection — not professional advice.</p>
        </div>
      </div>
    </footer>
  );
}

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--jk-line)] bg-white md:hidden"
      aria-label="Bottom navigation"
    >
      {MOBILE_NAV.map((item, i) => (
        <Link
          key={`${item.href}-${item.label}-${i}`}
          href={item.href}
          className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-[var(--jk-ink)]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
