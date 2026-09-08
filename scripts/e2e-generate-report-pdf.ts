import "dotenv/config";
import { writeFileSync } from "fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { processReportJob } from "../src/services/report/service";
import { PDFDocument } from "pdf-lib";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL missing");

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findUnique({ where: { email: "demo@jyotishkundali.com" } });
    const product = await prisma.product.findUnique({ where: { slug: "janam-kundali" } });
    if (!user || !product) throw new Error("missing user/product");

    let profile = await prisma.birthProfile.findFirst({ where: { userId: user.id } });
    if (!profile) {
      profile = await prisma.birthProfile.create({
        data: {
          userId: user.id,
          name: "Demo User",
          dob: new Date("1990-01-15"),
          birthTime: "08:45",
          birthTimeUnknown: false,
          placeName: "Delhi, India",
          lat: 28.6139,
          lng: 77.209,
          timezone: "Asia/Kolkata",
          country: "IN",
          isDefault: true,
        },
      });
    }

    const report = await prisma.report.create({
      data: {
        userId: user.id,
        productId: product.id,
        birthProfileId: profile.id,
        jobStatus: "QUEUED",
        title: product.name,
      },
    });

    await processReportJob(report.id);
    const ready = await prisma.report.findUnique({ where: { id: report.id } });
    const content = ready?.content as { pdfBase64?: string } | null;
    if (!content?.pdfBase64) throw new Error("no pdf");
    const buf = Buffer.from(content.pdfBase64, "base64");
    const doc = await PDFDocument.load(buf);
    writeFileSync("/opt/cursor/artifacts/paid_path_demo_janam_kundali.pdf", buf);
    console.log(
      JSON.stringify({
        reportId: report.id,
        status: ready?.jobStatus,
        pages: doc.getPageCount(),
        bytes: buf.length,
      }),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
