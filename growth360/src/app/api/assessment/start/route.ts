import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";

export async function POST() {
  try {
    const assessment = await prisma.assessment.create({
      data: { status: "started", currentStep: 0 },
    });
    return jsonOk({
      id: assessment.id,
      publicId: assessment.publicId,
      currentStep: assessment.currentStep,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
