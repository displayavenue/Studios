import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { permissionsForRole } from "@/lib/rbac";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const session = await requireUser(req);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      include: { organization: true },
    });
    return jsonOk({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        globalRole: user.globalRole,
      },
      organizationId: session.organizationId,
      permissions: permissionsForRole(user.globalRole),
      memberships: memberships.map((m) => ({
        organizationId: m.organizationId,
        role: m.role,
        organization: {
          id: m.organization.id,
          name: m.organization.name,
          slug: m.organization.slug,
          type: m.organization.type,
          status: m.organization.status,
        },
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
