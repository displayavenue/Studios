import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { InquiryForm } from "../components/InquiryForm";
import "./Page.css";

export function Contact() {
  const { company } = useCms();

  return (
    <div>
      <SEO
        title="Contact DisplayAvenue Real Estate | Mira Road"
        description="Call, WhatsApp or write to DisplayAvenue Real Estate in Mira Road East for Dahisar, Mira Road and Bhayandar property needs."
        path="/contact"
      />

      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Contact</span>
          <h1>Let&apos;s talk about your next move</h1>
          <p>Most enquiries get a same-day response on WhatsApp.</p>
        </div>
      </section>

      <section className="section">
        <div className="container form-split">
          <div className="contact-panel">
            <h2>Reach us</h2>
            <p>
              <a href={company.phoneHref}>{company.phone}</a>
            </p>
            <p>
              <a href={company.emailHref}>{company.email}</a>
            </p>
            <p>
              <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                WhatsApp chat
              </a>
            </p>
            <address>
              {company.address.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <div className="map-embed">
              <iframe
                title="Office map"
                src={company.address.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <InquiryForm
            type="contact"
            title="Send an enquiry"
            fields={[
              { name: "name", label: "Name", required: true },
              { name: "phone", label: "Phone", type: "tel", required: true },
              { name: "email", label: "Email", type: "email" },
              {
                name: "interest",
                label: "I'm interested in",
                required: true,
                options: [
                  { value: "buy", label: "Buying" },
                  { value: "rent", label: "Renting" },
                  { value: "sell", label: "Selling / listing" },
                  { value: "commercial", label: "Commercial" },
                  { value: "redevelopment", label: "Redevelopment" },
                ],
              },
              {
                name: "message",
                label: "Message",
                type: "textarea",
                required: true,
                placeholder: "Budget, BHK, locality preference…",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
