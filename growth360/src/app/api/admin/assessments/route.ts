import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        publicId: true,
        company: true,
        industry: true,
        location: true,
        status: true,
        growthScore: true,
        unlocked: true,
        contactName: true,
        contactEmail: true,
        createdAt: true,
        completedAt: true,
      },
    });
    return jsonOk(assessments);
  } catch (err) {
    return handleApiError(err);
  }
}
