import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

/** Shown for any URL that isn't a real page (noindex, so Google drops it). */
export function NotFound() {
  return (
    <>
      <SEO
        title="Page not found | DisplayAvenue Studios"
        description="This page doesn't exist. Browse wedding photography services, packages and portfolio from DisplayAvenue Studios, Mumbai."
        path="/404"
        noindex
      />
      <section className="section" style={{ paddingTop: "calc(var(--header-h) + 4rem)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "38rem" }}>
          <h1>This page doesn’t exist</h1>
          <p style={{ marginTop: "1rem" }}>
            The link may be old or mistyped. Here are the pages couples usually look for.
          </p>
          <div
            style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}
          >
            <Link to="/" className="btn btn--gold">Go to homepage</Link>
            <Link to="/packages" className="btn btn--ghost">See packages</Link>
            <Link to="/portfolio" className="btn btn--ghost">See our weddings</Link>
          </div>
        </div>
      </section>
    </>
  );
}
