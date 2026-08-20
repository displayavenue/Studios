"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";

type Dash = {
  leads: number;
  completedAssessments: number;
  reports: number;
  pdfDownloads: number;
  payments99: number;
  callsBooked: number;
  qualifiedLeads: number;
  convertedClients: number;
  ai: {
    estimatedCostUsd: number;
    reportsGenerated: number;
    avgCostPerLead: number;
    successful: number;
    failed: number;
    tokensUsed: number;
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/admin/me");
      if (!me.ok) {
        router.push("/admin/login");
        return;
      }
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (!json.ok) setError(json.error || "Failed");
      else setData(json.data);
    })().catch(() => router.push("/admin/login"));
  }, [router]);

  if (!data) {
    return <main className="container" style={{ padding: "2rem 0" }}>{error || "Loading..."}</main>;
  }

  const metrics = [
    ["Leads", data.leads],
    ["Completed Assessments", data.completedAssessments],
    ["Reports", data.reports],
    ["PDF Downloads", data.pdfDownloads],
    ["₹99 Payments", data.payments99],
    ["Calls Booked", data.callsBooked],
    ["Qualified Leads", data.qualifiedLeads],
    ["Converted Clients", data.convertedClients],
    ["AI Cost (USD)", data.ai.estimatedCostUsd.toFixed(4)],
    ["AI Reports", data.ai.reportsGenerated],
    ["Avg AI Cost / Lead", data.ai.avgCostPerLead.toFixed(4)],
  ];

  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "0.75rem" }}>
        {metrics.map(([label, value]) => (
          <div key={String(label)} className="panel" style={{ padding: "1rem" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{label}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--navy)" }}>{value}</div>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--muted)" }}>
        AI requests: {data.ai.successful} success / {data.ai.failed} failed · tokens {data.ai.tokensUsed}
      </p>
    </AdminShell>
  );
}
