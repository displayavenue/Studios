import Link from "next/link";

const links = [
  { href: "/shop/categories/", label: "Categories" },
  { href: "/brands/sbl/", label: "SBL" },
  { href: "/brands/dr-reckeweg/", label: "Reckeweg" },
  { href: "/brands/schwabe/", label: "Schwabe" },
  { href: "/brands/", label: "All brands" },
  { href: "/shop/offers/", label: "Offers" },
  { href: "/remedies/", label: "Remedies" },
  { href: "/consult/", label: "Consult" },
] as const;

/** Horizontal quick links shown under the header on phones/tablets. */
export function MobileShopStrip() {
  return (
    <nav className="mobile-shop-strip" aria-label="Quick shop links">
      <ul>
        {links.map((item) => (
          <li key={item.href + item.label}>
            <Link href={item.href} className="mobile-shop-strip__chip hp-focus-ring">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
