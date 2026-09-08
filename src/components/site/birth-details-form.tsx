"use client";

import { useState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type BirthDetails = {
  name: string;
  gender: string;
  dob: string;
  birthTime: string;
  placeName: string;
  birthTimeUnknown: boolean;
};

type Props = {
  productSlug: string;
  productName: string;
  price: number;
  onSubmit?: (details: BirthDetails) => void;
};

export function BirthDetailsForm({ productSlug, productName, price, onSubmit }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unknownTime, setUnknownTime] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
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
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          birthDetails: details,
        }),
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

  return (
    <form onSubmit={handleSubmit} className="site-section space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold">Your birth details</h2>
        <p className="mt-1 text-sm text-[var(--jk-muted)]">
          Required to generate your {productName} report.
        </p>
      </div>

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required className="mt-1" placeholder="As on birth certificate" />
      </div>

      <div>
        <Label htmlFor="gender">Gender</Label>
        <select
          id="gender"
          name="gender"
          required
          className="mt-1 flex h-11 w-full rounded-md border border-[var(--jk-line)] bg-white px-3 text-sm"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" name="dob" type="date" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="birthTime">Time of birth</Label>
          <Input
            id="birthTime"
            name="birthTime"
            type="time"
            disabled={unknownTime}
            className="mt-1"
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-[var(--jk-muted)]">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
            />
            Birth time unknown
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="placeName">Place of birth</Label>
        <Input id="placeName" name="placeName" required className="mt-1" placeholder="City, State, India" />
      </div>

      <p className="disclaimer-strip">
        Reports use interpretive astrology for reflection and entertainment. Demo mode may use mock chart data.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-[var(--jk-gold)] text-[var(--jk-navy)] hover:bg-[var(--jk-gold-soft)]"
        size="lg"
      >
        {pending ? "Processing…" : `Get Report — ₹${price}`}
      </Button>
    </form>
  );
}
