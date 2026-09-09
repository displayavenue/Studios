import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createPaymentOrder, verifyPaymentSignature } from "@/providers/payment";
import { creditWallet } from "@/services/wallet/service";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

const PACKS = [100, 200, 500, 1000, 2000, 5000];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED", message: "Login to recharge wallet." }, { status: 401 });

  const body = await req.json();
  const amountInr = Number(body.amountInr);
  if (!PACKS.includes(amountInr)) {
    return NextResponse.json({ error: "INVALID_PACK", packs: PACKS }, { status: 400 });
  }

  // Create a lightweight report-order style payment container via MallOrder pending + razorpay
  const orderNumber = `WLT-${generateOrderNumber().replace(/^JK-?/, "")}`;
  const rz = await createPaymentOrder({
    amountPaise: Math.round(amountInr * 100),
    receipt: orderNumber.slice(0, 40),
    notes: { type: "wallet_recharge", userId: session.id, amountInr: String(amountInr) },
  });

  await prisma.mallOrder.create({
    data: {
      userId: session.id,
      orderNumber,
      itemSlug: "wallet-recharge",
      itemName: `Wallet recharge ₹${amountInr}`,
      amountInr,
      status: "PENDING",
      razorpayOrderId: rz.id,
      notes: "wallet_recharge",
    },
  });

  return NextResponse.json({
    razorpay: rz,
    orderNumber,
    amountInr,
  });
}

/** Confirm wallet recharge after Razorpay (or mock) success. */
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const razorpayOrderId = String(body.razorpayOrderId || "");
  const razorpayPaymentId = String(body.razorpayPaymentId || "");
  const signature = String(body.signature || "");

  const mall = await prisma.mallOrder.findFirst({
    where: { razorpayOrderId, userId: session.id, itemSlug: "wallet-recharge" },
  });
  if (!mall) return NextResponse.json({ error: "ORDER_NOT_FOUND" }, { status: 404 });
  if (mall.status === "PAID") {
    const { getWalletBalance } = await import("@/services/wallet/service");
    return NextResponse.json({ ok: true, alreadyPaid: true, ...(await getWalletBalance(session.id)) });
  }

  const valid = await verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature });
  if (!valid) return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });

  await prisma.mallOrder.update({
    where: { id: mall.id },
    data: {
      status: "PAID",
      razorpayPaymentId,
      paidAt: new Date(),
    },
  });

  const credited = await creditWallet({
    userId: session.id,
    amountInr: Number(mall.amountInr),
    reason: "Wallet recharge",
    reference: razorpayPaymentId,
    metadata: { orderNumber: mall.orderNumber },
  });

  return NextResponse.json({ ok: true, ...credited });
}
