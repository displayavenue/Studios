import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema, FAQPageSchema } from "../components/SEO";
import {
  buildLocationFaqs,
  findCity,
  findService,
  locationPath,
  seoCities,
  seoServices,
} from "../data/locations";
import { company } from "../data/company";
import "../styles/pages.css";

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

  return (
    <div className="page-shell">
      <SEO
        title={`Digital Marketing Agency in ${city.name} | DisplayAvenue`}
        description={`Google Ads, Meta Ads, SEO, Local SEO, websites and lead generation for businesses in ${city.name}, ${city.state}. Free strategy tools + WhatsApp support.`}
        path={locationPath(city.slug)}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: city.name, path: locationPath(city.slug) },
        ]}
      />
      <div className="container">
        <div className="page-frame" style={{ maxWidth: 980 }}>
          <p className="badge">{city.state}</p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            Digital marketing in {city.name}
          </h1>
          <p className="section-sub">
            {city.blurb} DisplayAvenue helps {city.name} businesses get found, generate enquiries, and
            convert via Google, Meta, websites, and WhatsApp.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", margin: "1.1rem 0 1.5rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Get free plan for {city.name}
            </Link>
            <a className="btn btn-outline" href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="btn btn-outline" href="https://displayavenue.com/strategy/">
              Strategy Maker
            </a>
          </div>

          <h2 style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Services in {city.name}</h2>
          <div className="mini-grid-4" style={{ marginTop: "0.85rem" }}>
            {seoServices.map((service) => (
              <Link
                key={service.slug}
                to={locationPath(city.slug, service.slug)}
                className="tool-card"
                style={{ padding: "1rem", textDecoration: "none", color: "inherit", display: "block" }}
              >
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>{service.name}</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.86rem" }}>{service.short}</p>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: "1.5rem" }}>
            <Link to="/locations">← All cities</Link>
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
  const nearby = seoCities.filter((c) => c.slug !== city.slug).slice(0, 6);
  const related = seoServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div className="page-shell">
      <SEO
        title={`${service.name} in ${city.name} | DisplayAvenue`}
        description={`${service.name} agency in ${city.name}, ${city.state}. ${service.pitch} Get a free growth plan on WhatsApp 9222 122333.`}
        path={path}
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
        <div className="page-frame" style={{ maxWidth: 920 }}>
          <p className="badge">
            {city.name} · {service.name}
          </p>
          <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
            {service.name} in {city.name}
          </h1>
          <p className="section-sub">
            {service.pitch} Built for businesses in {city.name}, {city.state} that want measurable
            enquiries—not vanity traffic.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", margin: "1.1rem 0 1.4rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Get a free {city.name} plan
            </Link>
            <a className="btn btn-outline" href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp 9222 122333
            </a>
            <a className="btn btn-outline" href="https://displayavenue.com/strategy/">
              Free Strategy Maker
            </a>
            <a className="btn btn-outline" href="https://displayavenue.com/data/">
              Find leads (Data)
            </a>
          </div>

          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.15rem", color: "var(--navy)" }}>What you get</h2>
            <ul className="feature-list" style={{ marginTop: "0.65rem" }}>
              {service.outcomes.map((item) => (
                <li key={item}>
                  <strong>{item}</strong>
                </li>
              ))}
              <li>
                <strong>Local context for {city.name}</strong>
              </li>
              <li>
                <strong>Weekly reporting + WhatsApp support</strong>
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.15rem", color: "var(--navy)" }}>Why {city.name} businesses hire us</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
              {city.blurb} We combine {service.name.toLowerCase()} with landing pages, tracking, and
              sales follow-up so your team can close faster. Explore the core service page for deeper
              detail: <Link to={service.serviceHref}>{service.name}</Link>.
            </p>
          </section>

          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.15rem", color: "var(--navy)" }}>FAQs</h2>
            <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.75rem" }}>
              {faqs.map((f) => (
                <article key={f.question} className="tool-card" style={{ padding: "1rem" }}>
                  <h3 style={{ margin: "0 0 0.35rem", fontSize: "0.98rem" }}>{f.question}</h3>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>{f.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", color: "var(--navy)" }}>Related in {city.name}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
              {related.map((s) => (
                <Link key={s.slug} to={locationPath(city.slug, s.slug)} className="btn btn-outline btn-sm">
                  {s.name}
                </Link>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.1rem", color: "var(--navy)" }}>Nearby / other cities</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
              {nearby.map((c) => (
                <Link key={c.slug} to={locationPath(c.slug, service.slug)} className="btn btn-outline btn-sm">
                  {service.name} in {c.name}
                </Link>
              ))}
            </div>
          </section>

          <p>
            <Link to={locationPath(city.slug)}>← All {city.name} services</Link>
            {" · "}
            <Link to="/locations">All locations</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
