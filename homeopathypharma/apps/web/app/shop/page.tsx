import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { categoryImageDataUrl } from "@/lib/content/images";
import { PRODUCTS } from "@/lib/content/products";
import { productsForCategory } from "@/lib/content/products-by-taxonomy";
import { allCatalogTopicCount, CATALOG_TAXONOMY } from "@/lib/content/taxonomy";

export const metadata: Metadata = buildPageMetadata(
  "Shop",
  "/shop",
  "Browse the full homeopathy product catalogue by category, brand, remedy, and topic.",
);

export default function ShopPage() {
  const featured = PRODUCTS.slice(0, 16);

  return (
    <ContentPage
      title="Shop"
      description={`${PRODUCTS.length} products · ${CATALOG_TAXONOMY.length} categories · ${allCatalogTopicCount()} topics`}
      path="/shop"
    >
      <p style={{ marginTop: 0, maxWidth: "62ch" }}>
        Full catalogue from the updated homeopathy product categories — browse by body system, then open a topic or
        product pack.
      </p>

      <h2 className="font-display" style={{ marginTop: "1.5rem", color: "var(--hp-color-teal-900)" }}>
        Shop by category
      </h2>
      <ul className="category-browse-grid" role="list">
        {CATALOG_TAXONOMY.map((category) => (
          <li key={category.slug}>
            <Link href={`/shop/categories/${category.slug}/`} className="category-browse-card hp-focus-ring">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={categoryImageDataUrl(category.name, category.slug)} alt="" width={72} height={72} />
              <div>
                <h3 className="font-display" style={{ margin: 0, fontSize: "1.05rem", color: "var(--hp-color-teal-900)" }}>
                  {category.name}
                </h3>
                <p style={{ margin: "0.3rem 0 0", color: "var(--hp-color-text-muted)", fontSize: "0.85rem" }}>
                  {category.topics.length} topics · {productsForCategory(category.slug).length} products
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="home-section__head" style={{ marginTop: "2rem" }}>
        <h2 className="font-display" style={{ margin: 0, color: "var(--hp-color-teal-900)" }}>
          Featured packs
        </h2>
        <Link href="/shop/bestsellers/" className="hp-link">
          Bestsellers
        </Link>
      </div>
      <ProductGrid products={featured} />
    </ContentPage>
  );
}
