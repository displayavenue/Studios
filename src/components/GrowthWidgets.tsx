import { useCms } from "../cms/CmsProvider";
import "./GrowthWidgets.css";

export function GoogleReviewsBlock({ compact = false }: { compact?: boolean }) {
  const { extras } = useCms();
  const g = extras.googleReviews;
  if (!g.reviews?.length) return null;

  return (
    <section className={`section ${compact ? "" : "section--light"} google-reviews`}>
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow">{g.label}</p>
          <h2>Loved on Google by couples &amp; brands</h2>
          <div className="google-reviews__score">
            <span className="google-reviews__stars">★★★★★</span>
            <strong>{g.rating.toFixed(1)}</strong>
            <span>{g.count}+ reviews</span>
            <a href={g.profileUrl} target="_blank" rel="noreferrer" className="text-link">
              View on Google →
            </a>
          </div>
        </div>
        <div className="google-reviews__grid">
          {(compact ? g.reviews.slice(0, 3) : g.reviews).map((r) => (
            <article key={r.name + r.time} className="google-review-card card">
              <div className="google-review-card__top">
                <span className="google-review-card__avatar" aria-hidden>
                  {r.initials}
                </span>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.time}</span>
                </div>
                <span className="google-review-card__g" aria-hidden>
                  G
                </span>
              </div>
              <p className="google-review-card__stars" aria-label={`${r.rating} stars`}>
                {"★".repeat(r.rating)}
              </p>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramGrid() {
  const { extras } = useCms();
  const ig = extras.instagram;
  if (!ig.posts?.length) return null;

  return (
    <section className="section instagram-grid">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow">Instagram</p>
          <h2>Fresh frames from {ig.handle}</h2>
          <p>Follow along for weddings, brands and places across India.</p>
        </div>
        <div className="instagram-grid__row">
          {ig.posts.map((p) => (
            <a
              key={p.id}
              href={ig.url}
              target="_blank"
              rel="noreferrer"
              className="instagram-grid__card"
            >
              <img src={p.image} alt={p.caption} loading="lazy" />
              <span>
                ♥ {p.likes}
                <small>{p.caption}</small>
              </span>
            </a>
          ))}
        </div>
        <div className="section-cta" style={{ justifyContent: "center" }}>
          <a href={ig.url} className="btn btn--outline" target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export function AwardsStrip() {
  const { extras } = useCms();
  if (!extras.awards?.length) return null;
  return (
    <section className="awards-strip">
      <div className="container awards-strip__inner">
        {extras.awards.map((a) => (
          <div key={a.title} className="awards-strip__item">
            <strong>{a.title}</strong>
            <span>
              {a.org} · {a.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ShowreelBlock() {
  const { extras } = useCms();
  const s = extras.showreel;
  if (!s.youtubeUrl && !s.poster) return null;

  const embed = s.youtubeUrl
    ? s.youtubeUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "www.youtube.com/embed/")
        .split("&")[0]
    : "";

  return (
    <section className="section section--dark showreel">
      <div className="container showreel__grid">
        <div>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2>{s.title}</h2>
          {s.text ? <p>{s.text}</p> : null}
        </div>
        <div className="showreel__media">
          {embed ? (
            <iframe
              title="DisplayAvenue Studios showreel"
              src={embed}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <img src={s.poster} alt="" />
          )}
        </div>
      </div>
    </section>
  );
}
