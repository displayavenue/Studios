import { z } from "zod";
import { ForbiddenError, requirePermission, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { roleHasPermission } from "@/lib/rbac";
import { nextClientCode } from "@/lib/quotations/numbering";

const createSchema = z.object({
  organizationId: z.string().optional().nullable(),
  companyName: z.string().min(1),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  mobile: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  gstin: z.string().optional().nullable(),
  pan: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  clientCode: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await requireUser(req);
    if (
      !roleHasPermission(session.globalRole, "deal:read") &&
      !roleHasPermission(session.globalRole, "finance:read")
    ) {
      throw new ForbiddenError("Missing permission: deal:read or finance:read");
    }

    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const take = Math.min(200, Math.max(1, Number(url.searchParams.get("take") || 100)));

    const clients = await prisma.quoteClient.findMany({
      where: q
        ? {
            OR: [
              { companyName: { contains: q, mode: "insensitive" } },
              { contactPerson: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { mobile: { contains: q, mode: "insensitive" } },
              { clientCode: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take,
      include: { _count: { select: { quotations: true } } },
    });

    return jsonOk({ clients, count: clients.length });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requirePermission("deal:write", req);
    const body = createSchema.parse(await req.json());
    const clientCode = body.clientCode || (await nextClientCode());

    const client = await prisma.quoteClient.create({
      data: {
        clientCode,
        organizationId: body.organizationId || null,
        companyName: body.companyName,
        contactPerson: body.contactPerson || null,
        email: body.email || null,
        mobile: body.mobile || null,
        whatsapp: body.whatsapp || null,
        gstin: body.gstin || null,
        pan: body.pan || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        pincode: body.pincode || null,
        country: body.country || "India",
        website: body.website || null,
        notes: body.notes || null,
      },
    });

    await writeAudit({
      action: "quote_client.create",
      userId: session.userId,
      organizationId: client.organizationId,
      entity: "quote_client",
      entityId: client.id,
      after: { clientCode: client.clientCode, companyName: client.companyName },
    });

    return jsonOk(client);
  } catch (err) {
    return handleApiError(err);
  }
}
