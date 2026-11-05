import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    await requirePermission("org:read", req);
    const orgs = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return jsonOk(orgs);
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  type: z.enum(["INTERNAL", "CLIENT", "PROSPECT"]).optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requirePermission("org:write", req);
    const body = createSchema.parse(await req.json());
    const org = await prisma.organization.create({
      data: {
        name: body.name,
        slug: body.slug,
        type: body.type || "PROSPECT",
        status: body.type === "CLIENT" ? "ONBOARDING" : "PROSPECT",
        industry: body.industry,
        location: body.location,
        website: body.website,
      },
    });
    await writeAudit({
      action: "organization.create",
      userId: session.userId,
      organizationId: org.id,
      entity: "organization",
      entityId: org.id,
      after: org,
    });
    return jsonOk(org);
  } catch (err) {
    return handleApiError(err);
  }
}
