import Link from "next/link";
import { PageHero, SectionShell } from "@/components/site/page-chrome";
import { SAMPLE_STORIES, SAMPLE_STORIES_DISCLAIMER } from "@/content/sample-stories";

export const metadata = {
  title: "Sample reader stories | JyotishKundali",
  description: SAMPLE_STORIES_DISCLAIMER,
};

export default function StoriesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Sample stories"
        title="120 illustrative reader stories"
        subtitle={SAMPLE_STORIES_DISCLAIMER}
      />
      <SectionShell muted>
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Not verified reviews.</strong> Real customer testimonials appear only after verified
          purchases. Until then, these samples show the tone and layout only.{" "}
          <Link href="/services" className="underline">
            Browse real reports
          </Link>
          .
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_STORIES.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-[var(--jk-line)] bg-white p-5 shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                Sample · not verified
              </p>
              <blockquote className="mt-2 text-sm leading-relaxed text-[var(--jk-ink)]">
                “{s.quote}”
              </blockquote>
              <div className="mt-4 flex items-center justify-between gap-2 text-xs text-[var(--jk-muted)]">
                <span className="font-semibold text-[var(--jk-ink)]">
                  {s.name}
                  <span className="font-normal text-[var(--jk-muted)]"> · {s.city}</span>
                </span>
                <span className="truncate text-right">{s.focus}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
