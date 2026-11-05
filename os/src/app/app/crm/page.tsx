"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Lead = {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  pipelineStatus?: string;
  leadScore?: number | null;
  growthScore?: number | null;
  source?: string | null;
  createdAt?: string;
};

const STAGES = ["NEW", "CONTACTED", "QUALIFIED", "STRATEGY_CALL", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [notReady, setNotReady] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Lead[] | { leads: Lead[] }>("/api/crm/leads");
      if (!res.ok) {
        if (res.notReady) setNotReady(true);
        else setError(res.error || "Failed to load leads");
        setLeads([]);
        return;
      }
      const list = Array.isArray(res.data) ? res.data : asArray<Lead>(res.data.leads);
      setLeads(list);
    })();
  }, []);

  const byStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const s of STAGES) map[s] = [];
    for (const lead of leads || []) {
      const stage = lead.pipelineStatus || "NEW";
      if (!map[stage]) map[stage] = [];
      map[stage].push(lead);
    }
    return map;
  }, [leads]);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>CRM Pipeline</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Leads from `/api/crm/leads` — empty until capture starts.</p>

      {notReady && <ModuleNotReady moduleName="CRM" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && leads && leads.length === 0 && !error && (
        <EmptyState title="No leads yet" detail="New Growth360 and manual leads will appear here." />
      )}

      {!notReady && leads && leads.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: ".75rem", marginBottom: "1.25rem", overflowX: "auto" }}>
            {STAGES.map((stage) => (
              <div key={stage} className="panel" style={{ padding: ".85rem", minHeight: 140 }}>
                <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: ".85rem", marginBottom: ".55rem" }}>
                  {stage.replace(/_/g, " ")} · {byStage[stage]?.length || 0}
                </div>
                <div style={{ display: "grid", gap: ".45rem" }}>
                  {(byStage[stage] || []).slice(0, 6).map((lead) => (
                    <div key={lead.id} style={{ padding: ".55rem .65rem", borderRadius: 12, background: "rgba(255,255,255,.9)", border: "1px solid var(--line)", minHeight: 44 }}>
                      <div style={{ fontWeight: 700, fontSize: ".92rem" }}>{lead.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>{lead.company || lead.email || "—"}</div>
                    </div>
                  ))}
                  {(byStage[stage] || []).length === 0 && (
                    <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>Empty</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <section className="panel" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.25rem" }}>Lead list</h2>
            <div style={{ display: "grid", gap: ".55rem" }}>
              {leads.map((lead) => (
                <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", padding: ".7rem 0", borderTop: "1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{lead.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                      {[lead.company, lead.email, lead.phone].filter(Boolean).join(" · ") || "No contact details"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>{lead.pipelineStatus || "NEW"}</div>
                    <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>
                      {typeof lead.leadScore === "number" ? `Lead score ${lead.leadScore}` : "No score yet"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
