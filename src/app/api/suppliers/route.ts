import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSupplierProvider } from "@/providers/suppliers";

export async function POST(req: NextRequest) {
  try {
    await requirePermission("suppliers.manage");
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json();
  const supplier = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
  if (!supplier) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const provider = createSupplierProvider({
    providerType: supplier.providerType,
    name: supplier.name,
    apiBaseUrl: supplier.apiBaseUrl,
    credentials: supplier.credentialsReference,
  });

  if (body.action === "test") {
    const result = await provider.testConnection();
    return NextResponse.json(result);
  }

  if (body.action === "disable") {
    await prisma.supplier.update({ where: { id: supplier.id }, data: { status: "DISABLED" } });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "sync_inventory") {
    const products = await prisma.product.findMany({
      where: { supplierId: supplier.id, supplierProductId: { not: null } },
      select: { id: true, supplierProductId: true },
      take: 200,
    });
    const ids = products.map((p) => p.supplierProductId!).filter(Boolean);
    const inv = await provider.getInventory(ids);
    for (const row of inv) {
      const p = products.find((x) => x.supplierProductId === row.supplierProductId);
      if (!p) continue;
      await prisma.product.update({
        where: { id: p.id },
        data: {
          stockQuantity: row.quantity,
          stockStatus: row.quantity <= 0 ? "OUT_OF_STOCK" : row.quantity <= 5 ? "LOW_STOCK" : "IN_STOCK",
          status: row.quantity <= 0 ? "OUT_OF_STOCK" : undefined,
        },
      });
    }
    await prisma.supplier.update({ where: { id: supplier.id }, data: { lastInventorySyncAt: new Date() } });
    return NextResponse.json({ ok: true, synced: inv.length });
  }

  if (body.action === "sync_prices") {
    const products = await prisma.product.findMany({
      where: { supplierId: supplier.id, supplierProductId: { not: null } },
      take: 200,
    });
    const { calculatePricing } = await import("@/services/pricing/engine");
    const prices = await provider.getPrice(products.map((p) => p.supplierProductId!));
    let flagged = 0;
    for (const row of prices) {
      const p = products.find((x) => x.supplierProductId === row.supplierProductId);
      if (!p) continue;
      const pricing = calculatePricing({ costPrice: row.costPrice, shippingCost: row.shippingCost });
      const oldCost = Number(p.costPrice);
      const spike = oldCost > 0 && row.costPrice > oldCost * 1.25;
      await prisma.product.update({
        where: { id: p.id },
        data: {
          costPrice: row.costPrice,
          shippingCost: row.shippingCost,
          landedCost: pricing.landedCost,
          contributionBeforeAds: pricing.contributionBeforeAds,
          profitMargin: pricing.profitMargin,
          status: spike || !pricing.meetsMinContribution ? "PRICE_REVIEW" : p.status,
        },
      });
      if (spike) flagged++;
    }
    await prisma.supplier.update({ where: { id: supplier.id }, data: { lastPriceSyncAt: new Date() } });
    return NextResponse.json({ ok: true, flagged });
  }

  if (body.action === "sync_products") {
    return NextResponse.redirect(new URL("/admin/product-import", req.url));
  }

  return NextResponse.json({ error: "UNKNOWN_ACTION" }, { status: 400 });
}
