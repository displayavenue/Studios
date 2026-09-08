"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, Sparkles } from "lucide-react";
import { BRAND, NAV_LINKS, MOBILE_NAV } from "@/config/site";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hero-gradient text-[var(--jk-ivory)]">
        <div className="container-jk flex h-14 items-center justify-between gap-3 sm:h-16">
          <div className="flex min-w-0 items-center gap-2">
            <button
              className="focus-ring rounded p-2 hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2 truncate">
              <Sparkles className="h-5 w-5 text-[var(--jk-gold)]" aria-hidden />
              <span className="font-display text-lg font-semibold tracking-wide sm:text-xl">
                {BRAND.name}
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-[var(--jk-ivory)]/85 transition hover:text-[var(--jk-gold)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-[var(--jk-gold)]/40 bg-transparent text-[var(--jk-ivory)] hover:bg-white/10 sm:inline-flex"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[var(--jk-gold)] text-[var(--jk-navy)] hover:bg-[var(--jk-gold-soft)]"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
            <Link
              href="/dashboard"
              className="focus-ring rounded p-2 hover:bg-white/10 lg:hidden"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" role="dialog" aria-modal>
          <div className="h-full w-[min(100vw-3rem,20rem)] hero-gradient p-5 text-[var(--jk-ivory)] shadow-xl">
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
              <Link href="/login" onClick={() => setOpen(false)} className="py-1">
                Login
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="py-1 text-[var(--jk-gold)]">
                Create Account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[var(--jk-navy)] text-[var(--jk-ivory)]">
      <div className="container-jk grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-lg text-[var(--jk-gold)]">{BRAND.name}</h3>
          <p className="mt-2 text-sm text-[var(--jk-ivory)]/70">{BRAND.tagline}</p>
          <p className="mt-4 text-xs text-[var(--jk-ivory)]/50">
            Interpretive astrology for self-reflection — not medical, legal, or financial advice.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--jk-ivory)]/70">
            <li><Link href="/services" className="hover:text-[var(--jk-gold)]">All Reports</Link></li>
            <li><Link href="/membership" className="hover:text-[var(--jk-gold)]">Membership</Link></li>
            <li><Link href="/services?category=marriage" className="hover:text-[var(--jk-gold)]">Compatibility</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--jk-ivory)]/70">
            <li><Link href="/contact" className="hover:text-[var(--jk-gold)]">Contact</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-[var(--jk-gold)]">Privacy</Link></li>
            <li><Link href="/legal/terms" className="hover:text-[var(--jk-gold)]">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Stay connected</h3>
          <p className="mt-3 text-sm text-[var(--jk-ivory)]/70">Weekly insights and new report launches.</p>
          <form className="mt-3 flex flex-col gap-2 sm:flex-row" action="/api/newsletter" method="post">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="h-9 flex-1 rounded-md border border-white/20 bg-white/5 px-3 text-sm text-white placeholder:text-white/40"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="h-9 rounded-md bg-[var(--jk-gold)] px-4 text-sm font-medium text-[var(--jk-navy)]">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[var(--jk-ivory)]/50">
        © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
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
