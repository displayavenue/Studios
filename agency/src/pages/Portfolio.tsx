import { Link } from "react-router-dom";
import type { RefObject } from "react";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { MobileSwipeRail, LogoMarquee } from "../components/motion/MotionBits";
import {
  portfolioCategories,
  featuredProjects,
  portfolioStats,
  portfolioTrustBar,
  clientLogos,
} from "../data/work";
import "../styles/pages.css";
import "./Portfolio.css";

export function Portfolio() {
  const revealRef = useReveal();
  return (
    <div className="page-shell portfolio-page" ref={revealRef as RefObject<HTMLDivElement>}>
      <SEO title="Portfolio | DisplayAvenue" description="Websites, apps, branding, and campaigns delivered by DisplayAvenue." path="/portfolio" />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <h1 className="section-title reveal-up">
                Our Work.{" "}
                <span style={{ color: "var(--blue)" }}>Your Next Advantage.</span>
              </h1>
              <p className="reveal-up reveal-delay-1">
                A portfolio of websites, campaigns, products, and brand systems
                that drive measurable growth.
              </p>
              <ul className="feature-list">
                {[
                  { icon: "star", title: "Diverse Expertise", color: "#0056ff" },
                  { icon: "target", title: "Results Driven", color: "#16a34a" },
                  { icon: "bolt", title: "Creative & Innovative", color: "#f97316" },
                  { icon: "code", title: "End-to-End Delivery", color: "#7c3aed" },
                ].map((item, i) => (
                  <li key={item.title} className={`reveal-up reveal-delay-${Math.min(i + 1, 4)}`}>
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} />
                    </span>
                    <strong>{item.title}</strong>
                  </li>
                ))}
              </ul>
              <div className="cta-box reveal-up">
                <h4>Have a project in mind?</h4>
                <p>Let's build something amazing together.</p>
                <Link to="/contact" className="btn btn-primary btn-sm btn-shimmer">
                  Start Your Project
                  <span className="btn-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            </aside>

            <div>
              <h2 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Explore Our Work by Category
              </h2>
              <div className="category-grid portfolio-cats-desktop" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                {portfolioCategories.map((item) => (
                  <Link key={item.title} to="/portfolio" className="category-card">
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} size={16} />
                    </span>
                    <h3>{item.title}</h3>
                    <p className="meta">{item.count} Projects</p>
                  </Link>
                ))}
              </div>
              <div className="portfolio-cats-mobile">
                <MobileSwipeRail label="Portfolio categories">
                  {portfolioCategories.map((item) => (
                    <Link key={item.title} to="/portfolio" className="category-card portfolio-swipe-card">
                      <span className="icon-box" style={{ background: `${item.color}18` }}>
                        <Icon name={item.icon} color={item.color} size={16} />
                      </span>
                      <h3>{item.title}</h3>
                      <p className="meta">{item.count} Projects</p>
                    </Link>
                  ))}
                </MobileSwipeRail>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", margin: "1.5rem 0 0.75rem" }}>
                <h2 style={{ fontSize: "0.95rem", color: "var(--navy)" }}>Featured Projects</h2>
                <Link to="/portfolio" className="link-arrow portfolio-view-all-desktop">
                  View All Projects →
                </Link>
              </div>
              <div className="mini-grid-4 portfolio-featured-desktop" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                {featuredProjects.map((item) => (
                  <Link key={item.href} to={item.href} className="featured-card">
                    <div className="featured-media" style={{ background: item.gradient, height: "140px" }}>
                      <span className="featured-tag">{item.tag}</span>
                    </div>
                    <div className="featured-body">
                      <p>{item.client}</p>
                      <h3>{item.desc}</h3>
                      <div className="metric-row">
                        {item.metrics.map((m) => (
                          <span key={m} className="metric-chip">
                            {m}
                          </span>
                        ))}
                      </div>
                      <span className="link-arrow">View Project →</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="portfolio-featured-mobile">
                <MobileSwipeRail label="Featured projects">
                  {featuredProjects.map((item) => (
                    <Link key={item.href} to={item.href} className="featured-card portfolio-swipe-card">
                      <div className="featured-media" style={{ background: item.gradient, height: "140px" }}>
                        <span className="featured-tag">{item.tag}</span>
                      </div>
                      <div className="featured-body">
                        <p>{item.client}</p>
                        <h3>{item.desc}</h3>
                        <div className="metric-row">
                          {item.metrics.map((m) => (
                            <span key={m} className="metric-chip">
                              {m}
                            </span>
                          ))}
                        </div>
                        <span className="link-arrow">View Project →</span>
                      </div>
                    </Link>
                  ))}
                </MobileSwipeRail>
              </div>
            </div>

            <aside>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Our Work Speaks for Itself
              </h3>
              <ul className="mega-stat-list">
                {portfolioStats.map((stat) => (
                  <li key={stat.label}>
                    <Icon name={stat.icon} color="#0056ff" />
                    <div>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div
                className="cta-box dark"
                style={{
                  marginTop: "1rem",
                  background: "linear-gradient(160deg,#000b33,#4c1d95)",
                }}
              >
                <h4>Want similar results?</h4>
                <p>Let's discuss how we can help your business grow.</p>
                <Link to="/contact" className="btn btn-outline btn-sm" style={{ background: "#fff" }}>
                  Book Free Consultation →
                </Link>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.85rem" }}>
                  Trusted by 500+ Brands
                </p>
                <div style={{ marginTop: "0.55rem" }}>
                  <LogoMarquee logos={clientLogos} />
                </div>
                <Link to="/portfolio" className="link-arrow" style={{ marginTop: "0.55rem" }}>
                  View All Clients →
                </Link>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div className="bottom-bar-items">
              {portfolioTrustBar.map((item) => (
                <span key={item.label}>
                  <Icon name={item.icon} size={16} color="#0056ff" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
