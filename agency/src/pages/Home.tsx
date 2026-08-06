import { Link } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { toolCategories } from "../data/tools";
import { homeDefaults, pickList } from "../data/homeDefaults";
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
  const { company, home, content, industries, cases, tools, projects } = useCms();
  const show = (key: string) => home.sections?.[key] !== false;
  const clientLogos = home.clientLogos?.length
    ? home.clientLogos
    : content.clientLogos;
  const testimonials = home.testimonials?.length
    ? home.testimonials
    : content.testimonials;
  const partners = pickList(home.partners, homeDefaults.partners);
  const serviceCards = pickList(home.services, homeDefaults.services);
  const allServices = home.allServicesCard || homeDefaults.allServicesCard;
  const aiBanner = home.aiBanner || homeDefaults.aiBanner;
  const challenges = pickList(home.challengeLinks, homeDefaults.challengeLinks);
  const businessSizeLinks = pickList(
    home.businessSizeLinks,
    homeDefaults.businessSizeLinks,
  );
  const packages = pickList(home.packages, homeDefaults.packages);
  const insightLinks = pickList(home.insightLinks, homeDefaults.insightLinks);
  const ratings = pickList(home.ratings, homeDefaults.ratings);
  const maps = company.googleMaps;
  const location = home.location || homeDefaults.location;

  const defaultHeroStats = [
    { value: company.stats.projects, label: "Projects" },
    { value: company.stats.clients, label: "Happy Clients" },
    { value: company.stats.industries, label: "Industries" },
    { value: company.stats.leads, label: "Leads" },
    { value: company.stats.satisfaction, label: "Satisfaction" },
  ];
  const heroStats = home.heroStats?.length ? home.heroStats : defaultHeroStats;
  const defaultStatsBand = [
    { value: company.stats.projects, label: "Projects Delivered" },
    { value: company.stats.leads, label: "Leads Generated" },
    { value: company.stats.avgRoi, label: "Avg. ROI Increase" },
    { value: company.stats.industries, label: "Industries Served" },
    { value: company.stats.satisfaction, label: "Client Satisfaction" },
  ];
  const statsBand = home.statsBand?.length ? home.statsBand : defaultStatsBand;

  const industryCards = pickList(home.industrySlugs, homeDefaults.industrySlugs)
    .map((slug) => industries.find((i) => i.slug === slug))
    .filter(Boolean);

  const caseCards = pickList(home.caseSlugs, homeDefaults.caseSlugs)
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter(Boolean);

  const portfolioCards = pickList(
    home.portfolioSlugs,
    homeDefaults.portfolioSlugs,
  )
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  const toolCards = pickList(
    home.toolCategorySlugs,
    homeDefaults.toolCategorySlugs,
  )
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
  const dash = home.heroDashboard || homeDefaults.heroDashboard;
  const assist = home.aiAssist || homeDefaults.aiAssist;

  const caseGradients = [
    "linear-gradient(135deg,#0ea5e9,#0369a1)",
    "linear-gradient(135deg,#8b5cf6,#4c1d95)",
    "linear-gradient(135deg,#f97316,#c2410c)",
    "linear-gradient(135deg,#10b981,#047857)",
  ];

  return (
    <>
      <SEO title={seoTitle} description={seoDesc} path="/" />
      {show("hero") && (
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
            {show("heroStats") && (
            <div className="hero-stats">
              {heroStats.map((stat) => (
                <div key={`${stat.label}-${stat.value}`}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            )}
          </div>

          {show("heroDashboard") || show("aiAssist") ? (
          <div className="hero-visual">
            {show("heroDashboard") && (
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
            {show("aiAssist") && (
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
          ) : null}
        </div>
      </section>
      )}

      {show("trust") && (
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
      )}

      {show("statsBand") && (
      <section className="home-section alt">
        <div className="container">
          <div className="stats-band">
            {statsBand.map((stat) => (
              <div key={`${stat.label}-${stat.value}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {show("services") && (
      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">{home.servicesTitle}</h2>
              <p className="section-sub">{home.servicesSub}</p>
            </div>
            <InternalLink
              to={home.servicesViewAllHref || "/services"}
              className="link-arrow"
            >
              {home.servicesViewAllLabel || "View All Services →"}
            </InternalLink>
          </div>
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
            <InternalLink
              to={allServices.href}
              className="category-card"
              style={{ background: "var(--blue)", color: "#fff", border: 0 }}
            >
              <h3 style={{ color: "#fff" }}>{allServices.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.85)" }}>{allServices.desc}</p>
              <span className="arrow" style={{ color: "#fff" }}>
                <Icon name="arrow" size={16} color="#fff" />
              </span>
            </InternalLink>
          </div>
        </div>
      </section>
      )}

      {show("aiBanner") && (
      <section className="home-section alt">
        <div className="container">
          <div className="ai-platform-banner">
            <div className="ai-platform-copy">
              <h2 className="section-title ai-platform-title">{aiBanner.title}</h2>
              <p className="section-sub ai-platform-sub">{aiBanner.sub}</p>
              <ul className="feature-list ai-platform-bullets">
                {aiBanner.bullets.map((item, i) => (
                  <li key={item} style={{ ["--i" as string]: i }}>
                    <span className="ai-check">
                      <Icon name="check" color="#7dd3fc" size={16} />
                    </span>
                    <strong>{item}</strong>
                  </li>
                ))}
              </ul>
              <InternalLink
                to={aiBanner.ctaHref}
                className="btn btn-primary ai-platform-cta"
              >
                {aiBanner.ctaLabel}
              </InternalLink>
            </div>
            <div className="ai-platform-visual" aria-hidden="true">
              <div className="ai-glow" />
              <div className="ai-orbit ai-orbit-a" />
              <div className="ai-orbit ai-orbit-b" />
              <div className="ai-code-mark">
                <span className="ai-brace">{"{"}</span>
                <span className="ai-caret" />
                <span className="ai-brace">{"}"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {show("industries") && (
      <section className="home-section">
        <div className="container">
          <h2 className="section-title">
            {home.industriesTitle || "Tailored Solutions for Every Industry."}
          </h2>
          <div className="industry-grid" style={{ marginTop: "1.25rem" }}>
            {industryCards.map((item) => (
              <InternalLink
                key={item!.slug}
                to={`/industries/${item!.slug}`}
                className="industry-chip"
              >
                <span className="industry-icon">
                  <Icon name={item!.icon} color="#0056ff" />
                </span>
                <strong>{item!.title}</strong>
              </InternalLink>
            ))}
            <InternalLink
              to={home.industriesCtaHref || "/industries"}
              className="industry-chip more"
            >
              <span className="industry-icon">
                <Icon name="grid" color="#0056ff" />
              </span>
              <strong>{home.industriesMoreLabel || "More Industries"}</strong>
            </InternalLink>
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
      )}

      {show("solutions") && (
      <section className="home-section alt">
        <div className="container">
          <div className="home-split solutions-split">
            <div>
              <h2 className="section-title">
                {home.challengesTitle || "Solutions by Goal"}
              </h2>
              <div className="link-stack">
                {challenges.map((item) => (
                  <InternalLink
                    key={item.href}
                    to={item.href}
                    className="category-card row-card"
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
              <InternalLink
                to={home.challengesViewAllHref || "/solutions"}
                className="link-arrow"
                style={{ marginTop: "0.85rem" }}
              >
                {home.challengesViewAllLabel || "View All Goal Solutions →"}
              </InternalLink>
            </div>
            <div>
              <h2 className="section-title">
                {home.businessSizeTitle || "Solutions by Business Size"}
              </h2>
              <div className="link-stack">
                {businessSizeLinks.map((item) => (
                  <InternalLink
                    key={item.href}
                    to={item.href}
                    className="category-card row-card"
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
              <InternalLink
                to={home.businessSizeViewAllHref || "/solutions"}
                className="link-arrow"
                style={{ marginTop: "0.85rem" }}
              >
                {home.businessSizeViewAllLabel || "View All Size Solutions →"}
              </InternalLink>
            </div>
          </div>
        </div>
      </section>
      )}

      {show("packages") && (
      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">
                {home.packagesTitle || "Featured Packages"}
              </h2>
              <p className="section-sub">
                {home.packagesSub || "Transparent pricing. Scalable plans."}
              </p>
            </div>
            <InternalLink
              to={home.packagesCompareHref || "/packages"}
              className="link-arrow"
            >
              {home.packagesCompareLabel || "Compare All Packages →"}
            </InternalLink>
          </div>
          <div className="pricing-cards" style={{ marginTop: "1.25rem" }}>
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
            {pickList(home.packagePills, homeDefaults.packagePills).map((pill) => (
              <span key={pill} className="pill">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>
      )}

      {(show("aiBanner") || show("tools")) && (
      <section className="home-section alt">
        <div className="container">
          <div className="home-split">
            {show("aiBanner") && (
            <div className="card ecosystem-card">
              <h2 className="section-title">{aiBanner.title}</h2>
              <p className="section-sub">{aiBanner.sub}</p>
              <ul className="feature-list" style={{ marginTop: "1rem" }}>
                {aiBanner.bullets.map((item) => (
                  <li key={item}>
                    <Icon name="check" color="#0056ff" />
                    <strong>{item}</strong>
                  </li>
                ))}
              </ul>
              <InternalLink to={aiBanner.ctaHref || "/ai-platform"} className="btn btn-primary">
                {aiBanner.ctaLabel || "Explore AI Platform →"}
              </InternalLink>
            </div>
            )}
            {show("tools") && (
            <div>
              <div className="section-head">
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
              <div className="category-grid tools-grid" style={{ marginTop: "1rem" }}>
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
            )}
          </div>
        </div>
      </section>
      )}

      {show("cases") && (
      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">
              {home.casesTitle || "Real Results. Proven Impact."}
            </h2>
            <InternalLink
              to={home.casesViewAllHref || "/case-studies"}
              className="link-arrow"
            >
              {home.casesViewAllLabel || "View All Case Studies →"}
            </InternalLink>
          </div>
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
                  <span className="featured-tag">
                    {item!.category}
                  </span>
                </div>
                <div className="featured-body">
                  <p>{item!.eyebrow || item!.category}</p>
                  <h3>{item!.industry || item!.category}</h3>
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
      )}

      {show("portfolio") && (
      <section className="home-section alt">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">
              {home.portfolioTitle || "Creativity That Delivers Results."}
            </h2>
            <InternalLink
              to={home.portfolioCtaHref || "/portfolio"}
              className="link-arrow"
            >
              {home.portfolioCtaLabel || "View Full Portfolio →"}
            </InternalLink>
          </div>
          <div className="mini-grid-4" style={{ marginTop: "1.25rem" }}>
            {portfolioCards.map((item, i) => (
              <InternalLink
                key={item!.slug}
                to={`/portfolio/${item!.slug}`}
                className="featured-card"
              >
                <div
                  className="featured-media"
                  style={{ background: caseGradients[(i + 1) % caseGradients.length] }}
                >
                  <span className="featured-tag">
                    {item!.category}
                  </span>
                </div>
                <div className="featured-body">
                  <p>{item!.category}</p>
                  <h3>{item!.industry || item!.category}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {item!.summary}
                  </p>
                  <span className="link-arrow">View Project →</span>
                </div>
              </InternalLink>
            ))}
          </div>
        </div>
      </section>
      )}

      {show("testimonials") && (
      <section className="home-section">
        <div className="container">
          <h2 className="section-title">
            {home.testimonialsTitle || "Loved by Clients. Proven by Results."}
          </h2>
          <div className="rating-row">
            {ratings.map((r) => (
              <div key={r.label} className="rating-chip">
                <strong>{r.label}</strong>
                <span>{r.score}</span>
              </div>
            ))}
          </div>
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
      )}

      {show("insights") && (
      <section className="home-section alt">
        <div className="container">
          <div className="section-head">
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
      )}

      {show("location") && location?.enabled !== false && maps?.shareUrl && (
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
                    href={maps.profileUrl || maps.shareUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {location?.ctaLabel || "Open Google Business Profile"}
                  </a>
                  <a
                    href={
                      maps.directionsUrl ||
                      (maps.lat != null && maps.lng != null
                        ? `https://www.google.com/maps/dir/?api=1&destination=${maps.lat},${maps.lng}&travelmode=driving`
                        : maps.shareUrl)
                    }
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
                    (maps.lat != null && maps.lng != null
                      ? `https://maps.google.com/maps?q=${maps.lat},${maps.lng}+(${encodeURIComponent(maps.name || company.name)})&hl=en&z=17&output=embed`
                      : "https://maps.google.com/maps?q=Display+Avenue,+Arch+Garden,+Kashimira,+Mira+Road+East&hl=en&z=17&output=embed")
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
        .section-head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .link-stack {
          display: grid;
          gap: 0.65rem;
          margin-top: 1rem;
        }
        .row-card {
          flex-direction: row !important;
          align-items: center !important;
          gap: 0.75rem !important;
        }
        .industry-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.85rem;
        }
        .industry-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.55rem;
          text-align: center;
          text-decoration: none;
          color: var(--navy);
          background: #fff;
          border: 1px solid var(--border-soft);
          border-radius: 16px;
          padding: 1rem 0.7rem;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .industry-chip:hover {
          transform: translateY(-2px);
          border-color: #bfd0ff;
          box-shadow: var(--shadow-sm);
        }
        .industry-chip.more {
          border-style: dashed;
          color: var(--blue);
        }
        .industry-icon {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #e8f0ff;
        }
        .rating-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .rating-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #fff;
          border: 1px solid var(--border-soft);
          border-radius: 999px;
          padding: 0.45rem 0.85rem;
          font-size: 0.9rem;
        }
        .rating-chip strong { color: var(--navy); }
        .rating-chip span { color: var(--text-muted); font-weight: 600; }
        .ecosystem-card {
          padding: 1.35rem;
          background: #fff;
        }
        .tools-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
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
        .home-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
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

        /* AI Platform banner */
        .ai-platform-banner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          background: linear-gradient(120deg, #050a1f, #0a1435);
          color: #fff;
          overflow: hidden;
          position: relative;
        }
        .ai-platform-title { color: #fff; }
        .ai-platform-sub { color: rgba(255,255,255,0.75); }
        .ai-platform-bullets {
          margin-top: 1.25rem;
        }
        .ai-platform-bullets li {
          color: #fff;
          opacity: 0;
          transform: translateX(-12px);
          animation: ai-bullet-in 0.55s ease forwards;
          animation-delay: calc(0.15s + var(--i, 0) * 0.12s);
        }
        .ai-platform-bullets strong { color: #fff; }
        .ai-check {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(125, 211, 252, 0.14);
          flex-shrink: 0;
          animation: ai-check-pop 0.45s ease both;
          animation-delay: calc(0.28s + var(--i, 0) * 0.12s);
        }
        .ai-platform-cta {
          margin-top: 0.85rem;
          box-shadow: 0 0 0 0 rgba(0, 86, 255, 0.45);
          animation: ai-cta-glow 2.4s ease-in-out infinite;
          animation-delay: 1s;
        }
        .ai-platform-visual {
          position: relative;
          border-radius: 16px;
          min-height: 240px;
          display: grid;
          place-items: center;
          background: linear-gradient(160deg, #1e1b4b, #0f172a);
          overflow: hidden;
          isolation: isolate;
        }
        .ai-glow {
          position: absolute;
          inset: -20%;
          background: radial-gradient(circle at 50% 45%, rgba(124, 58, 237, 0.55), transparent 58%);
          animation: ai-glow-breathe 3.6s ease-in-out infinite;
          pointer-events: none;
        }
        .ai-orbit {
          position: absolute;
          border: 1px solid rgba(196, 181, 253, 0.28);
          border-radius: 999px;
          pointer-events: none;
        }
        .ai-orbit-a {
          width: 150px;
          height: 150px;
          animation: ai-spin 14s linear infinite;
        }
        .ai-orbit-b {
          width: 210px;
          height: 210px;
          border-style: dashed;
          border-color: rgba(125, 211, 252, 0.22);
          animation: ai-spin 22s linear infinite reverse;
        }
        .ai-code-mark {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: clamp(2.4rem, 5vw, 3.4rem);
          font-weight: 700;
          color: #e9e0ff;
          letter-spacing: 0.04em;
          animation: ai-float 3.2s ease-in-out infinite;
          text-shadow: 0 0 28px rgba(167, 139, 250, 0.55);
        }
        .ai-brace { opacity: 0.95; }
        .ai-caret {
          width: 3px;
          height: 1.05em;
          border-radius: 2px;
          background: #c4b5fd;
          box-shadow: 0 0 12px rgba(196, 181, 253, 0.9);
          animation: ai-blink 1.05s steps(1, end) infinite;
        }

        @keyframes ai-glow-breathe {
          0%, 100% { transform: scale(0.92); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes ai-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ai-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ai-blink {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes ai-bullet-in {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ai-check-pop {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ai-cta-glow {
          0%, 100% { box-shadow: 0 4px 14px rgba(0, 86, 255, 0.28); }
          50% { box-shadow: 0 6px 28px rgba(0, 86, 255, 0.55); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-glow,
          .ai-orbit,
          .ai-code-mark,
          .ai-caret,
          .ai-platform-bullets li,
          .ai-check,
          .ai-platform-cta {
            animation: none !important;
          }
          .ai-platform-bullets li { opacity: 1; transform: none; }
        }

        @media (max-width: 1100px) {
          .industry-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .home-split { grid-template-columns: 1fr !important; }
          .home-section .card { grid-template-columns: 1fr !important; }
          .ai-platform-banner { grid-template-columns: 1fr; }
          .ai-platform-visual { min-height: 200px; }
          .home-location { grid-template-columns: 1fr; }
          .industry-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .tools-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .industry-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </>
  );
}
