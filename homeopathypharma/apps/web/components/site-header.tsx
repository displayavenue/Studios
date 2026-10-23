import Link from "next/link";
import { HOMEPAGE } from "@/lib/content/homepage";

const categoryNav = [
  { href: "/shop/", label: "Medicines" },
  { href: "/shop/categories/", label: "Categories" },
  { href: "/brands/sbl/", label: "SBL" },
  { href: "/brands/dr-reckeweg/", label: "Reckeweg" },
  { href: "/brands/schwabe/", label: "Schwabe" },
  { href: "/consult/", label: "Consult doctors" },
  { href: "/shop/offers/", label: "Offers" },
  { href: "/health/", label: "Health library" },
];

export function SiteHeader() {
  return (
    <div className="mg-header">
      <div className="mg-header__top">
        <Link href="/" className="mg-header__logo font-display hp-focus-ring" aria-label="HomeopathyPharma home">
          <span className="mg-header__mark" aria-hidden="true">
            HP
          </span>
          <span className="mg-header__name">
            Homeopathy<span>Pharma</span>
          </span>
        </Link>

        <form action="/search/" role="search" className="mg-header__search">
          <span className="mg-header__search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder={HOMEPAGE.searchPlaceholder}
            autoComplete="off"
            aria-label={HOMEPAGE.searchPlaceholder}
            className="mg-header__search-input hp-focus-ring"
            enterKeyHint="search"
          />
        </form>

        <div className="mg-header__actions">
          <Link href="/shop/offers/" className="mg-header__link hp-focus-ring">
            Offers
          </Link>
          <Link href="/consult/" className="mg-header__link hp-focus-ring">
            Consult
          </Link>
          <Link href="/login/" className="mg-header__link hp-focus-ring">
            Login
          </Link>
          <Link href="/cart/" className="mg-header__cart hp-focus-ring">
            Cart
          </Link>
        </div>
      </div>

      <nav className="mg-header__cats" aria-label="Shop categories">
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
