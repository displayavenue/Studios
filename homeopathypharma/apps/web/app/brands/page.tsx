import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { BRAND_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Brands",
  "/brands",
  "Homeopathic and wellness brands — first-class brand hubs with products, manufacturers, and regulatory notes.",
);

export default function BrandsIndexPage() {
  return (
    <ContentPage
      title="Brands"
      description="Explore homeopathic and wellness brands as first-class catalog entities — each with its own profile, manufacturer links, and product catalog."
      path="/brands"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        Brands are separate from manufacturers. A brand hub includes logo, country, linked manufacturing partners,
        and published products. Shop context:{" "}
        <Link href="/shop/brands/" className="hp-link hp-focus-ring">
          Shop by brand
        </Link>
        .
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {BRAND_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/brands/${slug}/`} className="hp-link hp-focus-ring font-display">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      <p className="product-placeholder" style={{ marginTop: "var(--hp-space-6)" }}>
        Full directory from <code>GET /v1/brands</code>.
      </p>
    </ContentPage>
  );
}
