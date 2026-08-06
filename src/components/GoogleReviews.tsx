import { useCms } from "../cms/CmsProvider";
import "./GoogleReviews.css";

type DemoReview = {
  name: string;
  role: string;
  text: string;
  when: string;
};

const defaultReviews: DemoReview[] = [
  {
    name: "Priya & Aditya Nair",
    role: "Destination wedding · Udaipur",
    text: "Our three-day wedding film and gallery exceeded every expectation. The team was calm, invisible during rituals and delivered a highlight reel our families still watch weekly.",
    when: "3 weeks ago",
  },
  {
    name: "Rahul Mehta",
    role: "CMO · D2C lifestyle brand",
    text: "DisplayAvenue handled our entire launch — product stills, reels and a brand film. Assets were marketplace-ready and on brand from day one.",
    when: "1 month ago",
  },
  {
    name: "Ananya Deshmukh",
    role: "GM · Coastal resort, Goa",
    text: "Room, F&B and drone imagery lifted our OTA conversion within weeks. Professional, fast and easy to coordinate with our marketing team.",
    when: "2 months ago",
  },
];

export function GoogleReviews({ title = "Rated highly by clients across India" }: { title?: string }) {
  const { company } = useCms();
  const rating = (company as { googleRating?: string }).googleRating || "4.9";
  const reviewCount = (company as { googleReviewCount?: string }).googleReviewCount || "127";
  const reviews = defaultReviews;
  const mapsUrl =
    company.googleReviewsUrl?.trim() ||
    "https://www.google.com/maps/search/DisplayAvenue+Studios+Mumbai/reviews";

  return (
    <section className="section section--light google-reviews">
      <div className="container">
        <div className="google-reviews__head reveal">
          <div>
            <p className="eyebrow">Google Reviews</p>
            <h2>{title}</h2>
            <p>
              Couples, marketing teams and hospitality leaders trust DisplayAvenue
              for premium photography and film production.
            </p>
          </div>
          <div className="google-reviews__score card">
            <div className="google-reviews__brand" aria-hidden>
              G
            </div>
            <div>
              <strong>{rating}</strong>
              <span className="google-reviews__stars" aria-label={`${rating} out of 5 stars`}>
                ★★★★★
              </span>
              <em>{reviewCount} verified reviews</em>
            </div>
          </div>
        </div>

        <div className="google-reviews__grid">
          {reviews.map((r) => (
            <article key={r.name} className="google-review-card card reveal">
              <div className="google-review-card__top">
                <div className="google-review-card__avatar" aria-hidden>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </div>
                <span className="google-review-card__when">{r.when}</span>
              </div>
              <div className="google-review-card__stars" aria-hidden>
                ★★★★★
              </div>
              <p>&ldquo;{r.text}&rdquo;</p>
            </article>
          ))}
        </div>

        <div className="google-reviews__actions reveal">
          <a
            href={mapsUrl}
            className="btn btn--gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            Read all Google reviews
          </a>
          <a
            href={company.whatsappHref}
            className="btn btn--outline"
            target="_blank"
            rel="noreferrer"
          >
            Request references on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
