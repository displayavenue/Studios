import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { company } from "../data/company";
import {
  SEO,
  BreadcrumbSchema,
  FAQPageSchema,
  ArticleSchema,
} from "../components/SEO";
import "./Page.css";
import "./Guides.css";
import "./Societies.css";

export type SocietyPage = {
  id: number;
  slug: string;
  name: string;
  locality: string;
  localitySlug: string;
  pocket: string;
  tags: string[];
  title: string;
  h1: string;
  description: string;
  updatedAt: string;
  reviewedBy: string;
  heroImage: string;
  gallery: string[];
  imageNote: string;
  about: string[];
  typologies: string[];
  buyerFit: string[];
  priceBand: string;
  nearby: string[];
  amenities: string[];
  services: { id: string; title: string; text: string }[];
  whyLocal: string[];
  caseStudy: {
    title: string;
    challenge: string;
    approach: string;
    outcome: string;
    timeline: string;
  };
  reviews: { name: string; role: string; rating: number; quote: string }[];
  faqs: { question: string; answer: string }[];
  ctaLabel: string;
};

type SocietiesFile = {
  count: number;
  locality: string;
  societies: SocietyPage[];
};

let cache: SocietiesFile | null = null;

async function loadSocieties(): Promise<SocietiesFile> {
  if (cache) return cache;
  const res = await fetch("/content/societies.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("societies missing");
  cache = (await res.json()) as SocietiesFile;
  return cache;
}

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

function waHref(society: string) {
  const msg = `Hi DisplayAvenue Realty, I need help with ${society}, Mira Road.`;
  return `https://wa.me/918169122333?text=${encodeURIComponent(msg)}`;
}

export function SocietiesIndex() {
  const [data, setData] = useState<SocietiesFile | null>(null);

  useEffect(() => {
    loadSocieties()
      .then(setData)
      .catch(() => setData({ count: 0, locality: "Mira Road", societies: [] }));
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, SocietyPage[]>();
    for (const s of data?.societies || []) {
      const list = map.get(s.pocket) || [];
      list.push(s);
      map.set(s.pocket, list);
    }
    return [...map.entries()];
  }, [data]);

  return (
    <div>
      <SEO
        title="Mira Road societies | DisplayAvenue Realty services"
        description="Buy, sell and rent support across major Mira Road societies: Unique Garden, Beverly Park, JP North, Shanti Park and more."
        path="/societies"
      />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Mira Road coverage</span>
          <h1>Societies we actively service</h1>
          <p>
            Detailed local pages for major Mira Road complexes. Buy, sell, rent,
            visits and advisory with DisplayAvenue Realty.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {!data && <p>Loading societies…</p>}
          {data && (
            <p className="societies-count">
              {data.count} society pages · Desk based in Unique Garden, Kanakia,
              Mira Road East
            </p>
          )}
          {groups.map(([pocket, items]) => (
            <div key={pocket} className="societies-group">
              <h2>{pocket}</h2>
              <div className="societies-grid">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/societies/${s.slug}`}
                    className="society-card"
                  >
                    <img src={s.heroImage} alt={`${s.name} Mira Road`} loading="lazy" />
                    <div>
                      <h3>{s.name}</h3>
                      <p>{s.pocket}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function SocietyDetail() {
  const { slug = "" } = useParams();
  const [society, setSociety] = useState<SocietyPage | null | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;
    loadSocieties()
      .then((d) => {
        if (cancelled) return;
        setSociety(d.societies.find((s) => s.slug === slug) || null);
      })
      .catch(() => {
        if (!cancelled) setSociety(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (society === undefined) {
    return (
      <div className="section">
        <div className="container">
          <p>Loading…</p>
        </div>
      </div>
    );
  }
  if (!society) return <Navigate to="/societies" replace />;

  return (
    <div>
      <SEO
        title={society.title}
        description={society.description}
        path={`/societies/${society.slug}`}
        image={society.heroImage}
        type="article"
      />
      <ArticleSchema
        title={society.h1}
        description={society.description}
        image={society.heroImage}
        path={`/societies/${society.slug}`}
        datePublished={society.updatedAt}
        category="Society guide"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Societies", path: "/societies" },
          { name: society.name, path: `/societies/${society.slug}` },
        ]}
      />
      <FAQPageSchema faqs={society.faqs} />

      <section className="society-hero">
        <img src={society.heroImage} alt={`${society.name}, Mira Road`} />
        <div className="society-hero__overlay">
          <div className="container">
            <span className="eyebrow">{society.pocket}</span>
            <h1>{society.h1}</h1>
            <p>Buy · Sell · Rent · Visits · Local advisory</p>
          </div>
        </div>
      </section>

      <article className="section">
        <div className="container society-layout">
          <div className="society-main">
            <div className="eeat-bar" aria-label="Trust information">
              <div>
                <strong>Reviewed by</strong>
                <span>{society.reviewedBy}</span>
              </div>
              <div>
                <strong>Updated</strong>
                <span>{society.updatedAt}</span>
              </div>
              <div>
                <strong>Locality</strong>
                <span>
                  <Link to={`/localities/${society.localitySlug}`}>
                    {society.locality}
                  </Link>
                </span>
              </div>
            </div>

            {society.about.map((p) => (
              <p key={p}>{p}</p>
            ))}

            <p className="image-note">{society.imageNote}</p>

            <div className="society-gallery">
              {society.gallery.map((src, idx) => (
                <img
                  key={src + idx}
                  src={src}
                  alt={`${society.name} view ${idx + 1}`}
                  loading="lazy"
                />
              ))}
            </div>

            <h2>Our services in {society.name}</h2>
            <div className="society-services">
              {society.services.map((svc) => (
                <div key={svc.id} className="society-service">
                  <h3>{svc.title}</h3>
                  <p>{svc.text}</p>
                </div>
              ))}
            </div>

            <h2>Who it suits</h2>
            <ul className="check-list">
              {society.buyerFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Typical configurations</h2>
            <p>{society.typologies.join(" · ")}</p>
            <p>
              <strong>Price band:</strong> {society.priceBand}
            </p>

            <h2>Nearby & daily life</h2>
            <ul className="check-list">
              {society.nearby.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Amenities commonly expected</h2>
            <ul className="check-list">
              {society.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Why work with DisplayAvenue Realty here</h2>
            <ul className="check-list">
              {society.whyLocal.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <section className="guide-case" aria-labelledby="case-title">
              <h2 id="case-title">Case study</h2>
              <h3>{society.caseStudy.title}</h3>
              <p>
                <strong>Challenge:</strong> {society.caseStudy.challenge}
              </p>
              <p>
                <strong>Approach:</strong> {society.caseStudy.approach}
              </p>
              <p>
                <strong>Outcome:</strong> {society.caseStudy.outcome}
              </p>
              <p>
                <strong>Timeline:</strong> {society.caseStudy.timeline}
              </p>
            </section>

            <section aria-labelledby="reviews-title">
              <h2 id="reviews-title">Client reviews</h2>
              <div className="guide-reviews">
                {society.reviews.map((r) => (
                  <figure
                    key={r.name + r.quote.slice(0, 20)}
                    className="guide-review"
                  >
                    <div
                      className="guide-review__stars"
                      aria-label={`${r.rating} out of 5`}
                    >
                      {stars(r.rating)}
                    </div>
                    <blockquote>{r.quote}</blockquote>
                    <figcaption>
                      <strong>{r.name}</strong>
                      <span>{r.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section aria-labelledby="faq-title">
              <h2 id="faq-title">FAQs about {society.name}</h2>
              <div className="guide-faqs">
                {society.faqs.map((f) => (
                  <details key={f.question} className="guide-faq">
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="society-aside">
            <div className="guide-cta-card">
              <h2>Need help in {society.name}?</h2>
              <p>
                Tell us buy, sell or rent. We will shortlist live options and
                arrange visits.
              </p>
              <a
                className="btn btn--brass"
                href={waHref(society.name)}
                target="_blank"
                rel="noreferrer"
              >
                {society.ctaLabel}
              </a>
              <a className="btn btn--outline" href={company.phoneHref}>
                Call {company.phone}
              </a>
              <Link className="text-link" to="/buy">
                Browse Mira Road listings
              </Link>
              <Link className="text-link" to="/localities/mira-road">
                Mira Road locality guide
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
