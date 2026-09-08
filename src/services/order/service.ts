import { prisma } from "@/lib/prisma";
import { generateOrderNumber, toNumber } from "@/lib/utils";
import { OrderStatus, PaymentStatus, Gender, ReportJobStatus, Role } from "@/generated/prisma/enums";
import { createPaymentOrder, verifyPaymentSignature } from "@/providers/payment";
import { enqueueReportJob } from "@/services/report/service";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { notifyUser } from "@/providers/notifications";
import { nanoid } from "nanoid";

export type BirthDetailsInput = {
  name: string;
  gender: string;
  dob: string;
  birthTime?: string;
  birthTimeUnknown?: boolean;
  placeName: string;
};

async function resolveCheckoutUser(input: {
  userId?: string;
  guestEmail?: string;
  guestName?: string;
}) {
  if (input.userId) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) throw new Error("USER_NOT_FOUND");
    return user;
  }

  const email = input.guestEmail?.trim().toLowerCase();
  if (!email || !email.includes("@")) throw new Error("EMAIL_REQUIRED");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const tempPassword = `Tmp-${nanoid(12)}!`;
  return prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(tempPassword),
      role: Role.CUSTOMER,
      firstName: input.guestName?.split(" ")[0] || null,
      lastName: input.guestName?.split(" ").slice(1).join(" ") || null,
      emailVerified: false,
    },
  });
}

export async function createReportOrder(input: {
  userId?: string;
  guestEmail?: string;
  productSlug: string;
  birthDetails: BirthDetailsInput;
}) {
  const user = await resolveCheckoutUser({
    userId: input.userId,
    guestEmail: input.guestEmail,
    guestName: input.birthDetails.name,
  });

  const product = await prisma.product.findFirst({
    where: { slug: input.productSlug, status: "PUBLISHED", isActive: true },
  });
  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  const price = toNumber(product.price);
  const dob = new Date(input.birthDetails.dob);

  const birthProfile = await prisma.birthProfile.create({
    data: {
      userId: user.id,
      name: input.birthDetails.name,
      gender: (input.birthDetails.gender as Gender) || Gender.OTHER,
      dob,
      birthTime: input.birthDetails.birthTime || null,
      birthTimeUnknown: input.birthDetails.birthTimeUnknown ?? false,
      placeName: input.birthDetails.placeName,
      lat: 28.6139,
      lng: 77.209,
      timezone: "Asia/Kolkata",
      country: "IN",
      isDefault: true,
    },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: user.id,
      status: OrderStatus.PAYMENT_PROCESSING,
      subtotal: price,
      total: price,
      items: {
        create: {
          productId: product.id,
          birthProfileId: birthProfile.id,
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
          metadata: { birthDetails: input.birthDetails },
        },
      },
    },
    include: { items: true },
  });

  const rz = await createPaymentOrder({
    amountPaise: Math.round(price * 100),
    receipt: order.orderNumber,
    notes: { orderId: order.id, userId: user.id },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: PaymentStatus.PROCESSING,
      amount: price,
      razorpayOrderId: rz.id,
    },
  });

  return {
    order,
    razorpay: rz,
    birthProfile,
    user: { id: user.id, email: user.email },
    guestCheckout: !input.userId,
  };
}

export async function confirmRazorpayPayment(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
  skipSignatureCheck?: boolean;
  createSession?: boolean;
}) {
  if (!input.skipSignatureCheck) {
    const valid = await verifyPaymentSignature(input);
    if (!valid) throw new Error("INVALID_SIGNATURE");
  }

  const payment = await prisma.payment.findFirst({
    where: { orderId: input.orderId, razorpayOrderId: input.razorpayOrderId },
  });
  if (!payment) throw new Error("PAYMENT_NOT_FOUND");
  if (payment.status === PaymentStatus.SUCCESS) {
    return prisma.order.findUniqueOrThrow({
      where: { id: input.orderId },
      include: { user: true, items: { include: { product: true } }, reports: true },
    });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.SUCCESS,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.signature,
      paidAt: new Date(),
    },
  });

  const order = await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: OrderStatus.PAID,
      paidAt: new Date(),
    },
    include: {
      user: true,
      items: { include: { product: true, birthProfile: true } },
      reports: true,
    },
  });

  for (const item of order.items) {
    const report = await prisma.report.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        productId: item.productId,
        birthProfileId: item.birthProfileId,
        jobStatus: ReportJobStatus.QUEUED,
        title: item.product.name,
      },
    });
    await enqueueReportJob(report.id);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.REPORT_GENERATING },
  });

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.vercel.app";
  await notifyUser({
    userId: order.userId,
    type: "ORDER",
    title: `Payment received — ${order.orderNumber}`,
    body: "We are preparing your interpretive report PDF.",
    link: `${site}/checkout/success?order=${order.orderNumber}`,
    email: order.user.email,
    emailHtml: `
      <p>Thank you for your payment.</p>
      <p>Order <strong>${order.orderNumber}</strong> is confirmed. Your report is generating now.</p>
      <p><a href="${site}/checkout/success?order=${order.orderNumber}">Track your order</a></p>
    `,
  });

  if (input.createSession) {
    const token = await createSessionToken({
      id: order.user.id,
      email: order.user.email,
      role: order.user.role,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
    });
    await setSessionCookie(token);
    await prisma.session.create({
      data: {
        userId: order.user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  return prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    include: { user: true, items: { include: { product: true } }, reports: true, payments: true },
  });
}

export async function listUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { name: true, slug: true } } } },
      payments: true,
      reports: true,
    },
  });
}

export async function getOrderByNumber(orderNumber: string, userId?: string) {
  return prisma.order.findFirst({
    where: {
      orderNumber,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: { include: { product: true } },
      payments: true,
      reports: { include: { pdfFiles: true } },
      user: { select: { email: true, firstName: true } },
    },
  });
}
