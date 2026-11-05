import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: { organization: { select: { id: true, name: true, slug: true } } },
    });
    if (!report) return jsonError("Report not found", 404);
    await requireOrgAccess(report.organizationId, "report:read", req);
    return jsonOk(report);
  } catch (err) {
    return handleApiError(err);
  }
}
