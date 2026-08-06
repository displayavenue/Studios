import type { DetailPageContent } from "../data/catalogTypes";
import {
  SEO,
  FAQPageSchema,
  ServiceSchema,
  BreadcrumbSchema,
  ArticleSchema,
  ReviewListSchema,
} from "./SEO";
import {
  isMarketingService,
  isSoftwareService,
  pathFor,
} from "./detailLayouts/shared";
import { SoftwareServiceLayout } from "./detailLayouts/SoftwareServiceLayout";
import { MarketingServiceLayout } from "./detailLayouts/MarketingServiceLayout";
import { ServiceDetailLayout } from "./detailLayouts/ServiceDetailLayout";
import { IndustryDetailLayout } from "./detailLayouts/IndustryDetailLayout";
import { SolutionDetailLayout } from "./detailLayouts/SolutionDetailLayout";
import { PackageDetailLayout } from "./detailLayouts/PackageDetailLayout";
import { AiDetailLayout } from "./detailLayouts/AiDetailLayout";
import { ToolDetailLayout } from "./detailLayouts/ToolDetailLayout";
import { CaseDetailLayout } from "./detailLayouts/CaseDetailLayout";
import { ResourceDetailLayout } from "./detailLayouts/ResourceDetailLayout";
import { ProjectDetailLayout } from "./detailLayouts/ProjectDetailLayout";
import "./DetailPage.css";

function LayoutBody({ page }: { page: DetailPageContent }) {
  switch (page.kind) {
    case "industry":
      return <IndustryDetailLayout page={page} />;
    case "solution":
      return <SolutionDetailLayout page={page} />;
    case "package":
      return <PackageDetailLayout page={page} />;
    case "ai":
      return <AiDetailLayout page={page} />;
    case "tool":
      return <ToolDetailLayout page={page} />;
    case "case-study":
      return <CaseDetailLayout page={page} />;
    case "resource":
      return <ResourceDetailLayout page={page} />;
    case "project":
      return <ProjectDetailLayout page={page} />;
    case "service":
    default:
      if (isSoftwareService(page)) return <SoftwareServiceLayout page={page} />;
      if (isMarketingService(page)) return <MarketingServiceLayout page={page} />;
      return <ServiceDetailLayout page={page} />;
  }
}

export function DetailPage({ page }: { page: DetailPageContent }) {
  const path = pathFor(page);
  const kindLabel: Record<string, string> = {
    service: "Services",
    industry: "Industry",
    package: "Package",
    solution: "Solution",
    ai: "AI Suite",
    tool: "Free Tools",
    "case-study": "Case Study",
    project: "Portfolio",
    resource: "Resource",
  };
  const suffix = kindLabel[page.kind] || "Page";
  const title =
    page.seo?.title || `${page.title} ${suffix} | DisplayAvenue`;
  const description = page.seo?.description || page.summary;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: page.category, path: path.split("/").slice(0, 2).join("/") || "/" },
    { name: page.title, path },
  ];
  const faqs = (page.faqs || []).map((f) => ({
    question: f.q,
    answer: f.a,
  }));
  const reviews = page.reviews || [];
  const locations = page.locations || [];
  const keywords = page.longTailKeywords || page.seo?.keywords || [];
  const seoImage = page.coverImage || page.image;

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={path}
        image={seoImage}
        imageAlt={page.title}
      />
      <BreadcrumbSchema items={crumbs} />
      {(page.kind === "service" ||
        page.kind === "solution" ||
        page.kind === "ai" ||
        page.kind === "package") && (
        <ServiceSchema
          name={page.title}
          description={page.summary}
          path={path}
          category={page.category}
          areaServed={locations.map((l) => l.city)}
          keywords={keywords}
        />
      )}
      {(page.kind === "resource" || page.kind === "case-study") && (
        <ArticleSchema
          title={page.title}
          description={page.summary}
          path={path}
          category={page.category}
        />
      )}
      {faqs.length > 0 && <FAQPageSchema faqs={faqs} />}
      {page.kind === "service" && reviews.length > 0 && (
        <ReviewListSchema serviceName={page.title} reviews={reviews} />
      )}
      <LayoutBody page={page} />
    </>
  );
}

export function NotFoundDetail({
  kind,
  slug,
}: {
  kind: string;
  slug: string;
}) {
  return (
    <div className="detail-page">
      <SEO
        title={`${kind} not found | DisplayAvenue`}
        description={`No ${kind.toLowerCase()} page was found for “${slug}”.`}
        path={`/${kind.toLowerCase().replace(/\s+/g, "-")}/${slug}`}
        noindex
      />
      <section className="section">
        <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          <h1 className="section-title">{kind} not found</h1>
          <p className="section-sub">No page for “{slug}”.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Back home
          </a>
        </div>
      </section>
    </div>
  );
}
