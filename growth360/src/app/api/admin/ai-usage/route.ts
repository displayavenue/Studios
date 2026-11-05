import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const [recent, success, failed, agg, byUseCase] = await Promise.all([
      prisma.aiGeneration.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.aiGeneration.count({ where: { status: "success" } }),
      prisma.aiGeneration.count({ where: { status: "failed" } }),
      prisma.aiGeneration.aggregate({
        where: { status: "success" },
        _sum: { estimatedCostUsd: true, inputTokens: true, outputTokens: true },
      }),
      prisma.aiGeneration.groupBy({
        by: ["useCase", "status"],
        _count: true,
        _sum: { estimatedCostUsd: true },
      }),
    ]);

    return jsonOk({
      recent,
      successfulRequests: success,
      failedRequests: failed,
      tokensUsed: (agg._sum.inputTokens || 0) + (agg._sum.outputTokens || 0),
      estimatedCostUsd: agg._sum.estimatedCostUsd || 0,
      byUseCase,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
