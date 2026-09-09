"use client";

import { useEffect, useState } from "react";

type Panchang = {
  date: string;
  weekday: string;
  paksha: string;
  tithi: { name: string };
  nakshatra: { name: string; pada: number; lord: string };
  yoga: { name: string };
  karana: { name: string };
  rashi: { sun: string; moon: string };
  disclaimer: string;
};

export function PanchangPanel() {
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }));
  const [data, setData] = useState<Panchang | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetch(`/api/tools/panchang?date=${date}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setData(j.panchang);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm font-medium" htmlFor="pdate">
            Date (IST snapshot)
          </label>
          <input
            id="pdate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 flex h-11 rounded-xl border border-[var(--jk-line)] bg-white px-3 text-sm"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {data && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Vara", data.weekday],
            ["Tithi", `${data.tithi.name} (${data.paksha})`],
            ["Nakshatra", `${data.nakshatra.name} pada ${data.nakshatra.pada}`],
            ["Yoga", data.yoga.name],
            ["Karana", data.karana.name],
            ["Rashi", `Sun ${data.rashi.sun} · Moon ${data.rashi.moon}`],
          ].map(([k, v]) => (
            <div key={k} className="at-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--jk-muted)]">{k}</p>
              <p className="mt-1 text-lg font-semibold">{v}</p>
            </div>
          ))}
        </div>
      )}
      {data && <p className="text-xs text-[var(--jk-muted)]">{data.disclaimer}</p>}
    </div>
  );
}
