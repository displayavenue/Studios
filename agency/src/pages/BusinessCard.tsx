import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { cardProfile as c } from "../data/cardProfile";
import "./BusinessCard.css";

const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(c.cardUrl)}`;

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

export function BusinessCard() {
  return (
    <div className="bc-page">
      <SEO
        title="Akash · DisplayAvenue | Digital Business Card"
        description="Contact Akash at DisplayAvenue — phone, WhatsApp, email, services, free tools, and catalogue. Scan the QR on the DisplayAvenue business card."
        path="/card"
      />

      <header className="bc-hero">
        <p className="bc-kicker">DisplayAvenue digital card</p>
        <h1 className="bc-name">{c.personName}</h1>
        <p className="bc-title">{c.title}</p>
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

      <section className="bc-schematic" aria-label="Contact diagram">
        <div className="bc-schematic__email-wrap">
          <div className="bc-bracket bc-bracket--top bc-bracket--self">
            <span>Self</span>
          </div>
          <div className="bc-bracket bc-bracket--top bc-bracket--company">
            <span>Company</span>
          </div>
          <p className="bc-schematic__email">
            <span className="bc-self">Akash</span>
            <span className="bc-at">@</span>
            <span className="bc-company">DisplayAvenue.com</span>
          </p>
          <div className="bc-bracket bc-bracket--bottom bc-bracket--handle">
            <span>Social Media Handle</span>
          </div>
          <div className="bc-bracket bc-bracket--bottom bc-bracket--email">
            <span>Email</span>
          </div>
        </div>
        <div className="bc-schematic__phone">
          <p className="bc-phone">{c.phoneDisplay.replace(/\s/g, "")}</p>
          <p className="bc-phone-label">Contact</p>
        </div>
      </section>

      <section className="bc-cards-print" id="print-card">
        <h2>Business card</h2>
        <p className="bc-lead">
          Front uses your schematic contact design. Back carries the QR — scan opens this page.
        </p>
        <div className="bc-print-row">
          <figure className="bc-print-card">
            <img src="/images/card/front.png" alt="DisplayAvenue business card front" />
            <figcaption>Front</figcaption>
          </figure>
          <figure className="bc-print-card bc-print-card--back">
            <img src="/images/card/back.png" alt="DisplayAvenue business card back" className="bc-print-card__art" />
            <img src={qrSrc} alt="QR code linking to displayavenue.com/card" className="bc-print-card__qr" />
            <figcaption>Back · QR → {c.cardUrl.replace("https://", "")}</figcaption>
          </figure>
        </div>
        <div className="bc-actions">
          <button type="button" className="bc-btn bc-btn--primary" onClick={() => window.print()}>
            Print / save PDF
          </button>
          <a className="bc-btn" href="/images/card/front.png" download="DisplayAvenue-card-front.png">
            Download front
          </a>
          <a className="bc-btn" href="/images/card/back.png" download="DisplayAvenue-card-back.png">
            Download back
          </a>
        </div>
      </section>

      <section className="bc-block">
        <h2>Contact</h2>
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
            <span>Handle</span>
            <a href={c.socials[0].href}>{c.socialHandle}</a>
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
        <h2>What we do</h2>
        <div className="bc-chip-grid">
          {c.services.map((s) => (
            <Link key={s.href} to={s.href} className="bc-chip">
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bc-block">
        <h2>Free tools</h2>
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
        <h2>Social</h2>
        <div className="bc-chip-grid">
          {c.socials.map((s) => (
            <a key={s.href} href={s.href} className="bc-chip" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <section className="bc-block bc-block--cta">
        <h2>Next step</h2>
        <p className="bc-lead">Get a free growth plan or open the catalogue.</p>
        <div className="bc-actions">
          <a className="bc-btn bc-btn--primary" href={c.tools[0].href} target="_blank" rel="noreferrer">
            Free Strategy Maker
          </a>
          <a className="bc-btn" href={c.catalogueUrl} target="_blank" rel="noreferrer">
            Catalogue PDF
          </a>
          <Link className="bc-btn" to="/">
            Visit website
          </Link>
        </div>
      </section>

      <aside className="bc-qr-sticky" aria-label="QR code">
        <img src={qrSrc} width={120} height={120} alt="QR to this card page" />
        <p>Scan to share this card</p>
      </aside>
    </div>
  );
}
