"use client";

import { useState } from "react";

export function SamplePreview({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--jk-line)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Sample preview</h2>
          <p className="mt-1 text-sm text-[var(--jk-muted)]">Watermarked example of section structure — not your chart.</p>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full border px-4 py-2 text-sm font-semibold">
          {open ? "Hide" : "View sample"}
        </button>
      </div>
      {open && (
        <div className="relative mt-4 overflow-hidden rounded-xl border border-dashed border-[var(--jk-line)] bg-[#f8f9fb] p-4">
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center rotate-[-18deg] text-4xl font-bold uppercase tracking-[0.2em] text-[var(--jk-navy)]/10">
            Sample
          </p>
          <p className="relative text-sm font-semibold text-[var(--jk-navy)]">{productName}</p>
          <p className="relative mt-2 text-sm text-[var(--jk-muted)]">
            Overview: This sample shows how themes are organized — personality patterns, timing reflections, and gentle
            guidance. Your paid PDF uses your birth details.
          </p>
          <p className="relative mt-2 text-sm text-[var(--jk-muted)]">
            Guidance: Use insights for self-reflection only. Not medical, legal, or financial advice.
          </p>
        </div>
      )}
    </div>
  );
}
