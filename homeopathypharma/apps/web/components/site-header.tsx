import Link from "next/link";
import { Input } from "@homeopathypharma/ui";

export function SiteHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--hp-space-6)",
        minHeight: "var(--hp-header-height)",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        className="font-display hp-link hp-focus-ring"
        style={{
          fontSize: "var(--hp-text-xl)",
          fontWeight: 600,
          color: "var(--hp-color-teal-900)",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        HomeopathyPharma
      </Link>

      <form
        action="/search"
        role="search"
        style={{
          flex: "1 1 16rem",
          maxWidth: "28rem",
          display: "flex",
          gap: "var(--hp-space-2)",
        }}
      >
        <Input
          id="site-search"
          name="q"
          type="search"
          placeholder="Search remedies, health topics…"
          autoComplete="off"
          aria-label="Search remedies, health topics, and articles"
        />
      </form>

      <nav aria-label="Primary">
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--hp-space-5)",
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: "var(--hp-text-sm)",
          }}
        >
          <li>
            <Link href="/shop" className="hp-link hp-focus-ring">
              Shop
            </Link>
          </li>
          <li>
            <Link href="/remedies" className="hp-link hp-focus-ring">
              Remedies
            </Link>
          </li>
          <li>
            <Link href="/brands" className="hp-link hp-focus-ring">
              Brands
            </Link>
          </li>
          <li>
            <Link href="/bundles" className="hp-link hp-focus-ring">
              Bundles
            </Link>
          </li>
          <li>
            <Link href="/consult" className="hp-link hp-focus-ring">
              Consult
            </Link>
          </li>
          <li>
            <Link href="/about" className="hp-link hp-focus-ring">
              About
            </Link>
          </li>
          <li>
            <Link href="/how-it-works" className="hp-link hp-focus-ring">
              How it works
            </Link>
          </li>
          <li>
            <Link href="/cart" className="hp-link hp-focus-ring">
              Cart
            </Link>
          </li>
          <li>
            <Link href="/account" className="hp-link hp-focus-ring">
              Account
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
