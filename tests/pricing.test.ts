import { describe, it, expect } from "vitest";
import {
  calculateLandedCost,
  calculatePricing,
  calculateNetContribution,
  calculateProductScore,
} from "../src/services/pricing/engine";
import { normalizeTitle, slugify } from "../src/lib/utils";
import { hasPermission } from "../src/lib/rbac";
import { Role } from "../src/generated/prisma/enums";
import { simulateBusiness } from "../src/services/profit/client-sim";

describe("pricing engine", () => {
  it("calculates landed cost components", () => {
    const result = calculateLandedCost({
      costPrice: 500,
      shippingCost: 50,
      taxRate: 0.18,
      paymentFeeRate: 0.02,
      returnRiskRate: 0.05,
      sellingPriceHint: 1500,
    });
    expect(result.productCost).toBe(500);
    expect(result.supplierShipping).toBe(50);
    expect(result.estimatedOperationalCost).toBeGreaterThan(500);
  });

  it("computes contribution before ads", () => {
    const pricing = calculatePricing({ costPrice: 400, shippingCost: 60 });
    expect(pricing.sellingPrice).toBeGreaterThan(pricing.landedCost);
    expect(pricing.contributionBeforeAds).toBe(
      Math.round((pricing.sellingPrice - pricing.estimatedOperationalCost) * 100) / 100,
    );
    expect(pricing.maxTheoreticalCac).toBe(pricing.contributionBeforeAds);
  });

  it("never treats revenue as profit", () => {
    const net = calculateNetContribution({
      revenue: 10000,
      productCost: 4000,
      actualShipping: 500,
      paymentFees: 200,
      discounts: 100,
      refunds: 0,
      rtoCosts: 0,
      advertisingCost: 2000,
    });
    expect(net.netContribution).toBe(3200);
    expect(net.netContribution).not.toBe(net.revenue);
  });

  it("scores products 0-100", () => {
    const { score, classification } = calculateProductScore({
      contributionPotential: 90,
      supplierReliability: 80,
      shipping: 70,
      inventory: 70,
      returnRisk: 80,
      completeness: 90,
      adSuitability: 75,
      demandPerformance: 60,
      priceCompetitiveness: 70,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(["HIGH_POTENTIAL", "TEST", "WATCH", "LOW_PRIORITY"]).toContain(classification);
  });
});

describe("utils", () => {
  it("normalizes titles for duplicate detection", () => {
    expect(normalizeTitle("Smart LED Desk Lamp!")).toBe("smart led desk lamp");
  });

  it("slugifies product titles", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });
});

describe("rbac", () => {
  it("protects admin permissions", () => {
    expect(hasPermission(Role.CUSTOMER, "admin.access")).toBe(false);
    expect(hasPermission(Role.SUPER_ADMIN, "products.import")).toBe(true);
    expect(hasPermission(Role.ANALYST, "analytics.view")).toBe(true);
    expect(hasPermission(Role.ANALYST, "settings.manage")).toBe(false);
  });
});

describe("simulator", () => {
  it("marks simulations clearly", () => {
    const sim = simulateBusiness({
      aov: 2500,
      orders: 40,
      conversionRate: 2,
      cac: 300,
      productMarginPercent: 40,
      shippingPerOrder: 80,
      refundRate: 0.05,
      rtoRate: 0.08,
      taxRate: 0.18,
      paymentFeeRate: 0.02,
    });
    expect(sim.simulation).toBe(true);
    expect(sim.revenue).toBe(100000);
    expect(sim.note).toContain("SIMULATION");
  });
});
