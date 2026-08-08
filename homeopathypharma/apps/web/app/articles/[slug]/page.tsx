import type { Metadata } from "next";
import { buildArticleJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getArticle } from "@/lib/api";
import { ARTICLE_SLUGS, toParams } from "@/lib/static-params";


export function generateStaticParams() {
  return toParams(ARTICLE_SLUGS);
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return buildPageMetadata(article?.title ?? "Article", `/articles/${slug}`, article?.excerpt);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const title = article?.title ?? slug.replace(/-/g, " ");

  const jsonLd = serializeJsonLd(
    buildArticleJsonLd({
      headline: title,
      description: article?.excerpt ?? "Educational article from HomeopathyPharma.",
      url: `/articles/${slug}`,
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
      <ContentPage title={title} description={article?.excerpt} path={`/articles/${slug}`}>
        <article style={{ maxWidth: "65ch", lineHeight: "var(--hp-leading-relaxed)" }}>
          <p>
            This educational article covers {title}. It is published for general learning and is not personal medical
            advice.
          </p>
        </article>
      </ContentPage>
    </>
  );
}
