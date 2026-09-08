import { NextResponse } from "next/server";
import { buildMetaFeedCsv } from "@/services/feed/service";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.com";
  const csv = await buildMetaFeedCsv(siteUrl);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="velora-meta-catalog.csv"',
    },
  });
}
