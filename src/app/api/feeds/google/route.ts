import { NextResponse } from "next/server";
import { buildGoogleFeedTsv } from "@/services/feed/service";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.com";
  const tsv = await buildGoogleFeedTsv(siteUrl);
  return new NextResponse(tsv, {
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Content-Disposition": 'attachment; filename="velora-google-merchant.tsv"',
    },
  });
}
