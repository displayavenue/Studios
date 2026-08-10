"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type SearchHit = {
  id: string;
  type?: string;
  title?: string;
  subtitle?: string;
  href?: string;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotReady(false);
    setSearched(true);
    const res = await apiFetch<SearchHit[] | { results: SearchHit[] }>(`/api/search?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Search failed");
      setHits([]);
      return;
    }
    setHits(Array.isArray(res.data) ? res.data : res.data.results || []);
  }

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Search</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Find leads, orgs, campaigns, and reports.</p>

      <form onSubmit={onSearch} style={{ display: "flex", gap: ".65rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          className="input"
          style={{ flex: "1 1 240px" }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          aria-label="Search"
        />
        <button className="btn btn-primary" style={{ minHeight: 44 }} disabled={!q.trim()}>Search</button>
      </form>

      {notReady && <ModuleNotReady moduleName="Search" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {searched && !notReady && hits && hits.length === 0 && !error && (
        <EmptyState title="No results" detail="Try another query once indexed data exists." />
      )}
      {!notReady && hits && hits.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
          {hits.map((h) => (
            <div key={h.id} style={{ borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
              {h.href ? (
                <Link href={h.href} style={{ fontWeight: 800, color: "var(--navy)" }}>{h.title || h.id}</Link>
              ) : (
                <div style={{ fontWeight: 800 }}>{h.title || h.id}</div>
              )}
              <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{[h.type, h.subtitle].filter(Boolean).join(" · ")}</div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
