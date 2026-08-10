import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireOrgAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";

type Params = { params: Promise<{ orgId: string }> };

const DEFAULT_ITEMS = [
  { key: "kickoff_call", label: "Kickoff call completed", done: false },
  { key: "brand_assets", label: "Brand assets collected", done: false },
  { key: "tracking", label: "Tracking / pixels installed", done: false },
  { key: "ad_accounts", label: "Ad accounts access granted", done: false },
  { key: "billing", label: "Billing details confirmed", done: false },
  { key: "first_campaign", label: "First campaign brief approved", done: false },
];

export async function GET(req: Request, { params }: Params) {
  try {
    const { orgId } = await params;
    await requireOrgAccess(orgId, "org:read", req);

    let checklist = await prisma.onboardingChecklist.findUnique({
      where: { organizationId: orgId },
    });

    if (!checklist) {
      checklist = await prisma.onboardingChecklist.create({
        data: {
          organizationId: orgId,
          items: DEFAULT_ITEMS,
          status: "pending",
        },
      });
    }

    return jsonOk(checklist);
  } catch (err) {
    return handleApiError(err);
  }
}

const patchSchema = z.object({
  items: z
    .array(
      z.object({
        key: z.string(),
        label: z.string().optional(),
        done: z.boolean(),
      }),
    )
    .optional(),
  itemKey: z.string().optional(),
  done: z.boolean().optional(),
  status: z.string().optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { orgId } = await params;
    const { session } = await requireOrgAccess(orgId, "org:write", req);
    const body = patchSchema.parse(await req.json());

    let checklist = await prisma.onboardingChecklist.findUnique({
      where: { organizationId: orgId },
    });
    if (!checklist) {
      checklist = await prisma.onboardingChecklist.create({
        data: { organizationId: orgId, items: DEFAULT_ITEMS, status: "pending" },
      });
    }

    let items = Array.isArray(checklist.items)
      ? (checklist.items as { key: string; label?: string; done: boolean }[])
      : [...DEFAULT_ITEMS];

    if (body.items) {
      items = body.items.map((i) => ({
        key: i.key,
        label: i.label || items.find((x) => x.key === i.key)?.label || i.key,
        done: i.done,
      }));
    } else if (body.itemKey != null && body.done != null) {
      items = items.map((i) => (i.key === body.itemKey ? { ...i, done: body.done! } : i));
    }

    const allDone = items.length > 0 && items.every((i) => i.done);
    const status = body.status || (allDone ? "complete" : items.some((i) => i.done) ? "in_progress" : "pending");

    const updated = await prisma.onboardingChecklist.update({
      where: { organizationId: orgId },
      data: {
        items: items as unknown as Prisma.InputJsonValue,
        status,
      },
    });

    if (allDone) {
      await prisma.organization.update({
        where: { id: orgId },
        data: { status: "ACTIVE" },
      }).catch(() => null);
    }

    await writeAudit({
      action: "onboarding.update",
      userId: session.userId,
      organizationId: orgId,
      entity: "onboarding",
      entityId: updated.id,
      after: { status: updated.status, doneCount: items.filter((i) => i.done).length },
    });

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
