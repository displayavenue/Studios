"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Campaign = {
  id: string;
  name: string;
  status?: string;
  platform?: string | null;
  objective?: string | null;
};

export default function PortalCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Campaign[] | { campaigns: Campaign[] }>("/api/portal/campaigns");
      if (!res.ok) {
        if (res.notReady) {
          const fallback = await apiFetch<Campaign[] | { campaigns: Campaign[] }>("/api/campaigns");
          if (fallback.ok) {
            setCampaigns(Array.isArray(fallback.data) ? fallback.data : asArray<Campaign>(fallback.data.campaigns));
            return;
          }
          setNotReady(true);
        } else setError(res.error || "Failed to load campaigns");
        setCampaigns([]);
        return;
      }
      setCampaigns(Array.isArray(res.data) ? res.data : asArray<Campaign>(res.data.campaigns));
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Your campaigns</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Live ads connected to your organization.</p>

      {notReady && <ModuleNotReady moduleName="Portal campaigns" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!notReady && campaigns && campaigns.length === 0 && !error && (
        <EmptyState title="No campaigns yet" detail="When DisplayAvenue launches ads for you, they’ll appear here." />
      )}
      {!notReady && campaigns && campaigns.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
          {campaigns.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
              <div>
                <div style={{ fontWeight: 800 }}>{c.name}</div>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{[c.platform, c.objective].filter(Boolean).join(" · ") || "—"}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{c.status || "—"}</div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
