import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const [rules, pricing, roi, settings] = await Promise.all([
      prisma.pricingRule.findMany({ orderBy: { priority: "desc" } }),
      prisma.pricing.findMany(),
      prisma.roiAssumption.findMany(),
      prisma.setting.findMany({
        where: { key: { in: ["gst_percent", "booking_fee_inr", "default_mgmt_fee_pct", "default_setup_fee"] } },
      }),
    ]);
    return jsonOk({ rules, pricing, roi, settings });
  } catch (err) {
    return handleApiError(err);
  }
}

const updateSchema = z.object({
  type: z.enum(["pricing_rule", "roi", "setting"]),
  id: z.string().optional(),
  key: z.string().optional(),
  data: z.record(z.string(), z.unknown()),
});

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin(req);
    const body = updateSchema.parse(await req.json());

    if (body.type === "pricing_rule" && body.id) {
      const updated = await prisma.pricingRule.update({
        where: { id: body.id },
        data: body.data as never,
      });
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: "pricing_rule.update",
          entity: "pricing_rule",
          entityId: updated.id,
        },
      });
      return jsonOk(updated);
    }

    if (body.type === "roi" && body.key) {
      const updated = await prisma.roiAssumption.update({
        where: { key: body.key },
        data: body.data as never,
      });
      return jsonOk(updated);
    }

    if (body.type === "setting" && body.key) {
      const updated = await prisma.setting.upsert({
        where: { key: body.key },
        create: { key: body.key, value: body.data.value as never },
        update: { value: body.data.value as never },
      });
      return jsonOk(updated);
    }

    return jsonOk({ updated: false });
  } catch (err) {
    return handleApiError(err);
  }
}
