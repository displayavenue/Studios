import { describe, expect, it } from "vitest";
import { isPubliclyVisible, isSoftDeleted } from "./status.js";

describe("status helpers", () => {
  it("detects soft deletes", () => {
    expect(isSoftDeleted({ deletedAt: null })).toBe(false);
    expect(isSoftDeleted({ deletedAt: new Date() })).toBe(true);
  });

  it("only treats published/active non-deleted entities as public", () => {
    expect(isPubliclyVisible({ status: "PUBLISHED", deletedAt: null })).toBe(true);
    expect(isPubliclyVisible({ status: "DRAFT", deletedAt: null })).toBe(false);
    expect(isPubliclyVisible({ status: "PUBLISHED", deletedAt: new Date() })).toBe(false);
  });
});
