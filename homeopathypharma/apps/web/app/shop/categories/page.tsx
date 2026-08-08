import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { categoryImageDataUrl } from "@/lib/content/images";
import { productsForCategory } from "@/lib/content/products-by-taxonomy";
import { allCatalogTopicCount, CATALOG_TAXONOMY } from "@/lib/content/taxonomy";

export const metadata: Metadata = buildPageMetadata(
  "Shop categories",
  "/shop/categories",
  "Browse the full HomeopathyPharma product catalogue by body system and wellness theme.",
);

export default function ShopCategoriesPage() {
  return (
    <ContentPage
      title="Product categories"
      description={`${CATALOG_TAXONOMY.length} main categories · ${allCatalogTopicCount()} topics from the updated homeopathy catalogue.`}
      path="/shop/categories"
    >
      <p style={{ marginTop: 0, maxWidth: "62ch" }}>
        Explore every catalogue section — from head & hair to senior wellness. Pages are for product discovery and
        education, not disease-treatment claims.
      </p>
      <ul className="category-browse-grid" role="list">
        {CATALOG_TAXONOMY.map((category) => {
          const count = productsForCategory(category.slug).length;
          return (
            <li key={category.slug}>
              <Link href={`/shop/categories/${category.slug}/`} className="category-browse-card hp-focus-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={categoryImageDataUrl(category.name, category.slug)} alt="" width={72} height={72} />
                <div>
                  <h2 className="font-display">{category.name}</h2>
                  <p>{category.summary}</p>
                  <span>
                    {category.topics.length} topics · {count} products
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </ContentPage>
  );
}
