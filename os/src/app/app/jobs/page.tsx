"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Job = {
  id: string;
  type: string;
  status?: string;
  attempts?: number;
  lastError?: string | null;
  createdAt?: string;
  runAfter?: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await apiFetch<Job[] | { jobs: Job[] }>("/api/admin/jobs");
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Failed to load jobs");
      setJobs([]);
      return;
    }
    setJobs(Array.isArray(res.data) ? res.data : asArray<Job>(res.data.jobs));
  }

  useEffect(() => {
    load();
  }, []);

  async function runAction(action: "enqueue_ping" | "process") {
    setBusy(true);
    setMsg("");
    setError("");
    const res = await apiFetch("/api/admin/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      setError(res.error || "Action failed");
      return;
    }
    setMsg(action === "process" ? "Processed pending jobs." : "Ping job enqueued.");
    await load();
  }

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Jobs</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Background queue for sync, AI, and PDF work.</p>

      {notReady && <ModuleNotReady moduleName="Jobs" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {msg && <p style={{ color: "var(--ok)", fontWeight: 700 }}>{msg}</p>}

      {!notReady && (
        <>
          <div style={{ display: "flex", gap: ".65rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <button className="btn btn-secondary" disabled={busy} onClick={() => runAction("enqueue_ping")} style={{ minHeight: 44 }}>Enqueue ping</button>
            <button className="btn btn-primary" disabled={busy} onClick={() => runAction("process")} style={{ minHeight: 44 }}>Process next</button>
          </div>

          {jobs && jobs.length === 0 ? (
            <EmptyState title="No jobs yet" detail="Enqueue a ping or wait for system work to appear." />
          ) : (
            <section className="panel" style={{ padding: "1.1rem" }}>
              {(jobs || []).map((j) => (
                <div key={j.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{j.type}</div>
                    <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                      {j.createdAt ? new Date(j.createdAt).toLocaleString("en-IN") : "—"}
                      {j.lastError ? ` · ${j.lastError}` : ""}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{j.status || "PENDING"}</div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}
