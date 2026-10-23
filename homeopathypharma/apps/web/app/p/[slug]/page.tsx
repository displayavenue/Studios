import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@homeopathypharma/ui";
import { getPublishedCmsPage, listPublishedCmsPages } from "@/lib/content/cms-pages";

export function generateStaticParams() {
  return listPublishedCmsPages().map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublishedCmsPage(slug);
  if (!page) return { title: "Page" };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt,
  };
}

export default async function CmsPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = getPublishedCmsPage(slug);
  if (!page) notFound();

  return (
    <Section>
      <Container narrow>
        <article className="cms-page">
          <h1 className="font-display" style={{ marginTop: 0, color: "var(--hp-color-teal-900)" }}>
            {page.title}
          </h1>
          {page.excerpt ? (
            <p style={{ color: "var(--hp-color-text-muted)", fontSize: "1.05rem" }}>{page.excerpt}</p>
          ) : null}
          <div
            className="cms-page__body"
            style={{ lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
        </article>
      </Container>
    </Section>
  );
}
