import { NextRequest, NextResponse } from "next/server";
import { readStoredPdf } from "@/providers/storage";

export const dynamic = "force-dynamic";

/** Serves PDFs written by FilesystemStorageProvider. */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "KEY_REQUIRED" }, { status: 400 });
  const buf = await readStoredPdf(key);
  if (!buf) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${key.split("/").pop() || "report.pdf"}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
