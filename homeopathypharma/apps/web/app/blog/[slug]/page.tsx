import type { Metadata } from "next";
import { buildArticleJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { BLOG_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(BLOG_SLUGS);
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return buildPageMetadata(title, `/blog/${slug}`, "Blog article from HomeopathyPharma.");
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

  const jsonLd = serializeJsonLd(
    buildArticleJsonLd({
      headline: title,
      description: "Blog article from HomeopathyPharma.",
      url: `/blog/${slug}`,
      imageUrl: "",
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      authorName: "HomeopathyPharma Editorial",
      publisherName: "HomeopathyPharma",
      publisherLogoUrl: "/brand/logo.svg",
    }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ContentPage title={title} path={`/blog/${slug}`}>
        <article className="product-placeholder">Blog post body from GET /v1/blog/{slug}.</article>
      </ContentPage>
    </>
  );
}
