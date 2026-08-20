import Link from "next/link";

const trustLinks = [
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/disclaimer", label: "Medical disclaimer" },
  { href: "/shipping-policy", label: "Shipping policy" },
  { href: "/return-policy", label: "Return policy" },
];

const exploreLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/remedies", label: "Remedies" },
  { href: "/brands", label: "Brands" },
  { href: "/bundles", label: "Bundles" },
  { href: "/consult", label: "Consult" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/health", label: "Health knowledge hub" },
  { href: "/doctors", label: "Find a doctor" },
  { href: "/pets", label: "Pet care" },
];

export function SiteFooter() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--hp-space-8)",
        gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
      }}
    >
      <div>
        <p
          className="font-display"
          style={{
            margin: "0 0 var(--hp-space-3)",
            fontSize: "var(--hp-text-lg)",
            fontWeight: 600,
          }}
        >
          HomeopathyPharma
        </p>
        <p style={{ margin: 0, fontSize: "var(--hp-text-sm)", lineHeight: "var(--hp-leading-relaxed)" }}>
          Educational resources and pharmacy services for thoughtful homeopathic care. Not a substitute for
          professional medical advice.
        </p>
      </div>

      <nav aria-label="Explore">
        <h2
          style={{
            margin: "0 0 var(--hp-space-3)",
            fontSize: "var(--hp-text-sm)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--hp-color-sage-200)",
          }}
        >
          Explore
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: "var(--hp-text-sm)" }}>
          {exploreLinks.map((link) => (
            <li key={link.href} style={{ marginBottom: "var(--hp-space-2)" }}>
              <Link
                href={link.href}
                className="hp-focus-ring"
                style={{ color: "var(--hp-color-sage-100)", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Trust and legal">
        <h2
          style={{
            margin: "0 0 var(--hp-space-3)",
            fontSize: "var(--hp-text-sm)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--hp-color-sage-200)",
          }}
        >
          Trust &amp; legal
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: "var(--hp-text-sm)" }}>
          {trustLinks.map((link) => (
            <li key={link.href} style={{ marginBottom: "var(--hp-space-2)" }}>
              <Link
                href={link.href}
                className="hp-focus-ring"
                style={{ color: "var(--hp-color-sage-100)", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
