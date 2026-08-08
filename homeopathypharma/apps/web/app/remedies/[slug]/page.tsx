import type { Metadata } from "next";
import Link from "next/link";
import { buildMedicalWebPageJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { REMEDY_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(REMEDY_SLUGS);
}

interface RemedyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RemedyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return buildPageMetadata(
    title,
    `/remedies/${slug}`,
    `Educational overview of ${title} — homeopathic materia medica reference.`,
  );
}

export default async function RemedyPage({ params }: RemedyPageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

  const jsonLd = serializeJsonLd(
    buildMedicalWebPageJsonLd({
      name: title,
      description: `General educational information about ${title} in homeopathic literature — not medical advice.`,
      url: `/remedies/${slug}`,
      lastReviewed: new Date().toISOString().slice(0, 10),
      reviewedByName: "HomeopathyPharma Medical Review",
      reviewedByCredential: "Editorial review pending",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ContentPage
        title={title}
        description="Master remedy profile — source classification, common names, and educational background."
        path={`/remedies/${slug}`}
      >
        <div className="product-placeholder">
          Remedy monograph from <code>GET /v1/remedies/{slug}</code>. Includes source type, pharmacopoeial
          references, and linked commercial products (potency/form/pack as variant attributes).
        </div>
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
