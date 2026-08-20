import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const prompts = await prisma.aiPromptVersion.findMany({
      orderBy: [{ key: "asc" }, { version: "desc" }],
    });
    return jsonOk(prompts);
  } catch (err) {
    return handleApiError(err);
  }
}

const bodySchema = z.object({
  key: z.string(),
  name: z.string(),
  content: z.string().min(10),
  activate: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAdmin(req);
    const body = bodySchema.parse(await req.json());
    const latest = await prisma.aiPromptVersion.findFirst({
      where: { key: body.key },
      orderBy: { version: "desc" },
    });
    const version = (latest?.version || 0) + 1;

    if (body.activate !== false) {
      await prisma.aiPromptVersion.updateMany({
        where: { key: body.key },
        data: { isActive: false },
      });
    }

    const prompt = await prisma.aiPromptVersion.create({
      data: {
        key: body.key,
        name: body.name,
        content: body.content,
        version,
        isActive: body.activate !== false,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "prompt.create",
        entity: "ai_prompt_version",
        entityId: prompt.id,
      },
    });

    return jsonOk(prompt);
  } catch (err) {
    return handleApiError(err);
  }
}
