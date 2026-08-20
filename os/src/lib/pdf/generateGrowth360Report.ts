import PDFDocument from "pdfkit";
import { prisma } from "../db";
import { reportsDir } from "../storage";
import fs from "fs";
import path from "path";
import { profileFromAnswers } from "../engines/scoreEngine";

export async function generateGrowth360ReportPdf(assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
  });
  if (!assessment) throw new Error("Assessment not found");

  const competitors =
    assessment.selectedCompetitorIds.length > 0
      ? await prisma.competitor.findMany({
          where: { id: { in: assessment.selectedCompetitorIds } },
          include: { scores: true, industry: true, location: true },
        })
      : [];

  const profile = profileFromAnswers(assessment.answers);
  const analysis = (assessment.analysis || {}) as {
    executiveSummary?: string;
    businessOpportunity?: string;
    channelExplanations?: { channel: string; explanation: string; role: string }[];
    competitorSummary?: {
      competitiveSummary?: string;
      competitiveAdvantages?: string[];
      opportunities?: string[];
      recommendedActions?: string[];
    };
    coldCallScript?: { opening?: string };
  };

  const outDir = reportsDir();
  const filePath = path.join(outDir, `growth360-${assessment.publicId}.pdf`);

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

    doc.fontSize(22).fillColor("#0B1F3A").text("DisplayAvenue Growth360", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text("Complete Growth Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(profile.company || "Business Report", { align: "center" });
    doc.text(`${profile.industry || ""} · ${profile.location || ""}`, { align: "center" });
    doc.moveDown(2);
    doc.text(`Growth Score: ${assessment.growthScore ?? "—"}`, { align: "center" });

    doc.addPage();
    addHeading("1. Executive Summary");
    doc.text(analysis.executiveSummary || "Analysis ready.");

    addHeading("2. Growth Score");
    doc.text(`Overall: ${assessment.growthScore}`);
    doc.text(JSON.stringify(assessment.scoreBreakdown || {}, null, 2));

    addHeading("3. Revenue Opportunity");
    doc.text(analysis.businessOpportunity || assessment.biggestOpportunity || "");
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
    if (!competitors.length) {
      doc.text("No competitor records matched in the catalog for this segment.");
    }
    for (const c of competitors) {
      doc.text(
        `• ${c.name} — ${c.location?.name || c.city || "—"} | Overall ${c.scores?.overallScore ?? 0} | Digital ${c.scores?.digitalScore ?? 0} | Marketing ${c.scores?.marketingScore ?? 0}`,
      );
    }

    addHeading("6. Competitive Analysis");
    const comp = analysis.competitorSummary;
    doc.text(comp?.competitiveSummary || "");
    doc.text(`Advantages: ${(comp?.competitiveAdvantages || []).join("; ")}`);
    doc.text(`Opportunities: ${(comp?.opportunities || []).join("; ")}`);

    addHeading("7. Ideal Customer Profile");
    doc.text(profile.targetCustomer || "Not provided");

    addHeading("8. Marketing Strategy & Channels");
    for (const ch of analysis.channelExplanations || []) {
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
    doc.text(analysis.coldCallScript?.opening || "");

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

  const report = assessment.organizationId
    ? await prisma.report.create({
        data: {
          organizationId: assessment.organizationId,
          type: "growth360",
          title: `Growth360 — ${profile.company || assessment.publicId}`,
          status: "ready",
          pdfPath: filePath,
          content: {
            assessmentId: assessment.id,
            publicId: assessment.publicId,
            growthScore: assessment.growthScore,
          },
        },
      })
    : null;

  return { report, filePath };
}
