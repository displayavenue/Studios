"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { BRAND } from "@/config/site";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const field =
    "mt-1.5 flex h-11 w-full rounded-xl border border-[var(--jk-line)] bg-[#f8f9fb] px-3 text-sm outline-none focus:border-[var(--jk-gold)] focus:bg-white";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-gold-dark)]">{BRAND.name}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-[var(--jk-muted)]">
          Sign in to access your reports, horoscope, and AI assistant.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: fd.get("email"),
                  password: fd.get("password"),
                }),
              });
              const data = await res.json();
              if (!res.ok) {
                setError(data.error || "Login failed");
                return;
              }
              const dest = data.role === "CUSTOMER" || data.role === "EXPERT" ? next : "/admin";
              router.push(dest);
              router.refresh();
            });
          }}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className={field} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className={field} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="gold-btn flex h-11 w-full items-center justify-center text-sm" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--jk-muted)]">
          New to {BRAND.name}?{" "}
          <Link href="/signup" className="font-medium text-[var(--jk-gold-dark)] underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
