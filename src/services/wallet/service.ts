import { FREE_CONSULT_MINUTES } from "@/config/wallet";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export { FREE_CONSULT_MINUTES };

function toNum(v: Prisma.Decimal | number | string) {
  return Number(v);
}

export async function getOrCreateWallet(userId: string) {
  const existing = await prisma.wallet.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.wallet.create({
    data: { userId, balanceInr: 0 },
  });
}

export async function getWalletBalance(userId: string) {
  const w = await getOrCreateWallet(userId);
  return { balanceInr: toNum(w.balanceInr), walletId: w.id, currency: w.currency };
}

export async function creditWallet(input: {
  userId: string;
  amountInr: number;
  reason: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}) {
  if (input.amountInr <= 0) throw new Error("INVALID_AMOUNT");
  const wallet = await getOrCreateWallet(input.userId);
  const next = toNum(wallet.balanceInr) + input.amountInr;
  const [updated] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceInr: next },
    }),
    prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        amountInr: input.amountInr,
        balanceAfter: next,
        reason: input.reason,
        reference: input.reference,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    }),
  ]);
  return { balanceInr: toNum(updated.balanceInr) };
}

export async function debitWallet(input: {
  userId: string;
  amountInr: number;
  reason: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}) {
  if (input.amountInr <= 0) throw new Error("INVALID_AMOUNT");
  const wallet = await getOrCreateWallet(input.userId);
  const current = toNum(wallet.balanceInr);
  if (current < input.amountInr) throw new Error("INSUFFICIENT_BALANCE");
  const next = current - input.amountInr;
  const [updated] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceInr: next },
    }),
    prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "DEBIT",
        amountInr: input.amountInr,
        balanceAfter: next,
        reason: input.reason,
        reference: input.reference,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    }),
  ]);
  return { balanceInr: toNum(updated.balanceInr) };
}

export async function listWalletTransactions(userId: string, take = 30) {
  const wallet = await getOrCreateWallet(userId);
  return prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}

/** First N minutes of a demo consult are free; then charge per-minute rate. */

export function consultChargeInr(pricePerMin: number, minutes: number) {
  const billable = Math.max(0, minutes - FREE_CONSULT_MINUTES);
  return Math.round(billable * pricePerMin * 100) / 100;
}
