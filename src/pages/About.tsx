import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { ClientLogoWall } from "../components/ClientLogoWall";
import { GoogleReviews } from "../components/GoogleReviews";
import { TrustStats } from "../components/TrustStats";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import { img } from "../data/images";
import "./Page.css";

export function About() {
  const ref = useReveal<HTMLDivElement>();
  const { company, team, processSteps, whyChoose } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="About DisplayAvenue Studios | India's Premium Visual Production Studio"
        description="Meet DisplayAvenue Studios — a Mumbai-based luxury visual production company delivering photography, videography and post production across India."
        path="/about"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About</span>
          </nav>
          <p className="eyebrow">About Us</p>
          <h1>A luxury visual studio built for India&apos;s most important moments</h1>
          <p>
            DisplayAvenue Studios is a premium photography, videography and film
            production company headquartered in Mira Road East, Mumbai — trusted by
            120+ brands, hotels and families across 11 industry verticals.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <TrustStats compact />
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <div className="reveal">
            <p className="eyebrow">Company Story</p>
            <h2>Crafted in Mumbai. Trusted pan India.</h2>
            <p>
              DisplayAvenue Studios began with a simple belief: visual production
              in India deserves the same care as the world&apos;s best creative
              houses. We combine cinematic technique, cultural fluency and
              commercial discipline to create work that feels luxurious, honest
              and conversion-ready.
            </p>
            <p>
              Today, our teams photograph weddings in Udaipur, film factories in
              Pune, stage product campaigns in Mumbai and deliver hospitality
              imagery for resorts across the coastline — all under one studio
              standard.
            </p>
          </div>
          <div className="about-story__media reveal">
            <img
              src={img.indianWeddingCouple}
              alt="DisplayAvenue Studios team capturing an Indian wedding ceremony"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container grid-2">
          <article className="info-panel card reveal">
            <p className="eyebrow">Mission</p>
            <h3>Make premium visual storytelling accessible nationwide</h3>
            <p>
              We exist to help couples and brands commission world-class
              photography and film without compromising on trust, timelines or
              creative excellence.
            </p>
          </article>
          <article className="info-panel card reveal">
            <p className="eyebrow">Vision</p>
            <h3>Become India&apos;s largest visual production platform</h3>
            <p>
              Our vision is a scalable studio network — local expertise,
              national coverage and digital booking — that sets the benchmark
              for luxury visual production in India.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Meet the Team</p>
            <h2>Creative leadership behind every frame</h2>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name} className="team-card card reveal">
                <img src={member.image} alt={member.name} loading="lazy" />
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container about-equip">
          <div className="reveal">
            <p className="eyebrow">Equipment</p>
            <h2>Cinema-grade tools. Studio discipline.</h2>
            <ul className="check-list">
              <li>Full-frame mirrorless and cinema camera systems</li>
              <li>Prime and cinema zoom lenses for portraits and film</li>
              <li>Professional LED and flash lighting kits</li>
              <li>Wireless audio for interviews and vows</li>
              <li>Licensed drone units for aerial storytelling</li>
              <li>Colour-managed post production workflow</li>
            </ul>
          </div>
          <div className="reveal">
            <p className="eyebrow">Creative Process</p>
            <h2>How premium work gets made</h2>
            <div className="mini-process">
              {processSteps.map((s) => (
                <div key={s.step}>
                  <strong>
                    {s.step} · {s.title}
                  </strong>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">Awards & Recognition</p>
            <h2>Recognised for craft and client trust</h2>
          </div>
          <div className="awards-row reveal">
            <div>
              <strong>Wedding Film Excellence</strong>
              <span>Destination storytelling shortlist</span>
            </div>
            <div>
              <strong>Brand Film Distinction</strong>
              <span>Corporate narrative category</span>
            </div>
            <div>
              <strong>Client Choice</strong>
              <span>5-star average review standard</span>
            </div>
            <div>
              <strong>Pan India Delivery</strong>
              <span>Productions across major metros</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Behind The Scenes</p>
            <h2>Calm crews. Obsessive finish.</h2>
            <p>
              On every set you will find clear roles, backup media workflows and
              a producer mindset — so families enjoy the day and marketing teams
              hit their launch dates.
            </p>
          </div>
          <div className="why-grid">
            {whyChoose.slice(0, 3).map((item) => (
              <article key={item.title} className="why-card card reveal">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="about-address reveal">
            Visit us: {company.address.lines.join(" ")}
          </p>
        </div>
      </section>

      <ClientLogoWall />

      <GoogleReviews title="What our clients say on Google" />

      <CTABanner title="Let’s build your next visual story" />
    </div>
  );
}
