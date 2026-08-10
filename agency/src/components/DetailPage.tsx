import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import type { DetailPageContent } from "../data/catalogTypes";
import { useCms } from "../cms/CmsProvider";
import {
  SEO,
  FAQPageSchema,
  ServiceSchema,
  BreadcrumbSchema,
  ArticleSchema,
} from "./SEO";
import { InternalLinks } from "./InternalLinks";
import "./DetailPage.css";

function pathFor(page: DetailPageContent): string {
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

export function DetailPage({ page }: { page: DetailPageContent }) {
  const cms = useCms();
  const path = pathFor(page);
  const title = `${page.title} | DisplayAvenue`;
  const description = page.summary;
  const listPath = path.split("/").slice(0, 2).join("/") || "/";
  const crumbs = [
    { name: "Home", path: "/" },
    { name: page.category, path: listPath },
    { name: page.title, path },
  ];
  const faqs = (page.faqs || []).map((f) => ({
    question: f.q,
    answer: f.a,
  }));
  const sameKind = (
    {
      service: cms.services,
      industry: cms.industries,
      package: cms.packages,
      solution: cms.solutions,
      ai: cms.ai,
      tool: cms.tools,
      "case-study": cms.cases,
      project: cms.projects,
      resource: cms.resources,
    } as Record<string, DetailPageContent[]>
  )[page.kind] || [];
  const siblings = sameKind.filter((p) => p.slug !== page.slug).slice(0, 16);

  return (
    <div className="detail-page">
      <SEO title={title} description={description} path={path} />
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

      <section className="detail-hero" style={{ ["--accent" as string]: page.color }}>
        <div className="container detail-hero-grid">
          <div>
            <p className="detail-crumbs">
              <Link to="/">Home</Link>
              {" / "}
              <Link to={listPath}>{page.category}</Link>
            </p>
            <p className="badge">{page.eyebrow || page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <p className="detail-plain">
              Built for Indian business owners who want clear marketing that brings calls,
              walk-ins, and online sales  -  without confusing jargon.
            </p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {page.ctaLabel ?? "Get Free Proposal"} →
              </Link>
              <Link to="/packages" className="btn btn-outline">
                View Packages
              </Link>
              <Link to="/free-tools" className="btn btn-ghost">
                Try free tools
              </Link>
            </div>
            {page.metrics && (
              <div className="detail-metrics">
                {page.metrics.map((m) => (
                  <div key={m.label}>
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="detail-hero-card">
            <span className="icon-box" style={{ background: `${page.color}22` }}>
              <Icon name={page.icon} color={page.color} size={28} />
            </span>
            <h2>{page.title}</h2>
            <p>{page.category}</p>
            <ul>
              {page.deliverables.slice(0, 5).map((item) => (
                <li key={item}>
                  <Icon name="check" size={14} color={page.color} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why DisplayAvenue for {page.title}</h2>
          <p className="section-sub" style={{ marginBottom: "1.25rem" }}>
            We explain every step in plain English, share weekly updates, and focus on
            results you can see  -  more enquiries, better Google visibility, and a website
            that turns visitors into customers.
          </p>
          <div className="detail-benefits">
            {page.benefits.map((b) => (
              <div key={b.title} className="detail-benefit card">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container detail-two">
          <div>
            <h2 className="section-title">What you get</h2>
            <ul className="detail-list">
              {page.deliverables.map((item) => (
                <li key={item}>
                  <Icon name="check" color="#16a34a" size={16} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="detail-extra">
              <h3>Who this helps</h3>
              <p>
                Local shops, clinics, salons, restaurants, real estate teams, education
                brands, and growing online businesses across India that want more customers
                from Google, Instagram, and their website.
              </p>
              <h3>How we usually start</h3>
              <ol>
                <li>Quick call about your business and goals</li>
                <li>We review your Google listing, ads, and website</li>
                <li>You get a plain plan with clear next steps</li>
                <li>We start work and share simple weekly updates</li>
              </ol>
            </div>
          </div>
          <div>
            <h2 className="section-title">How we deliver</h2>
            <ol className="detail-process">
              {page.process.map((step, i) => (
                <li key={step.title}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            {siblings.length > 0 && (
              <div className="detail-siblings">
                <h3>More in {page.category}</h3>
                <ul>
                  {siblings.map((sib) => (
                    <li key={sib.slug}>
                      <Link to={pathFor(sib)}>{sib.title}</Link>
                    </li>
                  ))}
                  <li>
                    <Link to={listPath}>Browse all →</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">FAQs</h2>
          <div className="detail-faqs">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="card">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container detail-related">
          <h2 className="section-title">Next steps</h2>
          <div className="detail-related-grid">
            {page.related.map((item) => (
              <Link key={item.href + item.label} to={item.href} className="category-card">
                <h3>{item.label}</h3>
                <span className="link-arrow">Continue →</span>
              </Link>
            ))}
            <Link to="/services" className="category-card">
              <h3>All services</h3>
              <span className="link-arrow">Continue →</span>
            </Link>
            <Link to="/industries" className="category-card">
              <h3>Industries we help</h3>
              <span className="link-arrow">Continue →</span>
            </Link>
            <Link to="/case-studies" className="category-card">
              <h3>Case studies</h3>
              <span className="link-arrow">Continue →</span>
            </Link>
            <Link to="/resources" className="category-card">
              <h3>Guides & resources</h3>
              <span className="link-arrow">Continue →</span>
            </Link>
          </div>
          <div className="detail-bottom-cta">
            <div>
              <h3>Ready to get started with {page.title}?</h3>
              <p>Talk to our team for a free consultation and custom proposal.</p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              Book Free Consultation →
            </Link>
          </div>
        </div>
      </section>

      <InternalLinks
        title={`Explore more after ${page.title}`}
        excludeHref={path}
        limit={120}
        columns={4}
      />
    </div>
  );
}

export function NotFoundDetail({ kind, slug }: { kind: string; slug?: string }) {
  return (
    <div className="container" style={{ padding: "4rem 0" }}>
      <p className="badge">Not found</p>
      <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
        {kind} page not found
      </h1>
      <p className="section-sub">
        We couldn’t find {slug ? `"${slug}"` : "this page"}. Browse services from the menu or contact us.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
        <Link to="/services" className="btn btn-primary">
          Browse Services
        </Link>
        <Link to="/contact" className="btn btn-outline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
