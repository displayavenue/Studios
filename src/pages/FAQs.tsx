import { useCms } from "../cms/CmsProvider";
import { SEO, FAQPageSchema } from "../components/SEO";
import { FAQAccordion } from "../components/FAQAccordion";
import "./Page.css";

export function FAQs() {
  const { faqs } = useCms();

  return (
    <div>
      <SEO
        title="FAQs | DisplayAvenue Real Estate"
        description="Common questions about buying, selling, renting and redevelopment in Dahisar, Mira Road and Bhayandar."
        path="/faqs"
      />
      <FAQPageSchema faqs={faqs} />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Help</span>
          <h1>Frequently asked questions</h1>
          <p>Straight answers before you call.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </div>
  );
}
