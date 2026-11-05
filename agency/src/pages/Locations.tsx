import { Link } from "react-router-dom";
import { SEO, BreadcrumbSchema } from "../components/SEO";
import { seoCities, seoServices, locationPath } from "../data/locations";
import "../styles/pages.css";

export function LocationsHub() {
  return (
    <div className="page-shell">
      <SEO
        title="Digital Marketing by City in India | DisplayAvenue"
        description="Google Ads, Meta Ads, SEO, Local SEO, and websites for businesses across Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad, and more Indian cities."
        path="/locations"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />
      <div className="container">
        <div className="page-frame" style={{ maxWidth: 1100 }}>
          <p className="badge">Free-traffic SEO hub</p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Digital growth services by city
          </h1>
          <p className="section-sub">
            Explore DisplayAvenue’s Google Ads, Meta Ads, SEO, Local SEO, social, websites, and lead
            generation pages for major Indian cities. Built to rank, convert, and route enquiries to
            WhatsApp.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "1.25rem 0 1.75rem" }}>
            <a className="btn btn-primary btn-sm" href="https://displayavenue.com/strategy/">
              Free Strategy Maker
            </a>
            <a className="btn btn-outline btn-sm" href="https://displayavenue.com/data/">
              Free Data Lead Tool
            </a>
            <Link className="btn btn-outline btn-sm" to="/free-tools">
              All free tools
            </Link>
            <Link className="btn btn-outline btn-sm" to="/contact">
              Book consultation
            </Link>
          </div>

          <h2 style={{ fontSize: "1.15rem", color: "var(--navy)" }}>Services we localize</h2>
          <div className="mini-grid-4" style={{ marginTop: "0.75rem", marginBottom: "2rem" }}>
            {seoServices.map((s) => (
              <div key={s.slug} className="tool-card" style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>{s.name}</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>{s.short}</p>
                <Link to={s.serviceHref} className="link-arrow" style={{ marginTop: "0.55rem", display: "inline-block" }}>
                  Service page →
                </Link>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.15rem", color: "var(--navy)" }}>Cities</h2>
          <div className="mini-grid-4" style={{ marginTop: "0.75rem" }}>
            {seoCities.map((city) => (
              <Link
                key={city.slug}
                to={locationPath(city.slug)}
                className="tool-card"
                style={{ padding: "1rem", textDecoration: "none", color: "inherit", display: "block" }}
              >
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.05rem", color: "var(--navy)" }}>
                  {city.name}
                </h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.84rem" }}>
                  {city.state} · {seoServices.length} service pages
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
