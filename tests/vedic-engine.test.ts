import { describe, expect, it } from "vitest";
import { lahiriAyanamsa } from "@/lib/vedic/ayanamsa";
import { ashtakoota } from "@/lib/vedic/ashtakoota";
import { calculateVedicChart } from "@/lib/vedic/chart";
import { VIMSHOTTARI_YEARS } from "@/lib/vedic/constants";
import { longitudeToNakshatra, longitudeToSign } from "@/lib/vedic/placements";
import { vimshottariMahadashas } from "@/lib/vedic/dasha";
import { computeSiderealLongitudes, computeTropicalLongitudes } from "@/lib/vedic/ephemeris";

describe("Vedic calculation engine", () => {
  it("uses Lahiri ayanamsa near the J2000 reference (~23.85°)", () => {
    const a = lahiriAyanamsa(new Date("2000-01-01T12:00:00Z"));
    expect(a).toBeGreaterThan(23.7);
    expect(a).toBeLessThan(24.0);
  });

  it("sidereal = tropical − ayanamsa", () => {
    const date = new Date("1990-08-15T05:00:00Z");
    const trop = computeTropicalLongitudes(date);
    const sid = computeSiderealLongitudes(date);
    const ayan = lahiriAyanamsa(date);
    const diff = (trop.Sun - sid.Sun + 360) % 360;
    expect(Math.abs(diff - ayan)).toBeLessThan(0.02);
  });

  it("maps longitudes into 12 signs and 27 nakshatras", () => {
    const sign = longitudeToSign(45.5);
    expect(sign.sign).toBe("Taurus");
    const nak = longitudeToNakshatra(13.5);
    expect(nak.name).toBe("Bharani");
    expect(nak.pada).toBeGreaterThanOrEqual(1);
    expect(nak.pada).toBeLessThanOrEqual(4);
  });

  it("Vimshottari years sum to 120", () => {
    const sum = Object.values(VIMSHOTTARI_YEARS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(120);
  });

  it("produces a continuous Mahadasha timeline from the Moon", () => {
    const periods = vimshottariMahadashas(72.5, new Date("1990-08-15T05:00:00Z"), 9);
    expect(periods).toHaveLength(9);
    for (let i = 1; i < periods.length; i++) {
      expect(periods[i].start).toBe(periods[i - 1].end);
    }
  });

  it("Ashtakoota totals within 0–36", () => {
    const r = ashtakoota(10, 200);
    expect(r.total).toBeGreaterThanOrEqual(0);
    expect(r.total).toBeLessThanOrEqual(36);
    expect(r.koots).toHaveLength(8);
    expect(r.koots.reduce((s, k) => s + k.max, 0)).toBe(36);
  });

  it("calculates a full Mumbai chart without mock flag", () => {
    const chart = calculateVedicChart({
      name: "Test",
      dob: "1990-08-15",
      birthTime: "10:30",
      placeName: "Mumbai, India",
      lat: 19.076,
      lng: 72.8777,
      timezone: "Asia/Kolkata",
    });
    expect(chart.mock).toBe(false);
    expect(chart.planets).toHaveLength(9);
    expect(chart.lagna.sign).toBeTruthy();
    expect(chart.moon.nakshatra).toBeTruthy();
    expect(chart.dasha.mahadashas.length).toBe(9);
    expect(chart.ayanamsa.name).toContain("Lahiri");
  });

  it("Rahu and Ketu are opposite", () => {
    const sid = computeSiderealLongitudes(new Date("2000-06-01T00:00:00Z"));
    const sep = Math.abs(((sid.Ketu - sid.Rahu + 360) % 360) - 180);
    expect(sep).toBeLessThan(0.001);
  });
});
