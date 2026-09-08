/**
 * Generate a sample multi-page PDF offline for verification.
 * Usage: npx tsx scripts/generate-sample-pdf.ts [slug] [outPath]
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAstrologyProvider } from "../src/providers/astrology/vedic-provider";
import {
  buildReportPdf,
  parseProductWhatsIncluded,
} from "../src/services/report/pdf-builder";

async function main() {
  const slug = process.argv[2] || "janam-kundali";
  const out =
    process.argv[3] || `/opt/cursor/artifacts/${slug}-sample-report.pdf`;

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
    });
    if (!product) throw new Error(`Product not found: ${slug}`);

    const astrology = createAstrologyProvider();
    const chart = await astrology.calculateChart({
      name: "Demo Reader",
      dob: "1992-03-21",
      birthTime: "09:15",
      placeName: "Bengaluru, India",
      lat: 12.9716,
      lng: 77.5946,
      timezone: "Asia/Kolkata",
    });
    const packed = parseProductWhatsIncluded(product.whatsIncluded);
    const interpretation = await astrology.interpretChart(
      chart,
      product.reportTemplateKey || "default",
      packed.chapters,
    );

    const bytes = await buildReportPdf({
      title: product.name,
      productSlug: product.slug,
      personName: "Demo Reader",
      place: "Bengaluru, India",
      dob: "1992-03-21",
      birthTime: "09:15",
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

    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, bytes);
    console.log(
      JSON.stringify({
        ok: true,
        slug,
        out,
        bytes: bytes.byteLength,
        chapters: packed.chapters.length,
        included: packed.included.length,
        mock: chart.mock,
        lagna: chart.ascendant,
        moon: chart.moonSign,
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
