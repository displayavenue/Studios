"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input, Label } from "@/components/ui/input";

export type BirthDetails = {
  name: string;
  gender: string;
  dob: string;
  birthTime: string;
  placeName: string;
  birthTimeUnknown: boolean;
};

type CheckoutProps = {
  mode?: "checkout";
  productSlug: string;
  productName: string;
  price: number;
  onSubmit?: (details: BirthDetails) => void;
};

type ProfileProps = {
  mode: "profile";
  productSlug?: never;
  productName?: never;
  price?: never;
  onSubmit?: (details: BirthDetails) => void;
};

type Props = CheckoutProps | ProfileProps;

export function BirthDetailsForm(props: Props) {
  const mode = props.mode ?? "checkout";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [unknownTime, setUnknownTime] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const details: BirthDetails = {
      name: String(fd.get("name")),
      gender: String(fd.get("gender")),
      dob: String(fd.get("dob")),
      birthTime: unknownTime ? "" : String(fd.get("birthTime") || ""),
      placeName: String(fd.get("placeName")),
      birthTimeUnknown: unknownTime,
    };

    try {
      if (mode === "profile") {
        props.onSubmit?.(details);
        setSaved(true);
        return;
      }

      const { productSlug, onSubmit } = props as CheckoutProps;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, birthDetails: details }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      onSubmit?.(details);

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.order) {
        window.location.href = `/dashboard?order=${data.order.orderNumber}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  const field =
    "mt-1.5 flex h-11 w-full rounded-xl border border-[var(--jk-line)] bg-[#f8f9fb] px-3 text-sm outline-none transition focus:border-[var(--jk-gold)] focus:bg-white";

  const isCheckout = mode === "checkout";
  const price = isCheckout ? (props as CheckoutProps).price : 0;
  const productName = isCheckout ? (props as CheckoutProps).productName : "";

  return (
    <form
      onSubmit={handleSubmit}
      className={isCheckout ? "rounded-2xl border border-[var(--jk-line)] bg-white p-5 shadow-md sm:p-6" : "space-y-0"}
    >
      <div className="mb-5 border-b border-[var(--jk-line)] pb-4">
        <h2 className="font-display text-xl font-semibold">
          {isCheckout ? `Get My Report — ₹${price}` : "Save birth details"}
        </h2>
        <p className="mt-1 text-sm text-[var(--jk-muted)]">
          {isCheckout ? (
            <>
              Enter birth details for <span className="font-medium text-[var(--jk-ink)]">{productName}</span>
            </>
          ) : (
            "Used for Kundali generation and personalized guidance."
          )}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required className={field} placeholder="As on birth records" />
        </div>

        <div>
          <Label htmlFor="gender">Gender (optional)</Label>
          <select id="gender" name="gender" className={field} defaultValue="">
            <option value="">Prefer not to say</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" name="dob" type="date" required className={field} />
          </div>
          <div>
            <Label htmlFor="birthTime">Time of birth</Label>
            <Input id="birthTime" name="birthTime" type="time" disabled={unknownTime} className={field} />
            <label className="mt-2 flex items-center gap-2 text-sm text-[var(--jk-muted)]">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="rounded border-[var(--jk-line)]"
              />
              I don&apos;t know my exact birth time
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="placeName">Place of birth</Label>
          <Input id="placeName" name="placeName" required className={field} placeholder="City, State, Country" />
        </div>
      </div>

      <p className="mt-5 rounded-xl border border-[var(--jk-gold)]/25 bg-[var(--jk-gold)]/5 px-3 py-2.5 text-xs leading-relaxed text-[var(--jk-muted)]">
        Interpretive astrology for reflection and entertainment — not medical, legal, or financial advice.
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-sm text-emerald-700">Birth details captured for your profile.</p>}

      <button
        type="submit"
        disabled={pending}
        className="gold-btn mt-5 flex h-12 w-full items-center justify-center gap-2 text-sm disabled:opacity-60"
      >
        {pending ? "Processing…" : isCheckout ? `Get My Report — ₹${price}` : "Save details"}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
