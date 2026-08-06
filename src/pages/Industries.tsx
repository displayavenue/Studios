import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function Industries() {
  const ref = useReveal<HTMLDivElement>();
  const { industries } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Industries We Serve | DisplayAvenue Studios"
        description="Visual production for manufacturing, healthcare, hotels, restaurants, education, fashion, real estate, government and NGOs across India."
        path="/industries"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Industries</span>
          </nav>
          <p className="eyebrow">Industries</p>
          <h1>Sector expertise with a luxury studio standard</h1>
          <p>
            We adapt creative direction, permissions and delivery formats to
            the realities of each industry - without compromising craft.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container industries-grid">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              to={`/industries/${ind.slug}`}
              className="industry-card card reveal"
            >
              <img src={ind.image} alt={ind.title} loading="lazy" />
              <div>
                <h2>{ind.title}</h2>
                <p>{ind.text}</p>
                <span className="text-link">Open industry page →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTABanner title="Building visuals for your industry?" />
    </div>
  );
}
