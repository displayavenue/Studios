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

      <nav aria-label="Account and cart">
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
            <Link href="/health" className="hp-link hp-focus-ring">
              Health hub
            </Link>
          </li>
          <li>
            <Link href="/doctors" className="hp-link hp-focus-ring">
              Doctors
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
