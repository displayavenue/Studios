import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "./Icon";
import type { DetailPageContent, PageArchitecture } from "../data/catalogTypes";
import { useCms } from "../cms/CmsProvider";
import {
  SEO,
  FAQPageSchema,
  ServiceSchema,
  BreadcrumbSchema,
  ArticleSchema,
} from "./SEO";
import { whatsappWithText } from "../lib/geoContext";
import { catalogMeta } from "../data/pageSeo";
import "./DetailPage.css";

function pathFor(page: DetailPageContent): string {
  if (page.kind === "combo" && page.industrySlug && page.serviceSlug) {
    return `/industries/${page.industrySlug}/${page.serviceSlug}`;
  }
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
    combo: "/industries/",
  };
  return `${map[page.kind] || "/services/"}${page.slug}`;
}

function resolveArchitecture(page: DetailPageContent): PageArchitecture {
  if (page.architecture) return page.architecture;
  if (page.kind === "combo") return "combo";
  if (page.kind === "industry") {
    const map: Record<string, PageArchitecture> = {
      manufacturing: "manufacturing",
      healthcare: "healthcare",
      education: "education",
      "real-estate": "real-estate",
      ecommerce: "ecommerce",
    };
    return map[page.slug] || "industry";
  }
  const slug = page.slug;
  if (/(aeo|answer-engine|generative-engine|ai-search|geo)/.test(slug)) return "aeo";
  if (/(seo|gbp|google-business)/.test(slug)) return "seo";
  if (/(automation|chatbot|crm|workflow|erp)/.test(slug)) return "automation";
  if (/(ads|meta|google-ads|youtube|linkedin|performance)/.test(slug)) return "ads";
  if (/(lead|generation)/.test(slug)) return "lead-gen";
  if (/(web|shopify|wordpress|landing|ecommerce-website)/.test(slug)) return "web";
  return "default";
}

function sectionTitle(arch: PageArchitecture, page: DetailPageContent): {
  why: string;
  process: string;
  who: string;
  start: string;
} {
  switch (arch) {
    case "lead-gen":
      return {
        why: "How we turn attention into qualified conversations",
        process: "Acquisition → qualification → follow-up",
        who: "Who this lead system is for",
        start: "How we usually start a lead engine",
      };
    case "seo":
      return {
        why: "How we build durable search visibility",
        process: "Technical → content → authority → measurement",
        who: "Businesses that benefit from SEO",
        start: "How an SEO engagement starts",
      };
    case "aeo":
      return {
        why: "How we make your expertise easy for answer engines to cite",
        process: "Entities → answers → structured data → proof",
        who: "When AEO / AI search optimisation helps",
        start: "How we start an AEO programme",
      };
    case "automation":
      return {
        why: "Where manual work leaks revenue - and how we close it",
        process: "Map → automate → integrate → measure",
        who: "Teams that need workflow automation",
        start: "How automation projects kick off",
      };
    case "ads":
      return {
        why: "How we buy attention that becomes pipeline",
        process: "Offer → creative → bidding → conversion",
        who: "When paid media is the right lever",
        start: "How a paid media engagement starts",
      };
    case "manufacturing":
      return {
        why: "Built for RFQs, dealers, and long B2B cycles",
        process: "Discovery → enquiry → CRM → quotation follow-up",
        who: "Manufacturers, OEMs, and industrial brands",
        start: "How we start with manufacturing teams",
      };
    case "healthcare":
      return {
        why: "Patient discovery, trust, and appointment systems",
        process: "Local search → trust → booking → reminders",
        who: "Clinics, hospitals, and specialty practices",
        start: "How we start with healthcare brands",
      };
    case "education":
      return {
        why: "Admission funnels that reduce lead leakage",
        process: "Ad → lead → counselling → demo → admission",
        who: "Schools, coaching institutes, and study-abroad brands",
        start: "How we start with education brands",
      };
    case "real-estate":
      return {
        why: "Project demand, qualification, and site-visit systems",
        process: "Demand → qualify → visit → retarget → close",
        who: "Builders, developers, and brokers",
        start: "How we start with real estate teams",
      };
    case "ecommerce":
      return {
        why: "Traffic that converts - and customers who return",
        process: "Discover → convert → cart recovery → retention",
        who: "D2C brands and online stores",
        start: "How we start with ecommerce brands",
      };
    case "combo":
      return {
        why: `Why ${page.title} needs a specialised system`,
        process: "Industry context → channel → conversion → CRM",
        who: `Who buys ${page.title}`,
        start: "How we usually start",
      };
    default:
      return {
        why: `Why DisplayAvenue for ${page.title}`,
        process: "How we deliver",
        who: "Who this helps",
        start: "How we usually start",
      };
  }
}

export function DetailPage({ page }: { page: DetailPageContent }) {
  const cms = useCms();
  const [searchParams] = useSearchParams();
  const cityParam = (searchParams.get("city") || "").trim();
  const path = pathFor(page);
  const arch = resolveArchitecture(page);
  const labels = sectionTitle(arch, page);
  const meta = catalogMeta(page);
  const title = meta.title;
  const description = meta.description;
  const keywords = meta.keywords;
  const listPath =
    page.kind === "combo"
      ? `/industries/${page.industrySlug || ""}`
      : path.split("/").slice(0, 2).join("/") || "/";
  const crumbs =
    page.kind === "combo"
      ? [
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          {
            name: page.industrySlug || "Industry",
            path: `/industries/${page.industrySlug || ""}`,
          },
          { name: page.title, path },
        ]
      : [
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
      combo: cms.combos,
    } as Record<string, DetailPageContent[]>
  )[page.kind] || [];
  const siblings = sameKind.filter((p) => p.slug !== page.slug).slice(0, 12);
  const relatedCombos = (cms.combos || [])
    .filter(
      (c) =>
        c.slug !== page.slug &&
        (c.industrySlug === page.slug ||
          c.serviceSlug === page.slug ||
          c.industrySlug === page.industrySlug),
    )
    .slice(0, 6);
  const primaryCta = page.ctaLabel || "Get Free Growth Consultation";
  const secondaryCta = page.secondaryCtaLabel || "Call DisplayAvenue";
  const secondaryHref = page.secondaryCtaHref || cms.company.phoneHref;
  const processSteps = page.funnelSteps?.length ? page.funnelSteps : page.process;
  const contactHref = cityParam
    ? `/contact?city=${encodeURIComponent(cityParam)}`
    : "/contact";
  const waHref = cityParam
    ? whatsappWithText(
        cms.company.whatsappHref,
        `Hi DisplayAvenue, I'm looking at ${page.title} for ${cityParam}.`,
      )
    : cms.company.whatsappHref;

  return (
    <div className={`detail-page detail-page--${arch}`}>
      <SEO title={title} description={description} path={path} keywords={keywords} />
      <BreadcrumbSchema items={crumbs} />
      {(page.kind === "service" ||
        page.kind === "solution" ||
        page.kind === "ai" ||
        page.kind === "package" ||
        page.kind === "combo" ||
        page.kind === "industry") && (
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
              {crumbs.slice(0, -1).map((c, i) => (
                <span key={c.path}>
                  {i > 0 ? " / " : ""}
                  <Link to={c.path}>{c.name}</Link>
                </span>
              ))}
            </p>
            <p className="badge">{page.eyebrow || page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            {page.quickAnswer ? (
              <div className="detail-quick-answer">
                <strong>Quick answer</strong>
                <p>{page.quickAnswer}</p>
              </div>
            ) : (
              <p className="detail-plain">
                DisplayAvenue builds acquisition and conversion systems - ads, SEO, websites,
                CRM and follow-up - so attention becomes qualified conversations and revenue.
              </p>
            )}
            <div className="detail-hero-actions">
              <Link to={contactHref} className="btn btn-primary">
                {primaryCta} →
              </Link>
              {secondaryHref.startsWith("http") || secondaryHref.startsWith("tel:") ? (
                <a href={secondaryHref} className="btn btn-outline">
                  {secondaryCta}
                </a>
              ) : (
                <Link to={secondaryHref} className="btn btn-outline">
                  {secondaryCta}
                </Link>
              )}
              <a
                href={waHref}
                className="btn btn-ghost"
                target="_blank"
                rel="noreferrer"
              >
                {cityParam ? `WhatsApp · ${cityParam}` : "WhatsApp Us"}
              </a>
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
            {page.keyFacts && page.keyFacts.length > 0 && (
              <ul className="detail-key-facts">
                {page.keyFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="detail-hero-card">
            <span className="icon-box" style={{ background: `${page.color}22` }}>
              <Icon name={page.icon} color={page.color} size={28} />
            </span>
            <h2>{page.title}</h2>
            <p>{page.targetAudience || page.category}</p>
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

      {(page.painPoints?.length || page.whenYouNeedThis?.length) && (
        <section className="section">
          <div className="container detail-two">
            {page.painPoints && page.painPoints.length > 0 && (
              <div>
                <h2 className="section-title">Problems we solve</h2>
                <ul className="detail-list">
                  {page.painPoints.map((item) => (
                    <li key={item}>
                      <Icon name="check" color="#ef4444" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {page.whenYouNeedThis && page.whenYouNeedThis.length > 0 && (
              <div>
                <h2 className="section-title">When you need this</h2>
                <ul className="detail-list">
                  {page.whenYouNeedThis.map((item) => (
                    <li key={item}>
                      <Icon name="check" color="#16a34a" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">{labels.why}</h2>
          {page.uniqueAngle ? (
            <p className="section-sub" style={{ marginBottom: "1.25rem" }}>
              {page.uniqueAngle}
            </p>
          ) : (
            <p className="section-sub" style={{ marginBottom: "1.25rem" }}>
              We connect channels, conversion assets, and follow-up systems so growth is
              measurable - not a monthly report of vanity metrics.
            </p>
          )}
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

      {page.comparison && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Traditional agency vs DisplayAvenue</h2>
            <div className="detail-compare">
              <div className="detail-compare__col">
                <h3>Traditional agency</h3>
                <ul>
                  {page.comparison.traditional.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-compare__col detail-compare__col--ours">
                <h3>DisplayAvenue system</h3>
                <ul>
                  {page.comparison.ours.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
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
            <div className="detail-extra">
              <h3>{labels.who}</h3>
              <p>
                {page.targetAudience ||
                  "Indian businesses that want qualified enquiries, clearer websites, and systems that turn interest into sales conversations."}
              </p>
              {page.decisionMaker ? (
                <p>
                  <strong>Typical decision-maker:</strong> {page.decisionMaker}
                </p>
              ) : null}
              <h3>{labels.start}</h3>
              <ol>
                <li>Share your business, city, and growth goal</li>
                <li>We review channels, funnel, and follow-up gaps</li>
                <li>You get a plain plan with priorities and investment ranges</li>
                <li>We implement, track, and improve weekly</li>
              </ol>
            </div>
            <div className="detail-mid-cta">
              <Link to={contactHref} className="btn btn-primary">
                {primaryCta} →
              </Link>
            </div>
          </div>
          <div>
            <h2 className="section-title">{labels.process}</h2>
            <ol className="detail-process">
              {processSteps.map((step, i) => (
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
                <h3>Related in {page.category}</h3>
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

      {(page.objections?.length || page.faqs.length > 0) && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">
              {page.objections?.length ? "Objections & FAQs" : "FAQs"}
            </h2>
            <div className="detail-faqs">
              {[...(page.objections || []), ...page.faqs].map((faq) => (
                <details key={faq.q} className="card">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section detail-alt">
        <div className="container detail-related">
          <h2 className="section-title">Next steps & related pages</h2>
          <div className="detail-related-grid">
            {page.related.map((item) => (
              <Link key={item.href + item.label} to={item.href} className="category-card">
                <h3>{item.label}</h3>
                <span className="link-arrow">Continue →</span>
              </Link>
            ))}
            {relatedCombos.map((c) => (
              <Link key={c.slug} to={pathFor(c)} className="category-card">
                <h3>{c.title}</h3>
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
            <Link to={contactHref} className="category-card">
              <h3>Talk to a strategist</h3>
              <span className="link-arrow">Continue →</span>
            </Link>
          </div>
          <div className="detail-bottom-cta">
            <div>
              <h3>
                {arch === "manufacturing"
                  ? "Your next buyer may already be searching for your product."
                  : arch === "real-estate"
                    ? "Ready to turn project interest into qualified site visits?"
                    : arch === "aeo"
                      ? "Want your expertise cited when buyers ask AI?"
                      : `Ready to build a clearer growth system for ${page.title}?`}
              </h3>
              <p>
                Book a free consultation. We will map channels, conversion, and follow-up -
                then propose what to fix first.
              </p>
            </div>
            <Link to={contactHref} className="btn btn-primary">
              {primaryCta} →
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
        We couldn't find {slug ? `"${slug}"` : "this page"}. Browse services from the menu
        or contact us.
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
