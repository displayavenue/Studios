import PDFDocument from "pdfkit";
import { prisma } from "../db";
import fs from "fs";
import path from "path";

export async function generateReportPdf(assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { analysis: true },
  });
  if (!assessment) throw new Error("Assessment not found");

  const competitors = await prisma.competitor.findMany({
    where: { id: { in: assessment.selectedCompetitorIds } },
    include: { scores: true, industry: true, location: true },
  });

  const outDir = path.join(process.cwd(), "storage", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `${assessment.publicId}.pdf`);

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

    // 1 Cover
    doc.fontSize(22).fillColor("#0B1F3A").text("DisplayAvenue Growth360", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text("Complete Growth Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(assessment.company || "Business Report", { align: "center" });
    doc.text(`${assessment.industry || ""} · ${assessment.location || ""}`, { align: "center" });
    doc.moveDown(2);
    doc.text(`Growth Score: ${assessment.growthScore ?? "—"}`, { align: "center" });

    // 2 Executive Summary
    doc.addPage();
    addHeading("1. Executive Summary");
    doc.text(assessment.analysis?.executiveSummary || "Analysis ready.");

    addHeading("2. Growth Score");
    doc.text(`Overall: ${assessment.growthScore}`);
    doc.text(JSON.stringify(assessment.scoreBreakdown || {}, null, 2));

    addHeading("3. Revenue Opportunity");
    doc.text(assessment.analysis?.businessOpportunity || assessment.biggestOpportunity || "");
    const roi = assessment.roiResult as {
      scenarios?: { name: string; revenueInr: number; roiMultiple: number; leads: number }[];
    } | null;
    for (const s of roi?.scenarios || []) {
      doc.text(
        `${s.name}: ${s.leads} leads · Revenue ₹${s.revenueInr.toLocaleString("en-IN")} · ${s.roiMultiple}x`,
      );
    }

    addHeading("4. Competitive Landscape");
    doc.text(
      `We identified ${competitors.length} businesses competing for the same customers or market.`,
    );

    addHeading("5. Competitors (Database Records)");
    for (const c of competitors) {
      doc.text(
        `• ${c.name} — ${c.location?.name || c.city || "—"} | Overall ${c.scores?.overallScore ?? 0} | Digital ${c.scores?.digitalScore ?? 0} | Marketing ${c.scores?.marketingScore ?? 0}`,
      );
    }

    addHeading("6. Competitive Analysis (AI Interpretation)");
    const comp = assessment.analysis?.competitorSummary as {
      competitiveSummary?: string;
      competitiveAdvantages?: string[];
      opportunities?: string[];
      recommendedActions?: string[];
    } | null;
    doc.text(comp?.competitiveSummary || "");
    doc.text(`Advantages: ${(comp?.competitiveAdvantages || []).join("; ")}`);
    doc.text(`Opportunities: ${(comp?.opportunities || []).join("; ")}`);

    addHeading("7. Ideal Customer Profile");
    doc.text(assessment.targetCustomer || "Not provided");

    addHeading("8. Marketing Strategy & Channels");
    const channels = assessment.analysis?.channelExplanations as
      | { channel: string; explanation: string; role: string }[]
      | null;
    for (const ch of channels || []) {
      doc.text(`${ch.channel}: ${ch.explanation} (${ch.role})`);
    }

    addHeading("9. Budget & Management Fee (Rule Engine)");
    const pricing = assessment.pricingResult as {
      adSpendInr?: number;
      managementFeeInr?: number;
      setupFeeInr?: number;
      gstInr?: number;
      totalInvestmentInr?: number;
    } | null;
    if (pricing) {
      doc.text(`Ad Spend: ₹${pricing.adSpendInr?.toLocaleString("en-IN")}`);
      doc.text(`Management Fee: ₹${pricing.managementFeeInr?.toLocaleString("en-IN")}`);
      doc.text(`Setup Fee: ₹${pricing.setupFeeInr?.toLocaleString("en-IN")}`);
      doc.text(`GST: ₹${pricing.gstInr?.toLocaleString("en-IN")}`);
      doc.text(`Total Investment: ₹${pricing.totalInvestmentInr?.toLocaleString("en-IN")}`);
    }

    addHeading("10. ROI Scenarios");
    for (const s of roi?.scenarios || []) {
      doc.text(`${s.name}: ROI ${s.roiMultiple}x`);
    }

    addHeading("11. Cold Calling Strategy");
    const cold = assessment.analysis?.coldCallScript as { opening?: string } | null;
    doc.text(cold?.opening || "");

    addHeading("12. 90-Day Growth Plan");
    const plan = assessment.plan90Day as {
      phase1?: { days: string; tasks: string[] };
      phase2?: { days: string; tasks: string[] };
      phase3?: { days: string; tasks: string[] };
    } | null;
    for (const phase of [plan?.phase1, plan?.phase2, plan?.phase3]) {
      if (!phase) continue;
      doc.text(phase.days);
      for (const t of phase.tasks || []) doc.text(`- ${t}`);
    }

    addHeading("13. Recommended Next Steps");
    doc.text("1. Review this Growth360 report with your team");
    doc.text("2. Unlock execution priorities with DisplayAvenue");
    doc.text("3. Book the ₹99 Growth Strategy Call");

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });

  const report = await prisma.report.upsert({
    where: { assessmentId },
    create: {
      assessmentId,
      status: "ready",
      pdfPath: filePath,
      sections: {
        create: [
          { key: "cover", title: "Cover", content: { company: assessment.company }, sortOrder: 1 },
          {
            key: "executive",
            title: "Executive Summary",
            content: { text: assessment.analysis?.executiveSummary },
            sortOrder: 2,
          },
        ],
      },
    },
    update: { status: "ready", pdfPath: filePath },
  });

  return { report, filePath };
}
