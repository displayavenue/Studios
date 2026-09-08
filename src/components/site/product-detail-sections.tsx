import { Check, BookOpen, Users, Sparkles, HelpCircle, FileText, Clock } from "lucide-react";

type WhatsIncludedRich = {
  included: string[];
  chapters: string[];
  whoFor: string[];
  outcomes: string[];
  pageEstimate?: number;
};

export function parseWhatsIncluded(raw: unknown): {
  bullets: string[];
  chapters: string[];
  whoFor: string[];
  outcomes: string[];
  pageEstimate: number | null;
} {
  if (Array.isArray(raw)) {
    return { bullets: raw as string[], chapters: [], whoFor: [], outcomes: [], pageEstimate: null };
  }
  if (raw && typeof raw === "object") {
    const o = raw as Partial<WhatsIncludedRich>;
    return {
      bullets: Array.isArray(o.included) ? o.included : [],
      chapters: Array.isArray(o.chapters) ? o.chapters : [],
      whoFor: Array.isArray(o.whoFor) ? o.whoFor : [],
      outcomes: Array.isArray(o.outcomes) ? o.outcomes : [],
      pageEstimate: typeof o.pageEstimate === "number" ? o.pageEstimate : null,
    };
  }
  return {
    bullets: ["Digital PDF report", "Dashboard access", "Interpretive guidance with clear disclaimers"],
    chapters: [],
    whoFor: [],
    outcomes: [],
    pageEstimate: null,
  };
}

export type FaqItem = { q: string; a: string };

export function parseFaqs(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const q = "q" in item ? String((item as FaqItem).q) : "";
      const a = "a" in item ? String((item as FaqItem).a) : "";
      if (!q || !a) return null;
      return { q, a };
    })
    .filter(Boolean) as FaqItem[];
}

export function ProductDetailSections({
  description,
  whatsIncluded,
  faqs,
  deliveryNote,
}: {
  description: string;
  whatsIncluded: unknown;
  faqs: unknown;
  deliveryNote?: string | null;
}) {
  const { bullets, chapters, whoFor, outcomes, pageEstimate } = parseWhatsIncluded(whatsIncluded);
  const faqList = parseFaqs(faqs);
  const paragraphs = description.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-semibold">About this report</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--jk-muted)]">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--jk-ink)]">
          {deliveryNote && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--jk-line)] bg-[var(--jk-ivory)] px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[var(--jk-gold-dark)]" />
              {deliveryNote}
            </span>
          )}
          {pageEstimate ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--jk-line)] bg-[var(--jk-ivory)] px-3 py-1.5">
              <FileText className="h-3.5 w-3.5 text-[var(--jk-gold-dark)]" />
              About {pageEstimate} pages (estimate)
            </span>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--jk-gold-dark)]" />
          <h2 className="font-display text-xl font-semibold">What you will get</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[var(--jk-ink)]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--jk-gold-dark)]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {chapters.length > 0 && (
        <section className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--jk-gold-dark)]" />
            <h2 className="font-display text-xl font-semibold">Report chapters</h2>
          </div>
          <ol className="mt-4 space-y-2">
            {chapters.map((c, i) => (
              <li key={c} className="flex gap-3 text-sm text-[var(--jk-ink)]">
                <span className="font-semibold text-[var(--jk-gold-dark)]">{String(i + 1).padStart(2, "0")}</span>
                <span>{c.replace(/^\d+\.\s*/, "")}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {whoFor.length > 0 && (
        <section className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--jk-gold-dark)]" />
            <h2 className="font-display text-xl font-semibold">Who this is for</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {whoFor.map((w) => (
              <li key={w} className="text-sm text-[var(--jk-muted)]">
                • {w}
              </li>
            ))}
          </ul>
        </section>
      )}

      {outcomes.length > 0 && (
        <section className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Outcomes you can expect</h2>
          <p className="mt-2 text-xs text-[var(--jk-muted)]">
            Reflective outcomes only — not predictions, guarantees, or professional advice.
          </p>
          <ul className="mt-4 space-y-2">
            {outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-[var(--jk-ink)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--jk-gold-dark)]" />
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      {faqList.length > 0 && (
        <section className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--jk-gold-dark)]" />
            <h2 className="font-display text-xl font-semibold">Frequently asked questions</h2>
          </div>
          <div className="mt-4 divide-y divide-[var(--jk-line)]">
            {faqList.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--jk-ink)] marker:content-none">
                  <span className="flex items-start justify-between gap-3">
                    {f.q}
                    <span className="text-[var(--jk-muted)] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[var(--jk-muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--jk-gold)]/30 bg-[var(--jk-gold)]/5 p-5">
        <p className="text-sm leading-relaxed text-[var(--jk-muted)]">
          Astrology and face/numerology readings are interpretive and intended for personal reflection and
          entertainment. They should not be treated as certainty or as medical, legal, financial, or
          relationship advice.
        </p>
      </section>
    </div>
  );
}
