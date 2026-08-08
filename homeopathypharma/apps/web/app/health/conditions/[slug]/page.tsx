import type { Metadata } from "next";
import { buildMedicalWebPageJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getHealthTopic } from "@/lib/api";
import { CONDITION_SLUGS, toParams } from "@/lib/static-params";


export function generateStaticParams() {
  return toParams(CONDITION_SLUGS);
}

interface ConditionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ConditionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getHealthTopic("condition", slug);
  return buildPageMetadata(topic?.title ?? "Condition", `/health/conditions/${slug}`);
}

export default async function ConditionPage({ params }: ConditionPageProps) {
  const { slug } = await params;
  const topic = await getHealthTopic("condition", slug);
  const title = topic?.title ?? slug.replace(/-/g, " ");

  const jsonLd = serializeJsonLd(
    buildMedicalWebPageJsonLd({
      name: title,
      description: `General educational information about ${title} — not medical advice.`,
      url: `/health/conditions/${slug}`,
      lastReviewed: new Date().toISOString().slice(0, 10),
      reviewedByName: "HomeopathyPharma Medical Review",
      reviewedByCredential: "Editorial review pending",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ContentPage title={title} path={`/health/conditions/${slug}`}>
        <div className="product-placeholder">
          Condition overview from <code>GET /v1/health/conditions/{slug}</code>. No treatment claims — educational
          framing only.
        </div>
        <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
          Never use this information to self-diagnose. Contact a licensed healthcare provider for evaluation and
          treatment options.
        </p>
      </ContentPage>
    </>
  );
}
