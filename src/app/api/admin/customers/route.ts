import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { creditWallet } from "@/services/wallet/service";

export async function GET() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "customers.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const customers = await prisma.user.findMany({
    where: { role: { in: ["CUSTOMER", "EXPERT"] } },
    orderBy: { createdAt: "desc" },
    take: 150,
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      wallet: { select: { balanceInr: true } },
      _count: { select: { orders: true, reports: true } },
    },
  });
  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      email: c.email,
      phone: c.phone,
      name: [c.firstName, c.lastName].filter(Boolean).join(" ") || "—",
      role: c.role,
      isActive: c.isActive,
      balanceInr: Number(c.wallet?.balanceInr ?? 0),
      orders: c._count.orders,
      reports: c._count.reports,
      createdAt: c.createdAt,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "customers.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  if (typeof body.isActive === "boolean") {
    await prisma.user.update({ where: { id }, data: { isActive: body.isActive } });
  }

  if (typeof body.creditInr === "number" && body.creditInr > 0) {
    await creditWallet({
      userId: id,
      amountInr: body.creditInr,
      reason: String(body.reason || "Admin wallet credit"),
      reference: `admin:${session.id}:${Date.now()}`,
    });
  }

  return NextResponse.json({ ok: true });
}
