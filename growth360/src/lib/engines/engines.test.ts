import { describe, expect, it } from "vitest";
import { calculateGrowthScore, biggestOpportunity } from "./scoreEngine";
import { buildColdCallFallback } from "./coldCallEngine";
import { competitiveGaps } from "./competitorEngine";

describe("scoreEngine", () => {
  it("returns deterministic score breakdown", () => {
    const score = calculateGrowthScore({
      industry: "Manufacturing",
      location: "Mumbai",
      targetCustomer: "Factory owners",
      marketingBudget: 50000,
      avgCustomerValue: 75000,
      currentChannels: ["google-ads", "seo"],
      growthGoal: "more-leads",
    });
    expect(score.total).toBeGreaterThan(40);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.digitalMaturity).toBeDefined();
  });

  it("identifies biggest opportunity from weakest dimension", () => {
    const score = calculateGrowthScore({
      marketingBudget: 5000,
      currentChannels: [],
      growthGoal: "brand-growth",
    });
    const opp = biggestOpportunity(score, { growthGoal: "brand-growth", currentChannels: [] });
    expect(opp.length).toBeGreaterThan(10);
  });
});

describe("coldCallEngine", () => {
  it("builds fallback script without inventing spend claims", () => {
    const script = buildColdCallFallback(
      { company: "Acme", industry: "Retail", product: "Apparel", location: "Pune" },
      [],
    );
    expect(script.opening).toContain("Acme");
    expect(script.discoveryQuestions.length).toBeGreaterThan(0);
    expect(JSON.stringify(script)).not.toMatch(/₹\d+\s*lakh/i);
  });
});

describe("competitorGaps", () => {
  it("returns up to 3 gaps", () => {
    const gaps = competitiveGaps(55, [
      {
        id: "1",
        name: "Comp A",
        website: null,
        city: "Mumbai",
        description: null,
        businessType: null,
        industry: "Retail",
        location: "Mumbai",
        scores: { digitalScore: 70, marketingScore: 65, seoScore: 60, socialScore: 55, overallScore: 62 },
      },
    ]);
    expect(gaps.length).toBeLessThanOrEqual(3);
    expect(gaps.length).toBeGreaterThan(0);
  });
});
