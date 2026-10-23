import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ToolLayout } from "./ToolLayout";
import { SoftwareApplicationSchema } from "../../components/SEO";

const checks = [
  { id: "gmb", label: "Google Business Profile claimed and verified", weight: 10 },
  { id: "categories", label: "Primary + secondary categories match services", weight: 7 },
  { id: "nap", label: "Name, address, phone identical on website + GMB", weight: 9 },
  { id: "hours", label: "Hours updated (incl. holidays)", weight: 5 },
  { id: "photos", label: "Fresh photos monthly (team, work, premises)", weight: 6 },
  { id: "posts", label: "Google Posts / offers published regularly", weight: 4 },
  { id: "reviews", label: "Review ask system in place (WhatsApp / SMS)", weight: 8 },
  { id: "replies", label: "All reviews replied to professionally", weight: 5 },
  { id: "services", label: "Services list filled with plain-English descriptions", weight: 5 },
  { id: "products", label: "Products/menu/services with prices where relevant", weight: 3 },
  { id: "qa", label: "Q&A seeded with real customer questions", weight: 4 },
  { id: "website", label: "Website has local landing page + map embed", weight: 7 },
  { id: "citations", label: "Listed on Justdial / IndiaMART / Bing / Apple (as relevant)", weight: 6 },
  { id: "schema", label: "LocalBusiness schema with phone + address", weight: 6 },
  { id: "utm", label: "GMB website link uses UTM tracking", weight: 3 },
  { id: "spam", label: "Competitor spam / fake listings reported", weight: 4 },
];

const faqs = [
  {
    question: "What improves Google Maps rankings fastest?",
    answer:
      "Consistent NAP, relevant categories, review velocity with replies, photo freshness, and a website that matches the GMB entity. Citations help when they are legitimate and consistent.",
  },
];

export function LocalSeoScore() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const { score, checked, total } = useMemo(() => {
    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const earned = checks.reduce((sum, c) => sum + (done[c.id] ? c.weight : 0), 0);
    return {
      score: Math.round((earned / totalWeight) * 100),
      checked: checks.filter((c) => done[c.id]).length,
      total: checks.length,
    };
  }, [done]);

  return (
    <ToolLayout
      title="Local SEO & GMB Scorecard"
      description="Score your Google Business Profile and local citation readiness. Built for Mumbai and India service businesses."
      path="/free-tools/local-seo-score"
      badge="Free scorecard"
      faqs={faqs}
    >
      <SoftwareApplicationSchema
        name="Local SEO & GMB Scorecard"
        description="Free Google Business Profile and local SEO scorecard."
        path="/free-tools/local-seo-score"
      />
      <div className="tool-panel">
        <div className="tool-form">
          <h2>Local / GMB checks ({checked}/{total})</h2>
          <div className="tool-check-list">
            {checks.map((c) => (
              <label key={c.id} className="tool-check">
                <input
                  type="checkbox"
                  checked={!!done[c.id]}
                  onChange={(e) =>
                    setDone((prev) => ({ ...prev, [c.id]: e.target.checked }))
                  }
                />
                <div>
                  <strong>{c.label}</strong>
                  <span>Weight {c.weight}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="tool-result">
          <h2>Local SEO score</h2>
          <div className="tool-score-ring">
            <div>
              <strong>{score}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <p className="tool-note">
            Next: submit legitimate citations from our{" "}
            <Link to="/free-tools/citation-directory">India citation directory</Link>, then track
            outreach in the CMS backlink tracker.
          </p>
          <div className="tool-actions">
            <Link to="/services/local-seo" className="btn btn-primary btn-sm">
              Local SEO service →
            </Link>
            <Link to="/contact" className="btn btn-outline btn-sm">
              Free GMB review call
            </Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
