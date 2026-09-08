import { prisma } from "@/lib/prisma";
import { ReportJobStatus } from "@/generated/prisma/enums";
import { createAstrologyProvider } from "@/providers/astrology/vedic-provider";
import { createStorageProvider } from "@/providers/storage";
import { notifyUser } from "@/providers/notifications";
import {
  buildReportPdf,
  parseProductWhatsIncluded,
  type ReportPdfInput,
} from "@/services/report/pdf-builder";
import { resolvePlace } from "@/lib/vedic/geo";
import { productNeedsPartner } from "@/config/matching";
import type { BirthDetailsInput } from "@/services/order/service";
import type { ChartData } from "@/providers/astrology/types";

/** Stub report job queue — processes shortly after enqueue; replace with BullMQ/SQS later. */
export async function enqueueReportJob(reportId: string) {
  setTimeout(() => {
    processReportJob(reportId).catch((err) => {
      console.error("[report-queue] failed", reportId, err);
    });
  }, 150);
  return { queued: true, reportId };
}

async function loadPartnerDetails(
  orderId: string | null,
  productId: string,
): Promise<BirthDetailsInput | null> {
  if (!orderId) return null;
  const item = await prisma.orderItem.findFirst({
    where: { orderId, productId },
  });
  const meta = item?.metadata as {
    partnerBirthDetails?: BirthDetailsInput | null;
  } | null;
  return meta?.partnerBirthDetails || null;
}

async function partnerMoonFromDetails(
  astrology: ReturnType<typeof createAstrologyProvider>,
  partner: BirthDetailsInput,
): Promise<{ moonLon?: number; name: string; chart: ChartData }> {
  const place = resolvePlace(partner.placeName);
  const chart = await astrology.calculateChart({
    name: partner.name,
    gender: partner.gender || undefined,
    dob: partner.dob,
    birthTime: partner.birthTime,
    birthTimeUnknown: partner.birthTimeUnknown,
    placeName: partner.placeName,
    lat: place.lat,
    lng: place.lng,
    timezone: place.timezone,
  });
  const moonLon = chart.planets?.Moon?.longitude ?? (chart.vedic as { moon?: { longitude?: number } } | undefined)?.moon?.longitude;
  return { moonLon, name: partner.name, chart };
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
  const place = resolvePlace(
    report.birthProfile.placeName,
    report.birthProfile.lat != null ? Number(report.birthProfile.lat) : null,
    report.birthProfile.lng != null ? Number(report.birthProfile.lng) : null,
    report.birthProfile.timezone,
  );
  const chart = await astrology.calculateChart({
    name: report.birthProfile.name,
    gender: report.birthProfile.gender ?? undefined,
    dob: report.birthProfile.dob.toISOString().slice(0, 10),
    birthTime: report.birthProfile.birthTime ?? undefined,
    birthTimeUnknown: report.birthProfile.birthTimeUnknown,
    placeName: report.birthProfile.placeName,
    lat: place.lat,
    lng: place.lng,
    timezone: place.timezone,
  });

  let partnerMeta: { name?: string; moonLon?: number } | undefined;
  if (productNeedsPartner(report.product.slug)) {
    const partner = await loadPartnerDetails(report.orderId, report.productId);
    if (partner) {
      const resolved = await partnerMoonFromDetails(astrology, partner);
      chart.partnerMoonLongitude = resolved.moonLon;
      chart.partnerName = resolved.name;
      partnerMeta = { name: resolved.name, moonLon: resolved.moonLon };
    }
  }

  await prisma.report.update({
    where: { id: reportId },
    data: { jobStatus: ReportJobStatus.INTERPRETING },
  });

  const packed = parseProductWhatsIncluded(report.product.whatsIncluded);
  const interpretation = await astrology.interpretChart(
    chart,
    report.product.reportTemplateKey || "default",
    packed.chapters,
  );

  await prisma.report.update({
    where: { id: reportId },
    data: { jobStatus: ReportJobStatus.GENERATING_PDF },
  });

  const pdfInput: ReportPdfInput = {
    title: report.product.name,
    productSlug: report.product.slug,
    personName: report.birthProfile.name,
    place: report.birthProfile.placeName,
    dob: report.birthProfile.dob.toISOString().slice(0, 10),
    birthTime: report.birthProfile.birthTime,
    birthTimeUnknown: report.birthProfile.birthTimeUnknown,
    shortDescription: report.product.shortDescription,
    overview: interpretation.sections.overview,
    personality: interpretation.sections.personality,
    guidance: interpretation.sections.guidance,
    chapters: interpretation.chapters?.length
      ? interpretation.chapters
      : packed.chapters.map((title) => ({
          title: title.replace(/^\d+\.\s*/, ""),
          body: interpretation.sections.overview,
        })),
    included: packed.included,
    whoFor: packed.whoFor,
    outcomes: packed.outcomes,
    chartSummary: {
      mock: chart.mock,
      ascendant: chart.ascendant,
      moonSign: chart.moonSign,
      sunSign: chart.sunSign,
      planets: chart.planets,
      engineNote: chart.mock
        ? undefined
        : partnerMeta?.moonLon != null
          ? `Lahiri sidereal · whole-sign houses · Ashtakoota with ${partnerMeta.name || "partner"} · astronomy-engine`
          : "Lahiri sidereal · whole-sign houses · astronomy-engine geocentric positions",
    },
    disclaimer: chart.disclaimer,
  };

  const pdfBytes = await buildReportPdf(pdfInput);

  await prisma.report.update({
    where: { id: reportId },
    data: { jobStatus: ReportJobStatus.UPLOADING },
  });

  const storage = createStorageProvider();
  const key = `reports/${report.userId}/${reportId}.pdf`;
  const uploaded = await storage.uploadPdf(Buffer.from(pdfBytes), key);

  await prisma.pdfFile.create({
    data: {
      reportId,
      url: uploaded.url,
      fileName: `${report.product.slug || "report"}.pdf`,
      fileSize: pdfBytes.byteLength,
      mimeType: "application/pdf",
    },
  });

  await prisma.report.update({
    where: { id: reportId },
    data: {
      jobStatus: ReportJobStatus.COMPLETED,
      content: {
        chart: JSON.parse(JSON.stringify(chart)),
        interpretation: JSON.parse(JSON.stringify(interpretation)),
        pdfBase64: Buffer.from(pdfBytes).toString("base64"),
        storageKey: key,
        pageHint: packed.chapters.length || undefined,
        partner: partnerMeta || null,
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

/** Generate a watermarked sample PDF for a product slug (no payment). */
export async function buildSampleProductPdf(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED", isActive: true, isMembership: false },
  });
  if (!product) return null;

  const astrology = createAstrologyProvider();
  const chart = await astrology.calculateChart({
    name: "Sample Reader",
    dob: "1990-08-15",
    birthTime: "10:30",
    placeName: "Mumbai, India",
    lat: 19.076,
    lng: 72.8777,
    timezone: "Asia/Kolkata",
  });

  if (productNeedsPartner(product.slug)) {
    const partner = await astrology.calculateChart({
      name: "Sample Partner",
      dob: "1992-03-21",
      birthTime: "14:15",
      placeName: "Delhi, India",
      lat: 28.6139,
      lng: 77.209,
      timezone: "Asia/Kolkata",
    });
    chart.partnerMoonLongitude =
      partner.planets?.Moon?.longitude ??
      (partner.vedic as { moon?: { longitude?: number } } | undefined)?.moon?.longitude;
    chart.partnerName = "Sample Partner";
  }

  const packed = parseProductWhatsIncluded(product.whatsIncluded);
  const interpretation = await astrology.interpretChart(
    chart,
    product.reportTemplateKey || "default",
    packed.chapters,
  );

  const pdfBytes = await buildReportPdf({
    title: product.name,
    productSlug: product.slug,
    personName: "Sample Reader",
    place: "Mumbai, India",
    dob: "1990-08-15",
    birthTime: "10:30",
    birthTimeUnknown: false,
    shortDescription: product.shortDescription,
    overview: interpretation.sections.overview,
    personality: interpretation.sections.personality,
    guidance: interpretation.sections.guidance,
    chapters: interpretation.chapters || [],
    included: packed.included,
    whoFor: packed.whoFor,
    outcomes: packed.outcomes,
    chartSummary: {
      mock: chart.mock,
      ascendant: chart.ascendant,
      moonSign: chart.moonSign,
      sunSign: chart.sunSign,
      planets: chart.planets,
      engineNote: chart.mock
        ? undefined
        : "Lahiri sidereal · whole-sign houses · astronomy-engine geocentric positions",
    },
    disclaimer: chart.disclaimer,
    isSample: true,
  });

  return {
    bytes: Buffer.from(pdfBytes),
    fileName: `${product.slug}-sample.pdf`,
    productName: product.name,
  };
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
  const content = report.content as { pdfBase64?: string; storageKey?: string } | null;
  if (content?.pdfBase64) {
    return Buffer.from(content.pdfBase64, "base64");
  }
  if (content?.storageKey) {
    const { readStoredPdf } = await import("@/providers/storage");
    return readStoredPdf(content.storageKey);
  }
  return null;
}
