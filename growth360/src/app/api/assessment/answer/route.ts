import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const bodySchema = z.object({
  assessmentId: z.string().min(1),
  questionKey: z.string().min(1),
  answerValue: z.unknown(),
  step: z.number().int().optional(),
});

const fieldMap: Record<string, string> = {
  growthGoal: "growthGoal",
  industry: "industry",
  location: "location",
  businessType: "businessType",
  product: "product",
  targetCustomer: "targetCustomer",
  avgCustomerValue: "avgCustomerValue",
  marketingBudget: "marketingBudget",
  currentChannels: "currentChannels",
  company: "company",
  contactName: "contactName",
  contactEmail: "contactEmail",
  contactWhatsapp: "contactWhatsapp",
};

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const assessment = await prisma.assessment.findUnique({
      where: { id: body.assessmentId },
    });
    if (!assessment) return jsonError("Assessment not found", 404);

    await prisma.assessmentAnswer.upsert({
      where: {
        assessmentId_questionKey: {
          assessmentId: body.assessmentId,
          questionKey: body.questionKey,
        },
      },
      create: {
        assessmentId: body.assessmentId,
        questionKey: body.questionKey,
        answerValue: body.answerValue as object,
      },
      update: { answerValue: body.answerValue as object },
    });

    const data: Record<string, unknown> = {
      status: "in_progress",
    };
    if (body.step != null) data.currentStep = body.step;

    const field = fieldMap[body.questionKey];
    if (field) {
      let value = body.answerValue;
      if (field === "avgCustomerValue" || field === "marketingBudget") {
        value = Number(value);
      }
      if (field === "currentChannels") {
        const arr = Array.isArray(value) ? value.map(String) : [String(value)];
        value = arr.filter((v) => v !== "none");
      }
      data[field] = value;
    }

    const updated = await prisma.assessment.update({
      where: { id: body.assessmentId },
      data,
    });

    return jsonOk({
      id: updated.id,
      publicId: updated.publicId,
      currentStep: updated.currentStep,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
