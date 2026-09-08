import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", isActive: true, isMembership: false },
    orderBy: { sortOrder: "asc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  return NextResponse.json({ products });
}
