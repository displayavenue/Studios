import { Link } from "react-router-dom";
import type { RefObject } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { staticPageSeo } from "../data/pageSeo";
import { useReveal } from "../hooks/useReveal";
import { GoogleReviews } from "../components/GoogleReviews";
import { AwardsCertsHome } from "../components/AwardsCertsHome";
import "./Home.css";

const promises = [
  {
    title: "Get found online",
    text: "Show up when people search for what you sell  -  on Google and maps.",
  },
  {
    title: "Turn visits into calls",
    text: "Ads, posts, and a clear website that make people reach out to you.",
  },
  {
    title: "Know what works",
    text: "Simple monthly updates in plain language  -  so you see where money goes.",
  },
];

const plainServices = [
  {
    title: "Google & local search",
    desc: "Help customers find your business when they need you.",
    href: "/services/seo",
    icon: "search" as const,
  },
  {
    title: "Ads that bring enquiries",
    desc: "Google and Instagram ads aimed at people ready to buy.",
    href: "/services/google-ads",
    icon: "target" as const,
  },
  {
    title: "Website that converts",
    desc: "A clear site that explains your offer and captures leads.",
    href: "/services/web-development",
    icon: "globe" as const,
  },
  {
    title: "Brand & creative",
    desc: "Look trustworthy  -  logos, creatives, and content people remember.",
    href: "/services/branding",
    icon: "brand" as const,
  },
];

const HERO_IMAGE_FALLBACK = "/images/hero-agency-india.jpg";

export function Home() {
  const { company, home, content } = useCms();
  const revealRef = useReveal();
  const hero = home.hero as typeof home.hero & { image?: string; imageAlt?: string };
  const homeMeta = staticPageSeo["/"];
  const seoTitle = home.seo?.title || homeMeta.title;
  const seoDesc = home.seo?.description || homeMeta.description;
  const seoKeywords = home.seo?.keywords || homeMeta.keywords;
  const quote = content.testimonials[0];

  return (
    <div className="home-page" ref={revealRef as RefObject<HTMLDivElement>}>
      <SEO title={seoTitle} description={seoDesc} path="/" keywords={seoKeywords} />

      <section className="home-hero" aria-label="Introduction">
        <div className="home-hero__media" aria-hidden>
          <img
            src={hero.image || HERO_IMAGE_FALLBACK}
            alt=""
            width={2000}
            height={1333}
            fetchPriority="high"
          />
        </div>
        <div className="home-hero__shade" aria-hidden />
        <div className="home-hero__orb home-hero__orb--a" aria-hidden />
        <div className="home-hero__orb home-hero__orb--b" aria-hidden />
        <div className="home-hero__inner">
          <p className="home-hero__brand">{home.hero.eyebrow || company.name}</p>
          <h1>
            {home.hero.titleBefore}{" "}
            <em>{home.hero.titleAccent}</em>
          </h1>
          <p className="home-hero__lead">{home.hero.lead}</p>
          <div className="home-hero__actions">
            <Link to="/contact" className="btn btn-primary home-btn-pulse">
              {home.hero.primaryCta}
            </Link>
            <Link to="/portfolio" className="btn btn-outline-light">
              {home.hero.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="home-hero__scroll" aria-hidden>
          <span />
        </div>
      </section>

      <section className="home-block home-block--soft home-block--promises">
        <div className="container">
          <p className="home-kicker reveal">{home.trustLabel}</p>
          <h2 className="home-title reveal reveal-delay-1">How we help your business grow</h2>
          <p className="home-sub reveal reveal-delay-2">
            Three plain goals. No buzzwords  -  just more of the right people finding you and getting in touch.
          </p>
          <div className="home-promises">
            {promises.map((item, i) => (
              <article key={item.title} className={`home-promise reveal reveal-delay-${i + 1}`}>
                <span className="home-promise__index" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-block home-block--navy home-block--services">
        <div className="container">
          <p className="home-kicker reveal">What we do</p>
          <h2 className="home-title reveal reveal-delay-1">{home.servicesTitle}</h2>
          <p className="home-sub reveal reveal-delay-2">{home.servicesSub}</p>
          <div className="home-services">
            {plainServices.map((service, i) => (
              <Link
                key={service.href}
                to={service.href}
                className={`home-service reveal reveal-delay-${(i % 3) + 1}`}
              >
                <span className="icon-box home-service__icon" style={{ background: "rgba(158,193,255,0.16)" }}>
                  <Icon name={service.icon} color="#9ec1ff" />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </div>
                <Icon name="arrow" size={16} color="#9ec1ff" />
              </Link>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link to="/services" className="btn btn-ghost">
              See all services →
            </Link>
            <Link to="/locations/mumbai" className="btn btn-ghost">
              Mumbai →
            </Link>
            <Link to="/locations/navi-mumbai" className="btn btn-ghost">
              Navi Mumbai →
            </Link>
            <Link to="/locations/thane" className="btn btn-ghost">
              Thane →
            </Link>
            <Link to="/locations" className="btn btn-ghost">
              All cities →
            </Link>
          </div>
        </div>
      </section>

      {quote && (
        <section className="home-block home-block--soft home-block--proof">
          <div className="container">
            <p className="home-kicker reveal">From business owners like you</p>
            <div className="home-proof">
              <blockquote className="home-quote reveal reveal-delay-1">
                <p>“{quote.quote}”</p>
                <footer>
                  <strong>{quote.name}</strong>
                  <span>{quote.title}</span>
                </footer>
              </blockquote>
            </div>
            <div className="reveal reveal-delay-2" style={{ marginTop: "1.5rem" }}>
              <Link to="/case-studies" className="link-arrow">
                Read more client stories →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="home-block home-block--navy home-block--cta">
        <div className="container home-cta">
          <p className="home-kicker reveal">Next step</p>
          <h2 className="home-title reveal reveal-delay-1">
            Tell us about your business. We’ll show a clear plan.
          </h2>
          <p className="home-sub reveal reveal-delay-2">
            Free call. No hard sell. We’ll explain what to fix first  -  in language that makes sense.
          </p>
          <Link to="/contact" className="btn btn-primary reveal reveal-delay-3 home-btn-pulse">
            Book a free call
          </Link>
        </div>
      </section>

      <GoogleReviews />
      <AwardsCertsHome />
    </div>
  );
}
