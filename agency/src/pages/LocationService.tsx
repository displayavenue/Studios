import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema, FAQPageSchema } from "../components/SEO";
import {
  buildLocationFaqs,
  citiesByTier,
  cityWhatsAppHref,
  findCity,
  findService,
  industryHrefFromLabel,
  locationPath,
  locationTldr,
  mmrCities,
  seoCities,
  seoServices,
} from "../data/locations";
import { locationCityMeta, locationServiceMeta, staticPageSeo } from "../data/pageSeo";
import { company } from "../data/company";
import "../styles/pages.css";
import "./Locations.css";

function CityCtas({
  cityName,
  whatsappHref,
  phoneHref,
  phoneLabel,
}: {
  cityName: string;
  whatsappHref: string;
  phoneHref?: string;
  phoneLabel?: string;
}) {
  return (
    <div className="loc-ctas">
      <Link to={`/contact?city=${encodeURIComponent(cityName)}`} className="btn btn-primary">
        Get free plan for {cityName}
      </Link>
      <a className="btn btn-outline loc-ctas__wa" href={whatsappHref} target="_blank" rel="noreferrer">
        WhatsApp {cityName}
      </a>
      {phoneHref ? (
        <a className="btn btn-outline" href={phoneHref}>
          Call {phoneLabel || "now"}
        </a>
      ) : null}
      <a className="btn btn-outline" href="https://displayavenue.com/strategy/">
        Strategy Maker
      </a>
    </div>
  );
}

export function LocationsHub() {
  const { mmr, tier1, other } = citiesByTier();

  return (
    <div className="page-shell">
      <SEO
        title={staticPageSeo["/locations"].title}
        description={staticPageSeo["/locations"].description}
        path="/locations"
        keywords={staticPageSeo["/locations"].keywords}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />
      <div className="container">
        <div className="page-frame loc-hub">
          <p className="badge">India · MMR first</p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Digital growth services by city
          </h1>
          <p className="section-sub loc-tldr">
            DisplayAvenue helps Indian SMEs get found and convert enquiries — starting with Mumbai,
            Navi Mumbai, and Thane, then major metros pan-India.
          </p>

          <div className="loc-ctas" style={{ marginBottom: "1.75rem" }}>
            <a className="btn btn-primary btn-sm" href="https://displayavenue.com/strategy/">
              Free Strategy Maker
            </a>
            <a className="btn btn-outline btn-sm" href="https://displayavenue.com/data/">
              Free Data Lead Tool
            </a>
            <Link className="btn btn-outline btn-sm" to="/free-tools">
              All free tools
            </Link>
            <Link className="btn btn-outline btn-sm" to="/contact">
              Book consultation
            </Link>
          </div>

          <h2 className="loc-h2">Mumbai Metropolitan Region</h2>
          <p className="loc-note">Priority coverage — enriched pages for local search and answer engines.</p>
          <div className="loc-city-grid">
            {mmr.map((city) => (
              <Link key={city.slug} to={locationPath(city.slug)} className="loc-city-card loc-city-card--mmr">
                <h3>{city.name}</h3>
                <p>{city.state} · {seoServices.length} service pages</p>
                {city.neighbourhoods && (
                  <span className="loc-chip">{city.neighbourhoods.slice(0, 3).join(" · ")}</span>
                )}
              </Link>
            ))}
          </div>

          <h2 className="loc-h2">Services we localize</h2>
          <div className="loc-city-grid loc-city-grid--services">
            {seoServices.map((s) => (
              <div key={s.slug} className="loc-city-card">
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <Link to={s.serviceHref} className="link-arrow">
                  Service page →
                </Link>
              </div>
            ))}
          </div>

          <h2 className="loc-h2">Tier-1 metros</h2>
          <div className="loc-city-grid">
            {tier1.map((city) => (
              <Link key={city.slug} to={locationPath(city.slug)} className="loc-city-card">
                <h3>{city.name}</h3>
                <p>{city.state}</p>
              </Link>
            ))}
          </div>

          <h2 className="loc-h2">More cities across India</h2>
          <div className="loc-city-grid">
            {other.map((city) => (
              <Link key={city.slug} to={locationPath(city.slug)} className="loc-city-card">
                <h3>{city.name}</h3>
                <p>{city.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LocationCityPage() {
  const { city: citySlug = "" } = useParams();
  const city = findCity(citySlug);
  if (!city) {
    return (
      <div className="page-shell container">
        <h1>City not found</h1>
        <Link to="/locations">Browse all locations</Link>
      </div>
    );
  }

  const wa = cityWhatsAppHref(company.whatsappHref, city);
  const cityMeta = locationCityMeta(city.name, city.state);
  const faqs = city.faqs?.length
    ? city.faqs
    : [
        {
          question: `Do you offer digital marketing in ${city.name}?`,
          answer: `Yes. DisplayAvenue supports businesses in ${city.name}, ${city.state} with Google Ads, Meta Ads, SEO, Local SEO, websites, and WhatsApp lead systems.`,
        },
      ];
  const nearbyMmr = mmrCities().filter((c) => c.slug !== city.slug).slice(0, 5);
  const mapSrc = city.mapQuery
    ? `https://maps.google.com/maps?q=${city.mapQuery}&hl=en&z=12&output=embed`
    : company.googleMaps?.embedUrl;

  return (
    <div className="page-shell">
      <SEO
        title={cityMeta.title}
        description={city.tldr || cityMeta.description}
        path={locationPath(city.slug)}
        keywords={cityMeta.keywords}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: city.name, path: locationPath(city.slug) },
        ]}
      />
      <FAQPageSchema faqs={faqs} />

      <div className="container">
        <div className="page-frame loc-page">
          <p className="badge">
            {city.state}
            {city.tier === "mmr" ? " · MMR priority" : ""}
          </p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Digital marketing in {city.name}
          </h1>

          <p className="loc-tldr" role="doc-subtitle">
            <strong>Answer:</strong> {locationTldr(city)}
          </p>
          {city.marathiHint && <p className="loc-marathi">{city.marathiHint}</p>}

          <CityCtas
            cityName={city.name}
            whatsappHref={wa}
            phoneHref={company.phoneHref}
            phoneLabel={company.phone}
          />

          <p className="loc-trust-line">
            Free plan · Reply in business hours · Mumbai MMR specialists · Pan-India delivery
          </p>
          {city.pricingHint && (
            <p className="loc-pricing">
              <strong>Typical budget:</strong> {city.pricingHint}
            </p>
          )}
          {city.proof && (
            <p className="loc-proof">
              <strong>Local proof:</strong> {city.proof}
            </p>
          )}

          {city.neighbourhoods && city.neighbourhoods.length > 0 && (
            <section className="loc-section">
              <h2 className="loc-h2">Areas we support in {city.name}</h2>
              <div className="loc-tags">
                {city.neighbourhoods.map((n) => (
                  <span key={n} className="loc-tag">
                    {n}
                  </span>
                ))}
              </div>
            </section>
          )}

          {city.industries && city.industries.length > 0 && (
            <section className="loc-section">
              <h2 className="loc-h2">Who we help in {city.name}</h2>
              <ul className="loc-list loc-list--industries">
                {city.industries.map((i) => {
                  const href = industryHrefFromLabel(i);
                  return (
                    <li key={i}>
                      {href ? (
                        <Link to={`${href}?city=${encodeURIComponent(city.name)}`}>
                          {i} in {city.name}
                        </Link>
                      ) : (
                        i
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="loc-note">
                Industry pages explain the playbook; add your city on contact so we tag the lead correctly.
              </p>
            </section>
          )}

          <section className="loc-section">
            <h2 className="loc-h2">Services in {city.name}</h2>
            <div className="loc-city-grid loc-city-grid--services">
              {seoServices.map((service) => (
                <Link key={service.slug} to={locationPath(city.slug, service.slug)} className="loc-city-card">
                  <h3>{service.name}</h3>
                  <p>{service.short}</p>
                </Link>
              ))}
            </div>
          </section>

          {mapSrc && (
            <section className="loc-section">
              <h2 className="loc-h2">Find us / service area</h2>
              <div className="loc-map">
                <iframe title={`${city.name} map`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </section>
          )}

          <section className="loc-section">
            <h2 className="loc-h2">FAQs — {city.name}</h2>
            <div className="loc-faqs">
              {faqs.map((f) => (
                <article key={f.question} className="loc-faq">
                  <h3>{f.question}</h3>
                  <p>{f.answer}</p>
                </article>
              ))}
            </div>
          </section>

          {nearbyMmr.length > 0 && (
            <section className="loc-section">
              <h2 className="loc-h2">Nearby MMR cities</h2>
              <div className="loc-tags">
                {nearbyMmr.map((c) => (
                  <Link key={c.slug} to={locationPath(c.slug)} className="loc-tag loc-tag--link">
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <p className="loc-back">
            <Link to="/locations">← All cities</Link>
            {" · "}
            <Link to="/contact">Contact</Link>
            {" · "}
            <span className="loc-updated">Updated for local search · {new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function LocationServicePage() {
  const { city: citySlug = "", service: serviceSlug = "" } = useParams();
  const city = findCity(citySlug);
  const service = findService(serviceSlug);

  if (!city || !service) {
    return (
      <div className="page-shell container">
        <h1>Page not found</h1>
        <Link to="/locations">Browse locations</Link>
      </div>
    );
  }

  const path = locationPath(city.slug, service.slug);
  const faqs = buildLocationFaqs(city, service);
  const wa = cityWhatsAppHref(company.whatsappHref, city, service);
  const serviceMeta = locationServiceMeta(city.name, city.state, service.name);
  const nearby =
    city.tier === "mmr"
      ? mmrCities().filter((c) => c.slug !== city.slug).slice(0, 6)
      : seoCities.filter((c) => c.slug !== city.slug).slice(0, 6);
  const related = seoServices.filter((s) => s.slug !== service.slug).slice(0, 4);
  const steps = service.howItWorks || [];

  return (
    <div className="page-shell">
      <SEO
        title={serviceMeta.title}
        description={`${service.name} agency in ${city.name}, ${city.state}. ${service.pitch} Get a free growth plan on WhatsApp 9222 122333.`}
        path={path}
        keywords={serviceMeta.keywords}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: city.name, path: locationPath(city.slug) },
          { name: service.name, path },
        ]}
      />
      <FAQPageSchema faqs={faqs} />

      <div className="container">
        <div className="page-frame loc-page">
          <p className="badge">
            {city.name} · {service.name}
          </p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            {service.name} in {city.name}
          </h1>
          <p className="loc-tldr" role="doc-subtitle">
            <strong>Answer:</strong> {locationTldr(city, service)}
          </p>

          <CityCtas
            cityName={city.name}
            whatsappHref={wa}
            phoneHref={company.phoneHref}
            phoneLabel={company.phone}
          />

          <p className="loc-trust-line">
            Free plan · Reply in business hours · Tracking + WhatsApp follow-up included in kickoff
          </p>

          {(city.pricingHint || service.costFaq) && (
            <p className="loc-pricing">
              <strong>Cost guide:</strong> {city.pricingHint || service.costFaq}
            </p>
          )}

          <section className="loc-section">
            <h2 className="loc-h2">What you get</h2>
            <ul className="loc-list">
              {service.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>Local context for {city.name}</li>
              <li>Weekly reporting + WhatsApp support</li>
            </ul>
          </section>

          {steps.length > 0 && (
            <section className="loc-section">
              <h2 className="loc-h2">How {service.name} works</h2>
              <ol className="loc-steps">
                {steps.map((step, i) => (
                  <li key={step}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {city.neighbourhoods && city.neighbourhoods.length > 0 && (
            <section className="loc-section">
              <h2 className="loc-h2">{service.name} coverage in {city.name}</h2>
              <div className="loc-tags">
                {city.neighbourhoods.map((n) => (
                  <span key={n} className="loc-tag">
                    {n}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="loc-section">
            <h2 className="loc-h2">Why {city.name} businesses hire us</h2>
            <p className="loc-body">
              {city.blurb} We combine {service.name.toLowerCase()} with landing pages, tracking, and
              sales follow-up so your team can close faster.{" "}
              <Link to={service.serviceHref}>See full {service.name} service →</Link>
            </p>
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

          <section className="loc-section">
            <h2 className="loc-h2">Related in {city.name}</h2>
            <div className="loc-tags">
              {related.map((s) => (
                <Link key={s.slug} to={locationPath(city.slug, s.slug)} className="loc-tag loc-tag--link">
                  {s.name}
                </Link>
              ))}
            </div>
          </section>

          <section className="loc-section">
            <h2 className="loc-h2">Nearby / other cities</h2>
            <div className="loc-tags">
              {nearby.map((c) => (
                <Link key={c.slug} to={locationPath(c.slug, service.slug)} className="loc-tag loc-tag--link">
                  {service.name} in {c.name}
                </Link>
              ))}
            </div>
          </section>

          <section className="loc-section loc-convert">
            <h2 className="loc-h2">Ready to start in {city.name}?</h2>
            <p className="loc-body">
              Tell us your offer and monthly budget. We’ll reply with a plain 30-day plan — no jargon.
            </p>
            <CityCtas
              cityName={city.name}
              whatsappHref={wa}
              phoneHref={company.phoneHref}
              phoneLabel={company.phone}
            />
          </section>

          <p className="loc-back">
            <Link to={locationPath(city.slug)}>← All {city.name} services</Link>
            {" · "}
            <Link to="/locations">All locations</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
