import type { Metadata } from "next";
import Link from "next/link";
import { buildMedicalWebPageJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { productsByRemedy } from "@/lib/content/products";
import { getRemedy, listRemedySlugs } from "@/lib/content/remedies";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(listRemedySlugs());
}

interface RemedyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RemedyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const remedy = getRemedy(slug);
  return buildPageMetadata(
    remedy?.name ?? slug.replace(/-/g, " "),
    `/remedies/${slug}`,
    remedy?.summary ?? `Educational overview of ${slug.replace(/-/g, " ")}.`,
  );
}

export default async function RemedyPage({ params }: RemedyPageProps) {
  const { slug } = await params;
  const remedy = getRemedy(slug);
  const products = productsByRemedy(slug);

  if (!remedy) {
    return (
      <ContentPage title="Remedy not found" path={`/remedies/${slug}`}>
        <Link href="/remedies/" className="hp-link">
          ← All remedies
        </Link>
      </ContentPage>
    );
  }

  const jsonLd = serializeJsonLd(
    buildMedicalWebPageJsonLd({
      name: remedy.name,
      description: remedy.summary,
      url: `/remedies/${slug}`,
      lastReviewed: new Date().toISOString().slice(0, 10),
      reviewedByName: "HomeopathyPharma Editorial",
      reviewedByCredential: "Educational catalogue review",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ContentPage
        title={remedy.name}
        description={`${remedy.latinName} — educational materia medica reference`}
        path={`/remedies/${slug}`}
      >
        <p style={{ maxWidth: "65ch" }}>{remedy.summary}</p>
        <ul className="detail-meta">
          <li>
            <strong>Latin name</strong>
            <span>{remedy.latinName}</span>
          </li>
          <li>
            <strong>Forms in shop</strong>
            <span>{remedy.commonForms.join(" · ")}</span>
          </li>
          <li>
            <strong>Products</strong>
            <span>{products.length} published packs</span>
          </li>
        </ul>
        <h2 className="font-display" style={{ color: "var(--hp-color-teal-900)" }}>
          Available products
        </h2>
        <ProductGrid products={products} />
        <p style={{ marginTop: "var(--hp-space-6)" }}>
          <Link href="/remedies/" className="hp-link hp-focus-ring">
            ← All remedies
          </Link>
        </p>
        <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
          Educational content only. Not intended to diagnose, treat, cure, or prevent any disease. Not a substitute
          for professional medical care. Consult a qualified practitioner before using any remedy.
        </p>
      </ContentPage>
    </>
  );
}
