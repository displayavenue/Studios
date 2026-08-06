import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

/** Hub listing every public page on the website */
export function AllPages() {
  const ref = useReveal<HTMLDivElement>();
  const {
    services,
    packageGroups,
    portfolio,
    industries,
    locations,
    blogs,
  } = useCms();

  const core = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Packages", path: "/packages" },
    { label: "Pricing", path: "/pricing" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Industries", path: "/industries" },
    { label: "Locations", path: "/locations" },
    { label: "Blog", path: "/blog" },
    { label: "FAQs", path: "/faqs" },
    { label: "Book Now", path: "/book-now" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Booking Policy", path: "/booking-policy" },
  ];

  return (
    <div ref={ref}>
      <SEO
        title="All Pages | DisplayAvenue Studios"
        description="Complete directory of DisplayAvenue Studios pages — services, packages, portfolio, industries, locations and blog."
        path="/pages"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>All Pages</span>
          </nav>
          <p className="eyebrow">Sitemap</p>
          <h1>Every page on DisplayAvenue Studios</h1>
          <p>
            Browse all core pages and individual service, package, industry,
            location, portfolio and blog pages.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container pages-directory">
          <div className="pages-block reveal">
            <h2>Main pages</h2>
            <ul className="pages-links">
              {core.map((p) => (
                <li key={p.path}>
                  <Link to={p.path}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pages-block reveal">
            <h2>Service pages ({services.length})</h2>
            <ul className="pages-links">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pages-block reveal">
            <h2>Package pages</h2>
            <ul className="pages-links">
              {packageGroups.map((g) => (
                <li key={g.slug}>
                  <Link to={`/packages/${g.slug}`}>{g.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pages-block reveal">
            <h2>Industry pages</h2>
            <ul className="pages-links">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link to={`/industries/${i.slug}`}>{i.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pages-block reveal">
            <h2>Location pages</h2>
            <ul className="pages-links">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link to={`/locations/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pages-block reveal">
            <h2>Portfolio pages</h2>
            <ul className="pages-links">
              {portfolio.map((p) => (
                <li key={p.slug}>
                  <Link to={`/portfolio/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pages-block reveal">
            <h2>Blog pages</h2>
            <ul className="pages-links">
              {blogs.map((b) => (
                <li key={b.slug}>
                  <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
