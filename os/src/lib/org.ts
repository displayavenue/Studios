import { prisma } from "./db";
import type { AuthSession } from "./auth";
import { GlobalRole } from "@prisma/client";

/** Resolve DisplayAvenue INTERNAL org (Growth360 lead owner by default). */
export async function getDisplayAvenueOrg() {
  const bySlug = await prisma.organization.findUnique({ where: { slug: "displayavenue" } });
  if (bySlug) return bySlug;
  const internal = await prisma.organization.findFirst({
    where: { type: "INTERNAL" },
    orderBy: { createdAt: "asc" },
  });
  if (!internal) throw new Error("DisplayAvenue INTERNAL organization not seeded");
  return internal;
}

const STAFF_ALL_ORGS: GlobalRole[] = ["SUPER_ADMIN", "ADMIN", "SALES"];

export function canSeeAllOrgs(role: GlobalRole) {
  return STAFF_ALL_ORGS.includes(role);
}

/** Organization IDs the session may access for list/search filters. */
export async function accessibleOrgIds(session: AuthSession): Promise<string[] | "all"> {
  if (canSeeAllOrgs(session.globalRole)) return "all";
  const memberships = await prisma.membership.findMany({
    where: { userId: session.userId, status: "ACTIVE" },
    select: { organizationId: true },
  });
  return memberships.map((m) => m.organizationId);
}

export function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
}
