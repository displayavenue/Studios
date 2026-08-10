import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./GoogleReviews.css";

function Stars({ value }: { value: number }) {
  const full = Math.round(Math.max(0, Math.min(5, value)));
  return (
    <span className="grev__stars" aria-label={`${value} out of 5 stars`}>
      {"★★★★★".slice(0, full)}
      <span aria-hidden>{"★★★★★".slice(full)}</span>
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function GoogleReviews() {
  const { googleReviews, company } = useCms();
  const data = googleReviews;
  if (!data?.enabled || !data.reviews?.length) return null;

  const maps = company.googleMaps;
  const profileUrl = data.profileUrl || maps?.profileUrl || maps?.shareUrl || "#";
  const writeUrl = data.writeReviewUrl || maps?.shareUrl || profileUrl;
  const mapsUrl = data.mapsUrl || maps?.shareUrl || profileUrl;

  return (
    <section className="grev" aria-labelledby="grev-title">
      <div className="container">
        <div className="grev__shell">
          <header className="grev__header">
            <div className="grev__brand">
              <span className="grev__g" aria-hidden>
                G
              </span>
              <div>
                <p className="grev__kicker">Google reviews</p>
                <h2 id="grev-title">{data.title}</h2>
                <p className="grev__sub">{data.sub}</p>
              </div>
            </div>
            <div className="grev__score">
              <strong>{Number(data.rating).toFixed(1)}</strong>
              <Stars value={data.rating} />
              <span>
                {data.reviewCount}+ reviews on Google
                {data.lastSyncedAt
                  ? ` · synced ${new Date(data.lastSyncedAt).toLocaleDateString("en-IN")}`
                  : ""}
              </span>
              <div className="grev__actions">
                <a
                  className="btn btn-primary btn-sm"
                  href={writeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Write a Google review
                </a>
                <a
                  className="btn btn-outline btn-sm"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Google profile
                </a>
              </div>
            </div>
          </header>

          <div className="grev__grid">
            {data.reviews.slice(0, 8).map((review) => (
              <article key={`${review.author}-${review.relativeTime}-${review.text.slice(0, 24)}`} className="grev__card">
                <div className="grev__author">
                  {review.profilePhotoUrl ? (
                    <img src={review.profilePhotoUrl} alt="" width={40} height={40} loading="lazy" />
                  ) : (
                    <span className="grev__avatar" aria-hidden>
                      {initials(review.author)}
                    </span>
                  )}
                  <div>
                    {review.authorUrl ? (
                      <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">
                        <strong>{review.author}</strong>
                      </a>
                    ) : (
                      <strong>{review.author}</strong>
                    )}
                    <span>{review.relativeTime || "Google review"}</span>
                  </div>
                </div>
                <Stars value={review.rating} />
                <p>{review.text}</p>
              </article>
            ))}
          </div>

          <div className="grev__foot">
            <p>
              Reviews sync from Google Business Profile via the CMS. Want help improving your own
              Google rating?{" "}
              <Link to="/services/reputation">See reputation management</Link> or{" "}
              <Link to="/contact">talk to us</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
