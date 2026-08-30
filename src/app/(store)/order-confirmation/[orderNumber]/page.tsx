import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, shipments: true, payments: true },
  });
  if (!order) notFound();

  return (
    <div className="container-velora max-w-xl py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--velora-accent)]">Order confirmed</p>
      <h1 className="mt-3 font-display text-4xl">Thank you</h1>
      <p className="mt-4 text-[var(--velora-muted)]">
        Order <span className="font-medium text-[var(--velora-ink)]">{order.orderNumber}</span> is{" "}
        {order.status.replaceAll("_", " ").toLowerCase()}.
      </p>
      <div className="mt-8 rounded-lg border border-[var(--velora-line)] bg-white/60 p-6 text-left text-sm">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-semibold">{formatINR(toNumber(order.total))}</span>
        </div>
        <ul className="mt-4 space-y-2">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4">
              <span>
                {i.title} × {i.quantity}
              </span>
              <span>{formatINR(toNumber(i.totalPrice))}</span>
            </li>
          ))}
        </ul>
        {order.shipments[0]?.awb && (
          <p className="mt-4 text-[var(--velora-muted)]">
            Tracking AWB: {order.shipments[0].awb} ({order.shipments[0].courier})
          </p>
        )}
      </div>
      <Link href="/shop" className="mt-8 inline-block text-[var(--velora-accent)] underline">
        Continue shopping
      </Link>
    </div>
  );
}
