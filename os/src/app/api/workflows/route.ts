import { requirePermission } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { listWorkflowDefinitions } from "@/lib/workflows/engine";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requirePermission("admin:settings", req);
    const defs = await listWorkflowDefinitions();

    // Optional: if a Workflow model existed we'd query it; Setting/builtin for now
    const recentJobs = await prisma.job.findMany({
      where: {
        type: {
          in: [
            "lead.followup_notify",
            "payment.reminder",
            "health.recalculate",
            "meta.sync_noop",
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return jsonOk({
      ...defs,
      recentJobs,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
