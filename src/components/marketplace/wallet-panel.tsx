"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { openRazorpayCheckout } from "@/lib/razorpay-client";

const PACKS = [100, 200, 500, 1000, 2000, 5000];

type Tx = {
  id: string;
  type: string;
  amountInr: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
};

export function WalletPanel() {
  const [balance, setBalance] = useState<number | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function load() {
    setError(null);
    const res = await fetch("/api/wallet");
    if (res.status === 401) {
      window.location.href = "/login?next=/wallet";
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not load wallet");
      return;
    }
    setBalance(data.balanceInr);
    setTxs(data.transactions || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function recharge(amountInr: number) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/wallet/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/wallet";
        return;
      }
      if (!res.ok) throw new Error(data.message || data.error || "Recharge failed");

      const rz = data.razorpay as {
        id: string;
        amount: number;
        currency: string;
        keyId: string;
        mock?: boolean;
      };

      if (rz.mock) {
        const confirm = await fetch("/api/wallet/recharge", {
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
        setBalance(confirmData.balanceInr);
        await load();
        return;
      }

      const payment = await openRazorpayCheckout({
        keyId: rz.keyId,
        orderId: rz.id,
        amountPaise: rz.amount,
        currency: rz.currency,
        name: "Wallet",
        description: `Recharge ₹${amountInr}`,
      });
      const confirm = await fetch("/api/wallet/recharge", {
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
      setBalance(confirmData.balanceInr);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Recharge failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="at-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Balance</p>
        <p className="mt-2 text-4xl font-bold">₹{balance == null ? "…" : balance.toFixed(0)}</p>
        <p className="mt-2 text-sm text-[var(--jk-muted)]">
          First {3} consult minutes are free per session; then ₹/min is deducted from this wallet.
        </p>
        <p className="mt-4 text-sm font-semibold">Quick recharge</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PACKS.map((p) => (
            <button
              key={p}
              type="button"
              disabled={pending}
              onClick={() => recharge(p)}
              className="rounded-full border border-[var(--jk-line)] px-4 py-2 text-sm font-semibold hover:border-[var(--at-yellow)] hover:bg-[var(--at-yellow)]/20 disabled:opacity-50"
            >
              ₹{p}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Link href="/chat-with-astrologer" className="at-cta mt-6 inline-flex h-11 items-center px-5 text-sm">
          Talk to astrologer →
        </Link>
      </div>
      <div className="at-card p-6">
        <h2 className="text-lg font-bold">Recent transactions</h2>
        <ul className="mt-4 divide-y divide-[var(--jk-line)]">
          {txs.length === 0 && <li className="py-4 text-sm text-[var(--jk-muted)]">No transactions yet.</li>}
          {txs.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium">{t.reason}</p>
                <p className="text-xs text-[var(--jk-muted)]">{new Date(t.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <p className={`font-semibold ${t.type === "CREDIT" ? "text-emerald-600" : "text-[var(--jk-ink)]"}`}>
                {t.type === "CREDIT" ? "+" : "−"}₹{t.amountInr}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
