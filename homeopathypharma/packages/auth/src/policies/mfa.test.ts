import { describe, expect, it } from "vitest";
import { ROLES } from "../rbac/roles.js";
import { requiresMfa } from "./mfa.js";

describe("requiresMfa", () => {
  it("returns true for SUPER_ADMIN", () => {
    expect(requiresMfa([ROLES.SUPER_ADMIN])).toBe(true);
  });

  it("returns true for admin-adjacent roles", () => {
    expect(requiresMfa([ROLES.ADMIN])).toBe(true);
    expect(requiresMfa([ROLES.DOCTOR])).toBe(true);
    expect(requiresMfa([ROLES.FINANCE])).toBe(true);
    expect(requiresMfa([ROLES.SUPPORT])).toBe(true);
    expect(requiresMfa([ROLES.CONTENT_EDITOR])).toBe(true);
    expect(requiresMfa([ROLES.MEDICAL_REVIEWER])).toBe(true);
  });

  it("returns false for CUSTOMER-only roles", () => {
    expect(requiresMfa([ROLES.CUSTOMER])).toBe(false);
    expect(requiresMfa([])).toBe(false);
  });

  it("returns true when any role in a multi-role set requires MFA", () => {
    expect(requiresMfa([ROLES.CUSTOMER, ROLES.DOCTOR])).toBe(true);
  });
});
