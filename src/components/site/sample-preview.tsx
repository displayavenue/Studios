"use client";

import { useState } from "react";
import { Download, Eye } from "lucide-react";

export function SamplePreview({ productName, productSlug }: { productName: string; productSlug: string }) {
  const [open, setOpen] = useState(false);
  const sampleHref = `/api/reports/sample-pdf?slug=${encodeURIComponent(productSlug)}`;

  return (
    <div className="rounded-2xl border border-[var(--jk-line)] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Sample PDF preview</h2>
          <p className="mt-1 text-sm text-[var(--jk-muted)]">
            Download a real multi-page sample PDF for this report structure — watermarked, not your chart.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold"
          >
            <Eye className="h-3.5 w-3.5" />
            {open ? "Hide" : "View outline"}
          </button>
          <a
            href={sampleHref}
            className="gold-btn inline-flex h-10 items-center gap-1.5 px-4 text-sm"
            download
          >
            <Download className="h-3.5 w-3.5" />
            Download sample PDF
          </a>
        </div>
      </div>
      {open && (
        <div className="relative mt-4 overflow-hidden rounded-xl border border-dashed border-[var(--jk-line)] bg-[#f8f9fb] p-4">
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center rotate-[-18deg] text-4xl font-bold uppercase tracking-[0.2em] text-[var(--jk-navy)]/10">
            Sample
          </p>
          <p className="relative text-sm font-semibold text-[var(--jk-navy)]">{productName}</p>
          <ul className="relative mt-3 space-y-1.5 text-sm text-[var(--jk-muted)]">
            <li>• Cover with birth-detail placeholders</li>
            <li>• Lahiri sidereal chart snapshot (real astronomy-engine positions)</li>
            <li>• Lagna, Moon nakshatra, planetary table, Vimshottari dasha</li>
            <li>• Product-specific chapters from calculated placements</li>
            <li>• Classical dosha / matching flags where the template applies</li>
            <li>• Clear entertainment disclaimer — not predictive certainty</li>
          </ul>
          <p className="relative mt-3 text-xs text-amber-800">
            Paid PDFs use your birth details after checkout. Samples always say SAMPLE on each page.
            Calculations follow documented Lahiri / Parashari algorithms; interpretations remain reflective.
          </p>
        </div>
      )}
    </div>
  );
}
