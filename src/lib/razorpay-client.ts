"use client";

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, cb: (resp: unknown) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export async function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.Razorpay) return;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-razorpay]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(input: {
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency?: string;
  name: string;
  description: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
}): Promise<RazorpaySuccess> {
  await loadRazorpayCheckout();
  if (!window.Razorpay) throw new Error("Razorpay Checkout unavailable");

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: input.keyId,
      amount: input.amountPaise,
      currency: input.currency || "INR",
      name: "JyotishKundali",
      description: input.description,
      order_id: input.orderId,
      theme: { color: "#f5c542" },
      prefill: {
        name: input.prefillName || "",
        email: input.prefillEmail || "",
        contact: input.prefillContact || "",
      },
      handler: (response: RazorpaySuccess) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });

    rzp.on("payment.failed", (resp: unknown) => {
      const message =
        typeof resp === "object" && resp && "error" in resp
          ? String((resp as { error?: { description?: string } }).error?.description || "Payment failed")
          : "Payment failed";
      reject(new Error(message));
    });

    rzp.open();
  });
}
