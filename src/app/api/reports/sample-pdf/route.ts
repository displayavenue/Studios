import { NextRequest, NextResponse } from "next/server";
import { buildSampleProductPdf } from "@/services/report/service";

export const dynamic = "force-dynamic";

/** Public sample PDF for a catalogue product — watermarked, not a personal chart. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "janam-kundali";
  try {
    const sample = await buildSampleProductPdf(slug);
    if (!sample) {
      return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
    }
    return new NextResponse(new Uint8Array(sample.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sample.fileName}"`,
        "Cache-Control": "public, max-age=300",
        "X-JK-Sample": "true",
      },
    });
  } catch (err) {
    console.error("[sample-pdf]", err);
    return NextResponse.json({ error: "SAMPLE_PDF_FAILED" }, { status: 500 });
  }
}
