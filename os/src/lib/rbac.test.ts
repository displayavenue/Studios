import { describe, expect, it } from "vitest";
import { permissionsForRole, roleHasPermission } from "./rbac";

describe("rbac", () => {
  it("gives SUPER_ADMIN full access", () => {
    expect(roleHasPermission("SUPER_ADMIN", "ceo:dashboard")).toBe(true);
    expect(roleHasPermission("SUPER_ADMIN", "integration:meta")).toBe(true);
  });

  it("restricts CLIENT_USER from finance write", () => {
    expect(roleHasPermission("CLIENT_USER", "finance:write")).toBe(false);
    expect(roleHasPermission("CLIENT_USER", "portal:read")).toBe(true);
  });

  it("keeps SALES out of Meta launch", () => {
    expect(roleHasPermission("SALES", "campaign:launch")).toBe(false);
    expect(permissionsForRole("SALES")).toContain("lead:write");
  });
});
