"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Array<Record<string, unknown>>>([]);
  const [key, setKey] = useState("business_analysis");
  const [name, setName] = useState("Business Analysis Prompt");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/prompts").then((r) => r.json()).then((j) => j.ok && setPrompts(j.data));
  }, []);

  async function save() {
    const res = await fetch("/api/admin/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, name, content, activate: true }),
    });
    const json = await res.json();
    setMsg(json.ok ? `Saved v${json.data.version}` : json.error);
    const list = await fetch("/api/admin/prompts").then((r) => r.json());
    if (list.ok) setPrompts(list.data);
  }

  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>AI Prompts</h1>
      <div className="panel" style={{ padding: "1rem", marginBottom: "1rem", display: "grid", gap: "0.6rem" }}>
        <input className="option" value={key} onChange={(e) => setKey(e.target.value)} placeholder="key" />
        <input className="option" value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
        <textarea className="option" rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Prompt content" />
        <button className="btn btn-primary" onClick={save}>Save new version</button>
        {msg && <p>{msg}</p>}
      </div>
      {prompts.map((p) => (
        <div key={String(p.id)} className="panel" style={{ padding: "0.8rem", marginBottom: "0.5rem" }}>
          <strong>{String(p.key)}</strong> v{String(p.version)} {p.isActive ? "(active)" : ""}
          <div style={{ color: "var(--muted)", whiteSpace: "pre-wrap" }}>{String(p.content).slice(0, 220)}</div>
        </div>
      ))}
    </AdminShell>
  );
}
