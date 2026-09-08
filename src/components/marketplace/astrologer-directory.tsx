"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AstrologerCard } from "@/components/marketplace/astrologer-card";
import {
  filterAstrologers,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_DISCLAIMER,
} from "@/content/marketplace-astrologers";

export function AstrologerDirectory({ mode }: { mode: "chat" | "call" }) {
  const params = useSearchParams();
  const initialCat = params.get("category") || "all";
  const [category, setCategory] = useState(initialCat);
  const [q, setQ] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);

  const list = useMemo(
    () => filterAstrologers({ category, q, onlineOnly }),
    [category, q, onlineOnly],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            category === "all" ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)] bg-white"
          }`}
        >
          All
        </button>
        {MARKETPLACE_CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              category === c.key ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)] bg-white"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, skill, language…"
          className="h-11 min-w-[16rem] flex-1 rounded-full border border-[var(--jk-line)] bg-white px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
        />
        <label className="flex items-center gap-2 text-sm text-[var(--jk-muted)]">
          <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} />
          Online only (demo)
        </label>
      </div>

      <p className="mt-4 text-xs text-[var(--jk-muted)]">{MARKETPLACE_DISCLAIMER}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((a) => (
          <AstrologerCard key={a.slug} a={a} mode={mode === "chat" ? "chat" : mode === "call" ? "call" : "both"} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-8 text-center text-sm text-[var(--jk-muted)]">
          No sample experts match.{" "}
          <Link href="/services" className="font-semibold text-[var(--at-yellow-ink)]">
            Browse PDF reports
          </Link>
        </p>
      )}
    </div>
  );
}
