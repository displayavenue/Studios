import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function Industries() {
  const ref = useReveal<HTMLDivElement>();
  const { industries } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Wedding Styles We Cover | Hindu, Destination, Intimate & More"
        description="DisplayAvenue Studios covers Hindu, Christian, Muslim, Sikh, intimate and destination weddings across India with candid photography and cinematic films."
        path="/industries"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Wedding Styles</span>
          </nav>
          <p className="eyebrow">Wedding styles</p>
          <h1>Every celebration culture, one luxury standard</h1>
          <p>
            From Hindu pheras to destination palace weekends — we adapt ritual
            timing, family traditions and cinematic storytelling to your wedding
            style.
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
                <span className="text-link">Explore this style →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TestimonialsSection compact limit={3} />

      <CTABanner title="Planning a wedding in this style?" />
    </div>
  );
}
