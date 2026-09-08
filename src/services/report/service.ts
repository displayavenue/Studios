import { prisma } from "@/lib/prisma";
import { ReportJobStatus } from "@/generated/prisma/enums";
import { createAstrologyProvider } from "@/providers/astrology/mock-provider";

/** Stub report job queue — processes synchronously in dev; replace with BullMQ/SQS in production. */
export async function enqueueReportJob(reportId: string) {
  setTimeout(() => {
    processReportJob(reportId).catch((err) => {
      console.error("[report-queue] failed", reportId, err);
    });
  }, 100);
  return { queued: true, reportId };
}

export async function processReportJob(reportId: string) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      product: true,
      birthProfile: true,
    },
  });
  if (!report || !report.birthProfile) return;

  await prisma.report.update({
    where: { id: reportId },
    data: { jobStatus: ReportJobStatus.PROCESSING },
  });

  const astrology = createAstrologyProvider();
  const chart = await astrology.calculateChart({
    name: report.birthProfile.name,
    gender: report.birthProfile.gender ?? undefined,
    dob: report.birthProfile.dob.toISOString().slice(0, 10),
    birthTime: report.birthProfile.birthTime ?? undefined,
    birthTimeUnknown: report.birthProfile.birthTimeUnknown,
    placeName: report.birthProfile.placeName,
  });

  await prisma.report.update({
    where: { id: reportId },
    data: { jobStatus: ReportJobStatus.INTERPRETING },
  });

  const interpretation = await astrology.interpretChart(
    chart,
    report.product.reportTemplateKey || "default",
  );

  await prisma.report.update({
    where: { id: reportId },
    data: {
      jobStatus: ReportJobStatus.COMPLETED,
      content: { chart, interpretation },
      summary: interpretation.sections.overview,
      generatedAt: new Date(),
    },
  });

  const order = report.orderId
    ? await prisma.order.update({
        where: { id: report.orderId },
        data: { status: "REPORT_READY", completedAt: new Date() },
      })
    : null;

  return { reportId, orderId: order?.id };
}

export async function listUserReports(userId: string) {
  return prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, slug: true } },
      birthProfile: { select: { name: true } },
      pdfFiles: true,
    },
  });
}
