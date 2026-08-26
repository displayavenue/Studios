import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { staticPageSeo } from "../data/pageSeo";
import { cardProfile as c } from "../data/cardProfile";
import "./BusinessCard.css";

function downloadVCard() {
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${c.personName}`,
    `ORG:${c.company}`,
    `TITLE:${c.title}`,
    `TEL;TYPE=CELL,VOICE:${c.phoneE164}`,
    `EMAIL;TYPE=INTERNET:${c.email}`,
    `URL:${c.website}`,
    `ADR;TYPE=WORK:;;${c.city};;;;`,
    `NOTE:${c.tagline} · ${c.cardUrl}`,
    "END:VCARD",
  ].join("\r\n");
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "DisplayAvenue-Akash.vcf";
  a.click();
  URL.revokeObjectURL(url);
}

/** Physical 3.5×2in stationery cards + digital hub when QR is scanned. */
export function BusinessCard() {
  return (
    <div className="bc-page">
      <SEO
        title={staticPageSeo["/card"].title}
        description={staticPageSeo["/card"].description}
        path="/card"
        keywords={staticPageSeo["/card"].keywords}
      />

      {/* —— PRINT SHEET: exact physical card size for local stationery —— */}
      <section className="bc-print-sheet" id="print-card" aria-label="Printable business cards">
        <div className="bc-print-screen-only">
          <h1>Physical business card</h1>
          <p>
            Size <strong>{c.printSize}</strong> · 300 DPI · Ready for local stationery print.
            Page 1 = front, page 2 = back (QR opens this page).
          </p>
          <div className="bc-actions">
            <button type="button" className="bc-btn bc-btn--primary" onClick={() => window.print()}>
              Print for stationery
            </button>
            <a className="bc-btn" href="/images/card/DisplayAvenue-Business-Card.pdf" download>
              Download PDF
            </a>
            <a className="bc-btn" href="/images/card/print-front-300dpi.png" download>
              Front PNG
            </a>
            <a className="bc-btn" href="/images/card/print-back-300dpi.png" download>
              Back PNG (with QR)
            </a>
          </div>
        </div>

        <div className="bc-phys-row">
          <article className="bc-phys bc-phys--front" aria-label="Card front">
            <img
              src="/images/card/print-front-300dpi.png"
              alt="DisplayAvenue business card front — Akash, info@displayavenue.com"
              width={1050}
              height={600}
            />
          </article>
          <article className="bc-phys bc-phys--back" aria-label="Card back with QR">
            <img
              src="/images/card/print-back-300dpi.png"
              alt="DisplayAvenue business card back — QR to displayavenue.com/card"
              width={1050}
              height={600}
            />
          </article>
        </div>
        <p className="bc-print-screen-only bc-hint">
          Tell the printer: <strong>3.5″ × 2″</strong>, no scale, 300 DPI, double-sided (flip on short edge).
          QR must stay sharp — do not compress.
        </p>
      </section>

      {/* —— DIGITAL HUB (what visitors see after scanning) —— */}
      <div className="bc-hub">
        <header className="bc-hero">
          <p className="bc-kicker">Scanned from DisplayAvenue card</p>
          <h2 className="bc-name">{c.personName}</h2>
          <p className="bc-title">
            {c.title} · {c.company}
          </p>
          <p className="bc-tag">{c.tagline}</p>
          <div className="bc-actions">
            <a className="bc-btn bc-btn--primary" href={c.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="bc-btn" href={c.phoneHref}>
              Call {c.phoneDisplay}
            </a>
            <a className="bc-btn" href={`mailto:${c.email}`}>
              Email
            </a>
            <button type="button" className="bc-btn" onClick={downloadVCard}>
              Save contact
            </button>
          </div>
        </header>

        <section className="bc-block">
          <h3>Contact</h3>
          <ul className="bc-list">
            <li>
              <span>Email</span>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </li>
            <li>
              <span>Phone / WhatsApp</span>
              <a href={c.whatsappHref}>{c.phoneDisplay}</a>
            </li>
            <li>
              <span>Website</span>
              <a href={c.website}>{c.website.replace("https://", "")}</a>
            </li>
            <li>
              <span>Location</span>
              <a href={c.mapsUrl} target="_blank" rel="noreferrer">
                {c.city}
              </a>
            </li>
            <li>
              <span>Hours</span>
              <em>{c.hours}</em>
            </li>
          </ul>
        </section>

        <section className="bc-block">
          <h3>What we do</h3>
          <div className="bc-chip-grid">
            {c.services.map((s) => (
              <Link key={s.href} to={s.href} className="bc-chip">
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="bc-block">
          <h3>Free tools</h3>
          <div className="bc-chip-grid">
            {c.tools.map((t) =>
              t.href.startsWith("http") ? (
                <a key={t.href} href={t.href} className="bc-chip" target="_blank" rel="noreferrer">
                  {t.label}
                </a>
              ) : (
                <Link key={t.href} to={t.href} className="bc-chip">
                  {t.label}
                </Link>
              ),
            )}
          </div>
        </section>

        <section className="bc-block">
          <h3>Social</h3>
          <div className="bc-chip-grid">
            {c.socials.map((s) => (
              <a key={s.href} href={s.href} className="bc-chip" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <section className="bc-block bc-block--cta">
          <h3>Next step</h3>
          <p className="bc-lead">Get a free growth plan or open the catalogue.</p>
          <div className="bc-actions">
            <a className="bc-btn bc-btn--primary" href={c.tools[0].href} target="_blank" rel="noreferrer">
              Free Strategy Maker
            </a>
            <a className="bc-btn" href={c.catalogueUrl} target="_blank" rel="noreferrer">
              Catalogue PDF
            </a>
            <Link className="bc-btn" to="/">
              Full website
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
