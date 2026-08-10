import { prisma } from "./db";

export async function writeAudit(params: {
  action: string;
  userId?: string | null;
  organizationId?: string | null;
  entity?: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      userId: params.userId || null,
      organizationId: params.organizationId || null,
      entity: params.entity,
      entityId: params.entityId,
      before: params.before as object | undefined,
      after: params.after as object | undefined,
      ip: params.ip || null,
    },
  });
}
