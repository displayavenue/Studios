import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function ClientGallery() {
  const { extras } = useCms();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState<string | null>(null);

  const gallery = useMemo(
    () => extras.clientGalleries.find((g) => g.code === unlocked) || null,
    [extras.clientGalleries, unlocked],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const match = extras.clientGalleries.find(
      (g) => g.code.toLowerCase() === code.trim().toLowerCase(),
    );
    if (!match) {
      setError("Gallery code not found. Check your delivery email or WhatsApp.");
      setUnlocked(null);
      return;
    }
    setError("");
    setUnlocked(match.code);
  };

  return (
    <div>
      <SEO
        title="Client Gallery Portal | DisplayAvenue Studios"
        description="Access your private DisplayAvenue Studios gallery with the code from your delivery message."
        path="/client-gallery"
        noindex
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Client Gallery</span>
          </nav>
          <p className="eyebrow">Private delivery</p>
          <h1>Client gallery portal</h1>
          <p>
            Enter the gallery code from your WhatsApp or email delivery note.
            Demo codes: <code>AANYA2025</code>, <code>NYKAADEMO</code>,{" "}
            <code>GOARESORT</code>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          {!gallery ? (
            <form className="book-form card" onSubmit={onSubmit}>
              <h2>Unlock your gallery</h2>
              <div className="form-field">
                <label htmlFor="gallery-code">Gallery code</label>
                <input
                  id="gallery-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="YOURCODE"
                  required
                />
              </div>
              {error ? <p className="form-error">{error}</p> : null}
              <button type="submit" className="btn btn--gold">
                Open gallery
              </button>
            </form>
          ) : (
            <div>
              <div className="gallery-unlock-head">
                <div>
                  <p className="eyebrow">{gallery.type}</p>
                  <h2>{gallery.title}</h2>
                </div>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setUnlocked(null);
                    setCode("");
                  }}
                >
                  Lock gallery
                </button>
              </div>
              <div className="project-gallery">
                {gallery.images.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
