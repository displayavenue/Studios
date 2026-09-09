import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACTIVITY_TICKER } from "@/content/marketplace-astrologers";

export const dynamic = "force-dynamic";

/** Public ticker lines for header (CMS-backed with static fallback). */
export async function GET() {
  const row = await prisma.systemSetting.findUnique({ where: { key: "marketplace.ticker" } });
  let lines: string[] = [...ACTIVITY_TICKER];
  if (row?.value) {
    if (Array.isArray(row.value)) lines = row.value.map(String).filter(Boolean);
    else if (typeof row.value === "string") lines = row.value.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  const announcement = await prisma.systemSetting.findUnique({ where: { key: "site.announcement" } });
  let announcementText: string | null = null;
  if (announcement?.value && typeof announcement.value === "object" && announcement.value !== null && "text" in (announcement.value as object)) {
    announcementText = String((announcement.value as { text: string }).text || "") || null;
  } else if (typeof announcement?.value === "string") {
    announcementText = announcement.value || null;
  }

  const bannersRow = await prisma.systemSetting.findUnique({ where: { key: "marketplace.banners" } });
  let banners: unknown[] = [];
  if (Array.isArray(bannersRow?.value)) banners = bannersRow.value as unknown[];

  return NextResponse.json({ ticker: lines, announcement: announcementText, banners });
}
