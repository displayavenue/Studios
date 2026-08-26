import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function CaseStudies() {
  const ref = useReveal<HTMLDivElement>();
  const { extras } = useCms();
  const studies = extras.caseStudies || [];

  return (
    <div ref={ref}>
      <SEO
        title="Wedding Case Studies | Real Couples & Outcomes | DisplayAvenue"
        description="Real DisplayAvenue wedding case studies — destination weddings, candid Mumbai celebrations, pre-wedding films and maternity sessions across India."
        path="/case-studies"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Case Studies</span>
          </nav>
          <p className="eyebrow">Case studies</p>
          <h1>Real productions. Real outcomes.</h1>
          <p>
            Behind-the-scenes stories from real weddings and celebrations — challenge, approach and results.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container card-grid-2">
          {studies.map((c) => (
            <Link key={c.slug} to={`/case-studies/${c.slug}`} className="case-card card">
              <div className="case-card__img">
                <img src={c.image} alt="" loading="lazy" />
              </div>
              <div className="case-card__body">
                <span className="pill">
                  {c.category} · {c.city} · {c.year}
                </span>
                <h2>{c.title}</h2>
                <p>{c.summary}</p>
                <strong>{c.result}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <TestimonialsSection compact limit={3} />
      <CTABanner title="Want a production like these?" />
    </div>
  );
}

export function CaseStudyDetail() {
  const { slug } = useParams();
  const ref = useReveal<HTMLDivElement>();
  const { extras, company } = useCms();
  const study = extras.caseStudies.find((c) => c.slug === slug);

  if (!study) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Case study not found</h1>
          <Link to="/case-studies" className="btn btn--gold" style={{ marginTop: "1rem" }}>
            All case studies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref}>
      <SEO
        title={`${study.title} | Case Study | DisplayAvenue Studios`}
        description={study.summary}
        path={`/case-studies/${study.slug}`}
        image={study.image}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ]}
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/case-studies">Case Studies</Link>
            <span>/</span>
            <span>{study.title}</span>
          </nav>
          <p className="eyebrow">
            {study.category} · {study.city} · {study.year}
          </p>
          <h1>{study.title}</h1>
          <p>{study.summary}</p>
          <p className="case-result">{study.result}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <img className="case-hero-img" src={study.image} alt="" />
          <div className="grid-3 case-meta">
            <article className="card info-panel">
              <h3>Challenge</h3>
              <p>{study.challenge}</p>
            </article>
            <article className="card info-panel">
              <h3>Approach</h3>
              <p>{study.approach}</p>
            </article>
            <article className="card info-panel">
              <h3>Outcome</h3>
              <p>{study.outcome}</p>
            </article>
          </div>
          <div className="project-gallery" style={{ marginTop: "2rem" }}>
            {study.gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
          <div className="section-cta" style={{ marginTop: "2rem" }}>
            <Link to="/book-now" className="btn btn--gold">
              Book a similar production
            </Link>
            <a href={company.whatsappHref} className="btn btn--outline" target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
      <CTABanner />
    </div>
  );
}
