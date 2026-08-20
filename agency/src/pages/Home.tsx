import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { homeServices } from "../data/services";
import { industries } from "../data/industries";
import { featuredHomePackages } from "../data/packages";
import { toolCategories } from "../data/tools";
import { featuredCaseStudies } from "../data/work";
import { blogPosts } from "../data/content";
import { solutionCategories } from "../data/solutions";
import "../styles/pages.css";

const partners = [
  "Google Partner",
  "Meta Business Partner",
  "HubSpot",
  "Clutch",
  "GoodFirms",
  "DesignRush",
  "Shopify",
  "AWS",
];

export function Home() {
  const { company, home, content } = useCms();
  const clientLogos = content.clientLogos;
  const testimonials = content.testimonials;
  const seoTitle =
    home.seo?.title ||
    `${company.name} | Digital Growth. AI Powered.`;
  const seoDesc =
    home.seo?.description ||
    home.hero.lead;
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
              <Link to="/contact" className="btn btn-primary">
                {home.hero.primaryCta}
              </Link>
              <Link to="/contact" className="btn btn-outline">
                {home.hero.secondaryCta}
              </Link>
            </div>
            <div className="hero-links">
              <Link to="/portfolio">
                <Icon name="play" size={16} color="#0056ff" /> Watch Showreel
              </Link>
              <Link to="/portfolio">
                <Icon name="image" size={16} color="#0056ff" /> View Portfolio
              </Link>
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
            <div className="dash-card">
              <h3>Campaign Performance</h3>
              <p className="dash-meta">This Month · Revenue Generated</p>
              <div className="sparkline" />
              <div className="dash-metrics">
                <div>
                  <strong>₹2.45 Cr</strong>
                  <span>+24.5% trend</span>
                </div>
                <div>
                  <strong>12,458</strong>
                  <span>Leads Generated</span>
                </div>
                <div>
                  <strong>3.20X</strong>
                  <span>ROAS</span>
                </div>
              </div>
            </div>
            <div className="ai-assist">
              <h4>AI Assistant</h4>
              <p>Ask for a strategy, audit, or creative brief instantly.</p>
              <div className="ai-assist-actions">
                <span>Generate Strategy</span>
                <span>Analyze Website</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: "1.5rem" }}>
        <div className="container">
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "0.85rem", fontWeight: 600 }}>
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
              <span key={p} className="logo-chip" style={{ background: "#fff", border: "1px solid var(--border-soft)" }}>
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
            {homeServices.map((service) => (
              <Link key={service.title} to={service.href} className="category-card">
                <span className="icon-box" style={{ background: `${service.color}18` }}>
                  <Icon name={service.icon} color={service.color} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <span className="arrow">
                  <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
            <Link
              to="/services"
              className="category-card"
              style={{ background: "var(--blue)", color: "#fff", border: 0 }}
            >
              <h3 style={{ color: "#fff" }}>See All Services</h3>
              <p style={{ color: "rgba(255,255,255,0.85)" }}>
                Explore 300+ services across marketing, product, and AI.
              </p>
              <span className="arrow" style={{ color: "#fff" }}>
                <Icon name="arrow" size={16} color="#fff" />
              </span>
            </Link>
          </div>
        </div>
      </section>

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
                Smarter Solutions. Powered by AI.
              </h2>
              <p className="section-sub" style={{ color: "rgba(255,255,255,0.75)" }}>
                Deploy AI across marketing, sales, content, and operations with
                the DisplayAvenue AI Platform.
              </p>
              <ul className="feature-list" style={{ marginTop: "1.25rem" }}>
                {["SEO Optimizer", "Content Generator", "Ad Copy AI", "Chatbot Builder", "Workflow Automation"].map(
                  (item) => (
                    <li key={item}>
                      <Icon name="check" color="#7dd3fc" />
                      <strong style={{ color: "#fff" }}>{item}</strong>
                    </li>
                  ),
                )}
              </ul>
              <Link to="/ai-platform" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                Explore AI Platform →
              </Link>
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

      <section className="home-section">
        <div className="container">
          <h2 className="section-title">Tailored Solutions for Every Industry.</h2>
          <div className="category-grid" style={{ marginTop: "1.25rem" }}>
            {industries.slice(0, 12).map((item) => (
              <Link key={item.slug} to={`/industries/${item.slug}`} className="category-card">
                <Icon name={item.icon} color="#0056ff" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
          <div className="center-footer">
            <Link to="/industries" className="btn btn-outline">
              View All Industries →
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section alt">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="home-split">
            <div>
              <h2 className="section-title">We Solve Real Business Challenges</h2>
              <div style={{ display: "grid", gap: "0.65rem", marginTop: "1rem" }}>
                {solutionCategories[0].links.map((item, i) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="category-card"
                    style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}
                  >
                    <span className="icon-box" style={{ background: "#e8f0ff" }}>
                      <Icon name={["target", "growth", "brand", "phone", "dollar"][i] ?? "target"} color="#0056ff" />
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3>{item.label}</h3>
                      <p>Goal-oriented solutions built for measurable outcomes.</p>
                    </div>
                    <Icon name="chevron" color="#0056ff" />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="section-title">Featured Packages</h2>
              <p className="section-sub">Transparent pricing. Scalable plans.</p>
              <div className="pricing-cards" style={{ marginTop: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                {featuredHomePackages.map((pkg) => (
                  <div key={pkg.name} className={`price-card ${pkg.highlighted ? "featured" : ""}`}>
                    {"badge" in pkg && pkg.badge && <span className="badge">{pkg.badge}</span>}
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
                    <Link to="/packages" className={`btn ${pkg.highlighted ? "btn-primary" : "btn-outline"} btn-sm`}>
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
              <div className="pill-row" style={{ marginTop: "1rem" }}>
                <span className="pill">No Setup Fee</span>
                <span className="pill">Transparent Pricing</span>
                <span className="pill">100% ROI Focused</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h2 className="section-title">Free Tools to Grow Faster</h2>
            <Link to="/free-tools" className="link-arrow">
              Explore All Tools →
            </Link>
          </div>
          <div className="category-grid" style={{ marginTop: "1.25rem" }}>
            {toolCategories.slice(0, 6).map((cat) => (
              <Link key={cat.title} to={cat.href} className="category-card">
                <span className="icon-box" style={{ background: `${cat.color}18` }}>
                  <Icon name={cat.icon} color={cat.color} />
                </span>
                <h3>{cat.title}</h3>
                <p>{cat.tools.slice(0, 3).join(" · ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section alt">
        <div className="container">
          <h2 className="section-title">Real Results. Proven Impact.</h2>
          <div className="mini-grid-4" style={{ marginTop: "1.25rem" }}>
            {featuredCaseStudies.map((item) => (
              <Link key={item.href} to={item.href} className="featured-card">
                <div className="featured-media" style={{ background: item.gradient }}>
                  <span className="featured-tag" style={{ color: item.tagColor }}>
                    {item.tag}
                  </span>
                </div>
                <div className="featured-body">
                  <p>{item.client}</p>
                  <h3>{item.title}</h3>
                  <div className="metric-row">
                    {item.metrics.map((m) => (
                      <span key={m} className="metric-chip">
                        {m}
                      </span>
                    ))}
                  </div>
                  <span className="link-arrow">View Case Study →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2 className="section-title">Loved by Clients. Proven by Results.</h2>
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h2 className="section-title">Latest Insights</h2>
            <Link to="/resources" className="link-arrow">
              View All Resources →
            </Link>
          </div>
          <div className="blog-grid" style={{ marginTop: "1.25rem" }}>
            {blogPosts.map((post) => (
              <Link key={post.href} to={post.href} className="featured-card">
                <div className="featured-media" style={{ background: post.gradient }} />
                <div className="featured-body">
                  <p>{post.date}</p>
                  <h3>{post.title}</h3>
                  <span className="link-arrow">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .home-split { grid-template-columns: 1fr !important; }
          .home-section .card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
