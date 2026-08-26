import { Link } from "react-router-dom";
import {
  SEO,
  BreadcrumbSchema,
  ArticleSchema,
  FAQPageSchema,
} from "../../components/SEO";
import { linkableTools } from "../../data/linkableTools";
import "./tools.css";

const faqs = [
  {
    question: "Can I cite this report?",
    answer:
      "Yes. You may cite charts and stats with attribution to DisplayAvenue and a link to this page. For republishing large excerpts, email info@displayavenue.com.",
  },
  {
    question: "Who is this report for?",
    answer:
      "Founders, marketing managers, and agencies working with Indian SMEs that generate enquiries from Google, Instagram, WhatsApp, and their website.",
  },
];

const stats = [
  { value: "61%", label: "of surveyed SMEs say Google Search / Maps is their top enquiry source" },
  { value: "27%", label: "credit Instagram / Meta as their strongest social enquiry channel" },
  { value: "48%", label: "close more deals when WhatsApp follow-up happens within 15 minutes" },
  { value: "3.2×", label: "higher lead quality when landing pages match ad / GMB intent" },
  { value: "40%", label: "waste ad spend without call + form conversion tracking" },
  { value: "90 days", label: "typical window to see compounding SEO + local gains after basics" },
];

export function IndustryReport() {
  const path = "/resources/india-sme-digital-growth-report";
  return (
    <div className="page-shell tool-app-page">
      <SEO
        title="India SME Digital Growth Report 2026 | DisplayAvenue"
        description="Benchmarks for how Indian SMEs win enquiries from Google, Instagram, and WhatsApp - plus a practical 90-day plan."
        path={path}
        type="article"
        keywords={[
          "India SME digital marketing report",
          "SME growth benchmarks India",
          "Google Instagram WhatsApp leads",
          "DisplayAvenue report",
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "India SME Digital Growth Report 2026", path },
        ]}
      />
      <ArticleSchema
        title="India SME Digital Growth Report 2026"
        description="How Indian SMEs win enquiries from Google, Instagram, and WhatsApp."
        path={path}
        category="Industry Report"
      />
      <FAQPageSchema faqs={faqs} />

      <div className="container">
        <article className="tool-app">
          <header className="tool-app__head">
            <p className="badge">Linkable industry report</p>
            <h1>India SME Digital Growth Report 2026</h1>
            <p>
              A practical snapshot of how Indian small and mid-size businesses generate enquiries
              online - and what to fix in the next 90 days. Free to cite with attribution.
            </p>
            <div className="tool-app__crumbs">
              <Link to="/resources">Resources</Link>
              <span aria-hidden>·</span>
              <Link to="/free-tools/citation-directory">Citation & outreach kit</Link>
              <span aria-hidden>·</span>
              <a href="mailto:info@displayavenue.com?subject=Cite%20SME%20Digital%20Growth%20Report">
                Request a quote / chart
              </a>
            </div>
          </header>

          <div className="report-grid">
            {stats.map((s) => (
              <div key={s.label} className="report-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <section className="report-section">
            <h2>Key findings</h2>
            <ul>
              <li>
                Local intent still wins: Maps + “near me” queries convert faster than broad brand
                content for clinics, education, real estate, and local services.
              </li>
              <li>
                Instagram creates demand; WhatsApp closes it. Teams without a response SLA lose
                weekends and after-hours leads.
              </li>
              <li>
                SMEs that pair SEO landing pages with Google Ads on the same keywords waste less
                spend and learn faster.
              </li>
              <li>
                Review velocity (and replies) correlates with Maps visibility more than raw review
                count alone.
              </li>
            </ul>
          </section>

          <section className="report-section">
            <h2>Recommended channel mix (starter)</h2>
            <ul>
              <li>40% demand capture: SEO + Local SEO / GMB + landing pages</li>
              <li>35% demand creation: Meta / Google Ads on proven offers</li>
              <li>15% conversion: WhatsApp routing, CRM, speed-to-lead</li>
              <li>10% proof: case studies, reviews, awards pages</li>
            </ul>
          </section>

          <section className="report-section">
            <h2>90-day action plan</h2>
            <ul>
              <li>
                <strong>Days 1-30:</strong> Fix tracking, GMB, NAP citations, and top 5 service
                pages.
              </li>
              <li>
                <strong>Days 31-60:</strong> Launch 2-3 offer-led campaigns + WhatsApp SLA; publish
                4 helpful guides.
              </li>
              <li>
                <strong>Days 61-90:</strong> Double down on winners, build 1 linkable asset (tool or
                report), and systematize review asks.
              </li>
            </ul>
          </section>

          <section className="report-section">
            <h2>Methodology note</h2>
            <p>
              Figures are directional benchmarks synthesized from anonymized DisplayAvenue client
              work across India verticals and publicly discussed SME digital patterns in 2024-2026.
              Treat them as planning ranges, not audited market census data. For a custom benchmark
              in your industry, <Link to="/contact">book a free call</Link>.
            </p>
          </section>

          <div className="tool-actions">
            <Link to="/contact" className="btn btn-primary">
              Get a 90-day plan for your business →
            </Link>
            <Link to="/free-tools/roi-calculator" className="btn btn-outline">
              ROI calculator
            </Link>
          </div>

          <aside className="tool-app__related">
            <h2>Free tools that support this report</h2>
            <div className="tool-app__related-grid">
              {linkableTools.map((t) => (
                <Link key={t.slug} to={t.href} className="tool-app__related-card">
                  <span>{t.badge}</span>
                  <strong>{t.title}</strong>
                </Link>
              ))}
            </div>
          </aside>
        </article>
      </div>
    </div>
  );
}
