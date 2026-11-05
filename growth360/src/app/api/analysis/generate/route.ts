import { z } from "zod";
import { handleApiError, jsonOk } from "@/lib/api";
import { completeAssessmentAnalysis } from "@/lib/engines/analysisOrchestrator";

const bodySchema = z.object({
  assessmentId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const result = await completeAssessmentAnalysis(body.assessmentId);
    return jsonOk(result);
  } catch (err) {
    return handleApiError(err);
  }
}
