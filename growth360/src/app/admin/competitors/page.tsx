"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminCompetitorsPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  useEffect(() => {
    fetch("/api/admin/competitors").then((r) => r.json()).then((j) => j.ok && setRows(j.data));
  }, []);
  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Competitors</h1>
      <p style={{ color: "var(--muted)" }}>Factual database records only. AI must not invent competitors.</p>
      <div className="panel" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Industry", "Location", "Overall", "Digital", "Marketing"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.7rem", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const scores = r.scores as { overallScore?: number; digitalScore?: number; marketingScore?: number } | null;
              const industry = r.industry as { name?: string } | null;
              const location = r.location as { name?: string } | null;
              return (
                <tr key={String(r.id)}>
                  <td style={{ padding: "0.7rem" }}>{String(r.name)}</td>
                  <td style={{ padding: "0.7rem" }}>{industry?.name || ""}</td>
                  <td style={{ padding: "0.7rem" }}>{location?.name || String(r.city || "")}</td>
                  <td style={{ padding: "0.7rem" }}>{scores?.overallScore ?? ""}</td>
                  <td style={{ padding: "0.7rem" }}>{scores?.digitalScore ?? ""}</td>
                  <td style={{ padding: "0.7rem" }}>{scores?.marketingScore ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
