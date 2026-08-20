import type { Metadata } from "next";
import { buildMedicalWebPageJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getHealthTopic } from "@/lib/api";
import { BODY_SYSTEM_SLUGS, toParams } from "@/lib/static-params";


export function generateStaticParams() {
  return toParams(BODY_SYSTEM_SLUGS);
}

interface HealthTopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HealthTopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getHealthTopic("body-system", slug);
  return buildPageMetadata(topic?.title ?? "Body system", `/health/body-systems/${slug}`);
}

export default async function BodySystemPage({ params }: HealthTopicPageProps) {
  const { slug } = await params;
  const topic = await getHealthTopic("body-system", slug);
  const title = topic?.title ?? slug.replace(/-/g, " ");

  const jsonLd = serializeJsonLd(
    buildMedicalWebPageJsonLd({
      name: title,
      description: `Educational overview of the ${title} — not medical advice.`,
      url: `/health/body-systems/${slug}`,
      lastReviewed: new Date().toISOString().slice(0, 10),
      reviewedByName: "HomeopathyPharma Medical Review",
      reviewedByCredential: "Editorial review pending",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ContentPage title={title} path={`/health/body-systems/${slug}`}>
        <p style={{ maxWidth: "65ch", lineHeight: "var(--hp-leading-relaxed)" }}>
          An educational overview of the {title}. Use this for general learning about anatomy and wellness
          concepts — not for personal diagnosis or treatment decisions.
        </p>
        <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
          This page describes general anatomy and wellness concepts. It does not provide personalized medical
          guidance.
        </p>
      </ContentPage>
    </>
  );
}
