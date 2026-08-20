"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Metrics = {
  revenueInr: number;
  activeClients: number;
  managedAdSpendDailyInr: number;
  newLeads: number;
  qualifiedLeads: number;
  clientsWon: number;
  pendingPaymentsInr: number;
  clientHealth: { healthy: number; atRisk: number };
  campaigns: { healthy: number; needAttention: number };
  aiCostUsd: number;
  attention: {
    paymentIssues: number;
    campaignsNeedReview: number;
    clientApprovals: number;
    clientHealthDeclining: number;
    highPriorityTasks: number;
  };
  dataSource: string;
  generatedAt: string;
};

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function CommandCenterPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth/me");
      const meJson = await me.json();
      if (!meJson.ok) {
        router.push("/login");
        return;
      }
      const dash = await fetch("/api/admin/dashboard");
      const dashJson = await dash.json();
      if (!dashJson.ok) setError(dashJson.error || "Failed to load dashboard");
      else setMetrics(dashJson.data);
    })().catch(() => router.push("/login"));
  }, [router]);

  if (!metrics && !error) {
    return <main className="container" style={{ padding: "3rem 0" }}>Loading command center…</main>;
  }

  const a = metrics?.attention;
  const needsAttention = a
    ? a.paymentIssues + a.campaignsNeedReview + a.clientApprovals + a.clientHealthDeclining + a.highPriorityTasks
    : 0;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 className="display" style={{ margin: 0, color: "var(--navy)", fontSize: "1.6rem" }}>Command Center</h1>
        <p style={{ margin: ".35rem 0 0", color: "var(--muted)" }}>Live aggregates from your database — zeros mean no records yet.</p>
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {metrics && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: ".75rem", marginBottom: "1.25rem" }}>
            <Metric label="Revenue" value={inr(metrics.revenueInr)} />
            <Metric label="Active Clients" value={String(metrics.activeClients)} />
            <Metric label="Managed Ad Spend / day" value={inr(metrics.managedAdSpendDailyInr)} />
            <Metric label="New Leads (MTD)" value={String(metrics.newLeads)} />
            <Metric label="Qualified Leads" value={String(metrics.qualifiedLeads)} />
            <Metric label="Clients Won" value={String(metrics.clientsWon)} />
            <Metric label="Pending Payments" value={inr(metrics.pendingPaymentsInr)} />
            <Metric label="AI Cost (USD)" value={`$${metrics.aiCostUsd.toFixed(4)}`} />
          </div>

          <div className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
            <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Client & Campaign Health</h2>
            <p style={{ margin: 0 }}>
              Clients: {metrics.clientHealth.healthy} healthy · {metrics.clientHealth.atRisk} at risk
              <br />
              Campaigns: {metrics.campaigns.healthy} healthy · {metrics.campaigns.needAttention} need attention
            </p>
          </div>

          <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem", borderColor: needsAttention ? "rgba(180,35,24,.35)" : undefined }}>
            <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Needs Your Attention</h2>
            {needsAttention === 0 ? (
              <p style={{ margin: 0, color: "var(--ok)", fontWeight: 700 }}>Everything else is running normally.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: ".4rem" }}>
                {a!.paymentIssues > 0 && <li>{a!.paymentIssues} payment issue{a!.paymentIssues > 1 ? "s" : ""}</li>}
                {a!.campaignsNeedReview > 0 && <li>{a!.campaignsNeedReview} campaign{a!.campaignsNeedReview > 1 ? "s" : ""} need review</li>}
                {a!.clientApprovals > 0 && <li>{a!.clientApprovals} client approval{a!.clientApprovals > 1 ? "s" : ""} pending</li>}
                {a!.clientHealthDeclining > 0 && <li>{a!.clientHealthDeclining} client health declining</li>}
                {a!.highPriorityTasks > 0 && <li>{a!.highPriorityTasks} high-priority task{a!.highPriorityTasks > 1 ? "s" : ""}</li>}
              </ul>
            )}
          </section>

          <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>
            Data source: {metrics.dataSource} · {new Date(metrics.generatedAt).toLocaleString("en-IN")} · zeros mean no records yet (not demo data)
          </p>
        </>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel" style={{ padding: "1rem" }}>
      <div style={{ color: "var(--muted)", fontSize: ".82rem" }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--navy)" }}>{value}</div>
    </div>
  );
}
