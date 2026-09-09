import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getAnalyticsSummary } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "analytics.view")) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const days = Math.min(90, Math.max(1, Number(req.nextUrl.searchParams.get("days") || 7)));
  const summary = await getAnalyticsSummary(days);
  return NextResponse.json(summary);
}
