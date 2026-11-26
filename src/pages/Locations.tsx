import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema, FAQPageSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";
import { NotFound } from "./NotFound";

function locationFaqs(city: string, service: string) {
  return [
    {
      question: `How much does ${service.toLowerCase()} cost in ${city}?`,
      answer: `Pricing depends on coverage hours, crew size and deliverables. DisplayAvenue Studios publishes transparent starting packages and provides a custom quote for ${city} shoots after a short consultation.`,
    },
    {
      question: `Do you travel to ${city} for weddings and celebrations?`,
      answer: `Yes. Our Mumbai-based team travels pan India, including ${city}. Travel and stay are scoped clearly in your proposal before booking.`,
    },
    {
      question: `How far in advance should I book in ${city}?`,
      answer: `Peak wedding Saturdays and muhurat dates in ${city} often book 6–12 months ahead. Pre-wedding, maternity and birthday sessions can sometimes be scheduled sooner — WhatsApp us to check availability.`,
    },
    {
      question: `What is included in a ${city} photography package?`,
      answer: `Typical packages include lead creatives, edited galleries or films, online delivery and usage guidance. Albums, drone, reels and rush delivery are available as add-ons.`,
    },
  ];
}

const REGION_ORDER = [
  "Mira-Bhayandar",
  "Vasai-Virar",
  "Western suburbs",
  "South & Central Mumbai",
  "Central Mumbai",
  "Thane & Navi Mumbai",
];

function firstSentence(text: string) {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

export function Locations() {
  const ref = useReveal<HTMLDivElement>();
  const { locations } = useCms();

  const groups = REGION_ORDER.map((region) => ({
    region,
    items: locations.filter((l) => l.region === region),
  })).filter((g) => g.items.length > 0);
  const other = locations.filter((l) => !l.region || !REGION_ORDER.includes(l.region));

  return (
    <div ref={ref}>
      <SEO
        title="Wedding Photographer Across Mumbai, Mira Road, Thane & Vasai-Virar | DisplayAvenue Studios"
        description="Wedding photographers and filmmakers for every part of Mumbai — Mira Road, Bhayandar, Vasai, Virar, Borivali, Kandivali, Malad, Andheri, Bandra, South Mumbai, Thane and Navi Mumbai — plus destination weddings."
        path="/locations"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Locations</span>
          </nav>
          <p className="eyebrow">Areas we cover</p>
          <h1>Wedding photography across Mumbai, from our Mira Road studio</h1>
          <p>
            Pick your area to see local pre-wedding spots, the kinds of venues we
            shoot there and answers to common booking questions.
          </p>
        </div>
      </section>

      {groups.map((g, i) => (
        <section key={g.region} className={`section${i % 2 ? " section--light" : ""}`}>
          <div className="container">
            <div className="section-head reveal">
              <h2>{g.region}</h2>
            </div>
            <div className="locations-grid">
              {g.items.map((loc) => (
                <Link key={loc.slug} to={`/locations/${loc.slug}`} className="location-card card reveal">
                  <h3>{loc.city}</h3>
                  <p>{firstSentence(loc.intro)}</p>
                  <span className="text-link">Weddings in {loc.city}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {other.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <h2>Mumbai services and destination weddings</h2>
            </div>
            <div className="locations-grid">
              {other.map((loc) => (
                <Link key={loc.slug} to={`/locations/${loc.slug}`} className="location-card card reveal">
                  <h3>{loc.title}</h3>
                  <p>{firstSentence(loc.intro)}</p>
                  <span className="text-link">Open page</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection compact limit={3} />

      <CTABanner />
    </div>
  );
}

export function LocationDetail() {
  const { slug } = useParams();
  const { locations, services, portfolio, company } = useCms();
  const loc = locations.find((l) => l.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!loc) return <NotFound />;

  const isLocal = Boolean(loc.region);
  const generic = locationFaqs(loc.city, loc.service);
  const faqs = isLocal
    ? [...(loc.faqs || []), generic[0], generic[3]]
    : generic;
  const nearby = (loc.nearby || [])
    .map((s) => locations.find((l) => l.slug === s))
    .filter((l): l is (typeof locations)[number] => Boolean(l));
  const relatedServices = services
    .filter((s) => {
      const svc = loc.service.toLowerCase();
      if (svc.includes("maternity")) return s.category === "Maternity";
      if (svc.includes("birthday")) return s.category === "Birthday";
      if (svc.includes("engagement")) return s.category === "Engagement";
      if (svc.includes("pre")) return s.category === "Pre-Wedding";
      if (svc.includes("candid")) return s.slug === "candid-wedding-photography" || s.category === "Wedding";
      if (svc.includes("destination"))
        return s.slug === "destination-wedding-photography" || s.category === "Wedding";
      if (svc.includes("wedding") || svc.includes("film")) return s.category === "Wedding";
      return s.category === "Wedding" || s.category === "Events";
    })
    .slice(0, 6);

  const localWork = portfolio.filter((p) =>
    p.location?.toLowerCase().includes(loc.city.toLowerCase()),
  );
  const relatedWork = (localWork.length ? localWork : portfolio).slice(0, 3);

  const metaDescription = isLocal
    ? `Wedding photographer & videographer in ${loc.city} — candid photos and cinematic films for weddings of every faith, from DisplayAvenue Studios, Mira Road. Call ${company.phone}.`
    : `${firstSentence(loc.intro)} Book ${loc.service.toLowerCase()} in ${loc.city} with DisplayAvenue Studios. Call ${company.phone}.`;

  return (
    <div ref={ref}>
      <SEO
        title={`${loc.title} | DisplayAvenue Studios`}
        description={metaDescription}
        path={`/locations/${loc.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: loc.title, path: `/locations/${loc.slug}` },
        ]}
      />
      <FAQPageSchema faqs={faqs} />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/locations">Locations</Link>
            <span>/</span>
            <span>{loc.city}</span>
          </nav>
          <p className="eyebrow">{isLocal ? `${loc.region}` : loc.city}</p>
          <h1>{loc.title}</h1>
          <p>{loc.intro}</p>
          <div className="home-hero__actions" style={{ marginTop: "1.75rem" }}>
            <Link to="/book-now" className="btn btn--gold">
              Book in {loc.city}
            </Link>
            <Link to="/pricing" className="btn btn--outline">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <article className="info-panel card reveal">
            <h2>Why clients in {loc.city} choose DisplayAvenue</h2>
            <ul className="check-list">
              <li>Studio in Mira Road East — {isLocal ? `${loc.city} is part of our regular coverage area` : `travel-ready crews for ${loc.city}`}</li>
              <li>Weddings of every faith — Hindu, Muslim, Christian, Sikh, Jain, Parsi and interfaith</li>
              <li>Transparent packages and written proposals before booking</li>
              <li>Fast social selects and structured gallery / film delivery</li>
              <li>Experience across weddings, pre-weddings and family celebrations</li>
            </ul>
          </article>
          <article className="info-panel card reveal">
            <h2>Popular services in {loc.city}</h2>
            <ul className="check-list">
              <li>{loc.service}</li>
              <li>Wedding films and videography</li>
              <li>Pre-wedding shoots</li>
              <li>Engagement, haldi and mehendi coverage</li>
              <li>Drone photography and video (where permitted)</li>
            </ul>
            <div style={{ marginTop: "1.25rem" }}>
              <Link to="/services" className="text-link">
                Browse all services →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {isLocal && (loc.spots?.length || loc.venues?.length) ? (
        <section className="section section--light">
          <div className="container grid-2">
            {loc.spots && loc.spots.length > 0 && (
              <article className="info-panel card reveal">
                <h2>Pre-wedding shoot spots near {loc.city}</h2>
                <ul className="spot-list">
                  {loc.spots.map((s) => (
                    <li key={s.name}>
                      <strong>{s.name}</strong>
                      <span>{s.note}</span>
                    </li>
                  ))}
                </ul>
                <p className="fine-print">
                  Some heritage sites, parks and private places need permission or
                  have rules on tripods and drones — we check this with you while planning.
                </p>
              </article>
            )}
            {loc.venues && loc.venues.length > 0 && (
              <article className="info-panel card reveal">
                <h2>Wedding venues we cover in {loc.city}</h2>
                <ul className="check-list">
                  {loc.venues.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        </section>
      ) : null}

      {loc.shoots && loc.shoots.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <h2>Weddings we've shot in {loc.city}</h2>
            </div>
            <div className="blog-grid">
              {loc.shoots.map((s) => {
                const inner = (
                  <>
                    {s.image && (
                      <div className="blog-card__img">
                        <img src={s.image} alt={`${s.title}, ${loc.city}`} loading="lazy" />
                      </div>
                    )}
                    <div className="blog-card__body">
                      {s.month && <span>{s.month}</span>}
                      <h3>{s.title}</h3>
                      {s.venue && <p>{s.venue}</p>}
                    </div>
                  </>
                );
                return s.slug ? (
                  <Link key={s.title} to={`/portfolio/${s.slug}`} className="blog-card card reveal">{inner}</Link>
                ) : (
                  <div key={s.title} className="blog-card card reveal">{inner}</div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Bookable Services</p>
              <h2>{loc.city} photography & film services</h2>
              <p>
                Open a service page to see benefits, packages and booking options
                for your {loc.city} project.
              </p>
            </div>
            <div className="services-list-grid">
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="service-list-card card reveal"
                >
                  <img src={service.image} alt={service.title} loading="lazy" />
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.short}</p>
                    <span className="text-link">Open service page →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <h2>{localWork.length ? `Our work in ${loc.city}` : "Selected work"}</h2>
          </div>
          <div className="blog-grid">
            {relatedWork.map((item) => (
              <Link key={item.slug} to={`/portfolio/${item.slug}`} className="blog-card card reveal">
                <div className="blog-card__img">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="blog-card__body">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container narrow">
          <div className="section-head reveal">
            <p className="eyebrow">FAQs</p>
            <h2>{loc.city} booking questions</h2>
          </div>
          <div className="reveal">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <h2>Nearby areas we cover</h2>
            </div>
            <ul className="nearby-links">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link to={`/locations/${n.slug}`}>Wedding photographer in {n.city}</Link>
                </li>
              ))}
              <li>
                <Link to="/locations">All areas</Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      <TestimonialsSection compact limit={3} />

      <CTABanner
        title={`Book your ${loc.city} shoot today`}
        text={`Talk to DisplayAvenue Studios about ${loc.service.toLowerCase()} in ${loc.city} — WhatsApp or book a consultation online.`}
      />
    </div>
  );
}
