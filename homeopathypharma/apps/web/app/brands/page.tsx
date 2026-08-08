import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { brands } from "@/lib/content/brands";

export const metadata: Metadata = buildPageMetadata(
  "Brands",
  "/brands",
  "Homeopathic and wellness brands — brand hubs with products and manufacturer notes.",
);

export default function BrandsIndexPage() {
  return (
    <ContentPage
      title="Brands"
      description="Explore published brands as first-class catalogue entities — each with manufacturer notes and a product grid."
      path="/brands"
    >
      <ul className="catalog-grid" role="list">
        {brands.map((brand) => (
          <li key={brand.slug} className="catalog-tile">
            <Link href={`/brands/${brand.slug}/`} className="catalog-tile__link hp-focus-ring">
              <p className="catalog-tile__eyebrow">{brand.productCount} products</p>
              <h3 className="catalog-tile__title font-display">{brand.name}</h3>
              <p className="catalog-tile__meta">{brand.tagline}</p>
              <p className="catalog-tile__stock">{brand.manufacturer}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
