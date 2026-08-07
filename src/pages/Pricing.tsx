import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

const factors = [
  {
    title: "Coverage duration",
    text: "Half-day, full-day and multi-day productions change crew size and pricing.",
  },
  {
    title: "Crew composition",
    text: "Lead photographers, cinematographers, assistants and drone pilots are scoped to the brief.",
  },
  {
    title: "City & travel",
    text: "Mumbai local shoots differ from destination travel where stay and logistics apply.",
  },
  {
    title: "Deliverables",
    text: "Photo galleries, highlight films, albums, reels and ad cutdowns each affect investment.",
  },
  {
    title: "Turnaround",
    text: "Standard timelines are included; rush editing and same-day selects are available as add-ons.",
  },
  {
    title: "Usage rights",
    text: "Personal wedding use differs from commercial advertising and paid media licensing.",
  },
];

export function Pricing() {
  const ref = useReveal<HTMLDivElement>();
  const { faqs, packageGroups } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Transparent Pricing | DisplayAvenue Studios"
        description="Understand DisplayAvenue Studios pricing factors, payment terms, travel charges, album and drone pricing for weddings and commercial work."
        path="/pricing"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Pricing</span>
          </nav>
          <p className="eyebrow">Pricing</p>
          <h1>Transparent pricing for premium visual production</h1>
          <p>
            We publish starting packages and explain what influences the final
            quote - so you can plan with confidence before booking.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Starting Ranges</p>
            <h2>Indicative investment guides</h2>
          </div>
          <div className="pricing-cards">
            {[
              ["Wedding Photography & Film", "From ₹75,000", "Single-day Essential coverage", "/packages/wedding"],
              ["Corporate Photo + Film", "From ₹35,000", "Half-day on-location package", "/packages/corporate"],
              ["Product Photography", "From ₹999 / SKU", "Marketplace packshot sets", "/packages/product"],
              ["Monthly Content Retainer", "From ₹45,000 / mo", "Ongoing social content systems", "/packages/monthly-content"],
              ["Drone Add-on", "From ₹15,000", "Licensed aerial stills or film", "/packages"],
              ["Luxury Album Design", "From ₹25,000", "Editorial design + print coordination", "/packages"],
            ].map(([title, price, note, href]) => (
              <Link key={title} to={href} className="card pricing-card reveal">
                <h3>{title}</h3>
                <p className="package-card__price">{price}</p>
                <p>{note}</p>
                <span className="text-link">Open page →</span>
              </Link>
            ))}
          </div>
          <div className="section-cta reveal">
            {packageGroups.map((g) => (
              <Link key={g.slug} to={`/packages/${g.slug}`} className="btn btn--ghost">
                {g.title}
              </Link>
            ))}
            <Link to="/packages" className="btn btn--gold">
              All Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Pricing Factors</p>
            <h2>What shapes your final quote</h2>
          </div>
          <div className="why-grid">
            {factors.map((f) => (
              <article key={f.title} className="why-card card reveal">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <article className="info-panel card reveal">
            <h3>Payment terms</h3>
            <ul className="check-list">
              <li>Booking amount to reserve date and crew</li>
              <li>Milestone payment before the shoot day</li>
              <li>Balance before final gallery / film delivery</li>
              <li>Invoices available for corporate clients</li>
              <li>Razorpay-ready online payments (coming online)</li>
            </ul>
          </article>
          <article className="info-panel card reveal">
            <h3>Travel & add-ons</h3>
            <ul className="check-list">
              <li>Mumbai local travel typically included in packages</li>
              <li>Outstation travel & stay quoted per crew member</li>
              <li>Drone, live streaming and albums as optional add-ons</li>
              <li>Rush editing available subject to capacity</li>
              <li>Commercial usage licensing quoted separately</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section section--light">
        <div className="container narrow reveal">
          <p className="eyebrow">FAQs</p>
          <h2>Pricing questions</h2>
          <FAQAccordion
            items={faqs.filter((f) => f.category === "Pricing" || f.category === "Booking")}
          />
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
