import { prisma } from "@/lib/prisma";
import { generateOrderNumber, toNumber } from "@/lib/utils";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import { createPaymentOrder, verifyPaymentSignature } from "@/providers/payment";
import { createShipment, checkServiceability } from "@/providers/shipping";
import { calculateNetContribution } from "@/services/pricing/engine";
import { createSupplierProvider } from "@/providers/suppliers";

export async function getOrCreateCart(opts: { userId?: string; sessionId?: string }) {
  if (opts.userId) {
    const existing = await prisma.cart.findFirst({
      where: { userId: opts.userId },
      include: { items: { include: { product: true } } },
    });
    if (existing) return existing;
    return prisma.cart.create({
      data: { userId: opts.userId },
      include: { items: { include: { product: true } } },
    });
  }

  if (!opts.sessionId) throw new Error("SESSION_REQUIRED");

  const existing = await prisma.cart.findFirst({
    where: { sessionId: opts.sessionId },
    include: { items: { include: { product: true } } },
  });
  if (existing) return existing;

  return prisma.cart.create({
    data: { sessionId: opts.sessionId },
    include: { items: { include: { product: true } } },
  });
}

export async function addToCart(opts: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity?: number;
  variantId?: string;
}) {
  const product = await prisma.product.findUnique({ where: { id: opts.productId } });
  if (!product || product.status !== "PUBLISHED") throw new Error("PRODUCT_UNAVAILABLE");
  if (product.stockQuantity < (opts.quantity ?? 1)) throw new Error("INSUFFICIENT_STOCK");

  const cart = await getOrCreateCart(opts);
  const qty = opts.quantity ?? 1;

  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: opts.productId,
      variantId: opts.variantId ?? null,
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + qty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: opts.productId,
        variantId: opts.variantId,
        quantity: qty,
        price: product.sellingPrice,
      },
    });
  }

  await prisma.analyticsEvent.create({
    data: {
      eventName: "add_to_cart",
      userId: opts.userId,
      sessionId: opts.sessionId,
      productId: opts.productId,
      value: product.sellingPrice,
    },
  });

  return getOrCreateCart(opts);
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return;
  }
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
}

export function summarizeCart(
  items: Array<{ quantity: number; price: unknown; product: { contributionBeforeAds: unknown } }>,
) {
  const subtotal = items.reduce((s, i) => s + toNumber(i.price) * i.quantity, 0);
  const estimatedContribution = items.reduce(
    (s, i) => s + toNumber(i.product.contributionBeforeAds) * i.quantity,
    0,
  );
  return { subtotal, estimatedContribution, itemCount: items.reduce((s, i) => s + i.quantity, 0) };
}

export async function createCheckoutOrder(input: {
  userId?: string;
  sessionId?: string;
  email: string;
  phone: string;
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "RAZORPAY" | "COD";
  couponCode?: string;
  idempotencyKey?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    landingPage?: string;
  };
}) {
  if (input.idempotencyKey) {
    const existing = await prisma.order.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) return { order: existing, reused: true as const };
  }

  const serviceability = await checkServiceability(input.address.pincode);
  if (!serviceability.serviceable) throw new Error("PINCODE_NOT_SERVICEABLE");

  if (input.paymentMethod === "COD" && !serviceability.codAvailable) {
    throw new Error("COD_NOT_AVAILABLE");
  }

  const cart = await getOrCreateCart({
    userId: input.userId,
    sessionId: input.sessionId,
  });

  if (!cart.items.length) throw new Error("CART_EMPTY");

  const { subtotal } = summarizeCart(cart.items);
  const shippingFee = serviceability.shippingFee ?? 49;
  const codFee = input.paymentMethod === "COD" ? 40 : 0;
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shippingFee + taxAmount + codFee;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: input.userId,
      guestEmail: input.email,
      guestPhone: input.phone,
      status:
        input.paymentMethod === "COD" ? OrderStatus.PAID : OrderStatus.PENDING_PAYMENT,
      paymentMethod:
        input.paymentMethod === "COD" ? PaymentMethod.COD : PaymentMethod.RAZORPAY,
      subtotal,
      shippingFee,
      taxAmount,
      codFee,
      total,
      couponCode: input.couponCode,
      shippingName: input.address.name,
      shippingPhone: input.phone,
      shippingLine1: input.address.line1,
      shippingLine2: input.address.line2,
      shippingCity: input.address.city,
      shippingState: input.address.state,
      shippingPincode: input.address.pincode,
      idempotencyKey: input.idempotencyKey,
      utmSource: input.utm?.source,
      utmMedium: input.utm?.medium,
      utmCampaign: input.utm?.campaign,
      utmContent: input.utm?.content,
      landingPage: input.utm?.landingPage,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sku: item.product.sku,
          title: item.product.title,
          quantity: item.quantity,
          unitPrice: item.price,
          costPrice: item.product.costPrice,
          totalPrice: toNumber(item.price) * item.quantity,
          contributionEst: toNumber(item.product.contributionBeforeAds) * item.quantity,
        })),
      },
      statusHistory: {
        create: {
          status:
            input.paymentMethod === "COD" ? OrderStatus.PAID : OrderStatus.PENDING_PAYMENT,
          note: "Order created",
        },
      },
    },
  });

  if (input.paymentMethod === "RAZORPAY") {
    const rz = await createPaymentOrder({
      amountPaise: Math.round(total * 100),
      receipt: order.orderNumber,
      notes: { orderId: order.id },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: PaymentMethod.RAZORPAY,
        status: PaymentStatus.PENDING,
        amount: total,
        razorpayOrderId: rz.id,
      },
    });

    return { order, razorpay: rz, reused: false as const };
  }

  await prisma.payment.create({
    data: {
      orderId: order.id,
      method: PaymentMethod.COD,
      status: PaymentStatus.PENDING,
      amount: total,
    },
  });

  // Clear cart after COD accept
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return { order, reused: false as const };
}

export async function confirmRazorpayPayment(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}) {
  const valid = await verifyPaymentSignature(input);
  if (!valid) throw new Error("INVALID_SIGNATURE");

  const payment = await prisma.payment.findFirst({
    where: { orderId: input.orderId, razorpayOrderId: input.razorpayOrderId },
  });
  if (!payment) throw new Error("PAYMENT_NOT_FOUND");
  if (payment.status === PaymentStatus.CAPTURED) {
    return prisma.order.findUniqueOrThrow({ where: { id: input.orderId } });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.CAPTURED,
      razorpayPaymentId: input.razorpayPaymentId,
      paymentSignature: input.signature,
    },
  });

  const order = await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: OrderStatus.PAID,
      statusHistory: {
        create: { status: OrderStatus.PAID, note: "Payment captured via Razorpay" },
      },
    },
    include: { items: true },
  });

  // Clear carts linked to this user/session loosely by guest email match skipped
  return order;
}

export async function processPaidOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { include: { supplier: true } } } } },
  });
  if (!order || order.status !== OrderStatus.PAID) throw new Error("ORDER_NOT_PAID");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.PROCESSING,
      statusHistory: { create: { status: OrderStatus.PROCESSING } },
    },
  });

  // Supplier order (first item's supplier as simplification; production would split)
  const first = order.items[0];
  if (first?.product.supplier) {
    const provider = createSupplierProvider({
      providerType: first.product.supplier.providerType,
      name: first.product.supplier.name,
      apiBaseUrl: first.product.supplier.apiBaseUrl,
      credentials: first.product.supplier.credentialsReference,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SUPPLIER_ORDER_PENDING,
        statusHistory: { create: { status: OrderStatus.SUPPLIER_ORDER_PENDING } },
      },
    });

    const supplierOrder = await provider.createOrder({
      externalOrderId: order.orderNumber,
      items: order.items.map((i) => ({
        supplierProductId: i.product.supplierProductId || i.sku,
        quantity: i.quantity,
      })),
      shippingAddress: {
        name: order.shippingName || "",
        phone: order.shippingPhone || "",
        line1: order.shippingLine1 || "",
        line2: order.shippingLine2 || undefined,
        city: order.shippingCity || "",
        state: order.shippingState || "",
        pincode: order.shippingPincode || "",
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SUPPLIER_CONFIRMED,
        statusHistory: {
          create: {
            status: OrderStatus.SUPPLIER_CONFIRMED,
            note: `Supplier order ${supplierOrder.supplierOrderId}`,
          },
        },
      },
    });
  }

  const shipment = await createShipment({
    orderId: order.orderNumber,
    pincode: order.shippingPincode || "",
    weight: 0.5,
    paymentMethod: order.paymentMethod === PaymentMethod.COD ? "COD" : "PREPAID",
  });

  await prisma.shipment.create({
    data: {
      orderId,
      shipmentId: shipment.shipmentId,
      awb: shipment.awb,
      courier: shipment.courier,
      trackingNumber: shipment.trackingNumber,
      status: "CREATED",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.SHIPPED,
      statusHistory: { create: { status: OrderStatus.SHIPPED, note: `AWB ${shipment.awb}` } },
    },
  });

  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { shipments: true, payments: true, items: true },
  });
}

export async function finalizeOrderCosts(orderId: string, advertisingCost = 0) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, shipments: true, payments: true, refunds: true },
  });
  if (!order) throw new Error("ORDER_NOT_FOUND");

  const productCost = order.items.reduce(
    (s, i) => s + toNumber(i.costPrice) * i.quantity,
    0,
  );
  const actualShipping = toNumber(order.actualShippingCost ?? order.shippingFee);
  const paymentFees = toNumber(order.total) * 0.02;
  const refunds = order.refunds.reduce((s, r) => s + toNumber(r.amount), 0);
  const rtoCosts = order.shipments.reduce((s, sh) => s + toNumber(sh.rtoCost ?? 0), 0);

  const result = calculateNetContribution({
    revenue: toNumber(order.total),
    productCost,
    actualShipping,
    paymentFees,
    discounts: toNumber(order.discount),
    refunds,
    rtoCosts,
    advertisingCost,
  });

  return prisma.order.update({
    where: { id: orderId },
    data: {
      actualProductCost: productCost,
      actualShippingCost: actualShipping,
      actualPaymentFee: paymentFees,
      actualAdCost: advertisingCost,
      actualRefundCost: refunds,
      actualRtoCost: rtoCosts,
      netContribution: result.netContribution,
    },
  });
}
