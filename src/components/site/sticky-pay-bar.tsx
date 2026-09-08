"use client";

import { formatINR } from "@/lib/utils";

export function StickyPayBar({ price }: { price: number }) {
  return (
    <div className="fixed inset-x-0 bottom-[3.4rem] z-30 border-t border-[var(--jk-line)] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--jk-muted)]">Secure Razorpay</p>
          <p className="font-semibold">{formatINR(price)}</p>
        </div>
        <a href="#jk-checkout-form" className="gold-btn inline-flex h-11 items-center px-5 text-sm">
          Continue to pay
        </a>
      </div>
    </div>
  );
}
