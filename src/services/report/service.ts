import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { ReportJobStatus } from "@/generated/prisma/enums";
import { createAstrologyProvider } from "@/providers/astrology/mock-provider";
import { createStorageProvider } from "@/providers/storage/mock-provider";
import { notifyUser } from "@/providers/notifications";

/** Stub report job queue — processes shortly after enqueue; replace with BullMQ/SQS later. */
export async function enqueueReportJob(reportId: string) {
  setTimeout(() => {
    processReportJob(reportId).catch((err) => {
      console.error("[report-queue] failed", reportId, err);
    });
  }, 150);
  return { queued: true, reportId };
}

export async function processReportJob(reportId: string) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      product: true,
      birthProfile: true,
      user: { select: { id: true, email: true, firstName: true } },
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
    data: { jobStatus: ReportJobStatus.GENERATING_PDF },
  });

  const pdfBytes = await buildReportPdf({
    title: report.product.name,
    personName: report.birthProfile.name,
    place: report.birthProfile.placeName,
    dob: report.birthProfile.dob.toISOString().slice(0, 10),
    overview: interpretation.sections.overview,
    personality: interpretation.sections.personality,
    guidance: interpretation.sections.guidance,
    disclaimer: chart.disclaimer,
  });

  await prisma.report.update({
    where: { id: reportId },
    data: { jobStatus: ReportJobStatus.UPLOADING },
  });

  const storage = createStorageProvider();
  const key = `reports/${report.userId}/${reportId}.pdf`;
  const uploaded = await storage.uploadPdf(Buffer.from(pdfBytes), key);

  // Persist downloadable artifact. For mock storage we also keep bytes via API route.
  await prisma.pdfFile.create({
    data: {
      reportId,
      url: uploaded.url,
      fileName: `${report.product.slug || "report"}.pdf`,
      fileSize: pdfBytes.byteLength,
      mimeType: "application/pdf",
    },
  });

  // Store PDF buffer as base64 in report content for local/mock download reliability.
  await prisma.report.update({
    where: { id: reportId },
    data: {
      jobStatus: ReportJobStatus.COMPLETED,
      content: {
        chart,
        interpretation,
        pdfBase64: Buffer.from(pdfBytes).toString("base64"),
        storageKey: key,
      },
      summary: interpretation.sections.overview,
      generatedAt: new Date(),
    },
  });

  if (report.orderId) {
    await prisma.order.update({
      where: { id: report.orderId },
      data: { status: "REPORT_READY", completedAt: new Date() },
    });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.vercel.app";
  await notifyUser({
    userId: report.userId,
    type: "REPORT",
    title: `Your ${report.product.name} is ready`,
    body: "Your interpretive report PDF is ready to download from your dashboard.",
    link: `${site}/dashboard/reports`,
    email: report.user.email,
    emailHtml: `
      <p>Hi ${report.user.firstName || "there"},</p>
      <p>Your <strong>${report.product.name}</strong> report is ready.</p>
      <p><a href="${site}/dashboard/reports">Download from your dashboard</a></p>
      <p style="color:#64748b;font-size:12px">Interpretive guidance for reflection and entertainment only.</p>
    `,
  });

  return { reportId, orderId: report.orderId };
}

async function buildReportPdf(input: {
  title: string;
  personName: string;
  place: string;
  dob: string;
  overview: string;
  personality: string;
  guidance: string;
  disclaimer: string;
}) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  let y = height - 56;

  const write = (text: string, size = 11, useBold = false, color = rgb(0.05, 0.05, 0.1)) => {
    const f = useBold ? bold : font;
    const lines = wrapText(text, 86);
    for (const line of lines) {
      if (y < 56) break;
      page.drawText(line, { x: 48, y, size, font: f, color });
      y -= size + 6;
    }
    y -= 8;
  };

  write("JyotishKundali", 18, true, rgb(0.78, 0.64, 0.15));
  write(input.title, 16, true);
  write(`Prepared for: ${input.personName}`);
  write(`Birth: ${input.dob} · ${input.place}`);
  write("Overview", 13, true);
  write(input.overview);
  write("Personality themes", 13, true);
  write(input.personality);
  write("Guidance", 13, true);
  write(input.guidance);
  write("Disclaimer", 12, true);
  write(input.disclaimer, 9, false, rgb(0.4, 0.45, 0.5));
  write("This PDF is generated for personal reflection and entertainment.", 9, false, rgb(0.4, 0.45, 0.5));

  void width;
  return doc.save();
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
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

export async function getReportPdfBuffer(reportId: string, userId: string) {
  const report = await prisma.report.findFirst({
    where: { id: reportId, userId },
  });
  if (!report) return null;
  const content = report.content as { pdfBase64?: string } | null;
  if (content?.pdfBase64) {
    return Buffer.from(content.pdfBase64, "base64");
  }
  return null;
}
