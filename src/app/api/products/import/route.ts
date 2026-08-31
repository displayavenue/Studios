import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSupplierProvider } from "@/providers/suppliers";
import { importSupplierProduct } from "@/services/product/service";

export async function POST(req: NextRequest) {
  try {
    await requirePermission("products.import");
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json();
  const supplier = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
  if (!supplier) return NextResponse.json({ error: "SUPPLIER_NOT_FOUND" }, { status: 404 });

  const limit = Math.min(Number(body.limit || 100), 5000);
  const job = await prisma.importJob.create({
    data: {
      supplierId: supplier.id,
      status: "RUNNING",
      totalRows: limit,
      options: body,
    },
  });

  const provider = createSupplierProvider({
    providerType: supplier.providerType,
    name: supplier.name,
    apiBaseUrl: supplier.apiBaseUrl,
    credentials: supplier.credentialsReference,
  });

  const categories = await prisma.category.findMany();
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // Batch processing — fetch in chunks of 50
  const batchSize = 50;
  let imported = 0, duplicates = 0, failed = 0, skipped = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (let offset = 0; offset < limit; offset += batchSize) {
    const batch = await provider.getProducts({ limit: Math.min(batchSize, limit - offset), offset });
    if (!batch.length) break;

    for (const raw of batch) {
      try {
        const categoryId = raw.categoryHint ? catBySlug[raw.categoryHint] : undefined;
        const result = await importSupplierProduct({
          supplierId: supplier.id,
          raw,
          categoryId,
          skipDuplicates: body.skipDuplicates !== false,
          demo: supplier.providerType === "MOCK",
        });
        if (result.status === "imported") imported++;
        else duplicates++;
      } catch (e) {
        failed++;
        errors.push({ id: raw.supplierProductId, error: e instanceof Error ? e.message : "ERROR" });
      }
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: { imported, duplicates, failed, skipped, pending: Math.max(0, limit - imported - duplicates - failed) },
    });
  }

  const count = await prisma.product.count({ where: { supplierId: supplier.id } });
  await prisma.supplier.update({
    where: { id: supplier.id },
    data: { productCount: count, lastSyncAt: new Date() },
  });

  const progress = { imported, duplicates, failed, skipped, pending: 0, approved: 0, published: 0 };
  await prisma.importJob.update({
    where: { id: job.id },
    data: {
      status: "COMPLETED",
      ...progress,
      errorReport: errors.length ? errors : undefined,
    },
  });

  return NextResponse.json({ ok: true, jobId: job.id, progress, errorCount: errors.length });
}
