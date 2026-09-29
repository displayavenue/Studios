import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { productsForCategory } from "@/lib/content/products-by-taxonomy";
import { getCatalogCategory, listCatalogCategorySlugs } from "@/lib/content/taxonomy";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(listCatalogCategorySlugs());
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCatalogCategory(slug);
  return buildPageMetadata(
    category?.name ?? slug,
    `/shop/categories/${slug}`,
    category?.summary ?? "Browse catalogue products.",
  );
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCatalogCategory(slug);
  const products = productsForCategory(slug);

  if (!category) {
    return (
      <ContentPage title="Category not found" path={`/shop/categories/${slug}`}>
        <Link href="/shop/categories/" className="hp-link">
          ← All categories
        </Link>
      </ContentPage>
    );
  }

  return (
    <ContentPage title={category.name} description={category.summary} path={`/shop/categories/${slug}`}>
      <p style={{ marginTop: 0 }}>{category.topics.length} topics in this category.</p>
      <ul className="topic-chip-row" role="list">
        {category.topics.map((topic) => (
          <li key={topic.slug}>
            <Link href={`/shop/topics/${topic.slug}/`} className="topic-chip hp-focus-ring">
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="font-display" style={{ marginTop: "1.75rem", color: "var(--hp-color-teal-900)" }}>
        Products
      </h2>
      <ProductGrid products={products} />
      <p style={{ marginTop: "1.25rem" }}>
        <Link href="/shop/categories/" className="hp-link">
          ← All categories
        </Link>
      </p>
      <p className="disclaimer-banner" style={{ marginTop: "1.25rem" }}>
        Shop-by pages are for product discovery only. Not medical advice. Products are not presented as treatments for
        specific diseases.
      </p>
    </ContentPage>
  );
}
