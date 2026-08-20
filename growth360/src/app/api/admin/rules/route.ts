import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const [strategy, score, planTemplates, coldCall] = await Promise.all([
      prisma.strategyRule.findMany({ orderBy: { priority: "desc" } }),
      prisma.scoreRule.findMany(),
      prisma.planTemplate.findMany(),
      prisma.coldCallTemplate.findMany(),
    ]);
    return jsonOk({ strategy, score, planTemplates, coldCall });
  } catch (err) {
    return handleApiError(err);
  }
}

const bodySchema = z.object({
  type: z.enum(["strategy", "score", "plan", "cold_call"]),
  id: z.string().optional(),
  data: z.record(z.string(), z.unknown()),
});

export async function PUT(req: Request) {
  try {
    await requireAdmin(req);
    const body = bodySchema.parse(await req.json());
    if (body.type === "strategy" && body.id) {
      return jsonOk(
        await prisma.strategyRule.update({ where: { id: body.id }, data: body.data as never }),
      );
    }
    if (body.type === "plan" && body.id) {
      return jsonOk(
        await prisma.planTemplate.update({ where: { id: body.id }, data: body.data as never }),
      );
    }
    return jsonOk({ updated: false });
  } catch (err) {
    return handleApiError(err);
  }
}
