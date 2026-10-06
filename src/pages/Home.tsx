import { type FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { PropertyCard } from "../components/PropertyCard";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { whatsappLink } from "../utils/submitInquiry";
import "./Home.css";

const HERO_IMAGE = "/content/uploads/societies/_shared/tower-blocks-mira-east.jpg";
const EXPERTISE_IMAGES = [
  "/content/uploads/societies/_shared/srishti-area.jpg",
  "/content/uploads/societies/_shared/mira-skyline-poonam.jpg",
  "/content/uploads/societies/_shared/mira-residential.jpg",
];

const SERVICE_CARDS = [
  {
    title: "Buy Residential",
    text: "1, 2 and 3 BHK homes across Mira Road, Dahisar and Bhayandar.",
    to: "/buy",
    cta: "Explore homes",
  },
  {
    title: "Rent Residential",
    text: "Furnished, semi-furnished and family-friendly rental options.",
    to: "/rent",
    cta: "Find a rental",
  },
  {
    title: "Sell Your Property",
    text: "Get a valuation and connect with potential buyers.",
    to: "/sell",
    cta: "Sell with us",
  },
  {
    title: "Commercial",
    text: "Shops, offices, showrooms and warehouses.",
    to: "/commercial",
    cta: "Explore commercial",
  },
  {
    title: "Redevelopment",
    text: "Owner-first guidance for society committees and residents.",
    to: "/redevelopment",
    cta: "Discuss redevelopment",
  },
  {
    title: "Local Property Desk",
    text: "Practical local guidance based on your requirement.",
    to: "/contact",
    cta: "Talk to us",
  },
];

const TRUST = [
  { title: "Hyperlocal Expertise", text: "Mira Road, Dahisar and Bhayandar" },
  { title: "Verified Shortlists", text: "Options based on your requirement" },
  { title: "Site Visit Support", text: "We coordinate property visits" },
  { title: "WhatsApp First", text: "Quick and direct communication" },
];

const WHY = [
  {
    title: "Hyperlocal Focus",
    text: "We focus specifically on Mira Road, Dahisar and Bhayandar.",
  },
  {
    title: "Requirement-Based Shortlists",
    text: "We do not simply send random listings.",
  },
  {
    title: "Local Society Knowledge",
    text: "Understand neighbourhoods and established societies.",
  },
  {
    title: "Easy Site Visits",
    text: "We coordinate visits around your schedule.",
  },
  {
    title: "Seller Support",
    text: "Valuation, listing and buyer matching.",
  },
  {
    title: "Direct Communication",
    text: "Call or WhatsApp our property desk.",
  },
];

const PROCESS = [
  { step: "01", title: "Tell Us", text: "Share your requirement." },
  { step: "02", title: "Shortlist", text: "We identify suitable options." },
  { step: "03", title: "Visit", text: "See the property in person." },
  { step: "04", title: "Compare", text: "Understand your options." },
  { step: "05", title: "Decide", text: "Move ahead confidently." },
];

const POPULAR_SOCIETIES = [
  { name: "Unique Garden", pocket: "Kanakia", slug: "unique-garden" },
  { name: "Shanti Garden", pocket: "Mira Road", slug: "shanti-garden" },
  { name: "Srishti Complex", pocket: "Mira Road East", slug: "srishti-complex" },
  { name: "JP North", pocket: "Mira Road", slug: "jp-north" },
  { name: "Poonam Sagar Complex", pocket: "Mira Road", slug: "poonam-sagar-complex" },
  { name: "Beverly Park", pocket: "Mira Road", slug: "beverly-park" },
];

const LOCALITY_META: Record<string, string> = {
  "mira-road": "Mira Road East · Mira Road West",
  dahisar: "Dahisar East · Dahisar West",
  bhayandar: "Bhayandar East · Bhayandar West",
};

export function Home() {
  const { home, company, properties, localities, testimonials, faqs, blogs } = useCms();
  const ref = useReveal<HTMLDivElement>();
  const featured = properties.filter((p) => p.featured).slice(0, 3);
  const [intent, setIntent] = useState<"buy" | "rent" | "commercial">("buy");
  const [locality, setLocality] = useState("Mira Road");
  const [propertyType, setPropertyType] = useState("Flat");
  const [bhk, setBhk] = useState("2");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");
  const [societyQuery, setSocietyQuery] = useState("");

  const guideCards = useMemo(
    () => [
      {
        title: "Flats for Sale in Mira Road",
        text: "What buyers should consider before choosing a property.",
        to: "/guides/flats-for-sale-in-mira-road",
      },
      {
        title: "2 BHK Rent in Mira Road",
        text: "Budget, locality and society considerations.",
        to: "/guides/2-bhk-on-rent-mira-road",
      },
      {
        title: "Selling a Flat in Mira Road",
        text: "What can influence your property value.",
        to: "/guides/sell-flat-mira-road-east",
      },
      {
        title: "Mira Road East vs West",
        text: "Which side may suit you better.",
        to: "/guides/best-locality-mira-road-east-or-west",
      },
    ],
    [],
  );

  const filteredSocieties = POPULAR_SOCIETIES.filter((s) =>
    `${s.name} ${s.pocket}`.toLowerCase().includes(societyQuery.trim().toLowerCase()),
  );

  const onRequirementSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      `Hi DisplayAvenue Realty, I need a shortlist.`,
      `Intent: ${intent}`,
      `Locality: ${locality}`,
      `Type: ${propertyType}`,
      `BHK: ${bhk}`,
      budget ? `Budget: ${budget}` : null,
      phone ? `WhatsApp: ${phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(company.whatsappHref, msg), "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={ref} className="home">
      <SEO title={home.seo.title} description={home.seo.description} path="/" image={HERO_IMAGE} />

      <section className="home-hero">
        <div className="home-hero__media" aria-hidden>
          <img src={HERO_IMAGE} alt="" />
          <div className="home-hero__shade" />
        </div>
        <div className="container home-hero__content">
          <p className="home-hero__label">Mira Road · Dahisar · Bhayandar</p>
          <h1>Your Next Address Starts Here.</h1>
          <p className="home-hero__support">
            Buy, sell, rent or explore redevelopment with a local property team that knows Mira Road,
            Dahisar and Bhayandar.
          </p>
          <div className="home-hero__ctas">
            <Link className="btn btn--brass" to="/buy">
              Browse Homes
            </Link>
            <Link className="btn btn--ghost" to="/sell">
              List Your Property
            </Link>
          </div>
          <p className="home-hero__meta">Residential · Commercial · Redevelopment</p>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-strip__grid">
          {TRUST.map((item, i) => (
            <article key={item.title} className="trust-strip__item reveal">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <div className="section-head reveal">
            <h2>Property Help That Goes Beyond Listings.</h2>
            <p>
              Whether you are buying your first home, looking for a rental, selling a property or discussing
              redevelopment, we help you take the next step.
            </p>
          </div>
          <div className="service-grid">
            {SERVICE_CARDS.map((card) => (
              <Link key={card.title} to={card.to} className="service-card reveal">
                <span className="service-card__icon" aria-hidden />
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="text-link">{card.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-head section-head--row reveal">
            <div className="section-head__copy">
              <h2>Properties Worth Seeing.</h2>
            </div>
            <Link className="text-link" to="/buy">
              View All Properties →
            </Link>
          </div>
          <div className="property-grid">
            {featured.map((p) => (
              <div key={p.id} className="reveal">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section requirement">
        <div className="container">
          <div className="section-head reveal">
            <h2>Tell Us What You&apos;re Looking For.</h2>
            <p>
              Do not want to search through hundreds of listings? Tell us your requirement and we will help
              shortlist suitable options.
            </p>
          </div>
          <div className="requirement__tabs reveal" role="tablist" aria-label="Requirement type">
            {(
              [
                ["buy", "Buy", "I'm looking to buy"],
                ["rent", "Rent", "I'm looking to rent"],
                ["commercial", "Commercial", "I need commercial space"],
              ] as const
            ).map(([key, label, desc]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={intent === key}
                className={intent === key ? "is-active" : ""}
                onClick={() => setIntent(key)}
              >
                <strong>{label}</strong>
                <span>{desc}</span>
              </button>
            ))}
          </div>
          <form className="requirement__form reveal" onSubmit={onRequirementSubmit}>
            <div className="field">
              <label htmlFor="req-locality">Preferred Locality</label>
              <select id="req-locality" value={locality} onChange={(e) => setLocality(e.target.value)}>
                <option>Mira Road</option>
                <option>Dahisar</option>
                <option>Bhayandar</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="req-type">Property Type</label>
              <select id="req-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option>Flat</option>
                <option>Shop</option>
                <option>Office</option>
                <option>Showroom</option>
                <option>Warehouse</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="req-bhk">BHK</label>
              <select id="req-bhk" value={bhk} onChange={(e) => setBhk(e.target.value)}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="req-budget">Budget</label>
              <select id="req-budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="">Select budget</option>
                <option>Under 50 Lakh</option>
                <option>50 Lakh to 80 Lakh</option>
                <option>80 Lakh to 1.2 Crore</option>
                <option>1.2 Crore+</option>
                <option>Rent under 25k</option>
                <option>Rent 25k to 40k</option>
                <option>Rent 40k+</option>
              </select>
            </div>
            <div className="field requirement__phone">
              <label htmlFor="req-phone">WhatsApp Number</label>
              <input
                id="req-phone"
                type="tel"
                inputMode="tel"
                placeholder="91XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button className="btn btn--brass requirement__submit" type="submit">
              Get My Shortlist
            </button>
            <p className="requirement__note">We will contact you on WhatsApp regarding suitable options.</p>
          </form>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <div className="section-head reveal">
            <h2>Explore Your Locality.</h2>
          </div>
          <div className="locality-grid">
            {localities.map((l) => (
              <Link key={l.slug} to={`/localities/${l.slug}`} className="locality-card reveal">
                <img src={l.image} alt="" loading="lazy" />
                <div className="locality-card__shade" />
                <div className="locality-card__body">
                  <h3>{l.name}</h3>
                  <p>{LOCALITY_META[l.slug] || l.tagline}</p>
                  <span>Explore {l.name} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container expertise">
          <div className="expertise__collage reveal" aria-hidden>
            {EXPERTISE_IMAGES.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
          <div className="expertise__copy reveal">
            <span className="eyebrow">Local Knowledge</span>
            <h2>We Know Mira Road Beyond the Pin Code.</h2>
            <p>
              From established societies and family-friendly pockets to new developments, commercial areas and
              redevelopment opportunities, DisplayAvenue Realty works at a neighbourhood and society level.
            </p>
            <div className="expertise__stats">
              <div>
                <strong>118+</strong>
                <span>Societies</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Core Localities</span>
              </div>
              <div>
                <strong>6</strong>
                <span>Property Services</span>
              </div>
            </div>
            <Link className="btn btn--outline" to="/societies">
              Explore Mira Road Societies →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <div className="section-head reveal">
            <h2>Looking for a Specific Society?</h2>
          </div>
          <label className="society-search reveal">
            <span className="sr-only">Search Mira Road society</span>
            <input
              type="search"
              placeholder="Search Mira Road society..."
              value={societyQuery}
              onChange={(e) => setSocietyQuery(e.target.value)}
            />
          </label>
          <div className="society-grid">
            {filteredSocieties.map((s) => (
              <Link key={s.slug} to={`/societies/${s.slug}`} className="society-card reveal">
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.pocket}</p>
                </div>
                <div className="society-card__tags">
                  <span>Buy</span>
                  <span>Rent</span>
                  <span>Sell</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-cta">
            <Link className="btn btn--outline" to="/societies">
              View All Societies →
            </Link>
          </div>
        </div>
      </section>

      <section className="section why">
        <div className="container">
          <div className="section-head reveal">
            <h2>Local Knowledge. Personal Attention.</h2>
          </div>
          <div className="why-grid">
            {WHY.map((item) => (
              <article key={item.title} className="why-card reveal">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-head reveal">
            <h2>Finding Property Should Feel Simple.</h2>
          </div>
          <div className="process-grid">
            {PROCESS.map((step) => (
              <article key={step.step} className="process-card reveal">
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section redev">
        <div className="container redev__grid">
          <div className="redev__copy reveal">
            <span className="eyebrow">Society Redevelopment</span>
            <h2>Is Your Society Ready for Its Next Chapter?</h2>
            <p>
              Redevelopment involves important decisions for owners and committees. Get practical local guidance
              before taking the next step.
            </p>
            <div className="home-hero__ctas">
              <a className="btn btn--brass" href={company.whatsappHref} target="_blank" rel="noreferrer">
                Discuss Your Society
              </a>
              <Link className="btn btn--ghost" to="/redevelopment">
                Explore Redevelopment →
              </Link>
            </div>
          </div>
          <div className="redev__media reveal" aria-hidden>
            <img src="/content/uploads/societies/_shared/mhada-mira.jpg" alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-head reveal">
            <h2>Trusted by People Looking for the Right Property.</h2>
          </div>
          <div className="quote-grid">
            {testimonials.slice(0, 3).map((t) => (
              <blockquote key={t.name} className="quote-card reveal">
                <span aria-hidden>“</span>
                <p>{t.quote}</p>
                <footer>
                  <strong>{t.name}</strong>
                  <em>{t.role}</em>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <div className="section-head reveal">
            <h2>Know the Local Market Before You Decide.</h2>
          </div>
          <div className="guide-grid">
            {guideCards.map((g) => (
              <Link key={g.to} to={g.to} className="guide-card reveal">
                <h3>{g.title}</h3>
                <p>{g.text}</p>
                <span className="text-link">Read Guide →</span>
              </Link>
            ))}
          </div>
          {blogs.length ? (
            <div className="section-cta">
              <Link className="text-link" to="/guides">
                Browse all guides →
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section section--white">
        <div className="container faq-split">
          <div className="section-head reveal">
            <h2>Have Questions?</h2>
            <p>Here are answers to the things buyers, tenants, sellers and societies ask us most often.</p>
            <a className="btn btn--wa" href={company.whatsappHref} target="_blank" rel="noreferrer">
              Ask Us on WhatsApp
            </a>
          </div>
          <div className="reveal">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta__inner reveal">
          <span className="eyebrow">DisplayAvenue Realty</span>
          <h2>Let&apos;s Find the Right Property for You.</h2>
          <p>
            Buy. Rent. Sell. Redevelop.
            <br />
            Mira Road · Dahisar · Bhayandar
          </p>
          <div className="home-hero__ctas">
            <a className="btn btn--wa" href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp {company.phone}
            </a>
            <a className="btn btn--ghost" href={company.phoneHref}>
              Call {company.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
