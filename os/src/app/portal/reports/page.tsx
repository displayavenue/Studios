"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Report = {
  id: string;
  title: string;
  type?: string;
  status?: string;
};

export default function PortalReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Report[] | { reports: Report[] }>("/api/portal/reports");
      if (!res.ok) {
        if (res.notReady) {
          const fallback = await apiFetch<Report[] | { reports: Report[] }>("/api/reports");
          if (fallback.ok) {
            setReports(Array.isArray(fallback.data) ? fallback.data : asArray<Report>(fallback.data.reports));
            return;
          }
          setNotReady(true);
        } else setError(res.error || "Failed to load reports");
        setReports([]);
        return;
      }
      setReports(Array.isArray(res.data) ? res.data : asArray<Report>(res.data.reports));
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Reports</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Performance reports shared with your team.</p>

      {notReady && <ModuleNotReady moduleName="Portal reports" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!notReady && reports && reports.length === 0 && !error && (
        <EmptyState title="No reports yet" detail="Monthly packs will show here when DisplayAvenue publishes them." />
      )}
      {!notReady && reports && reports.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
          {reports.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
              <div>
                <div style={{ fontWeight: 800 }}>{r.title}</div>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{r.type || "report"}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{r.status || "—"}</div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
