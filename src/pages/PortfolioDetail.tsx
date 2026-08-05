import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function PortfolioDetail() {
  const { slug } = useParams();
  const { portfolio } = useCms();
  const item = portfolio.find((p) => p.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!item) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Project not found</h1>
          <Link to="/portfolio" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            Back to Portfolio
          </Link>
        </div>
      </section>
    );
  }

  const related = portfolio.filter((p) => p.slug !== item.slug && p.category === item.category).slice(0, 3);

  return (
    <div ref={ref}>
      <SEO
        title={`${item.title} | Portfolio | DisplayAvenue Studios`}
        description={item.description}
        path={`/portfolio/${item.slug}`}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/portfolio">Portfolio</Link>
            <span>/</span>
            <span>{item.title}</span>
          </nav>
          <p className="eyebrow">
            {item.category} · {item.location}
          </p>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="container project-gallery">
          <img className="reveal" src={item.image} alt={item.title} />
          <div className="project-gallery__grid">
            {item.gallery.map((src) => (
              <img key={src} className="reveal" src={src} alt={`${item.title} gallery`} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">More {item.category}</p>
              <h2>Related projects</h2>
            </div>
            <div className="blog-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`/portfolio/${r.slug}`} className="blog-card card reveal">
                  <div className="blog-card__img">
                    <img src={r.image} alt={r.title} loading="lazy" />
                  </div>
                  <div className="blog-card__body">
                    <span>{r.location}</span>
                    <h3>{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </div>
  );
}
