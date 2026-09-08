"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Sparkles } from "lucide-react";
import { BRAND, NAV_LINKS, MOBILE_NAV } from "@/config/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--jk-navy)]/95 text-white backdrop-blur-md">
      <div className="container-jk flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="focus-ring rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 truncate">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--jk-gold)]/15 text-[var(--jk-gold)]">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-display text-xl font-semibold tracking-wide text-white">
              {BRAND.name}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-5 text-[13px] xl:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-white/80 transition hover:text-[var(--jk-gold)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/services" className="focus-ring rounded-lg p-2 text-white/80 hover:bg-white/10" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="hidden rounded-full border border-white/25 px-4 py-1.5 text-sm text-white hover:bg-white/10 sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="gold-btn inline-flex h-9 items-center px-4 text-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" role="dialog" aria-modal>
          <div className="h-full w-[min(100vw-3rem,20rem)] bg-[var(--jk-navy)] p-5 text-white shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-semibold">{BRAND.name}</span>
              <button className="focus-ring rounded p-2" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)} className="py-1 hover:text-[var(--jk-gold)]">
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-white/10" />
              <Link href="/login" onClick={() => setOpen(false)} className="py-1">Login</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="py-1 text-[var(--jk-gold)]">Sign Up</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[var(--jk-navy)] text-white">
      <div className="container-jk py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--jk-gold)]" aria-hidden />
              <span className="font-display text-xl text-[var(--jk-gold)]">{BRAND.name}</span>
            </div>
            <p className="mt-3 text-sm text-white/65">{BRAND.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            <Link href="/contact" className="hover:text-[var(--jk-gold)]">About Us</Link>
            <Link href="/contact" className="hover:text-[var(--jk-gold)]">Contact</Link>
            <Link href="/legal/privacy" className="hover:text-[var(--jk-gold)]">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-[var(--jk-gold)]">Terms & Conditions</Link>
            <Link href="/blog" className="hover:text-[var(--jk-gold)]">Blog</Link>
            <Link href="/contact" className="hover:text-[var(--jk-gold)]">Help</Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="text-[var(--jk-gold)]/80">Guided by the Stars. Built for You.</p>
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
          className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-[var(--jk-ink)]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
