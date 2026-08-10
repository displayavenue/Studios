"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";

type Competitor = {
  id: string;
  name: string;
  city?: string | null;
  scores?: { overallScore?: number | null } | null;
};

type ResultsPayload = {
  publicId: string;
  tier?: "free" | "full";
  unlocked?: boolean;
  growthScore?: number | null;
  biggestOpportunity?: string | null;
  recommendedChannels?: string[];
  lead?: { name?: string | null; company?: string | null } | null;
  teaser?: { competitorCount?: number; hasPricing?: boolean; hasRoi?: boolean; hasPlan?: boolean };
  competitors?: Competitor[];
  analysis?: {
    competitorSummary?: { opportunities?: string[] };
    keyOpportunities?: string[];
  } | null;
};

const channelLabel: Record<string, string> = {
  "google-ads": "Google Ads",
  "meta-ads": "Meta Ads",
  seo: "SEO",
  "landing-page": "Landing Page",
  crm: "CRM",
  "cold-calling": "Cold Calling",
  whatsapp: "WhatsApp",
};

export default function Growth360ResultsPage() {
  const params = useParams<{ publicId: string }>();
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [error, setError] = useState("");
  const [notReady, setNotReady] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<ResultsPayload>(`/api/growth360/${params.publicId}`);
      if (res.ok) {
        setData(res.data);
        return;
      }
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Not found");
    })();
  }, [params.publicId]);

  if (notReady) {
    return (
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <ModuleNotReady moduleName="Growth360 results" />
      </main>
    );
  }
  if (error) {
    return (
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <EmptyState title={error} detail="We couldn’t load this assessment." />
      </main>
    );
  }
  if (!data) return <LoadingBlock label="Loading results…" />;

  const channels = asArray<string>(data.recommendedChannels);
  const competitors = asArray<Competitor>(data.competitors).slice(0, 5);
  const gaps = asArray<string>(
    data.analysis?.competitorSummary?.opportunities || data.analysis?.keyOpportunities,
  );
  const score = typeof data.growthScore === "number" ? data.growthScore : null;
  const company = data.lead?.company || data.lead?.name || "Your business";
  const competitorCount =
    competitors.length > 0
      ? competitors.length
      : typeof data.teaser?.competitorCount === "number"
        ? data.teaser.competitorCount
        : 0;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3.5rem" }}>
      <div className="display" style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>
        DisplayAvenue Growth360
      </div>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <p style={{ margin: 0, color: "var(--muted)", fontWeight: 600 }}>{company}</p>
        <h1 className="display" style={{ margin: "0.35rem 0 1rem", color: "var(--navy)", fontSize: "2rem" }}>
          Your Growth Score
        </h1>
        {score == null ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>Score not available yet.</p>
        ) : (
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <div className="score-ring" style={{ ["--score" as string]: score }}>
              <div style={{ textAlign: "center" }}>
                <div className="display" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--navy)" }}>
                  {Math.round(score)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}> / 100</div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "var(--navy)" }}>Biggest opportunity</div>
              <p style={{ margin: "0.35rem 0 0", maxWidth: 420 }}>
                {data.biggestOpportunity || "Opportunity details will appear once analysis completes."}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>Recommended channels</h2>
        {channels.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>No channel recommendations yet.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {channels.map((c) => (
              <span key={c} style={{ padding: "0.55rem 0.9rem", borderRadius: 999, background: "var(--blue-soft)", fontWeight: 700, color: "var(--navy-2)", minHeight: 44, display: "inline-flex", alignItems: "center" }}>
                {channelLabel[c] || c}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.35rem", color: "var(--navy)" }}>Competitive landscape</h2>
        {competitorCount === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>No competitors matched yet.</p>
        ) : competitors.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>
            We identified {competitorCount} competitor{competitorCount === 1 ? "" : "s"} in the catalog. Unlock the full report to see names and scores.
          </p>
        ) : (
          <>
            <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
              {competitors.length} competitor{competitors.length === 1 ? "" : "s"} from the catalog.
            </p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {competitors.map((c, i) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.85rem 0", borderTop: i ? "1px solid var(--line)" : undefined }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{c.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{c.city || "—"}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--navy)" }}>
                    {typeof c.scores?.overallScore === "number" ? c.scores.overallScore : "—"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>Gaps to close</h2>
        {gaps.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>No gap analysis in free results yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: "0.45rem" }}>
            {gaps.slice(0, 5).map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel fade-up" style={{ padding: "1.5rem", background: "linear-gradient(145deg, #071833, #0d2a52)", color: "white" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem" }}>Unlock your complete report</h2>
        <p style={{ margin: "0 0 1rem", opacity: 0.9 }}>
          Strategy, investment guidance, and a ₹99 strategy call booking are inside the full Growth360 report.
        </p>
        <Link href={`/growth360/report/${data.publicId || params.publicId}`} className="btn" style={{ background: "white", color: "var(--navy)", fontWeight: 800, minHeight: 44 }}>
          Unlock My Complete Growth360 Report →
        </Link>
      </section>
    </main>
  );
}
