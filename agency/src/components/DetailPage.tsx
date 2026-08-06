import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import type { DetailPageContent } from "../data/catalogTypes";
import {
  SEO,
  FAQPageSchema,
  ServiceSchema,
  BreadcrumbSchema,
  ArticleSchema,
  ReviewListSchema,
} from "./SEO";
import { toolCategories } from "../data/tools";
import { getExternalToolUrl } from "../data/toolLinks";
import { aiSuites } from "../data/ai";
import { getAiToolUrl } from "../data/aiToolLinks";
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
  const path = pathFor(page);
  const title =
    page.seo?.title || `${page.title} Services | DisplayAvenue`;
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

      <section className="detail-hero" style={{ ["--accent" as string]: page.color }}>
        <div className="container detail-hero-grid">
          <div>
            <p className="badge">{page.eyebrow || page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {page.ctaLabel ?? "Get Free Proposal"} →
              </Link>
              <Link to="/packages" className="btn btn-outline">
                View Packages
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

      {page.intro && (
        <section className="section">
          <div className="container detail-prose">
            <h2 className="section-title">About our {page.title}</h2>
            {page.intro.split("\n\n").map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {page.kind === "tool" && (() => {
        const cat = toolCategories.find(
          (c) =>
            c.title === page.title ||
            c.href.endsWith(`/${page.slug}`) ||
            page.title
              .toLowerCase()
              .includes(c.title.toLowerCase().replace(" tools", "")),
        );
        if (!cat?.tools.length) return null;
        return (
          <section className="section detail-alt">
            <div className="container">
              <h2 className="section-title">Open free tools (new tab)</h2>
              <p className="section-sub" style={{ marginBottom: "1rem" }}>
                Each link opens a trusted free online utility on your device in a
                new window.
              </p>
              <ul className="mega-links detail-tool-links">
                {cat.tools.map((tool) => {
                  const url = getExternalToolUrl(tool);
                  return (
                    <li key={tool}>
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {tool}
                          <Icon name="external" size={14} />
                        </a>
                      ) : (
                        <span>{tool}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })()}

      {page.kind === "ai" && (() => {
        const suite = aiSuites.find(
          (s) =>
            s.href.endsWith(`/${page.slug}`) ||
            s.title === page.title ||
            page.title.toLowerCase().includes(s.title.toLowerCase()),
        );
        if (!suite?.tools.length) return null;
        return (
          <section className="section detail-alt">
            <div className="container">
              <h2 className="section-title">Open free AI tools (new tab)</h2>
              <p className="section-sub" style={{ marginBottom: "1rem" }}>
                Click any tool below to launch a free online AI utility in a new
                tab. Suite overview stays on this page.
              </p>
              <ul className="mega-links detail-tool-links">
                {suite.tools.map((tool) => {
                  const url = getAiToolUrl(tool);
                  return (
                    <li key={tool}>
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {tool}
                          <Icon name="external" size={14} />
                        </a>
                      ) : (
                        <span>{tool}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div style={{ marginTop: "1.25rem" }}>
                <Link to="/contact" className="btn btn-primary">
                  Book Free AI Consultation →
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why DisplayAvenue for {page.title}</h2>
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

      {page.sections && page.sections.length > 0 && (
        <section className="section detail-alt">
          <div className="container detail-sections">
            {page.sections.map((sec) => (
              <article key={sec.title} className="detail-section-block">
                <h2 className="section-title">{sec.title}</h2>
                <p>{sec.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {page.whoItsFor && page.whoItsFor.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Who this {page.title} is for</h2>
            <ul className="detail-list detail-who">
              {page.whoItsFor.map((item) => (
                <li key={item}>
                  <Icon name="check" color="#16a34a" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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
          </div>
        </div>
      </section>

      {locations.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">
              {page.title} locations we serve
            </h2>
            <p className="section-sub">
              Mumbai-based team with delivery across India - online workshops
              and on-site kickoffs for larger rollouts.
            </p>
            <div className="detail-locations">
              {locations.map((loc) => (
                <div key={`${loc.city}-${loc.region}`} className="detail-location card">
                  <strong>{loc.city}</strong>
                  <span>
                    {[loc.region, loc.country || "India"].filter(Boolean).join(", ")}
                  </span>
                  {loc.note && <p>{loc.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {keywords.length > 0 && (
        <section className="section detail-alt">
          <div className="container">
            <h2 className="section-title">
              Popular searches related to {page.title}
            </h2>
            <p className="section-sub">
              Long-tail keywords buyers actually type - used in our content,
              ads, and landing pages for this service.
            </p>
            <ul className="detail-keywords">
              {keywords.map((kw) => (
                <li key={kw}>{kw}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">
              Client reviews for {page.title}
            </h2>
            <p className="section-sub">
              {reviews.length}+ recent client notes from projects across India.
              Edit these anytime in the CMS.
            </p>
            <div className="detail-reviews">
              {reviews.map((rev) => (
                <blockquote key={`${rev.name}-${rev.city}`} className="detail-review card">
                  <div className="detail-review-stars" aria-label={`${rev.rating} out of 5`}>
                    {"★".repeat(Math.max(1, Math.min(5, rev.rating || 5)))}
                  </div>
                  <p>“{rev.quote}”</p>
                  <footer>
                    <strong>{rev.name}</strong>
                    <span>
                      {[rev.role, rev.company, rev.city].filter(Boolean).join(" · ")}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">FAQs about {page.title}</h2>
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

      <section className="section">
        <div className="container detail-related">
          <h2 className="section-title">Next steps</h2>
          <div className="detail-related-grid">
            {page.related.map((item) => (
              <Link
                key={item.href + item.label}
                to={item.href}
                className="category-card"
              >
                <h3>{item.label}</h3>
                <span className="link-arrow">Continue →</span>
              </Link>
            ))}
          </div>
          <div className="detail-bottom-cta">
            <div>
              <h3>Ready to get started with {page.title}?</h3>
              <p>
                Talk to our team for a free consultation and a custom proposal
                tailored to your market.
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              Book Free Consultation →
            </Link>
          </div>
        </div>
      </section>
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
        We couldn’t find {slug ? `"${slug}"` : "this page"}. Browse services from
        the menu or contact us.
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1.25rem",
          flexWrap: "wrap",
        }}
      >
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
