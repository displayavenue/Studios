import { describe, expect, it } from "vitest";
import { calculateGrowthScore, biggestOpportunity, profileFromAnswers } from "./scoreEngine";
import { buildColdCallFallback } from "./coldCallEngine";
import { competitiveGaps } from "./competitorEngine";
import { calculateLeadScore, gradeFor } from "./leadScoreEngine";
import { calculateCampaignHealth } from "./campaignHealthEngine";
import { calculateClientHealth } from "./clientHealthEngine";

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

  it("parses profile from Assessment.answers JSON", () => {
    const profile = profileFromAnswers({
      company: "Acme",
      marketingBudget: "40000",
      currentChannels: ["meta-ads", "none"],
    });
    expect(profile.company).toBe("Acme");
    expect(profile.marketingBudget).toBe(40000);
    expect(profile.currentChannels).toEqual(["meta-ads"]);
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
  it("returns gaps for empty competitor list without fabricating peers", () => {
    const gaps = competitiveGaps(55, []);
    expect(gaps.length).toBeLessThanOrEqual(3);
    expect(gaps.length).toBeGreaterThan(0);
  });
});

describe("leadScoreEngine", () => {
  it("returns 0-100 score with A/B/C/D grade", () => {
    const result = calculateLeadScore({
      budget: 80000,
      growthScore: 72,
      industry: "SaaS / Software",
      location: "Bengaluru",
      email: "a@b.com",
      phone: "9999999999",
      company: "Acme",
      website: "https://acme.test",
      source: "google-ads",
      pipelineStatus: "QUALIFIED",
      utmSource: "google",
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(["A", "B", "C", "D"]).toContain(result.grade);
    expect(gradeFor(90)).toBe("A");
    expect(gradeFor(20)).toBe("D");
  });
});

describe("campaignHealthEngine", () => {
  it("scores deterministically from status and meta", () => {
    const healthy = calculateCampaignHealth({
      status: "active",
      dailyBudgetInr: 3000,
      meta: { ctr: 2.2, cpc: 18, cpl: 350, leads: 20, roas: 2.5 },
    });
    expect(healthy.score).toBeGreaterThan(60);
    expect(healthy.label).toBe("healthy");

    const weak = calculateCampaignHealth({
      status: "error",
      dailyBudgetInr: 0,
      meta: { deliveryIssues: true, leads: 0 },
    });
    expect(weak.score).toBeLessThan(50);
  });
});

describe("clientHealthEngine", () => {
  it("scores active clients from measured signals", () => {
    const result = calculateClientHealth({
      status: "ACTIVE",
      type: "CLIENT",
      avgCampaignHealth: 80,
      activeCampaigns: 3,
      openInvoicesOverdue: 0,
      pendingApprovals: 0,
      openCriticalTasks: 0,
      onboardingComplete: true,
    });
    expect(result.score).toBeGreaterThan(70);
    expect(result.label).toBe("healthy");
  });

  it("marks churned orgs without inventing recovery", () => {
    const result = calculateClientHealth({ status: "CHURNED" });
    expect(result.label).toBe("churned");
    expect(result.score).toBeLessThan(20);
  });
});
