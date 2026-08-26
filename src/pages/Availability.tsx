import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import { whatsappPrefill } from "../utils/whatsapp";
import "./Page.css";

const statusLabel = {
  open: "Open",
  limited: "Limited",
  booked: "Booked",
  past: "Past",
} as const;

export function Availability() {
  const ref = useReveal<HTMLDivElement>();
  const { extras, company } = useCms();
  const a = extras.availability;

  return (
    <div ref={ref}>
      <SEO
        title="Availability Calendar | Book Your Date | DisplayAvenue Studios"
        description="Check DisplayAvenue Studios wedding and production availability. Peak Saturdays fill first — hold your date with a booking consult."
        path="/availability"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Availability</span>
          </nav>
          <p className="eyebrow">{a.eyebrow}</p>
          <h1>{a.title}</h1>
          <p>{a.text}</p>
          <div className="section-cta" style={{ marginTop: "1.25rem" }}>
            <Link to="/book-now" className="btn btn--gold">
              Hold a date
            </Link>
            <a
              href={whatsappPrefill(
                company.whatsappHref,
                "Hi DisplayAvenue, I’d like to check availability for ____ (date) in ____ (city) for ____ (service).",
              )}
              className="btn btn--outline"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp date check
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cal-legend">
            <span className="cal-pill is-open">Open</span>
            <span className="cal-pill is-limited">Limited crew</span>
            <span className="cal-pill is-booked">Fully booked</span>
          </div>
          <p className="cal-note">{a.note}</p>
          <div className="cal-months">
            {a.months.map((month) => (
              <div key={month.label} className="cal-month card">
                <h3>{month.label}</h3>
                <div className="cal-weekdays">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={`${d}-${i}`}>{d}</span>
                  ))}
                </div>
                <div className="cal-grid">
                  {Array.from({
                    length: new Date(Date.UTC(month.year, month.month - 1, 1)).getUTCDay(),
                  }).map((_, i) => (
                    <span key={`pad-${i}`} className="cal-day is-empty" />
                  ))}
                  {month.days.map((day) => (
                    <span
                      key={day.date}
                      className={`cal-day is-${day.status}`}
                      title={`${month.label} ${day.date}: ${statusLabel[day.status]}`}
                    >
                      {day.date}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABanner
        title="Found an open date?"
        text="Book a consult and pay a booking token to reserve your crew."
      />
    </div>
  );
}
