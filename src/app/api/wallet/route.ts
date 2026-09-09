import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getWalletBalance, listWalletTransactions } from "@/services/wallet/service";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const bal = await getWalletBalance(session.id);
    const txs = await listWalletTransactions(session.id, 40);
    return NextResponse.json({
      balanceInr: bal.balanceInr,
      currency: bal.currency,
      transactions: txs.map((t) => ({
        id: t.id,
        type: t.type,
        amountInr: Number(t.amountInr),
        balanceAfter: Number(t.balanceAfter),
        reason: t.reason,
        reference: t.reference,
        createdAt: t.createdAt,
      })),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "WALLET_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  // alias for recharge start is under /api/wallet/recharge
  void req;
  return NextResponse.json({ error: "USE_/api/wallet/recharge" }, { status: 400 });
}
