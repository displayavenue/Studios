"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X, MapPin } from "lucide-react";
import { BRAND } from "@/config/site";

export function StoreHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-50">
      {/* Primary bar — Amazon-style dark header */}
      <div className="bg-[var(--velora-header)] text-white">
        <div className="container-velora flex h-14 items-center gap-3 md:gap-4">
          <button
            className="focus-ring rounded p-2 hover:outline hover:outline-1 hover:outline-white/40 lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-1 px-1 py-2 hover:outline hover:outline-1 hover:outline-white/40">
            <span className="text-xl font-bold tracking-tight">{BRAND.name}</span>
          </Link>

          <div className="hidden items-center gap-1 rounded-sm px-2 py-1 text-xs hover:outline hover:outline-1 hover:outline-white/40 md:flex">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <div className="leading-tight">
              <div className="text-[10px] text-gray-300">Deliver to</div>
              <div className="font-semibold">India</div>
            </div>
          </div>

          <form action="/shop" className="flex min-w-0 flex-1 items-stretch">
            <select
              className="hidden h-10 rounded-l-sm border-0 bg-[#e6e6e6] px-2 text-xs text-[var(--velora-ink)] sm:block"
              aria-label="Search category"
              defaultValue="all"
            >
              <option value="all">All</option>
              <option value="trending">Trending</option>
              <option value="best">Best Sellers</option>
            </select>
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search VELORA"
              className="h-10 min-w-0 flex-1 rounded-l-sm border-0 px-3 text-sm text-[var(--velora-ink)] outline-none sm:rounded-none"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-sm bg-[var(--velora-cta)] text-[var(--velora-ink)] hover:bg-[var(--velora-cta-hover)]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Link
              href="/account"
              className="hidden items-center rounded-sm px-2 py-1 hover:outline hover:outline-1 hover:outline-white/40 sm:flex"
              aria-label="Account"
            >
              <div className="leading-tight">
                <div className="text-[10px] text-gray-300">Hello, sign in</div>
                <div className="text-sm font-semibold">Account</div>
              </div>
            </Link>
            <Link
              href="/account/orders"
              className="hidden rounded-sm px-2 py-1 hover:outline hover:outline-1 hover:outline-white/40 lg:block"
            >
              <div className="leading-tight">
                <div className="text-[10px] text-gray-300">Returns</div>
                <div className="text-sm font-semibold">& Orders</div>
              </div>
            </Link>
            <Link
              href="/account/wishlist"
              className="focus-ring rounded p-2 hover:outline hover:outline-1 hover:outline-white/40 sm:hidden"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/account"
              className="focus-ring rounded p-2 hover:outline hover:outline-1 hover:outline-white/40 sm:hidden"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="flex items-end gap-1 rounded-sm px-2 py-1 hover:outline hover:outline-1 hover:outline-white/40"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="hidden text-sm font-semibold sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="hidden bg-[var(--velora-header-secondary)] text-sm text-white lg:block">
        <div className="container-velora flex h-10 items-center gap-5 overflow-x-auto whitespace-nowrap">
          <button className="flex items-center gap-1 font-semibold hover:outline hover:outline-1 hover:outline-white/40">
            <Menu className="h-4 w-4" aria-hidden />
            All
          </button>
          <Link href="/shop?sort=trending" className="hover:underline">Trending</Link>
          <Link href="/shop?sort=best_selling" className="hover:underline">Best Sellers</Link>
          <Link href="/shop?sort=newest" className="hover:underline">New Arrivals</Link>
          <Link href="/categories" className="hover:underline">Categories</Link>
          <Link href="/shop" className="hover:underline">Shop All</Link>
          <Link href="/legal/shipping" className="hover:underline">Shipping</Link>
          <Link href="/legal/returns" className="hover:underline">Returns</Link>
          <Link href="/contact" className="hover:underline">Customer Service</Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" role="dialog" aria-modal>
          <div className="h-full w-72 bg-[var(--velora-header)] p-5 text-white shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold">{BRAND.name}</span>
              <button className="focus-ring rounded p-2" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Mobile">
              {[
                ["/shop", "Shop All"],
                ["/categories", "Categories"],
                ["/shop?sort=trending", "Trending"],
                ["/shop?sort=best_selling", "Best Sellers"],
                ["/shop?sort=newest", "New Arrivals"],
                ["/account", "Account"],
                ["/account/orders", "Orders"],
                ["/cart", "Cart"],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="py-1 hover:underline">
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
    <footer className="mt-auto bg-[var(--velora-header-secondary)] text-white">
      <div className="bg-[var(--velora-header)] py-4 text-center text-sm">
        <a href="#" className="hover:underline">Back to top</a>
      </div>
      <div className="container-velora grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold">Get to Know Us</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li><Link href="/contact" className="hover:underline">About VELORA</Link></li>
            <li><Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/legal/terms" className="hover:underline">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li><Link href="/shop" className="hover:underline">All Products</Link></li>
            <li><Link href="/categories" className="hover:underline">Categories</Link></li>
            <li><Link href="/shop?sort=trending" className="hover:underline">Trending</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Help</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li><Link href="/legal/shipping" className="hover:underline">Shipping</Link></li>
            <li><Link href="/legal/returns" className="hover:underline">Returns</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Newsletter</h3>
          <p className="mt-3 text-sm text-gray-300">Product drops and useful finds. Unsubscribe anytime.</p>
          <form className="mt-3 flex gap-2" action="/api/newsletter" method="post">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="h-9 flex-1 rounded-sm border border-gray-500 bg-[var(--velora-header)] px-3 text-sm text-white"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="h-9 rounded-sm bg-[var(--velora-cta)] px-4 text-sm font-medium text-[var(--velora-ink)]">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}. Revenue targets are objectives, not guarantees.
      </div>
    </footer>
  );
}

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--velora-line)] bg-white md:hidden"
      aria-label="Bottom navigation"
    >
      {[
        ["/", "Home"],
        ["/shop", "Shop"],
        ["/cart", "Cart"],
        ["/account", "Account"],
      ].map(([href, label]) => (
        <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-[var(--velora-ink)]">
          {label}
        </Link>
      ))}
    </nav>
  );
}
