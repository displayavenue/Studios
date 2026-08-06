import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

type LegalPageProps = {
  title: string;
  description: string;
  path: string;
  breadcrumb: string;
  children: React.ReactNode;
};

function LegalPage({ title, description, path, breadcrumb, children }: LegalPageProps) {
  const ref = useReveal<HTMLDivElement>();
  const { company } = useCms();

  return (
    <div ref={ref}>
      <SEO title={title} description={description} path={path} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{breadcrumb}</span>
          </nav>
          <h1>{breadcrumb}</h1>
          <p>Last updated: August 2026 · {company.name}</p>
        </div>
      </section>
      <section className="section">
        <div className="container legal-doc reveal">{children}</div>
      </section>
    </div>
  );
}

export function PrivacyPolicy() {
  const { company } = useCms();
  return (
    <LegalPage
      title={`Privacy Policy | ${company.name}`}
      description={`How ${company.name} collects, uses and protects your personal information when you visit our website or enquire about photography and film services.`}
      path="/privacy"
      breadcrumb="Privacy Policy"
    >
      <h2>Overview</h2>
      <p>
        {company.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This
        policy explains what information we collect through displayavenuestudios.com
        and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you submit (name, phone, email, message)</li>
        <li>Booking enquiry details (city, date, package interest)</li>
        <li>Newsletter email if you opt in</li>
        <li>Technical data such as IP address and browser type for security</li>
        <li>Analytics via Google Tag Manager / Google Analytics when enabled</li>
      </ul>
      <h2>How we use information</h2>
      <ul>
        <li>Respond to enquiries and provide quotes</li>
        <li>Coordinate shoots, contracts and deliverables</li>
        <li>Improve our website and marketing (with consent where required)</li>
        <li>Prevent spam and abuse of our forms</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We do not sell your personal data. We may share information with service
        providers (email, hosting, analytics) only as needed to operate our business.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access, correction or deletion of your data by emailing{" "}
        <a href={company.emailHref}>{company.email}</a>.
      </p>
      <h2>Contact</h2>
      <p>
        {company.name}, {company.address.lines.join(" ")} · Phone:{" "}
        <a href={company.phoneHref}>{company.phone}</a>
      </p>
    </LegalPage>
  );
}

export function TermsOfService() {
  const { company } = useCms();
  return (
    <LegalPage
      title={`Terms of Service | ${company.name}`}
      description={`Website terms of use for ${company.name} — India's premium visual production studio.`}
      path="/terms"
      breadcrumb="Terms of Service"
    >
      <h2>Website use</h2>
      <p>
        By using this website you agree to these terms. Content, images and copy are
        owned by {company.name} unless stated otherwise.
      </p>
      <h2>Enquiries &amp; bookings</h2>
      <p>
        Submitting a form or message does not confirm a booking until we accept your
        date in writing and you pay the agreed booking amount. Package prices shown
        are starting prices and may vary based on scope.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Portfolio images and films remain our property until full payment and any
        agreed licence terms are met. Commercial usage rights are defined in your
        production agreement.
      </p>
      <h2>Liability</h2>
      <p>
        We provide this website &quot;as is&quot;. We are not liable for indirect
        losses arising from website downtime or third-party links.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in Mumbai shall have jurisdiction.</p>
    </LegalPage>
  );
}

export function BookingPolicy() {
  const { company } = useCms();
  return (
    <LegalPage
      title={`Booking & Refund Policy | ${company.name}`}
      description={`Booking amounts, rescheduling and refund terms for photography and videography services with ${company.name}.`}
      path="/booking-policy"
      breadcrumb="Booking & Refund Policy"
    >
      <h2>Reserving your date</h2>
      <p>
        Dates are confirmed only after we send a written proposal and receive the
        agreed booking amount. Until then, availability may change.
      </p>
      <h2>Payment</h2>
      <ul>
        <li>Booking amount secures your crew and date</li>
        <li>Balance is due as per your signed agreement (typically before delivery)</li>
        <li>GST and travel costs are quoted separately when applicable</li>
      </ul>
      <h2>Rescheduling</h2>
      <p>
        Reschedules depend on crew availability and notice period. We will always
        try to accommodate genuine changes; fees may apply for short notice or
        peak-season moves.
      </p>
      <h2>Cancellations &amp; refunds</h2>
      <p>
        Refund terms depend on how close the event is and costs already incurred.
        Your booking agreement will state the exact schedule. Generally, booking
        amounts are non-refundable within 30 days of the shoot unless we can
        re-book the date.
      </p>
      <h2>Questions</h2>
      <p>
        Email <a href={company.emailHref}>{company.email}</a> or WhatsApp{" "}
        <a href={company.whatsappHref}>{company.whatsapp}</a> before paying if you
        need clarification.
      </p>
    </LegalPage>
  );
}
