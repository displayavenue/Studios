import { prisma } from "./db";
import { JobStatus, Prisma } from "@prisma/client";

export async function enqueueJob(params: {
  type: string;
  organizationId?: string | null;
  payload?: Prisma.InputJsonValue;
  runAfter?: Date;
  maxAttempts?: number;
}) {
  return prisma.job.create({
    data: {
      type: params.type,
      organizationId: params.organizationId || null,
      payload: params.payload,
      runAfter: params.runAfter || new Date(),
      maxAttempts: params.maxAttempts ?? 5,
      status: JobStatus.PENDING,
    },
  });
}

/** Simple DB-backed worker tick — V1; replace with Redis/BullMQ under load. */
export async function processNextJobs(limit = 5) {
  const now = new Date();
  const jobs = await prisma.job.findMany({
    where: {
      status: JobStatus.PENDING,
      runAfter: { lte: now },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  const results = [];
  for (const job of jobs) {
    const locked = await prisma.job.updateMany({
      where: { id: job.id, status: JobStatus.PENDING },
      data: { status: JobStatus.RUNNING, lockedAt: now, attempts: { increment: 1 } },
    });
    if (locked.count === 0) continue;

    try {
      const result = await dispatchJob(job.type, job.payload);
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          result: result as Prisma.InputJsonValue,
          lockedAt: null,
        },
      });
      results.push(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Job failed";
      const attempts = job.attempts + 1;
      const failed = attempts >= job.maxAttempts;
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: {
          status: failed ? JobStatus.FAILED : JobStatus.PENDING,
          lastError: message.slice(0, 1000),
          lockedAt: null,
          runAfter: failed ? now : new Date(Date.now() + Math.min(60_000 * 2 ** attempts, 3600_000)),
        },
      });
      results.push(updated);
    }
  }
  return results;
}

async function dispatchJob(type: string, payload: unknown) {
  switch (type) {
    case "ping":
      return { pong: true, at: new Date().toISOString(), payload };
    case "audit.cleanup_noop":
      return { ok: true };
    default:
      // Unknown jobs fail loudly so they are visible in admin — never silently invent success
      throw new Error(`No handler registered for job type: ${type}`);
  }
}
