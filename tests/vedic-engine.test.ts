import { describe, expect, it } from "vitest";
import { lahiriAyanamsa } from "@/lib/vedic/ayanamsa";
import { ashtakoota } from "@/lib/vedic/ashtakoota";
import { calculateVedicChart } from "@/lib/vedic/chart";
import { VIMSHOTTARI_YEARS } from "@/lib/vedic/constants";
import { longitudeToNakshatra, longitudeToSign } from "@/lib/vedic/placements";
import { vimshottariMahadashas } from "@/lib/vedic/dasha";
import { computeSiderealLongitudes, computeTropicalLongitudes } from "@/lib/vedic/ephemeris";

import { buildLifeStory } from "@/lib/vedic/storytelling";
import { interpretVedicChart } from "@/lib/vedic/interpret";
import { resolvePlace } from "@/lib/vedic/geo";

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

  it("builds a past / present / future life story", () => {
    const chart = calculateVedicChart({
      name: "Story Seeker",
      dob: "1990-08-15",
      birthTime: "10:30",
      placeName: "Mumbai, India",
      lat: 19.076,
      lng: 72.8777,
      timezone: "Asia/Kolkata",
    });
    const story = buildLifeStory(chart, "janam-kundali");
    expect(story.length).toBe(5);
    expect(story[0].title.toLowerCase()).toContain("prologue");
    expect(story[1].title.toLowerCase()).toMatch(/past|behind/);
    expect(story[2].title.toLowerCase()).toMatch(/present|living/);
    expect(story[3].title.toLowerCase()).toMatch(/future|ahead|road/);
    expect(story[1].body.length).toBeGreaterThan(200);
    expect(story[2].body.length).toBeGreaterThan(200);
    expect(story[3].body.length).toBeGreaterThan(200);
  });

  it("includes Navamsa (D9) placements", () => {
    const chart = calculateVedicChart({
      name: "D9 Tester",
      dob: "1990-08-15",
      birthTime: "10:30",
      placeName: "Mumbai, India",
      lat: 19.076,
      lng: 72.8777,
      timezone: "Asia/Kolkata",
    });
    expect(chart.navamsa.navLagnaSign).toBeTruthy();
    expect(chart.navamsa.placements).toHaveLength(9);
    expect(chart.navamsa.placements[0].navamsaSign).toBeTruthy();
  });

  it("writes live Ashtakoota when partner Moon is supplied", () => {
    const a = calculateVedicChart({
      name: "A",
      dob: "1990-08-15",
      birthTime: "10:30",
      placeName: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      timezone: "Asia/Kolkata",
    });
    const b = calculateVedicChart({
      name: "B",
      dob: "1992-03-21",
      birthTime: "14:15",
      placeName: "Delhi",
      lat: 28.6139,
      lng: 77.209,
      timezone: "Asia/Kolkata",
    });
    const interp = interpretVedicChart(a, "guna-milan", ["Guna Milan matching"], b.moon.longitude);
    const chapter = interp.chapters.find((c) => c.title.toLowerCase().includes("guna"));
    expect(chapter?.body).toMatch(/Ashtakoota total \d+\/36/);
  });

  it("resolves common Indian cities for place geocoding", () => {
    const pune = resolvePlace("Pune, Maharashtra");
    expect(pune.lat).toBeCloseTo(18.52, 1);
    const fallback = resolvePlace("Unknown Hamlet");
    expect(fallback.approx).toBe(true);
  });
});
