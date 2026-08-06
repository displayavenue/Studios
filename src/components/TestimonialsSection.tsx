import { useCms } from "../cms/CmsProvider";
import "./TestimonialsSection.css";

type Props = {
  eyebrow?: string;
  title?: string;
  text?: string;
  limit?: number;
  compact?: boolean;
  className?: string;
};

export function TestimonialsSection({
  eyebrow,
  title,
  text,
  limit = 6,
  compact = false,
  className = "",
}: Props) {
  const { testimonials, home } = useCms();
  const items = testimonials.slice(0, limit);
  if (!items.length) return null;

  const resolvedEyebrow = eyebrow ?? home.testimonials.eyebrow ?? "Reviews";
  const resolvedTitle =
    title ?? home.testimonials.title ?? "Clients who trusted us with their biggest moments";
  const resolvedText =
    text ??
    home.testimonials.text ??
    "Real feedback from weddings, brands and hospitality teams across India.";

  return (
    <section
      className={`testimonials-section section ${compact ? "testimonials-section--compact" : ""} ${className}`.trim()}
    >
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">{resolvedEyebrow}</p>
          <h2>{resolvedTitle}</h2>
          {resolvedText ? <p>{resolvedText}</p> : null}
          <p className="testimonials-section__score" aria-label="Average rating 4.9 out of 5">
            <span>★★★★★</span> 4.9/5 average · Pan-India clients
          </p>
        </div>
        <div className={`testimonials-grid ${compact ? "testimonials-grid--compact" : ""}`}>
          {items.map((t) => (
            <article key={`${t.name}-${t.role}`} className="testimonial-card card reveal">
              <div className="testimonial-card__stars" aria-label="5 star review">
                ★★★★★
              </div>
              <p className="testimonial-card__quote">“{t.quote}”</p>
              <div className="testimonial-card__person">
                <img src={t.image} alt="" loading="lazy" width={56} height={56} />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
