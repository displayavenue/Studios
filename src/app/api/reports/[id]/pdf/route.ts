import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getReportPdfBuffer } from "@/services/report/service";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  const report = await prisma.report.findFirst({
    where: { id, userId: session.id },
    include: { product: { select: { slug: true, name: true } }, pdfFiles: true },
  });
  if (!report) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const buffer = await getReportPdfBuffer(id, session.id);
  if (!buffer) {
    return NextResponse.json({ error: "PDF_NOT_READY" }, { status: 404 });
  }

  const fileName = report.pdfFiles[0]?.fileName || `${report.product.slug || "report"}.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
