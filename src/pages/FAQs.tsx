import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function FAQs() {
  const ref = useReveal<HTMLDivElement>();
  const { faqs } = useCms();
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div ref={ref}>
      <SEO
        title="FAQs | DisplayAvenue Studios"
        description="Frequently asked questions about booking, pricing, delivery, weddings, corporate shoots and technical production at DisplayAvenue Studios."
        path="/faqs"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>FAQs</span>
          </nav>
          <p className="eyebrow">FAQs</p>
          <h1>Answers before you book</h1>
          <p>
            Everything couples and commercial clients ask about availability,
            pricing, travel, files and timelines.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          {categories.map((category) => (
            <div key={category} className="faq-group reveal">
              <h2>{category}</h2>
              <FAQAccordion items={faqs.filter((f) => f.category === category)} />
            </div>
          ))}
        </div>
      </section>

      <CTABanner title="Still have a question?" text="WhatsApp us or book a consultation — we typically respond within a few hours during business days." />
    </div>
  );
}
