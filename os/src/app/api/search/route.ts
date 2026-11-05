import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";
import { roleHasPermission } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const session = await requireUser(req);
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    if (q.length < 2) return jsonError("Query q must be at least 2 characters", 400);

    const orgScope = await accessibleOrgIds(session);
    const orgFilter =
      orgScope === "all"
        ? undefined
        : { organizationId: { in: orgScope.length ? orgScope : ["__none__"] } };

    const results: {
      leads: unknown[];
      orgs: unknown[];
      campaigns: unknown[];
      invoices: unknown[];
    } = { leads: [], orgs: [], campaigns: [], invoices: [] };

    const tasks: Promise<void>[] = [];

    if (roleHasPermission(session.globalRole, "lead:read")) {
      tasks.push(
        prisma.lead
          .findMany({
            where: {
              ...orgFilter,
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { company: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 20,
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
              pipelineStatus: true,
              leadScore: true,
              organizationId: true,
            },
          })
          .then((rows) => {
            results.leads = rows;
          }),
      );
    }

    if (roleHasPermission(session.globalRole, "org:read")) {
      tasks.push(
        prisma.organization
          .findMany({
            where: {
              ...(orgScope === "all" ? {} : { id: { in: orgScope.length ? orgScope : ["__none__"] } }),
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
                { website: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 20,
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              status: true,
              healthScore: true,
            },
          })
          .then((rows) => {
            results.orgs = rows;
          }),
      );
    }

    if (roleHasPermission(session.globalRole, "campaign:read")) {
      tasks.push(
        prisma.campaign
          .findMany({
            where: {
              ...orgFilter,
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { objective: { contains: q, mode: "insensitive" } },
                { externalId: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 20,
            select: {
              id: true,
              name: true,
              status: true,
              platform: true,
              organizationId: true,
              healthScore: true,
            },
          })
          .then((rows) => {
            results.campaigns = rows;
          }),
      );
    }

    if (roleHasPermission(session.globalRole, "finance:read")) {
      tasks.push(
        prisma.invoice
          .findMany({
            where: {
              ...orgFilter,
              OR: [
                { number: { contains: q, mode: "insensitive" } },
                { status: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 20,
            select: {
              id: true,
              number: true,
              amountInr: true,
              status: true,
              organizationId: true,
              dueAt: true,
            },
          })
          .then((rows) => {
            results.invoices = rows;
          }),
      );
    }

    await Promise.all(tasks);

    return jsonOk({
      q,
      ...results,
      counts: {
        leads: results.leads.length,
        orgs: results.orgs.length,
        campaigns: results.campaigns.length,
        invoices: results.invoices.length,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
