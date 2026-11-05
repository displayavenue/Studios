"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Array<Record<string, unknown>>>([]);
  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((j) => j.ok && setSettings(j.data));
  }, []);

  async function save(key: string, raw: string) {
    let value: unknown = raw;
    if (raw === "true") value = true;
    else if (raw === "false") value = false;
    else if (!Number.isNaN(Number(raw)) && raw.trim() !== "") value = Number(raw);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  }

  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Settings</h1>
      <p style={{ color: "var(--muted)" }}>AI Enabled, AI Model, tokens, temperature, booking fee, GST, etc.</p>
      {settings.map((s) => (
        <label key={String(s.key)} className="panel" style={{ display: "grid", gap: "0.35rem", padding: "0.8rem", marginBottom: "0.5rem" }}>
          <span>{String(s.key)}</span>
          <input
            className="option"
            defaultValue={typeof s.value === "string" ? s.value : JSON.stringify(s.value)}
            onBlur={(e) => save(String(s.key), e.target.value)}
          />
        </label>
      ))}
    </AdminShell>
  );
}
