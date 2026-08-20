import { z } from "zod";
import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

type Params = { params: Promise<{ orgId: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const { orgId } = await params;
    await requireOrgAccess(orgId, "lead:read", req);
    const leads = await prisma.lead.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return jsonOk(leads);
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  try {
    const { orgId } = await params;
    const { session } = await requireOrgAccess(orgId, "lead:write", req);
    const body = createSchema.parse(await req.json());
    const lead = await prisma.lead.create({
      data: {
        organizationId: orgId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        website: body.website,
        industry: body.industry,
        location: body.location,
        source: body.source || "manual",
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
      },
    });
    await writeAudit({
      action: "lead.create",
      userId: session.userId,
      organizationId: orgId,
      entity: "lead",
      entityId: lead.id,
      after: { name: lead.name, email: lead.email },
    });
    return jsonOk(lead);
  } catch (err) {
    return handleApiError(err);
  }
}
