import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { portfolio, portfolioCategories } from "../data/portfolio";
import "./Page.css";

export function Portfolio() {
  const ref = useReveal<HTMLDivElement>();
  const [category, setCategory] = useState("All");

  const items = useMemo(
    () =>
      category === "All"
        ? portfolio
        : portfolio.filter((p) => p.category === category),
    [category],
  );

  return (
    <div ref={ref}>
      <SEO
        title="Portfolio | DisplayAvenue Studios"
        description="Explore luxury wedding, corporate, product, drone, hotel and event portfolio projects by DisplayAvenue Studios."
        path="/portfolio"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Portfolio</span>
          </nav>
          <p className="eyebrow">Portfolio</p>
          <h1>Selected work across weddings, brands and spaces</h1>
          <p>
            Every project page highlights craft, location and outcomes — built
            for inspiration and SEO discovery.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-row reveal" role="tablist" aria-label="Portfolio categories">
            {portfolioCategories.map((c) => (
              <button
                key={c}
                type="button"
                className={category === c ? "is-active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="masonry" style={{ marginTop: "2rem" }}>
            {items.map((item) => (
              <Link
                key={item.slug}
                to={`/portfolio/${item.slug}`}
                className="masonry__item reveal"
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="masonry__overlay" style={{ opacity: 1, transform: "none" }}>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <em>{item.location}</em>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title="Want work like this for your date or brand?" />
    </div>
  );
}
