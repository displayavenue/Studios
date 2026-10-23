import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ToolLayout } from "./ToolLayout";
import { SoftwareApplicationSchema } from "../../components/SEO";

const faqs = [
  {
    question: "How is marketing ROI calculated?",
    answer:
      "ROI = ((monthly revenue attributed to marketing - monthly marketing spend) / monthly marketing spend) × 100. This tool also estimates leads from traffic using your conversion rate.",
  },
  {
    question: "Is this calculator free to use and share?",
    answer:
      "Yes. No signup required. You can link to it from blogs, decks, or client proposals with attribution to DisplayAvenue.",
  },
];

export function RoiCalculator() {
  const [spend, setSpend] = useState(50000);
  const [cpc, setCpc] = useState(25);
  const [cvr, setCvr] = useState(3);
  const [close, setClose] = useState(20);
  const [aov, setAov] = useState(15000);

  const result = useMemo(() => {
    const clicks = cpc > 0 ? spend / cpc : 0;
    const leads = clicks * (cvr / 100);
    const customers = leads * (close / 100);
    const revenue = customers * aov;
    const profit = revenue - spend;
    const roi = spend > 0 ? (profit / spend) * 100 : 0;
    const cpl = leads > 0 ? spend / leads : 0;
    return { clicks, leads, customers, revenue, profit, roi, cpl };
  }, [spend, cpc, cvr, close, aov]);

  const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  return (
    <ToolLayout
      title="Marketing ROI Calculator"
      description="Estimate clicks, leads, customers, and return on ad spend from your monthly marketing budget. Built for Indian SMEs."
      path="/free-tools/roi-calculator"
      badge="Free calculator"
      faqs={faqs}
    >
      <SoftwareApplicationSchema
        name="Marketing ROI Calculator"
        description="Free marketing ROI calculator for Indian businesses."
        path="/free-tools/roi-calculator"
      />
      <div className="tool-panel">
        <div className="tool-form">
          <h2>Your numbers</h2>
          <div className="tool-fields">
            <label>
              Monthly marketing spend (₹)
              <input
                type="number"
                min={0}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value) || 0)}
              />
            </label>
            <label>
              Average cost per click (₹)
              <input
                type="number"
                min={0}
                value={cpc}
                onChange={(e) => setCpc(Number(e.target.value) || 0)}
              />
            </label>
            <label>
              Landing page conversion rate (%)
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={cvr}
                onChange={(e) => setCvr(Number(e.target.value) || 0)}
              />
            </label>
            <label>
              Lead-to-customer close rate (%)
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={close}
                onChange={(e) => setClose(Number(e.target.value) || 0)}
              />
            </label>
            <label>
              Average order / deal value (₹)
              <input
                type="number"
                min={0}
                value={aov}
                onChange={(e) => setAov(Number(e.target.value) || 0)}
              />
            </label>
          </div>
        </div>
        <div className="tool-result">
          <h2>Estimated monthly results</h2>
          <div className="tool-metrics">
            <div className="tool-metric">
              <strong>{Math.round(result.clicks).toLocaleString("en-IN")}</strong>
              <span>Clicks</span>
            </div>
            <div className="tool-metric">
              <strong>{result.leads.toFixed(1)}</strong>
              <span>Leads</span>
            </div>
            <div className="tool-metric">
              <strong>{result.customers.toFixed(1)}</strong>
              <span>Customers</span>
            </div>
            <div className="tool-metric">
              <strong>{inr(result.cpl)}</strong>
              <span>Cost per lead</span>
            </div>
            <div className="tool-metric">
              <strong>{inr(result.revenue)}</strong>
              <span>Revenue</span>
            </div>
            <div className="tool-metric">
              <strong>{result.roi.toFixed(0)}%</strong>
              <span>ROI</span>
            </div>
          </div>
          <p className="tool-note">
            Estimates only. Actual results depend on offer, creative, tracking, and sales follow-up.
            Want a plan for your niche?{" "}
            <Link to="/contact">Book a free call</Link>.
          </p>
          <div className="tool-actions">
            <Link to="/services/google-ads" className="btn btn-outline btn-sm">
              Google Ads service
            </Link>
            <Link to="/free-tools/seo-checklist" className="btn btn-outline btn-sm">
              SEO checklist →
            </Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
