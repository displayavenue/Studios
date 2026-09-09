import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { OrderStatus, MallOrderStatus } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "orders.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const kind = req.nextUrl.searchParams.get("kind") || "reports";
  if (kind === "mall") {
    const mall = await prisma.mallOrder.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({
      orders: mall.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        email: o.user.email,
        itemName: o.itemName,
        amountInr: Number(o.amountInr),
        status: o.status,
        createdAt: o.createdAt,
      })),
    });
  }
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true } },
      items: { include: { product: { select: { name: true } } }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      email: o.user.email,
      product: o.items[0]?.product?.name || "Report",
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "orders.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const id = String(body.id || "");
  const kind = String(body.kind || "reports");
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  if (kind === "mall") {
    const status = body.status as MallOrderStatus;
    const updated = await prisma.mallOrder.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true, id: updated.id, status: updated.status });
  }

  const status = body.status as OrderStatus;
  const updated = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true, id: updated.id, status: updated.status });
}
