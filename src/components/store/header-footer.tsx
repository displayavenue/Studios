"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { BRAND } from "@/config/site";

export function StoreHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--velora-line)] bg-[rgba(247,243,235,0.92)] backdrop-blur-md">
      <div className="container-velora flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden focus-ring rounded p-2"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-display text-2xl tracking-[0.08em]">
            {BRAND.name}
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Primary">
          <Link href="/shop" className="hover:text-[var(--velora-accent)]">
            Shop
          </Link>
          <Link href="/categories" className="hover:text-[var(--velora-accent)]">
            Categories
          </Link>
          <Link href="/shop?sort=trending" className="hover:text-[var(--velora-accent)]">
            Trending
          </Link>
          <Link href="/shop?sort=best_selling" className="hover:text-[var(--velora-accent)]">
            Best Sellers
          </Link>
          <Link href="/shop?sort=newest" className="hover:text-[var(--velora-accent)]">
            New Arrivals
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <form
            action="/shop"
            className="hidden items-center gap-2 rounded-full border border-[var(--velora-line)] bg-white/70 px-3 py-1.5 lg:flex"
          >
            <Search className="h-4 w-4 text-[var(--velora-muted)]" aria-hidden />
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-44 bg-transparent text-sm outline-none"
              aria-label="Search products"
            />
          </form>
          <Link href="/shop" className="focus-ring rounded p-2 lg:hidden" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/account/wishlist" className="focus-ring rounded p-2" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/account" className="focus-ring rounded p-2" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="focus-ring rounded p-2" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" role="dialog" aria-modal>
          <div className="h-full w-72 bg-[var(--velora-bg)] p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl tracking-[0.08em]">{BRAND.name}</span>
              <button className="focus-ring rounded p-2" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-base" aria-label="Mobile">
              {[
                ["/shop", "Shop"],
                ["/categories", "Categories"],
                ["/shop?sort=trending", "Trending"],
                ["/shop?sort=best_selling", "Best Sellers"],
                ["/shop?sort=newest", "New Arrivals"],
                ["/account", "Account"],
                ["/cart", "Cart"],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--velora-line)] bg-[var(--velora-ink)] text-[#f3efe6]">
      <div className="container-velora grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-2xl tracking-[0.1em]">{BRAND.name}</div>
          <p className="mt-3 text-sm text-[#d9cbb6]">{BRAND.tagline}</p>
          <p className="mt-4 text-xs text-[#a89c8c]">{BRAND.domain}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9cbb6]">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/shop?sort=trending">Trending</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9cbb6]">Help</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/legal/shipping">Shipping</Link></li>
            <li><Link href="/legal/returns">Returns</Link></li>
            <li><Link href="/legal/privacy">Privacy</Link></li>
            <li><Link href="/legal/terms">Terms</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9cbb6]">Newsletter</h3>
          <p className="mt-4 text-sm text-[#d9cbb6]">Product drops and useful finds. Unsubscribe anytime.</p>
          <form className="mt-4 flex gap-2" action="/api/newsletter" method="post">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="h-10 flex-1 rounded-md border border-white/15 bg-white/5 px-3 text-sm"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="h-10 rounded-md bg-[var(--velora-accent)] px-4 text-sm font-medium">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#a89c8c]">
        © {new Date().getFullYear()} VELORA · {BRAND.domain}. Revenue targets are objectives, not guarantees.
      </div>
    </footer>
  );
}

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--velora-line)] bg-[rgba(247,243,235,0.96)] backdrop-blur md:hidden"
      aria-label="Bottom navigation"
    >
      {[
        ["/", "Home"],
        ["/shop", "Shop"],
        ["/cart", "Cart"],
        ["/account", "Account"],
      ].map(([href, label]) => (
        <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px]">
          {label}
        </Link>
      ))}
    </nav>
  );
}
