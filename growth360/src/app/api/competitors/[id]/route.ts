import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const competitor = await prisma.competitor.findUnique({
      where: { id },
      include: { scores: true, industry: true, location: true },
    });
    if (!competitor) return jsonError("Competitor not found", 404);
    return jsonOk({
      ...competitor,
      dataSource: "database",
      note: "Scores are factual database fields. Interpretations must come from analysis layer.",
    });
  } catch (err) {
    return handleApiError(err);
  }
}
