import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOrderByNumber } from "@/services/order/service";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";
import { OrderTimeline } from "@/components/site/order-timeline";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const session = await getSession();
  const order = await getOrderByNumber(orderNumber, session?.id);
  if (!order) notFound();

  const ready = order.status === "REPORT_READY";
  const report = order.reports[0];

  return (
    <div>
      <PageHero
        eyebrow="Checkout"
        title={ready ? "Your report is ready" : "Payment received"}
        subtitle={
          ready
            ? "Download your interpretive PDF from the dashboard."
            : "We’re generating your report now. This usually completes within a minute."
        }
      />
      <SectionShell muted>
        <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-2">
          <Surface>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--jk-gold-dark)]">Order</p>
            <p className="mt-2 font-display text-2xl text-[var(--jk-navy)]">{order.orderNumber}</p>
            <p className="mt-2 text-sm text-[var(--jk-muted)]">
              {order.items[0]?.product.name} · ₹{Number(order.total)}
            </p>
            <div className="mt-6">
              <OrderTimeline status={order.status} />
            </div>
          </Surface>
          <Surface>
            <h2 className="font-display text-xl font-semibold">Next steps</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--jk-muted)]">
              <li>A confirmation email was sent to {order.user.email}.</li>
              <li>When generation finishes, download the PDF from My Reports.</li>
              <li>Guidance is interpretive and for personal reflection only.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {ready && report ? (
                <GoldCtaLink href={`/api/reports/${report.id}/pdf`}>Download PDF</GoldCtaLink>
              ) : (
                <GoldCtaLink href="/dashboard/reports">Open My Reports</GoldCtaLink>
              )}
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center rounded-full border border-[var(--jk-line)] px-6 text-sm font-semibold"
              >
                Dashboard
              </Link>
            </div>
            {!ready && (
              <p className="mt-4 text-xs text-[var(--jk-muted)]">
                This page refreshes as status changes —{" "}
                <Link href={`/checkout/success?order=${order.orderNumber}`} className="underline">
                  refresh now
                </Link>
                .
              </p>
            )}
          </Surface>
        </div>
      </SectionShell>
    </div>
  );
}
