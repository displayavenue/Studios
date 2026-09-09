"use client";

import { useEffect, useState } from "react";

export function AdminContentClient() {
  const [ticker, setTicker] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    if (!res.ok) return;
    const t = data.settings?.ticker;
    const a = data.settings?.siteAnnouncement;
    if (Array.isArray(t)) setTicker(t.join("\n"));
    else if (typeof t === "string") setTicker(t);
    if (typeof a === "string") setAnnouncement(a);
    else if (a && typeof a === "object" && "text" in a) setAnnouncement(String((a as { text: string }).text));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(key: string, value: unknown) {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setNote(res.ok ? "Saved" : "Failed");
  }

  return (
    <div className="space-y-6">
      <div className="admin-panel space-y-3 p-4">
        <h2 className="text-sm font-semibold">Activity ticker (one line per item)</h2>
        <textarea
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          rows={6}
          className="w-full rounded border border-white/15 bg-transparent p-3 text-sm"
        />
        <button
          type="button"
          className="rounded border border-[var(--jk-gold)] px-3 py-1.5 text-xs text-[var(--jk-gold)]"
          onClick={() =>
            save(
              "marketplace.ticker",
              ticker
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        >
          Save ticker
        </button>
      </div>
      <div className="admin-panel space-y-3 p-4">
        <h2 className="text-sm font-semibold">Site announcement</h2>
        <input
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="h-10 w-full rounded border border-white/15 bg-transparent px-3 text-sm"
        />
        <button
          type="button"
          className="rounded border border-[var(--jk-gold)] px-3 py-1.5 text-xs text-[var(--jk-gold)]"
          onClick={() => save("site.announcement", { text: announcement })}
        >
          Save announcement
        </button>
      </div>
      {note && <p className="text-xs text-emerald-400">{note}</p>}
    </div>
  );
}
