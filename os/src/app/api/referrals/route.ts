import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { requireOrgAccess, requirePermission } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await requirePermission("org:read", req);
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("organizationId");
    const rows = await prisma.referral.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return jsonOk(rows);
  } catch (err) {
    return handleApiError(err);
  }
}

const schema = z.object({
  organizationId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await requireOrgAccess(body.organizationId, "org:write", req);
    const code = `DA-${randomBytes(4).toString("hex").toUpperCase()}`;
    const referral = await prisma.referral.create({
      data: {
        organizationId: body.organizationId,
        code,
        status: "created",
      },
    });
    return jsonOk({
      ...referral,
      link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/growth360?ref=${code}`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
