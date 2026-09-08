import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listUserReports } from "@/services/report/service";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";
import { OrderTimeline } from "@/components/site/order-timeline";
import { ShareReportCard } from "@/components/site/share-report-card";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/reports");

  const reports = await listUserReports(session.id);

  return (
    <div>
      <PageHero
        eyebrow="Library"
        title="Your reports"
        subtitle="Track generation status and download PDFs when ready."
      />
      <SectionShell muted>
        {!reports.length ? (
          <Surface className="text-center">
            <p className="text-sm text-[var(--jk-muted)]">No reports yet. Buy a reading to generate your first PDF.</p>
            <div className="mt-4 flex justify-center">
              <GoldCtaLink href="/services">Browse services</GoldCtaLink>
            </div>
          </Surface>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const ready = report.jobStatus === "COMPLETED";
              const statusForTimeline =
                report.jobStatus === "COMPLETED"
                  ? "REPORT_READY"
                  : report.jobStatus === "QUEUED"
                    ? "PAID"
                    : "REPORT_GENERATING";
              return (
                <Surface key={report.id} className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="font-display text-lg text-[var(--jk-navy)]">
                      {report.title || report.product.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--jk-muted)]">
                      {report.product.name} · {report.jobStatus.replace(/_/g, " ").toLowerCase()} ·{" "}
                      {report.createdAt.toLocaleString("en-IN")}
                    </p>
                    {ready ? (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <a
                          href={`/api/reports/${report.id}/pdf`}
                          className="gold-btn inline-flex h-10 items-center px-5 text-sm"
                        >
                          Download PDF
                        </a>
                        <ShareReportCard title={report.title || report.product.name} personName={report.birthProfile?.name} />
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-[var(--jk-muted)]">Generating your interpretive PDF…</p>
                    )}
                  </div>
                  <div>
                    <OrderTimeline status={statusForTimeline} />
                  </div>
                </Surface>
              );
            })}
          </div>
        )}
        <p className="mt-6 text-center text-sm text-[var(--jk-muted)]">
          Need help? <Link href="/contact" className="underline">Contact support</Link> or read our{" "}
          <Link href="/legal/refund" className="underline">refund policy</Link>.
        </p>
      </SectionShell>
    </div>
  );
}
