import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSupplierProvider } from "@/providers/suppliers";
import { calculatePricing, scoreFromPricing } from "@/services/pricing/engine";

export async function POST(req: NextRequest) {
  try {
    await requirePermission("products.manage");
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

  const products = await provider.getProducts({ limit: 50 });
  const opportunities = products.map((p) => {
    const pricing = calculatePricing({ costPrice: p.costPrice, shippingCost: p.shippingCost });
    const scored = scoreFromPricing(pricing, {
      inventory: Math.min(100, p.stockQuantity),
      completeness: p.description ? 80 : 40,
      supplierReliability: supplier.reliabilityScore,
    });
    let recommendation = "WATCH";
    if (scored.score >= 80) recommendation = "IMPORT";
    else if (scored.score >= 65) recommendation = "TEST";
    else if (scored.score < 50) recommendation = "REJECT";

    return {
      supplierProductId: p.supplierProductId,
      title: p.title,
      costPrice: p.costPrice,
      shippingCost: p.shippingCost,
      landedCost: pricing.landedCost,
      sellingPrice: pricing.sellingPrice,
      contribution: pricing.contributionBeforeAds,
      margin: pricing.profitMargin,
      inventory: p.stockQuantity,
      score: scored.score,
      risk: scored.classification,
      recommendation,
    };
  }).sort((a, b) => b.score - a.score);

  return NextResponse.json({ opportunities });
}
