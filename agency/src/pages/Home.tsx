import { Link } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { toolCategories } from "../data/tools";
import "../styles/pages.css";

function InternalLink({
  to,
  className,
  children,
  style,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  if (to.startsWith("http")) {
    return (
      <a href={to} className={className} style={style} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} style={style}>
      {children}
    </Link>
  );
}

export function Home() {
  const { company, home, content, industries, cases, tools } = useCms();
  const clientLogos = content.clientLogos;
  const testimonials = content.testimonials;
  const partners = home.partners || [];
  const serviceCards = home.services || [];
  const allServices = home.allServicesCard;
  const aiBanner = home.aiBanner;
  const challenges = home.challengeLinks || [];
  const packages = home.packages || [];
  const insightLinks = home.insightLinks || [];
  const maps = company.googleMaps;
  const location = home.location;

  const industryCards = (home.industrySlugs || [])
    .map((slug) => industries.find((i) => i.slug === slug))
    .filter(Boolean);

  const caseCards = (home.caseSlugs || [])
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter(Boolean);

  const toolCards = (home.toolCategorySlugs || [])
    .map((slug) => {
      const fromCms = tools.find((t) => t.slug === slug);
      const fromStatic = toolCategories.find((t) => t.href.endsWith(`/${slug}`));
      if (fromCms) {
        return {
          title: fromCms.title,
          href: `/free-tools/${fromCms.slug}`,
          icon: fromCms.icon,
          color: fromCms.color,
          blurb: (fromStatic?.tools || []).slice(0, 3).join(" · ") || fromCms.summary,
        };
      }
      if (fromStatic) {
        return {
          title: fromStatic.title,
          href: fromStatic.href,
          icon: fromStatic.icon,
          color: fromStatic.color,
          blurb: fromStatic.tools.slice(0, 3).join(" · "),
        };
      }
      return null;
    })
    .filter(Boolean) as {
    title: string;
    href: string;
    icon: string;
    color: string;
    blurb: string;
  }[];

  const seoTitle =
    home.seo?.title || `${company.name} | Digital Growth. AI Powered.`;
  const seoDesc = home.seo?.description || home.hero.lead;
  const dash = home.heroDashboard;
  const assist = home.aiAssist;

  const caseGradients = [
    "linear-gradient(135deg,#0ea5e9,#0369a1)",
    "linear-gradient(135deg,#8b5cf6,#4c1d95)",
    "linear-gradient(135deg,#f97316,#c2410c)",
    "linear-gradient(135deg,#10b981,#047857)",
  ];

  return (
    <>
      <SEO title={seoTitle} description={seoDesc} path="/" />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="hero-eyebrow">{home.hero.eyebrow}</p>
            <h1>
              {home.hero.titleBefore}{" "}
              <em>{home.hero.titleAccent}</em>
            </h1>
            <p className="hero-lead">{home.hero.lead}</p>
            <div className="hero-actions">
              <InternalLink
                to={home.hero.primaryCtaHref || "/contact"}
                className="btn btn-primary"
              >
                {home.hero.primaryCta}
              </InternalLink>
              <InternalLink
                to={home.hero.secondaryCtaHref || "/contact"}
                className="btn btn-outline"
              >
                {home.hero.secondaryCta}
              </InternalLink>
            </div>
            <div className="hero-links">
              <InternalLink to={home.hero.showreelHref || "/portfolio"}>
                <Icon name="play" size={16} color="#0056ff" />{" "}
                {home.hero.showreelLabel || "Watch Showreel"}
              </InternalLink>
              <InternalLink to={home.hero.portfolioHref || "/portfolio"}>
                <Icon name="image" size={16} color="#0056ff" />{" "}
                {home.hero.portfolioLabel || "View Portfolio"}
              </InternalLink>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{company.stats.projects}</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>{company.stats.clients}</strong>
                <span>Happy Clients</span>
              </div>
              <div>
                <strong>{company.stats.industries}</strong>
                <span>Industries</span>
              </div>
              <div>
                <strong>{company.stats.leads}</strong>
                <span>Leads</span>
              </div>
              <div>
                <strong>{company.stats.satisfaction}</strong>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            {dash && (
              <div className="dash-card">
                <h3>{dash.title}</h3>
                <p className="dash-meta">{dash.meta}</p>
                <div className="sparkline" />
                <div className="dash-metrics">
                  {dash.metrics.map((m) => (
                    <div key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {assist && (
              <div className="ai-assist">
                <h4>{assist.title}</h4>
                <p>{assist.body}</p>
                <div className="ai-assist-actions">
                  {assist.actions.map((a) => (
                    <InternalLink key={a.label} to={a.href}>
                      {a.label}
                    </InternalLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: "1.5rem" }}>
        <div className="container">
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              marginBottom: "0.85rem",
              fontWeight: 600,
            }}
          >
            {home.trustLabel}
          </p>
          <div className="logo-strip">
            {clientLogos.map((logo) => (
              <span key={logo} className="logo-chip">
                {logo}
              </span>
            ))}
          </div>
          <div className="logo-strip" style={{ marginTop: "0.85rem" }}>
            {partners.map((p) => (
              <span
                key={p}
                className="logo-chip"
                style={{ background: "#fff", border: "1px solid var(--border-soft)" }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section alt">
        <div className="container">
          <div className="stats-band">
            <div>
              <strong>{company.stats.projects}</strong>
              <span>Projects Delivered</span>
            </div>
            <div>
              <strong>{company.stats.leads}</strong>
              <span>Leads Generated</span>
            </div>
            <div>
              <strong>{company.stats.avgRoi}</strong>
              <span>Avg. ROI Increase</span>
            </div>
            <div>
              <strong>{company.stats.industries}</strong>
              <span>Industries Served</span>
            </div>
            <div>
              <strong>{company.stats.satisfaction}</strong>
              <span>Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2 className="section-title">{home.servicesTitle}</h2>
          <p className="section-sub">{home.servicesSub}</p>
          <div className="category-grid" style={{ marginTop: "1.5rem" }}>
            {serviceCards.map((service) => (
              <InternalLink
                key={service.title}
                to={service.href}
                className="category-card"
              >
                <span
                  className="icon-box"
                  style={{ background: `${service.color}18` }}
                >
                  <Icon name={service.icon} color={service.color} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <span className="arrow">
                  <Icon name="arrow" size={16} />
                </span>
              </InternalLink>
            ))}
            {allServices && (
              <InternalLink
                to={allServices.href}
                className="category-card"
                style={{ background: "var(--blue)", color: "#fff", border: 0 }}
              >
                <h3 style={{ color: "#fff" }}>{allServices.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.85)" }}>
                  {allServices.desc}
                </p>
                <span className="arrow" style={{ color: "#fff" }}>
                  <Icon name="arrow" size={16} color="#fff" />
                </span>
              </InternalLink>
            )}
          </div>
        </div>
      </section>

      {aiBanner && (
        <section className="home-section alt">
          <div className="container">
            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: "1.5rem",
                padding: "1.5rem",
                background: "linear-gradient(120deg,#050a1f,#0a1435)",
                color: "#fff",
                border: 0,
              }}
            >
              <div>
                <h2 className="section-title" style={{ color: "#fff" }}>
                  {aiBanner.title}
                </h2>
                <p
                  className="section-sub"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {aiBanner.sub}
                </p>
                <ul className="feature-list" style={{ marginTop: "1.25rem" }}>
                  {aiBanner.bullets.map((item) => (
                    <li key={item}>
                      <Icon name="check" color="#7dd3fc" />
                      <strong style={{ color: "#fff" }}>{item}</strong>
                    </li>
                  ))}
                </ul>
                <InternalLink
                  to={aiBanner.ctaHref}
                  className="btn btn-primary"
                  style={{ marginTop: "0.5rem" }}
                >
                  {aiBanner.ctaLabel}
                </InternalLink>
              </div>
              <div
                style={{
                  borderRadius: "16px",
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(124,58,237,0.45), transparent 55%), linear-gradient(160deg,#1e1b4b,#0f172a)",
                  minHeight: "220px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="brain" size={72} color="#c4b5fd" strokeWidth={1.2} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="container">
          <h2 className="section-title">
            {home.industriesTitle || "Tailored Solutions for Every Industry."}
          </h2>
          <div className="category-grid" style={{ marginTop: "1.25rem" }}>
            {industryCards.map((item) => (
              <InternalLink
                key={item!.slug}
                to={`/industries/${item!.slug}`}
                className="category-card"
              >
                <Icon name={item!.icon} color="#0056ff" />
                <h3>{item!.title}</h3>
                <p>{item!.summary}</p>
              </InternalLink>
            ))}
          </div>
          <div className="center-footer">
            <InternalLink
              to={home.industriesCtaHref || "/industries"}
              className="btn btn-outline"
            >
              {home.industriesCtaLabel || "View All Industries →"}
            </InternalLink>
          </div>
        </div>
      </section>

      <section className="home-section alt">
        <div className="container">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
            className="home-split"
          >
            <div>
              <h2 className="section-title">
                {home.challengesTitle || "We Solve Real Business Challenges"}
              </h2>
              <div style={{ display: "grid", gap: "0.65rem", marginTop: "1rem" }}>
                {challenges.map((item) => (
                  <InternalLink
                    key={item.href}
                    to={item.href}
                    className="category-card"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span className="icon-box" style={{ background: "#e8f0ff" }}>
                      <Icon name={item.icon} color="#0056ff" />
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3>{item.label}</h3>
                      <p>{item.desc}</p>
                    </div>
                    <Icon name="chevron" color="#0056ff" />
                  </InternalLink>
                ))}
              </div>
            </div>
            <div>
              <h2 className="section-title">
                {home.packagesTitle || "Featured Packages"}
              </h2>
              <p className="section-sub">
                {home.packagesSub || "Transparent pricing. Scalable plans."}
              </p>
              <div
                className="pricing-cards"
                style={{ marginTop: "1rem", gridTemplateColumns: "1fr 1fr" }}
              >
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`price-card ${pkg.highlighted ? "featured" : ""}`}
                  >
                    {pkg.badge && <span className="badge">{pkg.badge}</span>}
                    <h3>{pkg.name}</h3>
                    <div className="price">
                      {pkg.price}
                      <small>{pkg.period}</small>
                    </div>
                    <ul>
                      {pkg.features.map((f) => (
                        <li key={f}>
                          <Icon name="check" size={14} color="#16a34a" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <InternalLink
                      to={pkg.href}
                      className={`btn ${pkg.highlighted ? "btn-primary" : "btn-outline"} btn-sm`}
                    >
                      {pkg.ctaLabel || "View Details"}
                    </InternalLink>
                  </div>
                ))}
              </div>
              <div className="pill-row" style={{ marginTop: "1rem" }}>
                {(home.packagePills || []).map((pill) => (
                  <span key={pill} className="pill">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <h2 className="section-title">
              {home.toolsTitle || "Free Tools to Grow Faster"}
            </h2>
            <InternalLink
              to={home.toolsCtaHref || "/free-tools"}
              className="link-arrow"
            >
              {home.toolsCtaLabel || "Explore All Tools →"}
            </InternalLink>
          </div>
          <div className="category-grid" style={{ marginTop: "1.25rem" }}>
            {toolCards.map((cat) => (
              <InternalLink key={cat.title} to={cat.href} className="category-card">
                <span
                  className="icon-box"
                  style={{ background: `${cat.color}18` }}
                >
                  <Icon name={cat.icon} color={cat.color} />
                </span>
                <h3>{cat.title}</h3>
                <p>{cat.blurb}</p>
              </InternalLink>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section alt">
        <div className="container">
          <h2 className="section-title">
            {home.casesTitle || "Real Results. Proven Impact."}
          </h2>
          <div className="mini-grid-4" style={{ marginTop: "1.25rem" }}>
            {caseCards.map((item, i) => (
              <InternalLink
                key={item!.slug}
                to={`/case-studies/${item!.slug}`}
                className="featured-card"
              >
                <div
                  className="featured-media"
                  style={{ background: caseGradients[i % caseGradients.length] }}
                >
                  <span className="featured-tag" style={{ color: "#fff" }}>
                    {item!.category}
                  </span>
                </div>
                <div className="featured-body">
                  <p>{item!.eyebrow || item!.category}</p>
                  <h3>{item!.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {item!.summary}
                  </p>
                  <span className="link-arrow">View Case Study →</span>
                </div>
              </InternalLink>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2 className="section-title">
            {home.testimonialsTitle || "Loved by Clients. Proven by Results."}
          </h2>
          <div className="testimonial-grid" style={{ marginTop: "1.25rem" }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="stars">{"★".repeat(t.rating)}</div>
                <p>“{t.quote}”</p>
                <strong>{t.name}</strong>
                <span>{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section alt">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <h2 className="section-title">
              {home.insightsTitle || "Latest Insights"}
            </h2>
            <InternalLink
              to={home.insightsCtaHref || "/resources"}
              className="link-arrow"
            >
              {home.insightsCtaLabel || "View All Resources →"}
            </InternalLink>
          </div>
          <div className="blog-grid" style={{ marginTop: "1.25rem" }}>
            {insightLinks.map((post) => (
              <InternalLink
                key={post.href}
                to={post.href}
                className="featured-card"
              >
                <div
                  className="featured-media"
                  style={{ background: post.gradient }}
                />
                <div className="featured-body">
                  <p>{post.date}</p>
                  <h3>{post.title}</h3>
                  <span className="link-arrow">Read More →</span>
                </div>
              </InternalLink>
            ))}
          </div>
        </div>
      </section>

      {location?.enabled !== false && maps?.shareUrl && (
        <section className="home-section">
          <div className="container">
            <div className="home-location">
              <div>
                <p className="badge">Google Business Profile</p>
                <h2 className="section-title" style={{ marginTop: "0.65rem" }}>
                  {location?.title || "Visit DisplayAvenue in Mumbai"}
                </h2>
                <p className="section-sub">
                  {location?.sub ||
                    "Find us on Google Maps and Google Business Profile."}
                </p>
                <ul className="feature-list" style={{ marginTop: "1rem" }}>
                  <li>
                    <Icon name="building" color="#0056ff" />
                    <strong>
                      {(company.address.lines || []).join(", ") ||
                        company.address.city}
                    </strong>
                  </li>
                  <li>
                    <Icon name="clock" color="#0056ff" />
                    <strong>{company.address.hours}</strong>
                  </li>
                  <li>
                    <Icon name="phone" color="#0056ff" />
                    <strong>{company.phone}</strong>
                  </li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    marginTop: "1.25rem",
                  }}
                >
                  <a
                    href={maps.shareUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {location?.ctaLabel || "Open Google Business Profile"}
                  </a>
                  <a
                    href={maps.profileUrl || maps.shareUrl}
                    className="btn btn-outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {location?.directionsLabel || "Get Directions"}
                  </a>
                </div>
              </div>
              <div className="home-map-frame">
                <iframe
                  title={`${maps.name || company.name} on Google Maps`}
                  src={
                    maps.embedUrl ||
                    "https://maps.google.com/maps?q=Display+Avenue+Mumbai&hl=en&z=15&output=embed"
                  }
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .ai-assist-actions a {
          display: inline-flex;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          background: rgba(0, 86, 255, 0.08);
          color: var(--navy);
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
        }
        .ai-assist-actions a:hover { background: rgba(0, 86, 255, 0.16); }
        .home-location {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 1.5rem;
          align-items: stretch;
          background: #fff;
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .home-map-frame {
          border-radius: 14px;
          overflow: hidden;
          min-height: 280px;
          border: 1px solid var(--border-soft);
          background: #e8eef8;
        }
        .home-map-frame iframe {
          width: 100%;
          height: 100%;
          min-height: 280px;
          border: 0;
        }
        @media (max-width: 900px) {
          .home-split { grid-template-columns: 1fr !important; }
          .home-section .card { grid-template-columns: 1fr !important; }
          .home-location { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
