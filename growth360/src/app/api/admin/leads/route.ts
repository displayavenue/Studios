import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { assessment: { select: { publicId: true, growthScore: true, unlocked: true } } },
    });
    return jsonOk(leads);
  } catch (err) {
    return handleApiError(err);
  }
}
