"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [step, setStep] = useState(1);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          phone: fd.get("phone"),
          paymentMethod,
          idempotencyKey: `chk_${Date.now()}`,
          address: {
            name: fd.get("name"),
            line1: fd.get("line1"),
            line2: fd.get("line2") || undefined,
            city: fd.get("city"),
            state: fd.get("state"),
            pincode: fd.get("pincode"),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }

      if (paymentMethod === "RAZORPAY" && data.razorpay) {
        // Mock payment confirmation in development
        if (data.razorpay.mock) {
          const confirm = await fetch("/api/payments/razorpay/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.order.id,
              razorpayOrderId: data.razorpay.id,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              signature: "mock_ok",
            }),
          });
          if (!confirm.ok) {
            setError("Payment confirmation failed");
            return;
          }
        }
      }

      router.push(`/order-confirmation/${data.order.orderNumber}`);
    });
  };

  return (
    <div className="container-velora max-w-2xl py-10">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-[var(--velora-muted)]">
        Fast mobile-first checkout — only the fields we need.
      </p>

      <div className="mt-6 flex gap-2 text-xs uppercase tracking-wider text-[var(--velora-muted)]">
        {["Customer", "Address", "Shipping", "Payment"].map((s, i) => (
          <span key={s} className={step === i + 1 ? "text-[var(--velora-accent)]" : ""}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <section className="space-y-3">
          <h2 className="font-display text-xl">Customer</h2>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required className="mt-1" />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Address</h2>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="line1">Address line 1</Label>
            <Input id="line1" name="line1" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="line2">Address line 2</Label>
            <Input id="line2" name="line2" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="pincode">PIN code</Label>
            <Input
              id="pincode"
              name="pincode"
              required
              pattern="\d{6}"
              className="mt-1"
              onFocus={() => setStep(3)}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Payment</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("RAZORPAY");
                setStep(4);
              }}
              className={`flex-1 rounded-md border px-4 py-3 text-sm ${
                paymentMethod === "RAZORPAY"
                  ? "border-[var(--velora-accent)] bg-[var(--velora-accent)]/10"
                  : "border-[var(--velora-line)]"
              }`}
            >
              Razorpay (UPI / Card)
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("COD");
                setStep(4);
              }}
              className={`flex-1 rounded-md border px-4 py-3 text-sm ${
                paymentMethod === "COD"
                  ? "border-[var(--velora-accent)] bg-[var(--velora-accent)]/10"
                  : "border-[var(--velora-line)]"
              }`}
            >
              Cash on Delivery
            </button>
          </div>
          <p className="text-xs text-[var(--velora-muted)]">
            {paymentMethod === "RAZORPAY"
              ? "In development without Razorpay keys, payment is simulated with a clearly labeled mock."
              : "COD available only for eligible PIN codes. Fee may apply."}
          </p>
        </section>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Placing order…" : "Place Order"}
        </Button>
      </form>
    </div>
  );
}
