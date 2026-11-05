import { z } from "zod";
import { ForbiddenError, requirePermission, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { roleHasPermission } from "@/lib/rbac";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  defaultPriceInr: z.number().nonnegative().default(0),
  gstPercent: z.number().min(0).max(100).default(18),
  billingType: z.enum(["one_time", "recurring"]).default("one_time"),
  monthlyPriceInr: z.number().nonnegative().optional().nullable(),
  isActive: z.boolean().optional().default(true),
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
    const activeOnly = url.searchParams.get("active") !== "false";
    const q = url.searchParams.get("q")?.trim();

    const services = await prisma.quoteCatalogService.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      include: { category: true },
    });

    const categories = await prisma.quoteServiceCategory.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { sortOrder: "asc" },
      include: {
        services: {
          where: activeOnly ? { isActive: true } : undefined,
          orderBy: { name: "asc" },
        },
      },
    });

    return jsonOk({ services, categories, count: services.length });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requirePermission("deal:write", req);
    const body = createSchema.parse(await req.json());

    let categoryId = body.categoryId || null;
    if (!categoryId && body.categoryName) {
      const cat = await prisma.quoteServiceCategory.upsert({
        where: { name: body.categoryName },
        create: { name: body.categoryName, sortOrder: 99 },
        update: { isActive: true },
      });
      categoryId = cat.id;
    }

    const service = await prisma.quoteCatalogService.create({
      data: {
        name: body.name,
        description: body.description || null,
        categoryId,
        defaultPriceInr: body.defaultPriceInr,
        gstPercent: body.gstPercent,
        billingType: body.billingType,
        monthlyPriceInr: body.monthlyPriceInr ?? null,
        isActive: body.isActive ?? true,
      },
      include: { category: true },
    });

    await writeAudit({
      action: "quote_service.create",
      userId: session.userId,
      entity: "quote_catalog_service",
      entityId: service.id,
      after: { name: service.name, defaultPriceInr: service.defaultPriceInr },
    });

    return jsonOk(service);
  } catch (err) {
    return handleApiError(err);
  }
}
