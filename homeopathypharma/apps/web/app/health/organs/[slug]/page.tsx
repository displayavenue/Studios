import type { Metadata } from "next";
import { buildMedicalWebPageJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getHealthTopic } from "@/lib/api";

interface OrganPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: OrganPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getHealthTopic("organ", slug);
  return buildPageMetadata(topic?.title ?? "Organ", `/health/organs/${slug}`);
}

export default async function OrganPage({ params }: OrganPageProps) {
  const { slug } = await params;
  const topic = await getHealthTopic("organ", slug);
  const title = topic?.title ?? slug.replace(/-/g, " ");

  const jsonLd = serializeJsonLd(
    buildMedicalWebPageJsonLd({
      name: title,
      description: `Educational overview of the ${title} — not medical advice.`,
      url: `/health/organs/${slug}`,
      lastReviewed: new Date().toISOString().slice(0, 10),
      reviewedByName: "HomeopathyPharma Medical Review",
      reviewedByCredential: "Editorial review pending",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ContentPage title={title} path={`/health/organs/${slug}`}>
        <div className="product-placeholder">
          Organ education content from <code>GET /v1/health/organs/{slug}</code>.
        </div>
        <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
          For educational purposes only. Seek professional care for symptoms or concerns about organ health.
        </p>
      </ContentPage>
    </>
  );
}
