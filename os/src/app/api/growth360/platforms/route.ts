import { z } from "zod";
import { handleApiError, jsonOk } from "@/lib/api";
import { recommendPlatforms } from "@/lib/platforms/recommend";

const schema = z.object({
  budget: z.number().nonnegative().optional(),
  growthGoal: z.string().optional(),
  industry: z.string().optional(),
  currentChannels: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json().catch(() => ({})));
    const platforms = recommendPlatforms(body);
    return jsonOk({
      platforms,
      note: "Fit scores are deterministic recommendations. Live metrics require connected platform credentials.",
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const budgetRaw = url.searchParams.get("budget");
    const platforms = recommendPlatforms({
      budget: budgetRaw ? Number(budgetRaw) : undefined,
      growthGoal: url.searchParams.get("growthGoal") || undefined,
      industry: url.searchParams.get("industry") || undefined,
    });
    return jsonOk({ platforms });
  } catch (err) {
    return handleApiError(err);
  }
}
