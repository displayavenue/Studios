import { useCms } from "../cms/CmsProvider";

export function GoogleReviews({ title = "Client reviews" }: { title?: string }) {
  const { company } = useCms();
  const url = company.googleReviewsUrl?.trim();

  if (!url) return null;

  return (
    <section className="section section--light">
      <div className="container reviews-panel card reveal">
        <p className="eyebrow">Social proof</p>
        <h2>{title}</h2>
        <p>
          Read what clients say about working with DisplayAvenue Studios on
          Google, or message us on WhatsApp for recent references.
        </p>
        <div className="reviews-panel__actions">
          <a
            href={url}
            className="btn btn--gold"
            target="_blank"
            rel="noreferrer noopener"
          >
            View Google reviews
          </a>
          <a
            href={company.whatsappHref}
            className="btn btn--outline"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}
