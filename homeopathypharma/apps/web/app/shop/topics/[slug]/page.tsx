import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { productsForTopic } from "@/lib/content/products-by-taxonomy";
import { getCatalogTopic, listCatalogTopicSlugs } from "@/lib/content/taxonomy";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  // Unique topic slugs (some names repeat across categories; first match wins for routing).
  return toParams([...new Set(listCatalogTopicSlugs())]);
}

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getCatalogTopic(slug);
  return buildPageMetadata(
    match?.topic.name ?? slug,
    `/shop/topics/${slug}`,
    match ? `${match.topic.name} products in ${match.category.name}.` : "Catalogue topic",
  );
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const match = getCatalogTopic(slug);
  const products = productsForTopic(slug);

  if (!match) {
    return (
      <ContentPage title="Topic not found" path={`/shop/topics/${slug}`}>
        <Link href="/shop/categories/" className="hp-link">
          ← All categories
        </Link>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      title={match.topic.name}
      description={`${match.category.name} · educational product discovery`}
      path={`/shop/topics/${slug}`}
    >
      <p style={{ marginTop: 0 }}>
        Browse packs commonly listed under {match.topic.name.toLowerCase()}.{" "}
        <Link href={`/shop/categories/${match.category.slug}/`} className="hp-link">
          View {match.category.name}
        </Link>
      </p>
      <ProductGrid products={products} />
      <p className="disclaimer-banner" style={{ marginTop: "1.25rem" }}>
        Educational retail listing only. Not a diagnosis or treatment claim. Consult a qualified practitioner when
        unsure.
      </p>
    </ContentPage>
  );
}
