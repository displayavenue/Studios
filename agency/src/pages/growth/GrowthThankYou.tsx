import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../../cms/CmsProvider";
import { SEO } from "../../components/SEO";
import { trackGrowthEvent } from "./growthAnalytics";

type SavedLead = {
  lead_id?: string;
  business_name?: string;
  services_required?: string[];
  selected_plan?: string;
};

export function GrowthThankYou() {
  const { company } = useCms();
  const [lead, setLead] = useState<SavedLead>({});

  useEffect(() => {
    trackGrowthEvent("page_view", { landing_page: "/growth/thank-you" });
    try {
      const raw = sessionStorage.getItem("da_growth_lead");
      if (raw) setLead(JSON.parse(raw) as SavedLead);
    } catch {
      /* ignore */
    }
  }, []);

  const waHref = useMemo(() => {
    const business = lead.business_name || "my business";
    const services =
      lead.services_required && lead.services_required.length
        ? lead.services_required.join(", ")
        : "digital growth services";
    const text = encodeURIComponent(
      `Hi DisplayAvenue, I just submitted my Growth Plan request. My business is ${business} and I’m interested in ${services}.`,
    );
    const base = company.whatsappHref || "https://wa.me/919222122333";
    return base.includes("?") ? `${base}&text=${text}` : `${base}?text=${text}`;
  }, [company.whatsappHref, lead.business_name, lead.services_required]);

  return (
    <div className="growth-page growth-thanks">
      <SEO
        title="Growth Plan Request Received | DisplayAvenue"
        description="Thanks for sharing your business requirements. Our team will review the information and contact you."
        path="/growth/thank-you"
        noindex
      />
      <section className="growth-section">
        <div className="growth-wrap growth-wrap--narrow growth-thanks__card">
          <p className="growth-eyebrow">Request received</p>
          <h1>Your Growth Plan Request Has Been Received</h1>
          <p>
            Thanks for sharing your business requirements. Our team will review the
            information and contact you.
          </p>
          <ul className="growth-thanks__list">
            <li>✓ Review your requirements</li>
            <li>✓ Understand your business</li>
            <li>✓ Recommend the appropriate service mix</li>
            <li>✓ Discuss your growth objectives</li>
          </ul>
          <div className="growth-thanks__actions">
            <a
              className="btn btn-primary"
              href={waHref}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackGrowthEvent("whatsapp_click", { cta_location: "thank_you" })
              }
            >
              Chat on WhatsApp
            </a>
            <a
              className="btn btn-outline"
              href={company.phoneHref}
              onClick={() =>
                trackGrowthEvent("phone_click", { cta_location: "thank_you" })
              }
            >
              Call Us
            </a>
            <Link
              className="btn btn-outline"
              to="/contact"
              onClick={() =>
                trackGrowthEvent("booking_click", { cta_location: "thank_you" })
              }
            >
              Book a Strategy Call
            </Link>
          </div>
          <p className="growth-thanks__back">
            <Link to="/growth">Back to growth page</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
