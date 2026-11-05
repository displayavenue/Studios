import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { getDisplayAvenueOrg } from "@/lib/org";

const schema = z.object({
  organizationId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json().catch(() => ({})));
    let organizationId = body.organizationId || null;

    if (organizationId) {
      const org = await prisma.organization.findUnique({ where: { id: organizationId } });
      if (!org) {
        const da = await getDisplayAvenueOrg();
        organizationId = da.id;
      }
    } else {
      const da = await getDisplayAvenueOrg();
      organizationId = da.id;
    }

    const assessment = await prisma.assessment.create({
      data: {
        organizationId,
        status: "started",
        answers: {},
      },
    });

    return jsonOk({
      id: assessment.id,
      publicId: assessment.publicId,
      organizationId: assessment.organizationId,
      status: assessment.status,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
