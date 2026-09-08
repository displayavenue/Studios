import { describe, it, expect } from "vitest";
import { findDuplicates } from "../src/services/product/service";
import { prisma } from "../src/lib/prisma";

describe("duplicate detection", () => {
  it("detects normalized title matches against seeded demo products", async () => {
    const existing = await prisma.product.findFirst({ where: { demo: true } });
    expect(existing).toBeTruthy();
    if (!existing) return;

    const matches = await findDuplicates({
      title: existing.title,
      supplierId: existing.supplierId || undefined,
      supplierProductId: existing.supplierProductId || undefined,
    });
    expect(matches.length).toBeGreaterThan(0);
  });
});
