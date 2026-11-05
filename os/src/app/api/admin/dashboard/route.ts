import { requirePermission } from "@/lib/auth";
import { getCommandCenterMetrics } from "@/lib/metrics";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await requirePermission("ceo:dashboard", req);
    const metrics = await getCommandCenterMetrics();
    return jsonOk(metrics);
  } catch (err) {
    return handleApiError(err);
  }
}
