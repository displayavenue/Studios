import { prisma } from "@/lib/prisma";
import { generateOrderNumber, toNumber } from "@/lib/utils";
import { OrderStatus, PaymentStatus, Gender, ReportJobStatus } from "@/generated/prisma/enums";
import { createPaymentOrder, verifyPaymentSignature } from "@/providers/payment";
import { enqueueReportJob } from "@/services/report/service";

export type BirthDetailsInput = {
  name: string;
  gender: string;
  dob: string;
  birthTime?: string;
  birthTimeUnknown?: boolean;
  placeName: string;
};

export async function createReportOrder(input: {
  userId: string;
  productSlug: string;
  birthDetails: BirthDetailsInput;
}) {
  const product = await prisma.product.findFirst({
    where: { slug: input.productSlug, status: "PUBLISHED", isActive: true },
  });
  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  const price = toNumber(product.price);
  const dob = new Date(input.birthDetails.dob);

  const birthProfile = await prisma.birthProfile.create({
    data: {
      userId: input.userId,
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
      userId: input.userId,
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
    notes: { orderId: order.id },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: PaymentStatus.PROCESSING,
      amount: price,
      razorpayOrderId: rz.id,
    },
  });

  return { order, razorpay: rz, birthProfile };
}

export async function confirmRazorpayPayment(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
  skipSignatureCheck?: boolean;
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
    return prisma.order.findUniqueOrThrow({ where: { id: input.orderId } });
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
    include: { items: { include: { product: true, birthProfile: true } } },
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

  return order;
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
