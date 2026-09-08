"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { BRAND } from "@/config/site";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const field =
    "mt-1.5 flex h-11 w-full rounded-xl border border-[var(--jk-line)] bg-[#f8f9fb] px-3 text-sm outline-none focus:border-[var(--jk-gold)] focus:bg-white";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-gold-dark)]">{BRAND.name}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Create your account</h1>
        {plan === "membership" && (
          <p className="mt-2 text-sm text-[var(--jk-gold-dark)]">
            Membership signup — ₹2,999/year after account creation.
          </p>
        )}
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: fd.get("email"),
                  password: fd.get("password"),
                  firstName: fd.get("firstName"),
                  lastName: fd.get("lastName"),
                }),
              });
              const data = await res.json();
              if (!res.ok) {
                setError(data.error || "Signup failed");
                return;
              }
              router.push(plan === "membership" ? "/membership" : "/dashboard");
              router.refresh();
            });
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" className={field} />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" className={field} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className={field} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} className={field} />
          </div>
          <p className="text-xs text-[var(--jk-muted)]">
            By creating an account you agree to our interpretive content disclaimer and terms of service.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="gold-btn flex h-11 w-full items-center justify-center text-sm" disabled={pending}>
            {pending ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--jk-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--jk-gold-dark)] underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
