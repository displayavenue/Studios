"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = ["⌂", "▤", "◇", "▣", "◎", "✦", "◉"] as const;

const FALLBACK = [
  { href: "/", label: "Home" },
  { href: "/shop/", label: "Shop" },
  { href: "/brands/", label: "Brands" },
  { href: "/cart/", label: "Cart" },
  { href: "/login/", label: "Account" },
];

export function MobileNav({ items }: { items?: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const nav = (items?.length ? items : FALLBACK).slice(0, 5);

  return (
    <nav className="mobile-nav" aria-label="Mobile primary">
      {nav.map((item, i) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`mobile-nav__item hp-focus-ring${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-nav__icon" aria-hidden="true">
              {ICONS[i % ICONS.length]}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
