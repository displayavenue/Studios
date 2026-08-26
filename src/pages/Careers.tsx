import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import { whatsappPrefill } from "../utils/whatsapp";
import "./Page.css";

export function Careers() {
  const ref = useReveal<HTMLDivElement>();
  const { extras, company } = useCms();
  const c = extras.careers;

  return (
    <div ref={ref}>
      <SEO
        title="Careers | Join DisplayAvenue Studios"
        description="Join DisplayAvenue Studios in Mumbai — wedding photographers, product shooters, editors and producers for pan-India visual productions."
        path="/careers"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Careers</span>
          </nav>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p>{c.text}</p>
        </div>
      </section>
      <section className="section section--light">
        <div className="container">
          <ul className="perk-row">
            {c.perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Open roles</p>
            <h2>Current openings</h2>
          </div>
          <div className="stack-gap">
            {c.roles.map((role) => (
              <article key={role.id} className="card career-card">
                <div className="career-card__head">
                  <div>
                    <h3>{role.title}</h3>
                    <p>
                      {role.type} · {role.location}
                    </p>
                  </div>
                  <a
                    className="btn btn--gold btn--sm"
                    href={whatsappPrefill(
                      company.whatsappHref,
                      `Hi DisplayAvenue, I’d like to apply for ${role.title}. Here’s a short intro and portfolio link:`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apply on WhatsApp
                  </a>
                </div>
                <p>{role.summary}</p>
                <ul>
                  {role.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem", color: "var(--text-muted)" }}>
            Don’t see a fit? Send your portfolio anytime to{" "}
            <a href={company.emailHref}>{company.email}</a>.
          </p>
        </div>
      </section>
      <CTABanner title="Creative freelancers welcome" text="Tell us your craft and cities you can travel — we reply quickly." />
    </div>
  );
}
