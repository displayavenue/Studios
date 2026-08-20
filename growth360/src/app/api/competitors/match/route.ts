import { z } from "zod";
import { handleApiError, jsonOk } from "@/lib/api";
import { matchCompetitors, competitiveGaps } from "@/lib/engines/competitorEngine";
import { calculateGrowthScore } from "@/lib/engines/scoreEngine";

const bodySchema = z.object({
  industry: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  growthGoal: z.string().optional(),
  marketingBudget: z.number().optional(),
  currentChannels: z.array(z.string()).optional(),
  avgCustomerValue: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const competitors = await matchCompetitors(body, 5);
    const score = calculateGrowthScore(body).total;
    const gaps = competitiveGaps(score, competitors);
    return jsonOk({ competitors, gaps, yourScore: score });
  } catch (err) {
    return handleApiError(err);
  }
}
