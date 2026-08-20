import { describe, expect, it } from "vitest";
import {
  calcAdvancePaise,
  calcLine,
  calcQuoteTotals,
  formatInr,
  inrToPaise,
  paiseToInr,
  sameState,
} from "./money";

describe("quotation money engine", () => {
  it("converts INR and paise safely", () => {
    expect(inrToPaise(100.456)).toBe(10046);
    expect(paiseToInr(10046)).toBe(100.46);
    expect(formatInr(4248000)).toContain("42,480");
  });

  it("calculates line with discount and GST", () => {
    const line = calcLine({
      quantity: 1,
      unitPriceInr: 100000,
      discountPercent: 10,
      gstPercent: 18,
    });
    expect(line.taxablePaise).toBe(9000000);
    expect(line.gstPaise).toBe(1620000);
    expect(line.totalPaise).toBe(10620000);
  });

  it("splits CGST/SGST for same state", () => {
    const line = calcLine({ quantity: 1, unitPriceInr: 1000, gstPercent: 18 });
    const totals = calcQuoteTotals([line], "Maharashtra", "Maharashtra");
    expect(totals.gstMode).toBe("CGST_SGST");
    expect(totals.cgstPaise + totals.sgstPaise).toBe(totals.totalGstPaise);
    expect(totals.igstPaise).toBe(0);
  });

  it("uses IGST for other state", () => {
    const line = calcLine({ quantity: 1, unitPriceInr: 1000, gstPercent: 18 });
    const totals = calcQuoteTotals([line], "Maharashtra", "Karnataka");
    expect(totals.gstMode).toBe("IGST");
    expect(totals.igstPaise).toBe(totals.totalGstPaise);
  });

  it("calculates 60% advance by default math", () => {
    const { advancePaise, balancePaise } = calcAdvancePaise(10000000, 60);
    expect(advancePaise).toBe(6000000);
    expect(balancePaise).toBe(4000000);
  });

  it("sameState normalizes whitespace/case", () => {
    expect(sameState("Maharashtra", "maharashtra")).toBe(true);
    expect(sameState("Maharashtra", "Delhi")).toBe(false);
  });
});
