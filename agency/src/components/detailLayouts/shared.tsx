import { Link } from "react-router-dom";
import type { DetailPageContent } from "../../data/catalogTypes";

export function pathFor(page: DetailPageContent): string {
  const map: Record<string, string> = {
    service: "/services/",
    industry: "/industries/",
    package: "/packages/",
    solution: "/solutions/",
    ai: "/ai-platform/",
    tool: "/free-tools/",
    "case-study": "/case-studies/",
    project: "/portfolio/",
    resource: "/resources/",
  };
  return `${map[page.kind] || "/services/"}${page.slug}`;
}

export function isSoftwareService(page: DetailPageContent): boolean {
  const softwareSlugs = new Set([
    "erp",
    "crm",
    "hrms",
    "saas",
    "software",
    "dashboards",
    "pos",
  ]);
  return (
    page.kind === "service" &&
    (softwareSlugs.has(page.slug) ||
      page.category === "Software" ||
      page.category === "Cloud & DevOps")
  );
}

export function isMarketingService(page: DetailPageContent): boolean {
  return (
    page.kind === "service" &&
    ["Digital Marketing", "Paid Media", "Conversion", "Analytics"].includes(
      page.category,
    )
  );
}

export function LeadStrip({
  page,
  primary,
  secondary,
  note,
}: {
  page: DetailPageContent;
  primary: string;
  secondary?: { label: string; href: string };
  note?: string;
}) {
  return (
    <section className="detail-lead-strip">
      <div className="container detail-lead-inner">
        <div>
          <h2>Ready to talk about {page.title}?</h2>
          <p>
            {note ||
              "Share your goals - we respond with a scoped plan, timeline, and clear next step within one business day."}
          </p>
        </div>
        <div className="detail-lead-actions">
          <Link to="/contact" className="btn btn-primary">
            {primary}
          </Link>
          {secondary && (
            <Link to={secondary.href} className="btn btn-outline">
              {secondary.label}
            </Link>
          )}
          <a href="tel:+919222122333" className="btn btn-ghost">
            Call +91 9222 122333
          </a>
        </div>
      </div>
    </section>
  );
}

export function FaqBlock({
  page,
  title,
}: {
  page: DetailPageContent;
  title?: string;
}) {
  if (!page.faqs?.length) return null;
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          {title || `FAQs about ${page.title}`}
        </h2>
        <div className="detail-faqs">
          {page.faqs.map((f) => (
            <details key={f.q} className="detail-faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedBlock({ page }: { page: DetailPageContent }) {
  if (!page.related?.length) return null;
  return (
    <section className="section detail-alt">
      <div className="container">
        <h2 className="section-title">Related next steps</h2>
        <div className="detail-related">
          {page.related.map((r) => (
            <Link key={r.href} to={r.href} className="detail-related-card">
              {r.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
