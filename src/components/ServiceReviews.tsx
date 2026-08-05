import { useMemo, useState } from "react";
import type { ServiceReview } from "../data/services";
import "./ServiceReviews.css";

type Props = {
  serviceTitle: string;
  reviews: ServiceReview[];
  initialVisible?: number;
};

export function ServiceReviews({
  serviceTitle,
  reviews,
  initialVisible = 9,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const list = useMemo(
    () => (reviews || []).filter((r) => r?.name && r?.quote),
    [reviews],
  );

  if (!list.length) return null;

  const visible = expanded ? list : list.slice(0, initialVisible);
  const avg =
    list.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / list.length;

  return (
    <section className="section section--light service-reviews" aria-label={`${serviceTitle} reviews`}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Client reviews</p>
          <h2>What clients say about {serviceTitle}</h2>
          <p>
            Real feedback from people who booked this service with DisplayAvenue
            Studios across India.
          </p>
          <p className="service-reviews__score" aria-label={`${avg.toFixed(1)} out of 5 from ${list.length} reviews`}>
            <span>★★★★★</span> {avg.toFixed(1)}/5 · {list.length} reviews
          </p>
        </div>

        <div className="service-reviews__grid">
          {visible.map((r, i) => (
            <article key={`${r.name}-${i}`} className="service-review-card card reveal">
              <div
                className="service-review-card__stars"
                aria-label={`${r.rating || 5} star review`}
              >
                {"★".repeat(Math.max(1, Math.min(5, Number(r.rating) || 5)))}
              </div>
              <p className="service-review-card__quote">“{r.quote}”</p>
              <div className="service-review-card__person">
                {r.image ? (
                  <img src={r.image} alt="" loading="lazy" width={48} height={48} />
                ) : (
                  <span className="service-review-card__avatar" aria-hidden>
                    {r.name.slice(0, 1)}
                  </span>
                )}
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {list.length > initialVisible && (
          <div className="section-cta reveal" style={{ justifyContent: "center" }}>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? "Show fewer reviews"
                : `Show all ${list.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
