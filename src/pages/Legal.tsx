import type { ReactNode } from "react";
import { SEO } from "../components/SEO";
import "./Page.css";

function LegalPage({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <div>
      <SEO title={`${title} | DisplayAvenue Realty`} description={title} path={path} />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <h1>{title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container legal-content">{children}</div>
      </section>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy">
      <p>
        DisplayAvenue Realty collects contact details you submit via forms
        or WhatsApp to respond to property enquiries. We do not sell your
        personal data. Information is shared only with team members or partners
        needed to fulfil your request (for example loan facilitators you opt
        into).
      </p>
      <p>
        You may request correction or deletion of your enquiry data by emailing
        hello@displayavenuerealestate.com.
      </p>
    </LegalPage>
  );
}

export function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" path="/terms">
      <p>
        Listings on this website are indicative and subject to availability,
        owner confirmation and documentation. Prices may change without notice.
        DisplayAvenue Realty acts as a facilitator; transactions are between
        the parties to the deal.
      </p>
      <p>
        Brokerage and service fees, where applicable, will be disclosed before
        you proceed with serious negotiations or documentation.
      </p>
    </LegalPage>
  );
}
