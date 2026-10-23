import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ToolLayout } from "./ToolLayout";
import { SoftwareApplicationSchema } from "../../components/SEO";

const checks = [
  { id: "https", label: "HTTPS / SSL is active", weight: 5 },
  { id: "title", label: "Unique title tags on key pages", weight: 6 },
  { id: "meta", label: "Meta descriptions written for clicks", weight: 4 },
  { id: "h1", label: "One clear H1 per page", weight: 5 },
  { id: "mobile", label: "Mobile-friendly layout", weight: 7 },
  { id: "speed", label: "Core pages load in under ~3s on mobile", weight: 7 },
  { id: "sitemap", label: "XML sitemap submitted to Search Console", weight: 5 },
  { id: "robots", label: "robots.txt does not block important pages", weight: 4 },
  { id: "canonical", label: "Canonical tags set correctly", weight: 4 },
  { id: "internal", label: "Internal links between services / industries", weight: 5 },
  { id: "schema", label: "Organization / LocalBusiness / FAQ schema", weight: 5 },
  { id: "images", label: "Images compressed with descriptive alt text", weight: 4 },
  { id: "nap", label: "NAP matches Google Business Profile", weight: 5 },
  { id: "blog", label: "Helpful content targeting buyer questions", weight: 5 },
  { id: "cta", label: "Clear call / WhatsApp / form CTAs", weight: 4 },
  { id: "tracking", label: "GA4 + conversion events firing", weight: 6 },
  { id: "404", label: "Broken links / soft 404s cleaned up", weight: 4 },
  { id: "cwv", label: "No major Core Web Vitals warnings", weight: 5 },
  { id: "llms", label: "llms.txt / AI crawler access considered", weight: 3 },
  { id: "local", label: "Local landing pages for priority cities/services", weight: 7 },
];

const faqs = [
  {
    question: "What is a good SEO checklist score?",
    answer:
      "80+ is strong. 60-79 means fix technical and on-page basics first. Under 60 usually needs a structured SEO sprint before scaling ads.",
  },
  {
    question: "Can agencies link to this checklist?",
    answer:
      "Yes. It is a free public resource. Link to https://displayavenue.com/free-tools/seo-checklist when you mention on-page SEO hygiene.",
  },
];

export function SeoChecklist() {
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

  const tone =
    score >= 80 ? "Strong foundation" : score >= 60 ? "Needs focused fixes" : "Priority SEO sprint";

  return (
    <ToolLayout
      title="Website SEO Score Checklist"
      description="Tick the 20 checks that matter for Indian business websites. Get a weighted SEO hygiene score you can share with your team."
      path="/free-tools/seo-checklist"
      badge="Free checklist"
      faqs={faqs}
    >
      <SoftwareApplicationSchema
        name="Website SEO Score Checklist"
        description="Free weighted SEO checklist for business websites."
        path="/free-tools/seo-checklist"
      />
      <div className="tool-panel">
        <div className="tool-form">
          <h2>Checklist ({checked}/{total})</h2>
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
          <h2>Your SEO score</h2>
          <div className="tool-score-ring">
            <div>
              <strong>{score}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <div className="tool-metrics">
            <div className="tool-metric">
              <strong>{tone}</strong>
              <span>Status</span>
            </div>
            <div className="tool-metric">
              <strong>{checked}</strong>
              <span>Checks complete</span>
            </div>
          </div>
          <p className="tool-note">
            This is a hygiene score, not a rankings guarantee. Pair it with{" "}
            <Link to="/free-tools/local-seo-score">Local SEO score</Link> if you rely on Google Maps.
          </p>
          <div className="tool-actions">
            <Link to="/services/seo" className="btn btn-primary btn-sm">
              SEO services →
            </Link>
            <Link to="/services/technical-seo" className="btn btn-outline btn-sm">
              Technical SEO
            </Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
