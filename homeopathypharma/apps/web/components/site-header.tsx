import Link from "next/link";
import { MobileShopStrip } from "@/components/mobile-shop-strip";
import { HOMEPAGE } from "@/lib/content/homepage";

const categoryNav = [
  { href: "/shop/categories/", label: "Categories" },
  { href: "/shop/", label: "Medicines" },
  { href: "/brands/sbl/", label: "SBL" },
  { href: "/brands/dr-reckeweg/", label: "Reckeweg" },
  { href: "/brands/schwabe/", label: "Schwabe" },
  { href: "/brands/", label: "All brands" },
  { href: "/remedies/", label: "Remedies" },
  { href: "/consult/", label: "Consult doctors" },
  { href: "/doctors/city/mumbai/", label: "Doctors in Mumbai" },
];

export function SiteHeader() {
  return (
    <div className="site-header">
      <div className="site-header__top">
        <Link href="/" className="site-header__brand font-display hp-focus-ring">
          HomeopathyPharma
        </Link>

        <form action="/search/" role="search" className="site-header__search">
          <span className="site-header__search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder={HOMEPAGE.searchPlaceholder}
            autoComplete="off"
            aria-label={HOMEPAGE.searchPlaceholder}
            className="site-header__search-input hp-focus-ring"
            enterKeyHint="search"
          />
        </form>

        <div className="site-header__actions">
          <Link href="/consult/" className="site-header__action hp-focus-ring">
            Consult
          </Link>
          <Link href="/login/" className="site-header__action hp-focus-ring">
            Sign in
          </Link>
          <Link href="/cart/" className="site-header__cart hp-focus-ring">
            Cart
          </Link>
        </div>
      </div>

      <MobileShopStrip />

      <nav className="site-header__cats" aria-label="Shop categories">
        <ul>
          {categoryNav.map((item) => (
            <li key={item.href + item.label}>
              <Link href={item.href} className="hp-focus-ring">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
