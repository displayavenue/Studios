import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { brands } from "@/lib/content/brands";

export const metadata: Metadata = buildPageMetadata(
  "Shop by brand",
  "/shop/brands",
  "Browse published homeopathic brands and their product catalogues.",
);

export default function ShopBrandsPage() {
  return (
    <ContentPage title="Shop by brand" description="Brand hubs for the live catalogue." path="/shop/brands">
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {brands.map((brand) => (
          <li key={brand.slug}>
            <Link href={`/brands/${brand.slug}/`} className="hp-link hp-focus-ring font-display">
              {brand.name}
            </Link>
            <span style={{ color: "var(--hp-color-text-muted)", marginLeft: "var(--hp-space-2)" }}>
              {brand.productCount} products
            </span>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
