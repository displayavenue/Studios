"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminAssessmentsPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  useEffect(() => {
    fetch("/api/admin/assessments").then((r) => r.json()).then((j) => j.ok && setRows(j.data));
  }, []);
  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Assessments</h1>
      <div className="panel" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Company", "Industry", "Location", "Status", "Score", "Unlocked"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.7rem", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)}>
                <td style={{ padding: "0.7rem" }}>{String(r.company || "")}</td>
                <td style={{ padding: "0.7rem" }}>{String(r.industry || "")}</td>
                <td style={{ padding: "0.7rem" }}>{String(r.location || "")}</td>
                <td style={{ padding: "0.7rem" }}>{String(r.status)}</td>
                <td style={{ padding: "0.7rem" }}>{String(r.growthScore ?? "")}</td>
                <td style={{ padding: "0.7rem" }}>{r.unlocked ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
