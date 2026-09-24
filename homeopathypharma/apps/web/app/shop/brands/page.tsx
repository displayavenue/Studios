import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { brands } from "@/lib/content/brands";

export const metadata: Metadata = buildPageMetadata(
  "Shop by brand",
  "/shop/brands",
  "Browse SBL, Dr. Reckeweg, Schwabe and other published homeopathic brand catalogues.",
);

export default function ShopBrandsPage() {
  return (
    <ContentPage
      title="Shop by brand"
      description="Brand hubs for the live catalogue — start with SBL, Dr. Reckeweg, and Schwabe."
      path="/shop/brands"
    >
      <ul className="brand-card-grid" role="list">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <Link href={`/brands/${brand.slug}/`} className={`brand-card hp-focus-ring${brand.featured ? " brand-card--featured" : ""}`}>
              {brand.featured ? <span className="brand-card__badge">Featured</span> : null}
              <p className="brand-card__count">{brand.productCount} products</p>
              <h2 className="font-display">{brand.name}</h2>
              <p>{brand.tagline}</p>
              <span className="brand-card__cta">View catalogue →</span>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
