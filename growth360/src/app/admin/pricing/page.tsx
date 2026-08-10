"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminPricingPage() {
  const [data, setData] = useState<{ rules: Array<Record<string, unknown>>; roi: Array<Record<string, unknown>>; settings: Array<Record<string, unknown>> } | null>(null);
  useEffect(() => {
    fetch("/api/admin/pricing").then((r) => r.json()).then((j) => j.ok && setData(j.data));
  }, []);
  async function saveSetting(key: string, value: unknown) {
    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "setting", key, data: { value } }),
    });
    const res = await fetch("/api/admin/pricing");
    const json = await res.json();
    if (json.ok) setData(json.data);
  }
  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Pricing & Fees</h1>
      {!data ? <p>Loading...</p> : (
        <>
          <h2>Settings</h2>
          <div style={{ display: "grid", gap: "0.6rem", marginBottom: "1.2rem" }}>
            {data.settings.map((s) => (
              <label key={String(s.key)} className="panel" style={{ padding: "0.8rem", display: "grid", gap: "0.35rem" }}>
                <span>{String(s.key)}</span>
                <input
                  className="option"
                  defaultValue={String(s.value)}
                  onBlur={(e) => {
                    const raw = e.target.value;
                    const num = Number(raw);
                    saveSetting(String(s.key), Number.isFinite(num) && raw.trim() !== "" ? num : raw);
                  }}
                />
              </label>
            ))}
          </div>
          <h2>Pricing rules</h2>
          {data.rules.map((r) => (
            <div key={String(r.id)} className="panel" style={{ padding: "0.8rem", marginBottom: "0.5rem" }}>
              <strong>{String(r.name)}</strong> · mgmt {String(r.mgmtFeePct)} · setup ₹{String(r.setupFeeInr)}
            </div>
          ))}
          <h2>ROI assumptions</h2>
          {data.roi.map((r) => (
            <div key={String(r.key)} className="panel" style={{ padding: "0.8rem", marginBottom: "0.5rem" }}>
              {String(r.name)}: {String(r.value)} {String(r.unit || "")}
            </div>
          ))}
        </>
      )}
    </AdminShell>
  );
}
