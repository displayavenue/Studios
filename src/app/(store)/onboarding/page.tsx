"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Welcome", "Business Information", "Revenue Goal", "Product Categories", "Pricing Rules",
  "Supplier Connection", "Razorpay", "Shiprocket", "Meta", "Google", "Analytics", "AI",
  "Branding", "Store Review", "Launch",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [revenue, setRevenue] = useState(100000);
  const [contribution, setContribution] = useState(10000);

  return (
    <div className="container-velora max-w-2xl py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--velora-accent)]">Onboarding · Step {step + 1}/15</p>
      <h1 className="mt-3 font-display text-4xl">{STEPS[step]}</h1>
      {step === 0 && <p className="mt-4 text-[var(--velora-muted)]">Welcome to VELORA on jyotishkundali.com — an AI-powered ecommerce operating system.</p>}
      {step === 2 && (
        <div className="mt-6 space-y-4 text-sm">
          <label className="block">Daily revenue target (₹)
            <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="mt-1 h-11 w-full rounded-md border border-[var(--velora-line)] px-3" />
          </label>
          <label className="block">Daily minimum contribution (₹)
            <input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} className="mt-1 h-11 w-full rounded-md border border-[var(--velora-line)] px-3" />
          </label>
          <p className="text-xs text-[var(--velora-muted)]">Defaults ₹1,00,000 / ₹10,000 — objectives only, not guarantees.</p>
        </div>
      )}
      {step === 4 && (
        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-[var(--velora-muted)]">
          <li>Min selling price ₹1,500</li>
          <li>Max selling price ₹10,000</li>
          <li>Min contribution ₹500 · Preferred ₹1,000+</li>
          <li>Min margin 35%</li>
        </ul>
      )}
      {step === 13 && (
        <ul className="mt-6 space-y-2 text-sm">
          {["Logo","Domain","Products (≥10 approved)","Supplier","Payment","Shipping","Policies","Analytics"].map((i) => (
            <li key={i} className="flex justify-between border-b border-[var(--velora-line)] py-2">
              <span>{i}</span><span className="text-amber-700">ACTION REQUIRED</span>
            </li>
          ))}
        </ul>
      )}
      {step === 14 && (
        <p className="mt-4 text-sm text-[var(--velora-muted)]">
          Launch blocked until critical requirements are complete. DO NOT LAUNCH with missing payment, shipping, or products.
        </p>
      )}
      <div className="mt-10 flex gap-3">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
        <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
          {step === STEPS.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
