import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "coupons.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({
    coupons: coupons.map((c) => ({
      id: c.id,
      code: c.code,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      usageCount: c.usageCount,
      usageLimit: c.usageLimit,
      isActive: c.isActive,
      expiresAt: c.expiresAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "coupons.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const code = String(body.code || "")
    .trim()
    .toUpperCase();
  if (!code) return NextResponse.json({ error: "MISSING_CODE" }, { status: 400 });
  const coupon = await prisma.coupon.create({
    data: {
      code,
      description: body.description ? String(body.description) : null,
      discountType: body.discountType === "flat" ? "flat" : "percent",
      discountValue: Number(body.discountValue || 10),
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      isActive: true,
    },
  });
  return NextResponse.json({ ok: true, id: coupon.id, code: coupon.code });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "coupons.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
  const updated = await prisma.coupon.update({
    where: { id },
    data: {
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
      discountValue: typeof body.discountValue === "number" ? body.discountValue : undefined,
    },
  });
  return NextResponse.json({ ok: true, id: updated.id });
}
