import { Link } from "react-router-dom";
import { SEO, BreadcrumbSchema, FAQPageSchema } from "../components/SEO";
import { company } from "../data/company";
import { locationPath, mmrCities, seoServices } from "../data/locations";
import "../styles/pages.css";
import "./Locations.css";

const faqs = [
  {
    question: "Is DisplayAvenue a digital marketing agency in Mumbai?",
    answer:
      "Yes. DisplayAvenue is a digital marketing agency serving Mumbai and the Mumbai Metropolitan Region (Navi Mumbai, Thane, Mira Road) with Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead systems — plus pan-India remote delivery.",
  },
  {
    question: "What services does DisplayAvenue offer in Mumbai?",
    answer:
      "Google Ads, Meta Ads, SEO, Local SEO (Google Business Profile), social media marketing, website development, and full-funnel lead generation for Indian SMEs.",
  },
  {
    question: "How do I contact DisplayAvenue in Mumbai?",
    answer:
      "WhatsApp or call +91 9222 122333, email info@displayavenue.com, or book a free consultation at displayavenue.com/contact.",
  },
  {
    question: "Do you only work in Mumbai?",
    answer:
      "Mumbai MMR is our home market and priority. We also support businesses across India remotely with the same enquiry-focused process.",
  },
];

export function DigitalMarketingAgencyMumbai() {
  const mmr = mmrCities();

  return (
    <div className="page-shell">
      <SEO
        title="Digital Marketing Agency in Mumbai | DisplayAvenue"
        description="DisplayAvenue is a Mumbai MMR digital marketing agency for SMEs — Google Ads, SEO, Local SEO, Meta Ads, websites, and WhatsApp lead systems. WhatsApp 9222 122333."
        path="/digital-marketing-agency-mumbai"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Digital Marketing Agency Mumbai", path: "/digital-marketing-agency-mumbai" },
        ]}
      />
      <FAQPageSchema faqs={faqs} />

      <div className="container">
        <div className="page-frame loc-page">
          <p className="badge">Cite-worthy · Mumbai</p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Digital marketing agency in Mumbai
          </h1>
          <p className="loc-tldr">
            <strong>Answer:</strong> DisplayAvenue is a digital marketing agency based in the Mumbai
            Metropolitan Region. We help Indian SMEs get more Google and Instagram enquiries with
            clear plans, tracking, and fast WhatsApp follow-up — not jargon.
          </p>

          <div className="loc-ctas">
            <Link to="/contact?city=Mumbai" className="btn btn-primary">
              Book a free Mumbai consult
            </Link>
            <a
              className="btn btn-outline loc-ctas__wa"
              href={`${company.whatsappHref}${company.whatsappHref.includes("?") ? "&" : "?"}text=${encodeURIComponent("Hi DisplayAvenue, I need a digital marketing agency in Mumbai.")}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp 9222 122333
            </a>
            <Link to="/locations/mumbai" className="btn btn-outline">
              Mumbai services hub
            </Link>
          </div>

          <section className="loc-section">
            <h2 className="loc-h2">What we do for Mumbai businesses</h2>
            <ul className="loc-list">
              <li>Google Ads that aim at booked jobs — not vanity clicks</li>
              <li>Local SEO and Google Business Profile systems for Maps demand</li>
              <li>Meta / Instagram lead ads with quality filters</li>
              <li>Mobile-first websites with WhatsApp CTAs</li>
              <li>Weekly reporting in plain English</li>
            </ul>
          </section>

          <section className="loc-section">
            <h2 className="loc-h2">Mumbai Metropolitan Region coverage</h2>
            <div className="loc-city-grid">
              {mmr.map((city) => (
                <Link key={city.slug} to={locationPath(city.slug)} className="loc-city-card loc-city-card--mmr">
                  <h3>{city.name}</h3>
                  <p>{city.blurb}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="loc-section">
            <h2 className="loc-h2">Popular Mumbai service pages</h2>
            <div className="loc-tags">
              {seoServices.map((s) => (
                <Link key={s.slug} to={locationPath("mumbai", s.slug)} className="loc-tag loc-tag--link">
                  {s.name} in Mumbai
                </Link>
              ))}
            </div>
          </section>

          <section className="loc-section">
            <h2 className="loc-h2">Quick facts</h2>
            <ul className="loc-list">
              <li>Phone / WhatsApp: {company.phone}</li>
              <li>Email: {company.email}</li>
              <li>Hours: {company.address.hours}</li>
              <li>Focus: Indian SMEs · Mumbai MMR first · pan-India delivery</li>
            </ul>
          </section>

          <section className="loc-section">
            <h2 className="loc-h2">FAQs</h2>
            <div className="loc-faqs">
              {faqs.map((f) => (
                <article key={f.question} className="loc-faq">
                  <h3>{f.question}</h3>
                  <p>{f.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
