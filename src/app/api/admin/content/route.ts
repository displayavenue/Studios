import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

const KEYS = {
  ticker: "marketplace.ticker",
  banners: "marketplace.banners",
  freeChatMinutes: "wallet.free_consult_minutes",
  siteAnnouncement: "site.announcement",
} as const;

export async function GET() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const rows = await prisma.systemSetting.findMany({
    where: { key: { in: Object.values(KEYS) } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({
    keys: KEYS,
    settings: {
      ticker: map[KEYS.ticker] ?? null,
      banners: map[KEYS.banners] ?? null,
      freeChatMinutes: map[KEYS.freeChatMinutes] ?? null,
      siteAnnouncement: map[KEYS.siteAnnouncement] ?? null,
    },
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "content.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const key = String(body.key || "");
  if (!Object.values(KEYS).includes(key as (typeof KEYS)[keyof typeof KEYS])) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }
  const value = body.value as Prisma.InputJsonValue;
  const row = await prisma.systemSetting.upsert({
    where: { key },
    create: { key, value, group: "marketplace", label: key },
    update: { value },
  });
  return NextResponse.json({ ok: true, key: row.key });
}
