import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { submitLead } from "../lib/submitLead";
import "./LandingPage.css";

type Benefit = { title?: string; desc?: string };
type Faq = { q?: string; a?: string };
type Package = {
  id?: string;
  name?: string;
  price?: number;
  compareAtPrice?: number;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  highlighted?: boolean;
  razorpayEnabled?: boolean;
};

type Landing = {
  enabled?: boolean;
  slug?: string;
  name?: string;
  channel?: string;
  seoTitle?: string;
  seoDescription?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  trustBadges?: string[];
  bullets?: string[];
  heroImage?: string;
  primaryCta?: string;
  showPhone?: boolean;
  showWhatsapp?: boolean;
  formTitle?: string;
  formSubtitle?: string;
  formButton?: string;
  thankYouMessage?: string;
  showForm?: boolean;
  benefits?: Benefit[];
  packagesTitle?: string;
  packages?: Package[];
  faqs?: Faq[];
  footerNote?: string;
  googleAds?: { conversionId?: string; conversionLabel?: string };
  metaAds?: { pixelEvent?: string; contentName?: string };
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
};

type LandingsFile = {
  items?: Landing[];
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function utmFromSearch(params: URLSearchParams, landing?: Landing | null) {
  return {
    utmSource: params.get("utm_source") || landing?.utmSource || "",
    utmMedium: params.get("utm_medium") || landing?.utmMedium || "",
    utmCampaign: params.get("utm_campaign") || landing?.utmCampaign || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
    gclid: params.get("gclid") || "",
    fbclid: params.get("fbclid") || "",
  };
}

function fireLeadConversions(landing: Landing) {
  const convId = landing.googleAds?.conversionId?.trim();
  const convLabel = landing.googleAds?.conversionLabel?.trim();
  if (convId && convLabel && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `${convId}/${convLabel}`,
    });
  }
  const eventName = landing.metaAds?.pixelEvent?.trim() || "Lead";
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, {
      content_name: landing.metaAds?.contentName || landing.name || landing.slug,
    });
  }
}

export default function LandingPage() {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { company } = useCms();
  const [landing, setLanding] = useState<Landing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [buyBusy, setBuyBusy] = useState<string | null>(null);
  const [buyMsg, setBuyMsg] = useState("");

  const utm = useMemo(() => utmFromSearch(searchParams, landing), [searchParams, landing]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/content/landings.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as LandingsFile;
        const item = (data.items || []).find(
          (x) => x.enabled !== false && String(x.slug || "").toLowerCase() === slug.toLowerCase(),
        );
        if (!cancelled) {
          if (!item) setNotFound(true);
          else setLanding(item);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!landing) return;
    const title = landing.seoTitle || landing.headline || "Landing page";
    document.title = title;
    const desc = landing.seoDescription || landing.subheadline || "";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [landing]);

  async function onLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!landing?.slug) return;
    setSubmitting(true);
    setError("");
    try {
      const messageParts = [
        form.message.trim(),
        form.company.trim() ? `Company: ${form.company.trim()}` : "",
      ].filter(Boolean);
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: messageParts.join("\n"),
        source: "landing",
        landingSlug: landing.slug,
        ...utm,
      });
      fireLeadConversions(landing);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function buyPackage(pkg: Package) {
    if (!landing?.slug || !pkg.id) return;
    if (!form.name.trim() || !form.email.trim()) {
      setBuyMsg("Enter your name and email in the lead form above, then buy the package.");
      document.getElementById("lp-lead")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setBuyBusy(pkg.id);
    setBuyMsg("");
    try {
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Payment gateway failed to load.");

      const orderRes = await fetch("/shop-api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          action: "create-order",
          landingSlug: landing.slug,
          packageId: pkg.id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.ok) {
        throw new Error(orderData.error || "Could not start payment.");
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "DisplayAvenue",
        description: `${pkg.name} — ${landing.name || landing.headline || landing.slug}`,
        order_id: orderData.razorpayOrderId,
        prefill: orderData.prefill || {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#0f766e" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/shop-api.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({
                action: "verify-payment",
                orderId: orderData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }
            setBuyMsg(`Payment successful for ${pkg.name}. We’ll contact you shortly.`);
            fireLeadConversions(landing);
            try {
              await submitLead({
                name: form.name,
                email: form.email,
                phone: form.phone,
                message: `Paid for package: ${pkg.name} (${pkg.id}) via Razorpay. Payment ID: ${response.razorpay_payment_id}`,
                source: "landing",
                landingSlug: landing.slug,
                packageId: pkg.id,
                ...utm,
              });
            } catch {
              /* lead notify optional after paid */
            }
          } catch (err) {
            setBuyMsg(
              err instanceof Error
                ? err.message
                : "Payment received but verification failed. Contact us with your payment ID.",
            );
          } finally {
            setBuyBusy(null);
          }
        },
        modal: {
          ondismiss: () => setBuyBusy(null),
        },
      });
      rzp.open();
    } catch (err) {
      setBuyMsg(err instanceof Error ? err.message : "Checkout failed.");
      setBuyBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="lp-shell">
        <div className="lp-loading">Loading…</div>
      </div>
    );
  }

  if (notFound || !landing) {
    return (
      <div className="lp-shell">
        <div className="lp-missing">
          <h1>Landing page not found</h1>
          <p>This campaign URL is inactive or does not exist.</p>
          <Link to="/">Go to homepage</Link>
        </div>
      </div>
    );
  }

  const packages = (landing.packages || []).filter((p) => p.name);
  const benefits = landing.benefits || [];
  const faqs = landing.faqs || [];
  const phone = company.phone || "";
  const phoneHref = company.phoneHref || (phone ? `tel:${phone.replace(/\s/g, "")}` : "");
  const whatsappHref = company.whatsappHref || "";
  const showPhone = landing.showPhone !== false && Boolean(phoneHref);
  const showWa = landing.showWhatsapp !== false && Boolean(whatsappHref);
  const channelLabel =
    landing.channel === "meta"
      ? "Meta Ads"
      : landing.channel === "both"
        ? "Google & Meta Ads"
        : "Google Ads";

  return (
    <div className="lp-shell">
      <header className="lp-top">
        <div className="lp-brand">DisplayAvenue</div>
        <div className="lp-top-actions">
          {showPhone ? (
            <a className="lp-phone" href={phoneHref}>
              {phone}
            </a>
          ) : null}
          {showWa ? (
            <a className="lp-wa" href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          ) : null}
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-copy">
          <p className="lp-eyebrow">{landing.eyebrow || `${channelLabel} landing`}</p>
          <h1>{landing.headline}</h1>
          {landing.subheadline ? <p className="lp-sub">{landing.subheadline}</p> : null}
          {(landing.trustBadges || []).length > 0 ? (
            <ul className="lp-trust">
              {(landing.trustBadges || []).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
          {(landing.bullets || []).length > 0 ? (
            <ul className="lp-bullets">
              {(landing.bullets || []).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
          <div className="lp-hero-ctas">
            {landing.showForm !== false ? (
              <a className="lp-btn lp-btn-primary" href="#lp-lead">
                {landing.primaryCta || "Get a free consultation"}
              </a>
            ) : null}
            {packages.length > 0 ? (
              <a className="lp-btn lp-btn-ghost" href="#lp-packages">
                View packages
              </a>
            ) : null}
          </div>
        </div>
        <div className="lp-hero-media">
          {landing.heroImage ? (
            <img src={landing.heroImage} alt="" />
          ) : (
            <div className="lp-hero-fallback" aria-hidden />
          )}
        </div>
      </section>

      {landing.showForm !== false ? (
        <section className="lp-lead" id="lp-lead">
          <div className="lp-lead-intro">
            <h2>{landing.formTitle || "Get your free plan"}</h2>
            {landing.formSubtitle ? <p>{landing.formSubtitle}</p> : null}
          </div>
          {submitted ? (
            <div className="lp-thanks" role="status">
              {landing.thankYouMessage || "Thanks — we’ll contact you shortly."}
            </div>
          ) : (
            <form className="lp-form" onSubmit={onLeadSubmit}>
              <label>
                Name *
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  autoComplete="name"
                />
              </label>
              <label>
                Email *
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  autoComplete="tel"
                />
              </label>
              <label>
                Company
                <input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  autoComplete="organization"
                />
              </label>
              <label className="lp-form-full">
                Message
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </label>
              {error ? <p className="lp-error">{error}</p> : null}
              <button className="lp-btn lp-btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Sending…" : landing.formButton || "Submit"}
              </button>
            </form>
          )}
        </section>
      ) : (
        <div id="lp-lead" />
      )}

      {benefits.length > 0 ? (
        <section className="lp-benefits">
          <h2>Why this works</h2>
          <div className="lp-benefit-grid">
            {benefits.map((b) => (
              <article key={b.title}>
                <h3>{b.title}</h3>
                {b.desc ? <p>{b.desc}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {packages.length > 0 ? (
        <section className="lp-packages" id="lp-packages">
          <h2>{landing.packagesTitle || "Packages"}</h2>
          {buyMsg ? <p className="lp-buy-msg" role="status">{buyMsg}</p> : null}
          <div className="lp-pkg-grid">
            {packages.map((pkg) => {
              const price = Number(pkg.price) || 0;
              const compare = Number(pkg.compareAtPrice) || 0;
              const canPay = pkg.razorpayEnabled !== false && price > 0;
              return (
                <article
                  key={pkg.id || pkg.name}
                  className={`lp-pkg${pkg.highlighted ? " is-hot" : ""}`}
                >
                  {pkg.highlighted ? <span className="lp-pkg-badge">Popular</span> : null}
                  <h3>{pkg.name}</h3>
                  <div className="lp-pkg-price">
                    <strong>{formatInr(price)}</strong>
                    {compare > price ? <s>{formatInr(compare)}</s> : null}
                  </div>
                  {pkg.description ? <p className="lp-pkg-desc">{pkg.description}</p> : null}
                  {(pkg.features || []).length > 0 ? (
                    <ul>
                      {(pkg.features || []).map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                  {canPay ? (
                    <button
                      type="button"
                      className="lp-btn lp-btn-primary"
                      disabled={buyBusy === pkg.id}
                      onClick={() => void buyPackage(pkg)}
                    >
                      {buyBusy === pkg.id ? "Opening…" : pkg.ctaLabel || "Buy with Razorpay"}
                    </button>
                  ) : (
                    <a className="lp-btn lp-btn-primary" href="#lp-lead">
                      {pkg.ctaLabel || "Enquire"}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
          <p className="lp-pkg-hint">
            Enter your name and email above so Razorpay checkout is pre-filled.
          </p>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="lp-faq">
          <h2>FAQs</h2>
          <div className="lp-faq-list">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="lp-foot">
        <p>{landing.footerNote || "© DisplayAvenue. All rights reserved."}</p>
        <Link to="/">displayavenue.com</Link>
      </footer>
    </div>
  );
}
