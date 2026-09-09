"use client";

import { useState } from "react";
import Link from "next/link";
import { openRazorpayCheckout } from "@/lib/razorpay-client";
import type { MallItem } from "@/content/astromall";

export function MallBuyBox({ item }: { item: MallItem }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function buy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setDone(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: item.slug,
          shippingName: fd.get("shippingName"),
          shippingPhone: fd.get("shippingPhone"),
          shippingAddress: fd.get("shippingAddress"),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = `/login?next=/shop/${item.slug}`;
        return;
      }
      if (!res.ok) throw new Error(data.message || data.error || "Checkout failed");

      const rz = data.razorpay as {
        id: string;
        amount: number;
        currency: string;
        keyId: string;
        mock?: boolean;
      };

      if (rz.mock) {
        const confirm = await fetch("/api/shop/checkout", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: rz.id,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            signature: "mock_ok",
          }),
        });
        const confirmData = await confirm.json();
        if (!confirm.ok) throw new Error(confirmData.error || "Confirm failed");
        setDone(confirmData.orderNumber);
        return;
      }

      const payment = await openRazorpayCheckout({
        keyId: rz.keyId,
        orderId: rz.id,
        amountPaise: rz.amount,
        currency: rz.currency,
        name: item.name,
        description: `AstroMall · ₹${item.priceInr}`,
      });
      const confirm = await fetch("/api/shop/checkout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          signature: payment.razorpay_signature,
        }),
      });
      const confirmData = await confirm.json();
      if (!confirm.ok) throw new Error(confirmData.error || "Confirm failed");
      setDone(confirmData.orderNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setPending(false);
    }
  }

  const field =
    "mt-1.5 flex h-11 w-full rounded-xl border border-[var(--jk-line)] bg-white px-3 text-sm outline-none focus:border-[var(--at-yellow)]";

  if (done) {
    return (
      <div className="at-card p-5 text-center">
        <p className="text-lg font-bold text-emerald-700">Order confirmed</p>
        <p className="mt-2 text-sm text-[var(--jk-muted)]">Order {done}. We will email fulfilment updates.</p>
        <Link href="/shop" className="at-cta mt-4 inline-flex h-10 items-center px-4 text-sm">
          Back to mall
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={buy} className="at-card space-y-3 p-5">
      <p className="text-2xl font-bold">₹{item.priceInr.toLocaleString("en-IN")}</p>
      <p className="text-xs text-[var(--jk-muted)]">Secure Razorpay · Digital + shipped items as listed</p>
      <div>
        <label className="text-sm font-medium" htmlFor="shippingName">
          Full name
        </label>
        <input id="shippingName" name="shippingName" required className={field} />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="shippingPhone">
          Phone
        </label>
        <input id="shippingPhone" name="shippingPhone" required className={field} />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="shippingAddress">
          Shipping address
        </label>
        <textarea id="shippingAddress" name="shippingAddress" required rows={3} className={`${field} h-auto py-2`} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="at-cta flex h-12 w-full items-center justify-center text-sm disabled:opacity-60">
        {pending ? "Opening payment…" : `Buy now — ₹${item.priceInr}`}
      </button>
    </form>
  );
}
