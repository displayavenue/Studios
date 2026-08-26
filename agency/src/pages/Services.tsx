import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { staticPageSeo } from "../data/pageSeo";
import "../styles/pages.css";

export function Services() {
  const { services, industries, packages } = useCms();
  const categories = Array.from(new Set(services.map((p) => p.category)));
  return (
    <div className="page-shell">
      <SEO
        title={staticPageSeo["/services"].title}
        description={staticPageSeo["/services"].description}
        path="/services"
        keywords={staticPageSeo["/services"].keywords}
      />
      <div className="container">
        <div className="page-frame" style={{ padding: "1.75rem" }}>
          <p className="badge">What We Do</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            {services.length}+ services to help you get more customers
          </h1>
          <p className="section-sub">
            Plain-English help for Google, ads, websites, branding, and AI tools.
            Pick a service below, or tell us your goal and we will recommend what
            fits your budget.
          </p>
          <div className="page-intro-extra">
            <p>
              Most owners start with{" "}
              <Link to="/services/seo">SEO</Link>,{" "}
              <Link to="/services/google-ads">Google Ads</Link>,{" "}
              <Link to="/services/social-media-marketing">Social Media</Link>, or{" "}
              <Link to="/services/web-development">Web Development</Link>. You can
              also browse{" "}
              <Link to="/packages">monthly packages</Link>,{" "}
              <Link to="/industries">industry plans</Link>,{" "}
              <Link to="/locations">city pages</Link>, and{" "}
              <Link to="/free-tools">free tools</Link>.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Request Custom Solution →
            </Link>
            <Link to="/locations/mumbai" className="btn btn-outline">
              Mumbai
            </Link>
            <Link to="/locations/navi-mumbai" className="btn btn-outline">
              Navi Mumbai
            </Link>
            <Link to="/locations/thane" className="btn btn-outline">
              Thane
            </Link>
            <Link to="/locations" className="btn btn-outline">
              All cities
            </Link>
            <Link to="/packages" className="btn btn-outline">
              View Packages
            </Link>
            <Link to="/case-studies" className="btn btn-ghost">
              See results
            </Link>
          </div>

          {categories.map((category) => {
            const items = services.filter((p) => p.category === category);
            return (
              <section key={category} style={{ marginTop: "2rem" }}>
                <h2 style={{ fontSize: "1.05rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                  {category}
                </h2>
                <div className="category-grid">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/services/${item.slug}`}
                      className="category-card"
                    >
                      <span
                        className="icon-box"
                        style={{ background: `${item.color}18` }}
                      >
                        <Icon name={item.icon} color={item.color} />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.summary.slice(0, 110)}…</p>
                      <span className="arrow">
                        <Icon name="arrow" size={14} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <section style={{ marginTop: "2.5rem" }}>
            <h2 className="section-title">Also explore</h2>
            <p className="section-sub">
              Match services with your industry, package, or a free checker.
            </p>
            <div className="category-grid" style={{ marginTop: "1rem" }}>
              {industries.slice(0, 6).map((item) => (
                <Link key={item.slug} to={`/industries/${item.slug}`} className="category-card">
                  <h3>{item.title}</h3>
                  <p>{item.summary.slice(0, 90)}…</p>
                </Link>
              ))}
              {packages.slice(0, 4).map((item) => (
                <Link key={item.slug} to={`/packages/${item.slug}`} className="category-card">
                  <h3>{item.title}</h3>
                  <p>{item.summary.slice(0, 90)}…</p>
                </Link>
              ))}
              <Link to="/locations" className="category-card">
                <h3>Services by city</h3>
                <p>Google Ads, SEO, Meta Ads and more across 23 Indian cities…</p>
              </Link>
              <Link to="/free-tools" className="category-card">
                <h3>Free growth tools</h3>
                <p>ROI calculator, SEO checklist, Strategy Maker, Data extractor…</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
