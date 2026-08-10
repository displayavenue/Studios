import PDFDocument from "pdfkit";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import fs from "fs";
import path from "path";
import { calculateCampaignHealth } from "../engines/campaignHealthEngine";
import { calculateClientHealth } from "../engines/clientHealthEngine";
import { runAiStructured, monthlyNarrativeSchema } from "../ai/aiService";
import { z } from "zod";

export async function generateMonthlyReportPdf(params: {
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
}) {
  const org = await prisma.organization.findUnique({
    where: { id: params.organizationId },
  });
  if (!org) throw new Error("Organization not found");

  const [campaigns, payments, invoices, leads, approvals, tasks] = await Promise.all([
    prisma.campaign.findMany({ where: { organizationId: org.id } }),
    prisma.payment.findMany({
      where: {
        organizationId: org.id,
        status: "PAID",
        createdAt: { gte: params.periodStart, lte: params.periodEnd },
      },
    }),
    prisma.invoice.findMany({ where: { organizationId: org.id } }),
    prisma.lead.count({
      where: {
        organizationId: org.id,
        createdAt: { gte: params.periodStart, lte: params.periodEnd },
      },
    }),
    prisma.approval.count({
      where: { organizationId: org.id, status: "pending" },
    }),
    prisma.task.count({
      where: {
        organizationId: org.id,
        status: "open",
        priority: { in: ["critical", "high"] },
      },
    }),
  ]);

  const campaignHealthRows = campaigns.map((c) => {
    const meta =
      c.meta && typeof c.meta === "object" ? (c.meta as Record<string, unknown>) : {};
    return {
      campaign: c,
      health: calculateCampaignHealth({
        status: c.status,
        dailyBudgetInr: c.dailyBudgetInr,
        healthScore: c.healthScore,
        meta: {
          ctr: num(meta.ctr),
          cpc: num(meta.cpc),
          cpl: num(meta.cpl),
          spendInr: num(meta.spendInr),
          leads: num(meta.leads),
          roas: num(meta.roas),
          frequency: num(meta.frequency),
          deliveryIssues: Boolean(meta.deliveryIssues),
        },
      }),
    };
  });

  const avgCampaignHealth =
    campaignHealthRows.length > 0
      ? campaignHealthRows.reduce((s, r) => s + r.health.score, 0) / campaignHealthRows.length
      : null;

  const overdueInvoices = invoices.filter((i) => i.status === "overdue").length;
  const paidTotal = payments.reduce((s, p) => s + p.amountInr, 0);

  const clientHealth = calculateClientHealth({
    status: org.status,
    type: org.type,
    openInvoicesOverdue: overdueInvoices,
    pendingApprovals: approvals,
    activeCampaigns: campaigns.filter((c) => /active|live|enabled/i.test(c.status)).length,
    campaignsNeedAttention: campaignHealthRows.filter((r) =>
      ["watch", "at_risk", "critical"].includes(r.health.label),
    ).length,
    avgCampaignHealth,
    openCriticalTasks: tasks,
    onboardingComplete: org.status !== "ONBOARDING",
  });

  // Persist deterministic health back to org / campaigns (AI never sets these)
  await prisma.organization.update({
    where: { id: org.id },
    data: { healthScore: clientHealth.score, healthLabel: clientHealth.label },
  });
  for (const row of campaignHealthRows) {
    await prisma.campaign.update({
      where: { id: row.campaign.id },
      data: { healthScore: row.health.score },
    });
  }

  const metricsPayload = {
    organization: org.name,
    periodStart: params.periodStart.toISOString(),
    periodEnd: params.periodEnd.toISOString(),
    clientHealth,
    campaigns: campaignHealthRows.map((r) => ({
      name: r.campaign.name,
      status: r.campaign.status,
      score: r.health.score,
      label: r.health.label,
      flags: r.health.flags,
    })),
    newLeads: leads,
    paidInr: paidTotal,
    overdueInvoices,
    pendingApprovals: approvals,
    openCriticalTasks: tasks,
  };

  const narrativeAi = await runAiStructured<z.infer<typeof monthlyNarrativeSchema>>({
    organizationId: org.id,
    feature: "monthly_report",
    userPayload: metricsPayload,
    schemaDescription:
      '{ "executiveSummary": string, "highlights": string[], "risks": string[], "nextMonthFocus": string[] }',
    validate: (d) => monthlyNarrativeSchema.parse(d),
  });

  const narrative = narrativeAi.data || {
    executiveSummary: `${org.name} monthly health score is ${clientHealth.score} (${clientHealth.label}).`,
    highlights: [
      `${leads} new leads in period`,
      `₹${paidTotal.toLocaleString("en-IN")} paid`,
      `${campaignHealthRows.filter((r) => r.health.label === "healthy").length} healthy campaigns`,
    ],
    risks: clientHealth.flags,
    nextMonthFocus: ["Review at-risk campaigns", "Clear pending approvals", "Confirm billing"],
  };

  const outDir = path.join(process.cwd(), "storage", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = params.periodEnd.toISOString().slice(0, 10);
  const filePath = path.join(outDir, `monthly-${org.slug}-${stamp}.pdf`);

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const addHeading = (t: string) => {
      doc.moveDown(1);
      doc.fontSize(16).fillColor("#0B1F3A").text(t, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#1a1a1a");
    };

    doc.fontSize(22).fillColor("#0B1F3A").text("DisplayAvenue OS", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text("Monthly Client Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(org.name, { align: "center" });
    doc.text(
      `${params.periodStart.toLocaleDateString("en-IN")} – ${params.periodEnd.toLocaleDateString("en-IN")}`,
      { align: "center" },
    );
    doc.moveDown(2);
    doc.text(`Client Health: ${clientHealth.score} (${clientHealth.label})`, {
      align: "center",
    });

    doc.addPage();
    addHeading("1. Executive Summary");
    doc.text(narrative.executiveSummary);

    addHeading("2. Highlights");
    for (const h of narrative.highlights) doc.text(`• ${h}`);

    addHeading("3. Measured Metrics");
    doc.text(`New leads: ${leads}`);
    doc.text(`Paid this period: ₹${paidTotal.toLocaleString("en-IN")}`);
    doc.text(`Overdue invoices: ${overdueInvoices}`);
    doc.text(`Pending approvals: ${approvals}`);
    doc.text(`Open critical/high tasks: ${tasks}`);

    addHeading("4. Campaign Health");
    if (!campaignHealthRows.length) doc.text("No campaigns in this organization.");
    for (const row of campaignHealthRows) {
      doc.text(
        `• ${row.campaign.name}: ${row.health.score} (${row.health.label})${row.health.flags.length ? ` — ${row.health.flags.join(", ")}` : ""}`,
      );
    }

    addHeading("5. Risks");
    for (const r of narrative.risks) doc.text(`• ${r}`);

    addHeading("6. Next Month Focus");
    for (const n of narrative.nextMonthFocus) doc.text(`• ${n}`);

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });

  const report = await prisma.report.create({
    data: {
      organizationId: org.id,
      type: "monthly",
      title: `Monthly Report — ${org.name} — ${stamp}`,
      status: "ready",
      pdfPath: filePath,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      content: {
        clientHealth,
        metrics: metricsPayload,
        narrative,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  return { report, filePath, clientHealth };
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
