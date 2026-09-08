"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getDailyHoroscope, ZODIAC_SIGNS, type ZodiacKey } from "@/content/daily-horoscope";

export function DailyHoroscopePanel({ compact = false }: { compact?: boolean }) {
  const [sign, setSign] = useState<ZodiacKey>("aries");
  const reading = useMemo(() => getDailyHoroscope(sign), [sign]);

  return (
    <div className={compact ? "" : "grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"}>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {ZODIAC_SIGNS.map((z) => (
          <button
            key={z.key}
            type="button"
            onClick={() => setSign(z.key)}
            className={`rounded-xl border px-2 py-3 text-center text-xs transition ${
              sign === z.key
                ? "border-[var(--at-yellow)] bg-[var(--at-yellow)]/30 font-semibold"
                : "border-[var(--jk-line)] bg-white hover:border-[var(--at-yellow)]"
            }`}
          >
            <span className="block font-semibold">{z.name}</span>
            <span className="text-[10px] text-[var(--jk-muted)]">{z.hindi}</span>
          </button>
        ))}
      </div>
      <div className="at-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">
          Today · sample rashi blurb
        </p>
        <h3 className="mt-2 text-2xl font-bold">
          {reading.name} <span className="text-[var(--jk-muted)]">· {reading.hindi}</span>
        </h3>
        <p className="mt-1 text-xs text-[var(--jk-muted)]">{reading.range}</p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--jk-ink)]">{reading.body}</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(reading.pillars).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-[var(--at-cream)] px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wide text-[var(--jk-muted)]">{k}</p>
              <p className="text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--jk-muted)]">{reading.disclaimer}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/services?category=daily-astrology" className="at-cta inline-flex h-10 items-center px-4 text-sm">
            Get detailed report
          </Link>
          <Link
            href="/chat-with-astrologer"
            className="inline-flex h-10 items-center rounded-full border border-[var(--jk-line)] px-4 text-sm font-semibold"
          >
            Talk to a specialist
          </Link>
        </div>
      </div>
    </div>
  );
}
