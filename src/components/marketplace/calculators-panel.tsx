"use client";

import { useState } from "react";

type MatchResult = {
  match: {
    total: number;
    max: number;
    percent: number;
    boyRashi: string;
    girlRashi: string;
    boyNakshatra: string;
    girlNakshatra: string;
    koots: Array<{ name: string; obtained: number; max: number }>;
  };
};

export function CalculatorsPanel() {
  const [tab, setTab] = useState<"match" | "moon">("match");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchResult["match"] | null>(null);
  const [moon, setMoon] = useState<{ moon?: { sign: string; nakshatra: string; pada: number }; lagna?: { sign: string } } | null>(
    null,
  );

  const field =
    "mt-1.5 flex h-10 w-full rounded-xl border border-[var(--jk-line)] bg-white px-3 text-sm outline-none focus:border-[var(--at-yellow)]";

  async function runMatch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/tools/calculators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "match",
          a: {
            name: fd.get("aName"),
            dob: fd.get("aDob"),
            birthTime: fd.get("aTime") || undefined,
            placeName: fd.get("aPlace"),
          },
          b: {
            name: fd.get("bName"),
            dob: fd.get("bDob"),
            birthTime: fd.get("bTime") || undefined,
            placeName: fd.get("bPlace"),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMatch(data.match);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  async function runMoon(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/tools/calculators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "moon-sign",
          name: fd.get("name"),
          dob: fd.get("dob"),
          birthTime: fd.get("birthTime") || undefined,
          placeName: fd.get("placeName"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMoon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("match")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "match" ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)]"}`}
        >
          Kundli matching
        </button>
        <button
          type="button"
          onClick={() => setTab("moon")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "moon" ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)]"}`}
        >
          Moon sign
        </button>
      </div>

      {tab === "match" && (
        <form onSubmit={runMatch} className="mt-6 grid gap-4 lg:grid-cols-2">
          {(["a", "b"] as const).map((p) => (
            <fieldset key={p} className="at-card space-y-3 p-4">
              <legend className="px-1 font-semibold">Person {p.toUpperCase()}</legend>
              <input name={`${p}Name`} required placeholder="Name" className={field} />
              <input name={`${p}Dob`} type="date" required className={field} />
              <input name={`${p}Time`} type="time" className={field} />
              <input name={`${p}Place`} required placeholder="Place of birth" className={field} defaultValue={p === "a" ? "Mumbai" : "Delhi"} />
            </fieldset>
          ))}
          <div className="lg:col-span-2">
            <button type="submit" disabled={pending} className="at-cta h-11 px-5 text-sm disabled:opacity-60">
              {pending ? "Calculating…" : "Calculate Ashtakoota"}
            </button>
          </div>
        </form>
      )}

      {tab === "moon" && (
        <form onSubmit={runMoon} className="at-card mt-6 max-w-lg space-y-3 p-5">
          <input name="name" required placeholder="Name" className={field} />
          <input name="dob" type="date" required className={field} />
          <input name="birthTime" type="time" className={field} />
          <input name="placeName" required placeholder="Place" defaultValue="Mumbai" className={field} />
          <button type="submit" disabled={pending} className="at-cta h-11 px-5 text-sm disabled:opacity-60">
            {pending ? "Calculating…" : "Find Moon sign"}
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {match && (
        <div className="at-card mt-6 p-5">
          <p className="text-2xl font-bold">
            {match.total}/{match.max} · {match.percent}%
          </p>
          <p className="mt-1 text-sm text-[var(--jk-muted)]">
            A: {match.boyRashi}/{match.boyNakshatra} · B: {match.girlRashi}/{match.girlNakshatra}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {match.koots.map((k) => (
              <li key={k.name} className="flex justify-between rounded-lg bg-[var(--at-cream)] px-3 py-2 text-sm">
                <span>{k.name}</span>
                <span className="font-semibold">
                  {k.obtained}/{k.max}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--jk-muted)]">Traditional conversation tool — not a marriage verdict.</p>
        </div>
      )}

      {moon && (
        <div className="at-card mt-6 max-w-lg p-5">
          <p className="text-lg font-bold">Moon {moon.moon?.sign}</p>
          <p className="text-sm text-[var(--jk-muted)]">
            Nakshatra {moon.moon?.nakshatra} pada {moon.moon?.pada} · Lagna {moon.lagna?.sign}
          </p>
        </div>
      )}
    </div>
  );
}
