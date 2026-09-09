import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymentOrder, verifyPaymentSignature } from "@/providers/payment";
import { getMallItem } from "@/content/astromall";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Login to buy from AstroMall." }, { status: 401 });
  }
  const body = await req.json();
  const item = getMallItem(String(body.slug || ""));
  if (!item) return NextResponse.json({ error: "ITEM_NOT_FOUND" }, { status: 404 });

  const orderNumber = `MAL-${generateOrderNumber().replace(/^JK-?/, "")}`;
  const rz = await createPaymentOrder({
    amountPaise: Math.round(item.priceInr * 100),
    receipt: orderNumber.slice(0, 40),
    notes: { type: "astromall", slug: item.slug, userId: session.id },
  });

  await prisma.mallOrder.create({
    data: {
      userId: session.id,
      orderNumber,
      itemSlug: item.slug,
      itemName: item.name,
      amountInr: item.priceInr,
      status: "PENDING",
      razorpayOrderId: rz.id,
      shippingName: body.shippingName ? String(body.shippingName) : session.firstName,
      shippingPhone: body.shippingPhone ? String(body.shippingPhone) : null,
      shippingAddress: body.shippingAddress ? String(body.shippingAddress) : null,
    },
  });

  return NextResponse.json({ razorpay: rz, orderNumber, item });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const razorpayOrderId = String(body.razorpayOrderId || "");
  const razorpayPaymentId = String(body.razorpayPaymentId || "");
  const signature = String(body.signature || "");

  const mall = await prisma.mallOrder.findFirst({
    where: { razorpayOrderId, userId: session.id },
  });
  if (!mall) return NextResponse.json({ error: "ORDER_NOT_FOUND" }, { status: 404 });
  if (mall.status === "PAID" || mall.status === "FULFILLED") {
    return NextResponse.json({ ok: true, alreadyPaid: true, orderNumber: mall.orderNumber });
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

  return NextResponse.json({ ok: true, orderNumber: mall.orderNumber });
}
