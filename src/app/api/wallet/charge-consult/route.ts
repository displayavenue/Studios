import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { debitWallet } from "@/services/wallet/service";
import { FREE_CONSULT_MINUTES } from "@/config/wallet";
import { getPublicExpertBySlug, startConsultationRecord } from "@/services/experts/service";

/** Charge wallet for billable consult minutes after free intro. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const slug = String(body.expertSlug || "");
  const minutes = Math.max(1, Math.min(120, Number(body.minutes) || 1));
  const expert = await getPublicExpertBySlug(slug);
  if (!expert) return NextResponse.json({ error: "EXPERT_NOT_FOUND" }, { status: 404 });

  if (minutes === 1) {
    await startConsultationRecord({ userId: session.id, expertSlug: slug, mode: "chat" }).catch(() => null);
  }

  const billable = Math.max(0, minutes - FREE_CONSULT_MINUTES);
  const amount = Math.round(billable * expert.pricePerMinInr * 100) / 100;

  if (amount <= 0) {
    return NextResponse.json({
      ok: true,
      charged: 0,
      freeMinutes: FREE_CONSULT_MINUTES,
      message: "Still within free intro minutes.",
    });
  }

  try {
    const result = await debitWallet({
      userId: session.id,
      amountInr: amount,
      reason: `Consult ${expert.name} (${billable} min)`,
      reference: `consult:${slug}:${Date.now()}`,
      metadata: { minutes, billable, pricePerMin: expert.pricePerMinInr, source: expert.source },
    });
    return NextResponse.json({
      ok: true,
      charged: amount,
      billableMinutes: billable,
      freeMinutes: FREE_CONSULT_MINUTES,
      balanceInr: result.balanceInr,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "CHARGE_FAILED";
    return NextResponse.json(
      { error: msg, message: msg === "INSUFFICIENT_BALANCE" ? "Recharge wallet to continue." : msg },
      { status: 402 },
    );
  }
}
