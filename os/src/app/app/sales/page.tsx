"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Lead = {
  id: string;
  name: string;
  company?: string | null;
  pipelineStatus?: string;
  leadScore?: number | null;
};

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [pipelineCounts, setPipelineCounts] = useState<Record<string, number> | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [pipe, leadsRes] = await Promise.all([
        apiFetch<{ counts: Record<string, number>; total: number }>("/api/crm/pipeline"),
        apiFetch<{ leads: Lead[] } | Lead[]>("/api/crm/leads"),
      ]);

      if ((!pipe.ok && pipe.notReady) && (!leadsRes.ok && leadsRes.notReady)) {
        setNotReady(true);
        setLeads([]);
        return;
      }
      if (!pipe.ok && !leadsRes.ok) {
        setError(pipe.error || leadsRes.error || "Failed to load sales data");
        setLeads([]);
        return;
      }
      if (pipe.ok) setPipelineCounts(pipe.data.counts);
      if (leadsRes.ok) {
        setLeads(Array.isArray(leadsRes.data) ? leadsRes.data : asArray<Lead>(leadsRes.data.leads));
      } else {
        setLeads([]);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    if (pipelineCounts) {
      return {
        total: Object.values(pipelineCounts).reduce((a, b) => a + b, 0),
        qualified:
          (pipelineCounts.QUALIFIED || 0) +
          (pipelineCounts.STRATEGY_CALL || 0) +
          (pipelineCounts.PROPOSAL || 0) +
          (pipelineCounts.NEGOTIATION || 0),
        won: pipelineCounts.WON || 0,
        lost: pipelineCounts.LOST || 0,
      };
    }
    const list = leads || [];
    return {
      total: list.length,
      qualified: list.filter((l) =>
        ["QUALIFIED", "STRATEGY_CALL", "PROPOSAL", "NEGOTIATION"].includes(l.pipelineStatus || ""),
      ).length,
      won: list.filter((l) => l.pipelineStatus === "WON").length,
      lost: list.filter((l) => l.pipelineStatus === "LOST").length,
    };
  }, [leads, pipelineCounts]);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Sales</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Pipeline metrics from live CRM data.</p>

      {notReady && <ModuleNotReady moduleName="Sales" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && leads && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: ".75rem", marginBottom: "1.25rem" }}>
            <Stat label="Open leads" value={String(stats.total)} />
            <Stat label="In qualification+" value={String(stats.qualified)} />
            <Stat label="Won" value={String(stats.won)} />
            <Stat label="Lost" value={String(stats.lost)} />
          </div>

          {leads.length === 0 ? (
            <EmptyState title="No leads yet" detail="Sales metrics will populate when CRM has leads." />
          ) : (
            <section className="panel" style={{ padding: "1.1rem", marginBottom: "1rem" }}>
              <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.2rem" }}>Active pipeline</h2>
              <div style={{ display: "grid", gap: ".5rem" }}>
                {leads.slice(0, 20).map((lead) => (
                  <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".65rem" }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{lead.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{lead.company || "—"}</div>
                    </div>
                    <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700 }}>{lead.pipelineStatus || "NEW"}</div>
                      <Link href={`/app/crm`} className="btn btn-secondary" style={{ padding: ".45rem .8rem", minHeight: 44 }}>
                        Open CRM
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="panel" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.2rem" }}>Sales briefs</h2>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>Open a Growth360 report to brief a strategy call.</p>
            <Link href="/growth360" className="btn btn-primary" style={{ minHeight: 44 }}>Start Growth360 brief</Link>
          </div>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel" style={{ padding: "1rem" }}>
      <div style={{ color: "var(--muted)", fontSize: ".82rem" }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--navy)" }}>{value}</div>
    </div>
  );
}
