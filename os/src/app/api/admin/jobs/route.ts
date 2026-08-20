import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { enqueueJob, processNextJobs } from "@/lib/jobs";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requirePermission("admin:settings", req);
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return jsonOk(jobs);
  } catch (err) {
    return handleApiError(err);
  }
}

const postSchema = z.object({
  action: z.enum(["enqueue_ping", "process"]),
  organizationId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await requirePermission("admin:settings", req);
    const body = postSchema.parse(await req.json());
    if (body.action === "enqueue_ping") {
      const job = await enqueueJob({
        type: "ping",
        organizationId: body.organizationId,
        payload: { source: "admin" },
      });
      return jsonOk(job);
    }
    const processed = await processNextJobs(10);
    return jsonOk({ processed: processed.length, jobs: processed });
  } catch (err) {
    return handleApiError(err);
  }
}
