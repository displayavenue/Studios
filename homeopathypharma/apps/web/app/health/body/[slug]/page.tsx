import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@homeopathypharma/ui";
import { buildPageMetadata } from "@/components/content-page";
import { ORGAN_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(ORGAN_SLUGS);
}

interface BodyOrganAliasPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BodyOrganAliasPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata(slug.replace(/-/g, " "), `/health/body/${slug}`);
}

export default async function BodyOrganAliasPage({ params }: BodyOrganAliasPageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

  return (
    <Section>
      <Container>
        <header style={{ marginBottom: "var(--hp-space-8)" }}>
          <h1
            className="font-display"
            style={{
              margin: "0 0 var(--hp-space-3)",
              fontSize: "var(--hp-text-3xl)",
              color: "var(--hp-color-teal-900)",
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, color: "var(--hp-color-text-muted)", maxWidth: "60ch" }}>
            Organ-focused educational content.{" "}
            <Link href={`/health/organs/${slug}/`} className="hp-link hp-focus-ring">
              View canonical organ page
            </Link>
          </p>
        </header>
        <article className="product-placeholder">
          Organ content from <code>GET /v1/health/organs/{slug}</code>.
        </article>
        <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
          For general education only. Not intended to diagnose, treat, cure, or prevent any disease. Consult a
          qualified healthcare provider for personal health decisions.
        </p>
      </Container>
    </Section>
  );
}
