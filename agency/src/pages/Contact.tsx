import { useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { getStoredUtm, getVisitorId } from "../components/VisitorTracker";
import { LEAD_INTEREST_OPTIONS, mmrCities } from "../data/locations";
import { whatsappWithText } from "../lib/geoContext";
import { staticPageSeo } from "../data/pageSeo";
import "../styles/pages.css";
import "./Contact.css";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

export function Contact() {
  const { company, contact } = useCms();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city") || "";
  const fields = contact.fields;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");
  const [successTitle, setSuccessTitle] = useState(contact.successTitle);
  const [successMessage, setSuccessMessage] = useState(contact.successMessage);
  const [submittedCity, setSubmittedCity] = useState(cityFromUrl);
  const [submittedInterest, setSubmittedInterest] = useState("");
  const mmrOptions = useMemo(() => mmrCities().map((c) => c.name), []);
  const defaultCity = cityFromUrl || "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const city = String(data.get("city") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const tags = [city, interest].filter(Boolean);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      business: String(data.get("business") || "").trim(),
      city,
      interest,
      tags,
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || "").trim(),
      page: `${location.pathname}${location.search || ""}` || "/contact",
      visitorId: getVisitorId(),
      utm: getStoredUtm(),
    };
    if (!payload.name || !payload.phone) {
      setStatus("err");
      setError("Please add your name and phone number.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`${base}admin/contact-submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        successTitle?: string;
        successMessage?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not send. Try WhatsApp.");
      }
      setSuccessTitle(json.successTitle || contact.successTitle);
      setSuccessMessage(json.successMessage || contact.successMessage);
      setSubmittedCity(city);
      setSubmittedInterest(interest);
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Could not send.");
      if (contact.whatsappFallback) {
        window.setTimeout(() => {
          const text = `Hi DisplayAvenue, I'm ${payload.name}. Phone: ${payload.phone}.${payload.city ? ` City: ${payload.city}.` : ""}${payload.interest ? ` Interest: ${payload.interest}.` : ""}${payload.business ? ` Business: ${payload.business}.` : ""} ${payload.message}`;
          window.open(whatsappWithText(company.whatsappHref, text), "_blank", "noopener,noreferrer");
        }, 400);
      }
    }
  }

  const successWa = whatsappWithText(
    company.whatsappHref,
    submittedCity
      ? `Hi DisplayAvenue, I just submitted the contact form for ${submittedCity}${submittedInterest ? ` (${submittedInterest})` : ""}.`
      : `Hi DisplayAvenue, I just submitted the contact form${submittedInterest ? ` about ${submittedInterest}` : ""}.`,
  );

  const contactMeta = staticPageSeo["/contact"];
  return (
    <div className="page-shell contact-page">
      <SEO
        title={contact.seo?.title || contactMeta.title}
        description={contact.seo?.description || contactMeta.description}
        path="/contact"
        keywords={contact.seo?.keywords || contactMeta.keywords}
      />
      <div className="container">
        <div className="contact-layout">
          <aside className="contact-aside">
            <p className="badge">{contact.title || "Get Free Proposal"}</p>
            <h1 className="contact-aside__title">
              {contact.headline || "Let's grow your business"}
            </h1>
            <p className="contact-aside__lead">{contact.lead}</p>

            <ul className="contact-points">
              <li>
                <span className="contact-points__icon" aria-hidden>
                  <Icon name="clock" color="#0056ff" size={18} />
                </span>
                <div>
                  <strong>Response within 24 hours</strong>
                  <span>Weekday business hours IST</span>
                </div>
              </li>
              <li>
                <span className="contact-points__icon" aria-hidden>
                  <Icon name="phone" color="#0056ff" size={18} />
                </span>
                <div>
                  <strong>
                    <a href={company.phoneHref}>{company.phone}</a>
                  </strong>
                  <span>Call or WhatsApp</span>
                </div>
              </li>
              <li>
                <span className="contact-points__icon" aria-hidden>
                  <Icon name="chat" color="#0056ff" size={18} />
                </span>
                <div>
                  <strong>
                    <a href={company.emailHref}>{company.email}</a>
                  </strong>
                  <span>Email us anytime</span>
                </div>
              </li>
              <li>
                <span className="contact-points__icon" aria-hidden>
                  <Icon name="building" color="#0056ff" size={18} />
                </span>
                <div>
                  <strong>{company.address.city}</strong>
                  <span>{company.address.hours}</span>
                </div>
              </li>
            </ul>

            <div className="contact-aside__actions">
              <a
                className="btn btn-primary contact-wa-btn"
                href={
                  defaultCity
                    ? whatsappWithText(
                        company.whatsappHref,
                        `Hi DisplayAvenue, I need digital marketing help in ${defaultCity}.`,
                      )
                    : company.whatsappHref
                }
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp{defaultCity ? ` · ${defaultCity}` : ""}
              </a>
              <a className="btn btn-outline" href={company.phoneHref}>
                Call {company.phone}
              </a>
            </div>

            <div className="contact-trust">
              <p>Why clients reach out</p>
              <ul>
                <li>More Google & Instagram enquiries</li>
                <li>Clear monthly marketing packages</li>
                <li>Websites that convert visitors</li>
                <li>Mumbai MMR specialists · pan-India delivery</li>
              </ul>
            </div>

            <p className="contact-aside__hint">
              Prefer browsing first?{" "}
              <Link to="/services">Services</Link>,{" "}
              <Link to="/packages">Packages</Link>, or{" "}
              <Link to="/case-studies">Case studies</Link>.
            </p>

            {company.googleMaps?.embedUrl ? (
              <div className="contact-map" aria-label="DisplayAvenue on Google Maps">
                <iframe
                  title="DisplayAvenue location map"
                  src={company.googleMaps.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : null}
          </aside>

          <div className="contact-form-panel">
            {status === "ok" ? (
              <div className="contact-form contact-form--success">
                <h2>{successTitle}</h2>
                <p>{successMessage}</p>
                {submittedCity ? (
                  <p className="contact-form__city-note">
                    We noted your city as <strong>{submittedCity}</strong>
                    {submittedInterest ? (
                      <>
                        {" "}
                        · interest: <strong>{submittedInterest}</strong>
                      </>
                    ) : null}
                    .
                  </p>
                ) : null}
                <p className="contact-form__next-label">While you wait — pick a next step</p>
                <div className="contact-form__actions contact-form__actions--stack">
                  <a
                    className="btn btn-primary contact-wa-btn"
                    href={successWa}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp us{submittedCity ? ` · ${submittedCity}` : ""}
                  </a>
                  <a className="btn btn-outline" href="https://displayavenue.com/strategy/">
                    Free Strategy Maker
                  </a>
                  <a className="btn btn-outline" href={company.phoneHref}>
                    Call {company.phone}
                  </a>
                  <Link className="btn btn-outline" to="/free-tools">
                    Try a free tool
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStatus("idle")}
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit} noValidate>
                <div className="contact-form__head">
                  <h2>Tell us about your business</h2>
                  <p>We reply with a clear next step - no jargon, no pressure.</p>
                </div>

                <div className="contact-form__grid">
                  <label className="contact-field">
                    <span>{fields.nameLabel}</span>
                    <input
                      required
                      name="name"
                      placeholder={fields.namePlaceholder}
                      autoComplete="name"
                    />
                  </label>
                  <label className="contact-field">
                    <span>{fields.phoneLabel}</span>
                    <input
                      required
                      name="phone"
                      placeholder={fields.phonePlaceholder}
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                  <label className="contact-field">
                    <span>{fields.emailLabel}</span>
                    <input
                      type="email"
                      name="email"
                      placeholder={fields.emailPlaceholder}
                      autoComplete="email"
                    />
                  </label>
                  <label className="contact-field">
                    <span>{fields.businessLabel}</span>
                    <input
                      name="business"
                      placeholder={fields.businessPlaceholder}
                      autoComplete="organization"
                    />
                  </label>
                  <label className="contact-field">
                    <span>City</span>
                    <input
                      name="city"
                      list="contact-city-options"
                      defaultValue={defaultCity}
                      placeholder="Mumbai, Navi Mumbai, Thane…"
                      autoComplete="address-level2"
                    />
                    <datalist id="contact-city-options">
                      {mmrOptions.map((c) => (
                        <option key={c} value={c} />
                      ))}
                      <option value="Pune" />
                      <option value="Delhi NCR" />
                      <option value="Bengaluru" />
                      <option value="Other India" />
                    </datalist>
                  </label>
                  <label className="contact-field">
                    <span>What do you need?</span>
                    <select name="interest" defaultValue="">
                      <option value="">Select an option</option>
                      {LEAD_INTEREST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="contact-field contact-field--full">
                    <span>{fields.messageLabel}</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder={fields.messagePlaceholder}
                      defaultValue={
                        defaultCity
                          ? `Looking for digital marketing help in ${defaultCity}.`
                          : undefined
                      }
                    />
                  </label>
                </div>

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="contact-honeypot"
                />

                {status === "err" && error ? (
                  <p className="contact-form__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn-primary contact-form__submit"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : `${contact.submitLabel || "Get Free Proposal"} →`}
                </button>

                <p className="contact-form__note">
                  We email replies to{" "}
                  <strong>{contact.notifyEmail || company.email}</strong>. Prefer
                  WhatsApp?{" "}
                  <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                    Message us now
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
