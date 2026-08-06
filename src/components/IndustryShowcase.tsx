import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./IndustryShowcase.css";

export function IndustryShowcase() {
  const { industries } = useCms();

  return (
    <section className="section section--light">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Industries</p>
          <h2>Production experience across every major sector</h2>
          <p>
            From palace weddings to factory floors and five-star resorts — our crews
            adapt to your industry&apos;s pace, permissions and deliverables.
          </p>
        </div>
        <div className="industry-showcase">
          {industries.slice(0, 6).map((ind) => (
            <Link
              key={ind.slug}
              to={`/industries/${ind.slug}`}
              className="industry-showcase__card reveal"
            >
              <img src={ind.image} alt="" loading="lazy" />
              <div>
                <h3>{ind.title}</h3>
                <p>{ind.text}</p>
                {"projectCount" in ind && ind.projectCount ? (
                  <span className="industry-showcase__count">
                    {String(ind.projectCount)}+ projects
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
        <div className="section-cta reveal">
          <Link to="/industries" className="btn btn--dark">
            Explore all industries
          </Link>
          <Link to="/portfolio" className="btn btn--outline">
            View portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
