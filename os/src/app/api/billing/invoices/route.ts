import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireOrgAccess, requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { accessibleOrgIds } from "@/lib/org";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const session = await requirePermission("finance:read", req);
    const url = new URL(req.url);
    const organizationId = url.searchParams.get("organizationId");
    const orgScope = await accessibleOrgIds(session);

    const where: { organizationId?: string | { in: string[] } } = {};
    if (organizationId) {
      if (orgScope !== "all" && !orgScope.includes(organizationId)) {
        return jsonOk({ invoices: [], count: 0 });
      }
      where.organizationId = organizationId;
    } else if (orgScope !== "all") {
      where.organizationId = { in: orgScope.length ? orgScope : ["__none__"] };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { organization: { select: { id: true, name: true, slug: true } } },
    });
    return jsonOk({ invoices, count: invoices.length });
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  organizationId: z.string().min(1),
  number: z.string().min(1).optional(),
  amountInr: z.number().nonnegative(),
  gstInr: z.number().nonnegative().optional(),
  status: z.string().optional().default("draft"),
  dueAt: z.string().datetime().optional(),
  lineItems: z.array(z.record(z.string(), z.unknown())).optional(),
});

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    const { session } = await requireOrgAccess(body.organizationId, "finance:write", req);

    const gstPercent = Number(process.env.GST_PERCENT || 18);
    const gstInr =
      body.gstInr ?? Math.round(body.amountInr * (gstPercent / 100) * 100) / 100;

    let number = body.number;
    if (!number) {
      const count = await prisma.invoice.count({
        where: { organizationId: body.organizationId },
      });
      number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
    }

    const existing = await prisma.invoice.findUnique({
      where: {
        organizationId_number: {
          organizationId: body.organizationId,
          number,
        },
      },
    });
    if (existing) return jsonError("Invoice number already exists", 409);

    const invoice = await prisma.invoice.create({
      data: {
        organizationId: body.organizationId,
        number,
        amountInr: body.amountInr,
        gstInr,
        status: body.status || "draft",
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        lineItems: (body.lineItems || []) as Prisma.InputJsonValue,
      },
    });

    await writeAudit({
      action: "invoice.create",
      userId: session.userId,
      organizationId: body.organizationId,
      entity: "invoice",
      entityId: invoice.id,
      after: { number: invoice.number, amountInr: invoice.amountInr },
    });

    return jsonOk(invoice);
  } catch (err) {
    return handleApiError(err);
  }
}
