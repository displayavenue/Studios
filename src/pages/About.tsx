import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { img } from "../data/images";
import "./Page.css";

export function About() {
  const { company, team, whyChoose } = useCms();

  return (
    <div>
      <SEO
        title="About DisplayAvenue Real Estate | Mira Road based advisors"
        description="DisplayAvenue Real Estate helps families and businesses buy, sell, rent and redevelop property across Dahisar, Mira Road and Bhayandar."
        path="/about"
        image={img.teamOffice}
      />

      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">About</span>
          <h1>Local advisors. Clear property moves.</h1>
          <p>{company.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <div>
            <h2>Based in Mira Road East</h2>
            <p>
              DisplayAvenue Real Estate focuses on the markets we live and work
              in — Dahisar, Mira Road and Bhayandar. That means sharper pricing
              sense, faster visits, and advice rooted in how these societies
              actually transact.
            </p>
            <p>
              From first-home buyers to shop owners and society committees, we
              keep communication simple: WhatsApp updates, honest gaps, and
              documentation checklists before money moves.
            </p>
          </div>
          <div className="about-story__media">
            <img src={img.teamOffice} alt="DisplayAvenue Real Estate desk" />
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we stand for</span>
            <h2>Trust you can verify locally</h2>
          </div>
          <div className="why-grid">
            {whyChoose.map((w) => (
              <article key={w.title} className="why-item">
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Team</span>
            <h2>Who you&apos;ll talk to</h2>
          </div>
          <div className="team-grid">
            {team.map((t) => (
              <article key={t.name} className="team-card">
                <img src={t.image} alt={t.name} />
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.role}</p>
                  <p>{t.bio}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="info-panel">
            <h3>Visit / call</h3>
            <address>
              {company.address.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p>
              <a href={company.phoneHref}>{company.phone}</a> ·{" "}
              <a href={company.emailHref}>{company.email}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
