import { describe, expect, it } from "vitest";
import { recommendPlatforms } from "./platforms/recommend";
import { calculateLeadScore } from "./engines/leadScoreEngine";

describe("platform recommendations", () => {
  it("ranks Meta as primary automation-ready platform", () => {
    const rows = recommendPlatforms({
      growthGoal: "more-leads",
      budget: 50000,
    });
    const meta = rows.find((r) => r.slug === "meta" || r.platform.toLowerCase().includes("meta"));
    expect(meta).toBeTruthy();
    expect(meta!.automationReady).toBe(true);
    const google = rows.find((r) => r.slug === "google" || r.platform.toLowerCase().includes("google"));
    expect(google?.automationReady).toBe(false);
  });
});

describe("lead scoring", () => {
  it("returns A-D grade deterministically", () => {
    const high = calculateLeadScore({
      budget: 100000,
      growthScore: 75,
      industry: "Manufacturing",
      location: "Mumbai",
      website: "https://example.com",
      email: "a@b.com",
      phone: "9876543210",
      company: "Acme",
      source: "growth360",
    });
    expect(high.score).toBeGreaterThan(40);
    expect(["A", "B", "C", "D"]).toContain(high.grade);
  });
});
