import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/reports");

  let reports: Array<{
    id: string;
    title: string | null;
    jobStatus: string;
    createdAt: Date;
    product: { name: string };
  }> = [];
  try {
    reports = await prisma.report.findMany({
      where: { userId: session.id },
      take: 40,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    });
  } catch {
    reports = [];
  }

  return (
    <div>
      <PageHero
        eyebrow="Library"
        title="Your reports"
        subtitle="Generated Kundali PDFs and purchased readings appear here after checkout completes."
      />
      <SectionShell muted>
        {!reports.length ? (
          <Surface className="text-center">
            <p className="text-sm text-[var(--jk-muted)]">No reports yet. Buy a reading to generate your first PDF.</p>
            <Link
              href="/services"
              className="mt-4 inline-flex text-sm font-semibold text-[var(--jk-navy)] hover:text-[var(--jk-gold-dark)]"
            >
              Browse services →
            </Link>
          </Surface>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Surface key={report.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-[var(--jk-navy)]">
                    {report.title || report.product.name}
                  </p>
                  <p className="mt-1 text-xs text-[var(--jk-muted)]">
                    {report.product.name} · {report.jobStatus.replace(/_/g, " ").toLowerCase()} ·{" "}
                    {report.createdAt.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--jk-navy)]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--jk-navy)]">
                  {report.jobStatus.replace(/_/g, " ")}
                </span>
              </Surface>
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}
