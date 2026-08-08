import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Shop categories",
  "/shop/categories",
  "Browse catalogue categories — single remedies, biochemic, bundles, and pet care.",
);

export default function ShopCategoriesPage() {
  const categories = [...new Set(PRODUCTS.map((p) => p.category))].sort();

  return (
    <ContentPage
      title="Categories"
      description="Store navigation tree for the published catalogue."
      path="/shop/categories"
    >
      <ul className="catalog-grid" role="list">
        {categories.map((category) => {
          const count = PRODUCTS.filter((p) => p.category === category).length;
          const href =
            category === "Bundles"
              ? "/bundles/"
              : category === "Pet Care"
                ? "/shop/health-areas/pet-care/"
                : "/shop/";
          return (
            <li key={category} className="catalog-tile">
              <Link href={href} className="catalog-tile__link hp-focus-ring">
                <p className="catalog-tile__eyebrow">{count} products</p>
                <h3 className="catalog-tile__title font-display">{category}</h3>
              </Link>
            </li>
          );
        })}
      </ul>
    </ContentPage>
  );
}
