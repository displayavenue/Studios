import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@/generated/prisma/enums";

export async function GET() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "products.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true, slug: true } } },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: 200,
  });
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      status: p.status,
      isActive: p.isActive,
      category: p.category.name,
      updatedAt: p.updatedAt,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "products.manage")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  const data: {
    isActive?: boolean;
    status?: ProductStatus;
    price?: number;
    name?: string;
  } = {};
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (body.status === "PUBLISHED" || body.status === "DRAFT") data.status = body.status;
  if (typeof body.price === "number") data.price = body.price;
  if (typeof body.name === "string") data.name = body.name.trim();

  const updated = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ ok: true, id: updated.id });
}
