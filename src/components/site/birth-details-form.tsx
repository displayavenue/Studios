"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { openRazorpayCheckout } from "@/lib/razorpay-client";
import { useI18n } from "@/components/site/i18n";

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
  needsPartner?: boolean;
  onSubmit?: (details: BirthDetails, partner?: BirthDetails) => void;
};

type ProfileProps = {
  mode: "profile";
  productSlug?: never;
  productName?: never;
  price?: never;
  needsPartner?: never;
  onSubmit?: (details: BirthDetails) => void;
};

type Props = CheckoutProps | ProfileProps;

function readPerson(fd: FormData, prefix: "" | "partner", unknownTime: boolean): BirthDetails {
  const p = prefix ? `${prefix}` : "";
  const nameKey = prefix ? `${prefix}Name` : "name";
  const genderKey = prefix ? `${prefix}Gender` : "gender";
  const dobKey = prefix ? `${prefix}Dob` : "dob";
  const timeKey = prefix ? `${prefix}BirthTime` : "birthTime";
  const placeKey = prefix ? `${prefix}PlaceName` : "placeName";
  void p;
  return {
    name: String(fd.get(nameKey) || ""),
    gender: String(fd.get(genderKey) || ""),
    dob: String(fd.get(dobKey) || ""),
    birthTime: unknownTime ? "" : String(fd.get(timeKey) || ""),
    placeName: String(fd.get(placeKey) || ""),
    birthTimeUnknown: unknownTime,
  };
}

function PersonFields({
  prefix,
  title,
  unknownTime,
  setUnknownTime,
  field,
  required,
}: {
  prefix: "" | "partner";
  title: string;
  unknownTime: boolean;
  setUnknownTime: (v: boolean) => void;
  field: string;
  required: boolean;
}) {
  const id = (base: string) => (prefix ? `${prefix}${base[0].toUpperCase()}${base.slice(1)}` : base);
  const nameAttr = (base: string) => {
    if (!prefix) return base;
    const map: Record<string, string> = {
      name: "partnerName",
      gender: "partnerGender",
      dob: "partnerDob",
      birthTime: "partnerBirthTime",
      placeName: "partnerPlaceName",
    };
    return map[base] || base;
  };

  return (
    <fieldset className="space-y-4 rounded-xl border border-[var(--jk-line)]/80 bg-[#fafbfc] p-4">
      <legend className="px-1 font-display text-base font-semibold text-[var(--jk-ink)]">{title}</legend>
      <div>
        <Label htmlFor={id("name")}>Full name</Label>
        <Input id={id("name")} name={nameAttr("name")} required={required} className={field} placeholder="As on birth records" />
      </div>
      <div>
        <Label htmlFor={id("gender")}>Gender (optional)</Label>
        <select id={id("gender")} name={nameAttr("gender")} className={field} defaultValue="">
          <option value="">Prefer not to say</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={id("dob")}>Date of birth</Label>
          <Input id={id("dob")} name={nameAttr("dob")} type="date" required={required} className={field} />
        </div>
        <div>
          <Label htmlFor={id("birthTime")}>Time of birth</Label>
          <Input
            id={id("birthTime")}
            name={nameAttr("birthTime")}
            type="time"
            disabled={unknownTime}
            className={field}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-[var(--jk-muted)]">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
              className="rounded border-[var(--jk-line)]"
            />
            Exact birth time unknown
          </label>
        </div>
      </div>
      <div>
        <Label htmlFor={id("placeName")}>Place of birth</Label>
        <Input
          id={id("placeName")}
          name={nameAttr("placeName")}
          required={required}
          className={field}
          placeholder="City, State, Country"
        />
      </div>
    </fieldset>
  );
}

export function BirthDetailsForm(props: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const mode = props.mode ?? "checkout";
  const needsPartner = mode === "checkout" ? Boolean((props as CheckoutProps).needsPartner) : false;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [unknownTime, setUnknownTime] = useState(false);
  const [partnerUnknownTime, setPartnerUnknownTime] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const details = readPerson(fd, "", unknownTime);
    const partnerDetails = needsPartner ? readPerson(fd, "partner", partnerUnknownTime) : undefined;
    const guestEmail = String(fd.get("guestEmail") || "");

    try {
      if (mode === "profile") {
        const res = await fetch("/api/profile/birth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(details),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login?next=/dashboard/profile");
            return;
          }
          throw new Error(data.error || "Could not save");
        }
        props.onSubmit?.(details);
        setSaved(true);
        return;
      }

      const { productSlug, productName, price, onSubmit } = props as CheckoutProps;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          birthDetails: details,
          partnerBirthDetails: partnerDetails,
          guestEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Checkout failed");

      onSubmit?.(details, partnerDetails);
      const order = data.order as { id: string; orderNumber: string };
      const razorpay = data.razorpay as {
        id: string;
        amount: number;
        currency: string;
        keyId: string;
        mock?: boolean;
      };

      if (razorpay.mock) {
        const confirm = await fetch("/api/payments/razorpay/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            razorpayOrderId: razorpay.id,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            signature: "mock_ok",
            createSession: true,
          }),
        });
        const confirmData = await confirm.json();
        if (!confirm.ok) throw new Error(confirmData.error || "Mock payment failed");
        window.location.href = confirmData.redirectTo || `/checkout/success?order=${order.orderNumber}`;
        return;
      }

      const keyId = razorpay.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
      if (!keyId) throw new Error("Razorpay key missing");

      const payment = await openRazorpayCheckout({
        keyId,
        orderId: razorpay.id,
        amountPaise: razorpay.amount,
        currency: razorpay.currency,
        name: details.name,
        description: `${productName} — ₹${price}`,
        prefillName: details.name,
        prefillEmail: guestEmail || data.user?.email,
      });

      const confirm = await fetch("/api/payments/razorpay/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          signature: payment.razorpay_signature,
          createSession: true,
        }),
      });
      const confirmData = await confirm.json();
      if (!confirm.ok) throw new Error(confirmData.error || "Payment verification failed");
      window.location.href = confirmData.redirectTo || `/checkout/success?order=${order.orderNumber}`;
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
      id={isCheckout ? "jk-checkout-form" : undefined}
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
              Guest checkout supported. Enter birth details for{" "}
              <span className="font-medium text-[var(--jk-ink)]">{productName}</span>
              {needsPartner ? " — both partners required for Ashtakoota matching." : "."}
            </>
          ) : (
            "Used for Kundali generation and personalized guidance."
          )}
        </p>
      </div>

      <div className="space-y-4">
        {isCheckout && (
          <div>
            <Label htmlFor="guestEmail">Email (for receipt & account)</Label>
            <Input id="guestEmail" name="guestEmail" type="email" required className={field} placeholder="you@email.com" />
          </div>
        )}

        {isCheckout && needsPartner ? (
          <>
            <PersonFields
              prefix=""
              title="Person A"
              unknownTime={unknownTime}
              setUnknownTime={setUnknownTime}
              field={field}
              required
            />
            <PersonFields
              prefix="partner"
              title="Person B (partner)"
              unknownTime={partnerUnknownTime}
              setUnknownTime={setPartnerUnknownTime}
              field={field}
              required
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <p className="mt-5 rounded-xl border border-[var(--jk-gold)]/25 bg-[var(--jk-gold)]/5 px-3 py-2.5 text-xs leading-relaxed text-[var(--jk-muted)]">
        Secure Razorpay checkout. Interpretive astrology for reflection — not medical, legal, or financial advice.
        {needsPartner ? " Matching scores are traditional conversation tools, not marriage verdicts." : ""}
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-sm text-emerald-700">Birth details saved to your profile.</p>}

      <button
        type="submit"
        disabled={pending}
        className="gold-btn mt-5 flex h-12 w-full items-center justify-center gap-2 text-sm disabled:opacity-60"
      >
        {pending ? "Opening payment…" : isCheckout ? `${t("paySecurely")} — ₹${price}` : "Save details"}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
