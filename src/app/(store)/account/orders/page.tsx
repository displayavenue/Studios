import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: { shipments: true },
  });
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Orders</h1>
      <ul className="mt-8 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded-lg border border-[var(--velora-line)] bg-white/50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="font-medium">{o.orderNumber}</span>
              <span>{formatINR(toNumber(o.total))}</span>
            </div>
            <p className="mt-1 text-[var(--velora-muted)]">{o.status} · {o.shipments[0]?.awb || "No AWB yet"}</p>
          </li>
        ))}
        {!orders.length && <p className="text-[var(--velora-muted)]">No orders yet.</p>}
      </ul>
    </div>
  );
}
