"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ChartResult = {
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  disclaimer?: string;
  mock?: boolean;
  planets?: Record<string, { sign?: string; house?: number; nakshatra?: string }>;
};

export function FreeKundliForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chart, setChart] = useState<ChartResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/tools/free-kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          dob: fd.get("dob"),
          birthTime: fd.get("birthTime") || undefined,
          birthTimeUnknown: fd.get("birthTimeUnknown") === "on",
          placeName: fd.get("placeName"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not calculate");
      setChart(data.chart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  const field =
    "mt-1.5 flex h-11 w-full rounded-xl border border-[var(--jk-line)] bg-white px-3 text-sm outline-none focus:border-[var(--at-yellow)]";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={onSubmit} className="at-card space-y-4 p-5 sm:p-6">
        <h2 className="text-xl font-bold">Enter birth details</h2>
        <p className="text-xs text-[var(--jk-muted)]">
          Free Lahiri sidereal chart preview — same engine as paid reports. Interpretive only.
        </p>
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" required className={field} placeholder="Your name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="dob">
              Date of birth
            </label>
            <input id="dob" name="dob" type="date" required className={field} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="birthTime">
              Time of birth
            </label>
            <input id="birthTime" name="birthTime" type="time" className={field} />
            <label className="mt-2 flex items-center gap-2 text-xs text-[var(--jk-muted)]">
              <input type="checkbox" name="birthTimeUnknown" /> Time unknown (uses noon)
            </label>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="placeName">
            Place of birth
          </label>
          <input id="placeName" name="placeName" required className={field} placeholder="City, State, Country" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={pending} className="at-cta flex h-12 w-full items-center justify-center gap-2 text-sm disabled:opacity-60">
          {pending ? "Calculating…" : "Generate Free Kundli"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="at-card p-5 sm:p-6">
        {!chart ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center text-center text-sm text-[var(--jk-muted)]">
            <p className="text-4xl" aria-hidden>
              ☉
            </p>
            <p className="mt-3 max-w-sm">Your Lagna, Moon, Sun, and planet houses will appear here after you submit.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold">Chart snapshot</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[var(--at-cream)] p-3">
                <p className="text-[10px] uppercase text-[var(--jk-muted)]">Lagna</p>
                <p className="font-semibold">{chart.ascendant || "—"}</p>
              </div>
              <div className="rounded-xl bg-[var(--at-cream)] p-3">
                <p className="text-[10px] uppercase text-[var(--jk-muted)]">Moon</p>
                <p className="font-semibold">{chart.moonSign || "—"}</p>
              </div>
              <div className="rounded-xl bg-[var(--at-cream)] p-3">
                <p className="text-[10px] uppercase text-[var(--jk-muted)]">Sun</p>
                <p className="font-semibold">{chart.sunSign || "—"}</p>
              </div>
            </div>
            {chart.planets && (
              <ul className="mt-5 space-y-2 text-sm">
                {Object.entries(chart.planets).map(([name, p]) => (
                  <li key={name} className="flex justify-between border-b border-[var(--jk-line)] py-2">
                    <span className="font-medium">{name}</span>
                    <span className="text-[var(--jk-muted)]">
                      {p.sign}
                      {p.house != null ? ` · H${p.house}` : ""}
                      {p.nakshatra ? ` · ${p.nakshatra}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-[var(--jk-muted)]">{chart.disclaimer}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/services/janam-kundali" className="at-cta inline-flex h-10 items-center px-4 text-sm">
                Get full PDF report
              </Link>
              <Link href="/chat-with-astrologer" className="inline-flex h-10 items-center rounded-full border border-[var(--jk-line)] px-4 text-sm font-semibold">
                Discuss with astrologer
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
