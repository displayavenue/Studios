import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { company } from "../data/company";
import { SEO, BreadcrumbSchema, FAQPageSchema, ArticleSchema } from "../components/SEO";
import "./Page.css";
import "./Guides.css";

export type GuidePage = {
  id: number;
  slug: string;
  keyword: string;
  intent: string;
  locality: string;
  bhk: string | null;
  title: string;
  h1: string;
  description: string;
  updatedAt: string;
  reviewedBy: string;
  experienceYearsNote: string;
  intro: string[];
  howWeHelp: string[];
  checklist: string[];
  caseStudy: {
    title: string;
    challenge: string;
    approach: string;
    outcome: string;
    timeline: string;
  };
  reviews: { name: string; role: string; rating: number; quote: string }[];
  faqs: { question: string; answer: string }[];
  primaryCta: string;
  relatedPath: string;
  relatedLabel: string;
};

type GuidesFile = { count: number; guides: GuidePage[] };

let cache: GuidesFile | null = null;

async function loadGuides(): Promise<GuidesFile> {
  if (cache) return cache;
  const res = await fetch("/content/guides.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("guides missing");
  cache = (await res.json()) as GuidesFile;
  return cache;
}

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

function waHref(keyword: string) {
  const msg = `Hi DisplayAvenue Realty, I searched for: ${keyword}. Please help.`;
  return `https://wa.me/918169122333?text=${encodeURIComponent(msg)}`;
}

export function GuidesIndex() {
  const [data, setData] = useState<GuidesFile | null>(null);

  useEffect(() => {
    loadGuides()
      .then(setData)
      .catch(() => setData({ count: 0, guides: [] }));
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, GuidePage[]>();
    for (const g of data?.guides || []) {
      const list = map.get(g.intent) || [];
      list.push(g);
      map.set(g.intent, list);
    }
    return [...map.entries()];
  }, [data]);

  const labels: Record<string, string> = {
    buy: "Buy & resale",
    rent: "Rent",
    sell: "Sell & valuation",
    commercial: "Commercial",
    redevelopment: "Redevelopment",
    locality: "Locality research",
  };

  return (
    <div>
      <SEO
        title="Local property guides | DisplayAvenue Realty"
        description="EEAT guides for buying, renting, selling, commercial and redevelopment across Mira Road, Dahisar and Bhayandar."
        path="/guides"
      />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Local expertise</span>
          <h1>Guides that answer real searches</h1>
          <p>
            Practical pages for Dahisar, Mira Road and Bhayandar, written from on-ground
            experience, with FAQs, case notes and reviews.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {!data && <p>Loading guides…</p>}
          {data && (
            <p className="guides-count">
              {data.count} local guides · Reviewed by {company.name} desk, Mira Road East
            </p>
          )}
          {groups.map(([intent, items]) => (
            <div key={intent} className="guides-group">
              <h2>{labels[intent] || intent}</h2>
              <div className="guides-list">
                {items.map((g) => (
                  <Link key={g.slug} to={`/guides/${g.slug}`} className="guides-list__item">
                    <strong>{g.h1}</strong>
                    <span>{g.locality}</span>
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

export function GuideDetail() {
  const { slug = "" } = useParams();
  const [guide, setGuide] = useState<GuidePage | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadGuides()
      .then((d) => {
        if (cancelled) return;
        setGuide(d.guides.find((g) => g.slug === slug) || null);
      })
      .catch(() => {
        if (!cancelled) setGuide(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (guide === undefined) {
    return (
      <div className="section">
        <div className="container">
          <p>Loading…</p>
        </div>
      </div>
    );
  }
  if (!guide) return <Navigate to="/guides" replace />;

  return (
    <div>
      <SEO
        title={guide.title}
        description={guide.description}
        path={`/guides/${guide.slug}`}
        type="article"
      />
      <ArticleSchema
        title={guide.h1}
        description={guide.description}
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
        path={`/guides/${guide.slug}`}
        datePublished={guide.updatedAt}
        category={guide.intent}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.h1, path: `/guides/${guide.slug}` },
        ]}
      />
      <FAQPageSchema faqs={guide.faqs} />

      <article className="section guide-article">
        <div className="container guide-layout">
          <div className="guide-main">
            <span className="eyebrow">{guide.intent} · {guide.locality}</span>
            <h1>{guide.h1}</h1>

            <div className="eeat-bar" aria-label="Trust information">
              <div>
                <strong>Reviewed by</strong>
                <span>{guide.reviewedBy}</span>
              </div>
              <div>
                <strong>Updated</strong>
                <span>{guide.updatedAt}</span>
              </div>
              <div>
                <strong>Experience</strong>
                <span>{guide.experienceYearsNote}</span>
              </div>
            </div>

            {guide.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}

            <h2>How DisplayAvenue Realty can help</h2>
            <ul className="check-list">
              {guide.howWeHelp.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Practical checklist</h2>
            <ul className="check-list">
              {guide.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <section className="guide-case" aria-labelledby="case-title">
              <h2 id="case-title">Case study</h2>
              <h3>{guide.caseStudy.title}</h3>
              <p>
                <strong>Challenge:</strong> {guide.caseStudy.challenge}
              </p>
              <p>
                <strong>Approach:</strong> {guide.caseStudy.approach}
              </p>
              <p>
                <strong>Outcome:</strong> {guide.caseStudy.outcome}
              </p>
              <p>
                <strong>Timeline:</strong> {guide.caseStudy.timeline}
              </p>
            </section>

            <section aria-labelledby="reviews-title">
              <h2 id="reviews-title">Client reviews</h2>
              <div className="guide-reviews">
                {guide.reviews.map((r) => (
                  <figure key={r.name + r.quote.slice(0, 24)} className="guide-review">
                    <div className="guide-review__stars" aria-label={`${r.rating} out of 5`}>
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
              <h2 id="faq-title">FAQs</h2>
              <div className="guide-faqs">
                {guide.faqs.map((f) => (
                  <details key={f.question} className="guide-faq">
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="guide-aside">
            <div className="guide-cta-card">
              <h2>Talk to the local desk</h2>
              <p>
                Searching for <em>{guide.keyword}</em>? Get a practical shortlist for{" "}
                {guide.locality}.
              </p>
              <a className="btn btn--brass" href={waHref(guide.keyword)} target="_blank" rel="noreferrer">
                {guide.primaryCta}
              </a>
              <a className="btn btn--outline" href={company.phoneHref}>
                Call {company.phone}
              </a>
              <Link className="text-link" to={guide.relatedPath}>
                {guide.relatedLabel}
              </Link>
              <p className="guide-cta-card__note">
                Office: Unique Garden, Kanakia, Mira Road East · Transparent fees · WhatsApp-first
                updates
              </p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
