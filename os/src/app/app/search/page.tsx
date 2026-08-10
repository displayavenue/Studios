"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type SearchResponse = {
  q?: string;
  leads?: { id: string; name: string; company?: string | null; email?: string | null; pipelineStatus?: string }[];
  orgs?: { id: string; name: string; slug?: string; type?: string; status?: string }[];
  campaigns?: { id: string; name: string; status?: string; platform?: string | null }[];
  invoices?: { id: string; number?: string; amountInr?: number; status?: string }[];
  counts?: { leads: number; orgs: number; campaigns: number; invoices: number };
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotReady(false);
    setSearched(true);
    const res = await apiFetch<SearchResponse>(`/api/search?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Search failed");
      setData(null);
      return;
    }
    setData(res.data);
  }

  const total =
    (data?.counts?.leads || 0) +
    (data?.counts?.orgs || 0) +
    (data?.counts?.campaigns || 0) +
    (data?.counts?.invoices || 0);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Search</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Find leads, orgs, campaigns, and invoices.</p>

      <form onSubmit={onSearch} style={{ display: "flex", gap: ".65rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          className="input"
          style={{ flex: "1 1 240px" }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (min 2 characters)…"
          aria-label="Search"
        />
        <button className="btn btn-primary" style={{ minHeight: 44 }} disabled={q.trim().length < 2}>Search</button>
      </form>

      {notReady && <ModuleNotReady moduleName="Search" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {searched && !notReady && data && total === 0 && !error && (
        <EmptyState title="No results" detail="Try another query once indexed data exists." />
      )}

      {!notReady && data && total > 0 && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {asArray(data.leads).length > 0 && (
            <Section title="Leads">
              {data.leads!.map((l) => (
                <Row key={l.id} title={l.name} subtitle={[l.company, l.email, l.pipelineStatus].filter(Boolean).join(" · ")} href="/app/crm" />
              ))}
            </Section>
          )}
          {asArray(data.orgs).length > 0 && (
            <Section title="Organizations">
              {data.orgs!.map((o) => (
                <Row key={o.id} title={o.name} subtitle={[o.slug, o.type, o.status].filter(Boolean).join(" · ")} href="/app/organizations" />
              ))}
            </Section>
          )}
          {asArray(data.campaigns).length > 0 && (
            <Section title="Campaigns">
              {data.campaigns!.map((c) => (
                <Row key={c.id} title={c.name} subtitle={[c.platform, c.status].filter(Boolean).join(" · ")} href="/app/campaigns" />
              ))}
            </Section>
          )}
          {asArray(data.invoices).length > 0 && (
            <Section title="Invoices">
              {data.invoices!.map((inv) => (
                <Row
                  key={inv.id}
                  title={inv.number || inv.id}
                  subtitle={[inv.status, typeof inv.amountInr === "number" ? `₹${inv.amountInr.toLocaleString("en-IN")}` : null].filter(Boolean).join(" · ")}
                  href="/app/billing"
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel" style={{ padding: "1.1rem" }}>
      <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.15rem" }}>{title}</h2>
      <div style={{ display: "grid", gap: ".45rem" }}>{children}</div>
    </section>
  );
}

function Row({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <Link href={href} style={{ display: "block", borderTop: "1px solid var(--line)", paddingTop: ".65rem", minHeight: 44 }}>
      <div style={{ fontWeight: 800, color: "var(--navy)" }}>{title}</div>
      {subtitle && <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{subtitle}</div>}
    </Link>
  );
}
