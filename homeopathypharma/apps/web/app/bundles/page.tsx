import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { BUNDLE_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Bundles & kits",
  "/bundles",
  "Curated homeopathic product bundles for common wellness goals.",
);

export default function BundlesIndexPage() {
  return (
    <ContentPage
      title="Bundles & kits"
      description="Multi-product bundles curated for discovery — individual items remain available separately."
      path="/bundles"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        Bundles group published SKUs with transparent pricing. Each bundle page lists included variants (potency,
        form, pack) without implying disease treatment.
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {BUNDLE_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/bundles/${slug}/`} className="hp-link hp-focus-ring font-display">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        Also browse via{" "}
        <Link href="/shop/bundles/" className="hp-link hp-focus-ring">
          Shop → Bundles
        </Link>
        .
      </p>
    </ContentPage>
  );
}
