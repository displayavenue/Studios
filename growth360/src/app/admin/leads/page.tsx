"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Array<Record<string, unknown>>>([]);
  useEffect(() => {
    fetch("/api/admin/leads").then((r) => r.json()).then((j) => j.ok && setLeads(j.data));
  }, []);
  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Leads</h1>
      <div className="panel" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Email", "WhatsApp", "Company", "Status", "Score"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.7rem", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={String(l.id)}>
                <td style={{ padding: "0.7rem" }}>{String(l.name)}</td>
                <td style={{ padding: "0.7rem" }}>{String(l.email)}</td>
                <td style={{ padding: "0.7rem" }}>{String(l.whatsapp)}</td>
                <td style={{ padding: "0.7rem" }}>{String(l.company || "")}</td>
                <td style={{ padding: "0.7rem" }}>{String(l.status)}</td>
                <td style={{ padding: "0.7rem" }}>{String((l.assessment as { growthScore?: number } | null)?.growthScore ?? "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
