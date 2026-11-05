"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type AnalysisPayload = {
  free: {
    publicId: string;
    assessmentId: string;
    company: string | null;
    growthScore: number;
    biggestOpportunity: string;
    recommendedChannels: string[];
    competitors: { id: string; name: string; city?: string; scores?: { overallScore: number; digitalScore: number; marketingScore: number } | null }[];
    competitorSummary?: { competitiveSummary?: string; opportunities?: string[] } | null;
    roiPreview?: { scenarios?: { name: string; revenueInr: number; roiMultiple: number; leads: number }[] } | null;
    unlocked: boolean;
    aiStatusMessage?: string | null;
  };
  full: unknown;
};

const channelLabel: Record<string, string> = {
  "google-ads": "Google Ads",
  "meta-ads": "Meta Ads",
  seo: "SEO",
  "landing-page": "Landing Page",
  crm: "CRM",
  "cold-calling": "Cold Calling",
};

export default function ResultsPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();
  const [data, setData] = useState<AnalysisPayload | null>(null);
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/analysis/${params.publicId}`);
      const json = await res.json();
      if (!json.ok) setError(json.error || "Not found");
      else setData(json.data);
    })().catch(() => setError("Failed to load results"));
  }, [params.publicId]);

  async function unlockReport() {
    if (!data) return;
    setUnlocking(true);
    try {
      await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: data.free.assessmentId, unlock: true }),
      });
      router.push(`/report/${data.free.publicId}`);
    } catch {
      setError("Could not unlock report");
    } finally {
      setUnlocking(false);
    }
  }

  if (error) {
    return <main className="container" style={{ padding: "3rem 0" }}><p>{error}</p></main>;
  }
  if (!data) {
    return (
      <main className="container" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div className="pulse-dot" />
      </main>
    );
  }

  const { free } = data;
  const gaps = free.competitorSummary?.opportunities || [
    "Digital visibility gaps versus peers",
    "Channel mix not yet optimized",
    "Conversion system can be tightened",
  ];
  const expected = free.roiPreview?.scenarios?.find((s) => s.name === "Expected");

  return (
    <main className="container" style={{ padding: "1.25rem 0 3.5rem" }}>
      <div className="display" style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>
        DisplayAvenue Growth360
      </div>

      {free.aiStatusMessage && (
        <div className="panel fade-up" style={{ padding: "0.9rem 1rem", marginBottom: "1rem", color: "var(--navy-2)" }}>
          {free.aiStatusMessage}
        </div>
      )}

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <p style={{ margin: 0, color: "var(--muted)", fontWeight: 600 }}>{free.company || "Your business"}</p>
        <h1 className="display" style={{ margin: "0.35rem 0 1rem", color: "var(--navy)", fontSize: "2rem" }}>
          Your Growth Score
        </h1>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
          <div className="score-ring" style={{ ["--score" as string]: free.growthScore }}>
            <div style={{ textAlign: "center" }}>
              <div className="display" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--navy)" }}>
                {Math.round(free.growthScore)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}> / 100</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "var(--navy)" }}>Biggest opportunity</div>
            <p style={{ margin: "0.35rem 0 0", maxWidth: 420 }}>{free.biggestOpportunity}</p>
          </div>
        </div>
      </section>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>Recommended channels</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {free.recommendedChannels.map((c) => (
            <span key={c} style={{ padding: "0.45rem 0.8rem", borderRadius: 999, background: "var(--blue-soft)", fontWeight: 700, color: "var(--navy-2)" }}>
              {channelLabel[c] || c}
            </span>
          ))}
        </div>
      </section>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.35rem", color: "var(--navy)" }}>🏆 Your Competitive Landscape</h2>
        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          We identified {free.competitors.length} businesses competing for the same customers or market.
        </p>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {free.competitors.map((c, i) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.85rem 0", borderTop: i ? "1px solid var(--line)" : undefined }}>
              <div>
                <div style={{ fontWeight: 800 }}>{c.name}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{c.city || "—"} · database record</div>
              </div>
              <div style={{ fontWeight: 800, color: "var(--navy)" }}>{c.scores?.overallScore ?? "—"}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel fade-up" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>Here&apos;s what gets interesting...</h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: "0.45rem" }}>
          {gaps.slice(0, 3).map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        {expected && (
          <p style={{ marginTop: "1rem", fontWeight: 600 }}>
            Basic ROI projection: ~{expected.leads} leads · ₹{expected.revenueInr.toLocaleString("en-IN")} revenue potential ({expected.roiMultiple}x)
          </p>
        )}
      </section>

      <section className="panel fade-up" style={{ padding: "1.5rem", background: "linear-gradient(145deg, #071833, #0d2a52)", color: "white" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem" }}>There&apos;s more to uncover</h2>
        <p style={{ margin: "0 0 1rem", opacity: 0.9 }}>
          Your complete Growth360 report reveals the strategy, investment and opportunities behind these numbers.
        </p>
        <button className="btn" style={{ background: "white", color: "var(--navy)", fontWeight: 800 }} onClick={unlockReport} disabled={unlocking}>
          Unlock My Complete Growth360 Report →
        </button>
        {free.unlocked && (
          <div style={{ marginTop: "0.8rem" }}>
            <Link href={`/report/${free.publicId}`} style={{ color: "white", textDecoration: "underline" }}>
              Open full report
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
