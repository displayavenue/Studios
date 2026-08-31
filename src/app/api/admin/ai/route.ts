import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { getTodayDashboard } from "@/services/profit/service";
import { answerBusinessQuestion } from "@/services/ai/service";

export async function POST(req: NextRequest) {
  try {
    await requirePermission("ai.use");
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const body = await req.json();
  const dash = await getTodayDashboard();
  const answer = await answerBusinessQuestion(String(body.question || ""), {
    revenue: dash.revenue,
    revenueTarget: dash.revenueTarget,
    netContribution: dash.netContribution,
    contributionTarget: dash.contributionTarget,
    orders: dash.orders,
    aov: dash.aov,
    cac: dash.cac,
    adSpend: dash.adSpend,
  });
  return NextResponse.json(answer);
}
