import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { InquiryForm } from "../components/InquiryForm";
import { img } from "../data/images";
import "./Page.css";

export function Sell() {
  const { company } = useCms();

  return (
    <div>
      <SEO
        title="Sell or list your property | Free valuation | DisplayAvenue"
        description="List your flat or shop in Dahisar, Mira Road or Bhayandar. Free valuation, buyer matching and WhatsApp-first support from DisplayAvenue Realty."
        path="/sell"
        image={img.handshake}
      />

      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">For owners</span>
          <h1>Sell smarter in Mira Road, Dahisar & Bhayandar</h1>
          <p>
            Correct pricing, serious buyer outreach, and clear updates — from
            listing to token.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <div>
            <h2>Why list with us</h2>
            <p>
              Portals create noise. We create conversations with people actually
              ready to buy or rent in these three localities.
            </p>
            <ul className="check-list">
              <li>Free local valuation based on recent comps</li>
              <li>Listing presentation guidance (photos, facts, pricing)</li>
              <li>Screened enquiries — fewer time-wasters</li>
              <li>Negotiation and paperwork checklist support</li>
            </ul>
            <a className="btn btn--brass" href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp your property
            </a>
          </div>
          <div className="about-story__media">
            <img src={img.handshake} alt="Property listing discussion" />
          </div>
        </div>
      </section>

      <section className="section section--mist" id="valuation">
        <div className="container form-split">
          <div>
            <span className="eyebrow">Lead magnet</span>
            <h2>Request a free property valuation</h2>
            <p>
              Share basic details and we&apos;ll call you with a realistic price
              band for your society and carpet.
            </p>
          </div>
          <InquiryForm
            type="valuation"
            submitLabel="Get my valuation"
            fields={[
              { name: "name", label: "Name", required: true },
              { name: "phone", label: "Phone", type: "tel", required: true },
              {
                name: "locality",
                label: "Locality",
                required: true,
                options: [
                  { value: "mira-road", label: "Mira Road" },
                  { value: "dahisar", label: "Dahisar" },
                  { value: "bhayandar", label: "Bhayandar" },
                ],
              },
              {
                name: "property_type",
                label: "Property type",
                required: true,
                options: [
                  { value: "1bhk", label: "1 BHK" },
                  { value: "2bhk", label: "2 BHK" },
                  { value: "3bhk", label: "3 BHK" },
                  { value: "shop", label: "Shop" },
                  { value: "office", label: "Office" },
                  { value: "other", label: "Other" },
                ],
              },
              {
                name: "society",
                label: "Society / landmark",
                placeholder: "e.g. Unique Garden, Kanakia",
              },
              {
                name: "intent",
                label: "I want to",
                required: true,
                options: [
                  { value: "sell", label: "Sell" },
                  { value: "rent-out", label: "Rent out" },
                  { value: "both", label: "Explore both" },
                ],
              },
              {
                name: "message",
                label: "Additional notes",
                type: "textarea",
                placeholder: "Carpet area, floor, expected price…",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
