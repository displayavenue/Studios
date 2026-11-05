import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
    return jsonOk(settings);
  } catch (err) {
    return handleApiError(err);
  }
}

const bodySchema = z.object({
  key: z.string(),
  value: z.unknown(),
});

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin(req);
    const body = bodySchema.parse(await req.json());
    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      create: { key: body.key, value: body.value as object },
      update: { value: body.value as object },
    });
    await prisma.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "setting.update",
        entity: "setting",
        entityId: setting.id,
        meta: { key: body.key },
      },
    });
    return jsonOk(setting);
  } catch (err) {
    return handleApiError(err);
  }
}
