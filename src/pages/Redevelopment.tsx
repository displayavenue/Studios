import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { InquiryForm } from "../components/InquiryForm";
import { img } from "../data/images";
import "./Page.css";

export function Redevelopment() {
  const { company } = useCms();

  return (
    <div>
      <SEO
        title="Society redevelopment advisory | Mira Road & Dahisar"
        description="Owner-first redevelopment guidance for societies in Mira Road, Dahisar and Bhayandar. Process walkthrough, FAQs and builder introductions."
        path="/redevelopment"
        image={img.redevelopment}
      />

      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Advisory</span>
          <h1>Redevelopment, explained for owners</h1>
          <p>
            We help societies understand the journey before anyone signs — corpus,
            carpet, rent, consent and builder fit.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <div className="about-story__media">
            <img src={img.redevelopment} alt="Redevelopment planning" />
          </div>
          <div>
            <h2>How we support committees</h2>
            <ul className="check-list">
              <li>Early consultation without a hard sales pitch</li>
              <li>Plain-language process walkthrough</li>
              <li>Owner FAQ sessions for common concerns</li>
              <li>Introductions to relevant builders when you&apos;re ready</li>
            </ul>
            <a className="btn btn--outline" href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp the desk
            </a>
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container form-split">
          <div>
            <span className="eyebrow">Society enquiry</span>
            <h2>Start a redevelopment conversation</h2>
            <p>
              Share society basics — we&apos;ll schedule a call with your
              committee representative.
            </p>
          </div>
          <InquiryForm
            type="redevelopment"
            submitLabel="Request consultation"
            fields={[
              { name: "name", label: "Your name", required: true },
              { name: "phone", label: "Phone", type: "tel", required: true },
              { name: "society", label: "Society name", required: true },
              {
                name: "locality",
                label: "Locality",
                required: true,
                options: [
                  { value: "mira-road", label: "Mira Road" },
                  { value: "dahisar", label: "Dahisar" },
                  { value: "bhayandar", label: "Bhayandar" },
                  { value: "other", label: "Nearby area" },
                ],
              },
              {
                name: "units",
                label: "Approx. number of units",
                placeholder: "e.g. 48",
              },
              {
                name: "role",
                label: "Your role",
                options: [
                  { value: "committee", label: "Committee member" },
                  { value: "owner", label: "Flat owner" },
                  { value: "other", label: "Other" },
                ],
              },
              {
                name: "message",
                label: "What stage are you at?",
                type: "textarea",
                placeholder: "Exploring / comparing proposals / stuck on consent…",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
