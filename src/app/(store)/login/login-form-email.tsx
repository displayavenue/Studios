"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BRAND } from "@/config/site";
import { useAuthModal } from "@/components/site/auth-provider";

export default function EmailLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const { openAuth, closeAuth } = useAuthModal();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const field =
    "mt-1.5 flex h-11 w-full rounded-xl border border-[var(--jk-line)] bg-[#f8f9fb] px-3 text-sm outline-none focus:border-[var(--at-yellow)] focus:bg-white";

  useEffect(() => {
    closeAuth();
  }, [closeAuth]);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-[var(--jk-line)] bg-white p-6 shadow-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--at-yellow-ink)]">{BRAND.name}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Email sign in</h1>
        <p className="mt-2 text-sm text-[var(--jk-muted)]">Admin and demo accounts can use email & password.</p>
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
              router.push(next);
              router.refresh();
            });
          }}
        >
          <label className="block text-sm">
            Email
            <input name="email" type="email" required className={field} />
          </label>
          <label className="block text-sm">
            Password
            <input name="password" type="password" required className={field} />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={pending} className="at-cta flex h-11 w-full items-center justify-center text-sm disabled:opacity-60">
            {pending ? "Signing in…" : "Sign in with email"}
          </button>
        </form>
        <div className="mt-4 flex flex-col gap-2 text-center text-sm">
          <button type="button" onClick={() => openAuth({ next })} className="font-semibold text-[var(--at-yellow-ink)]">
            Sign in with phone OTP →
          </button>
          <Link href="/signup" className="text-[var(--jk-muted)] hover:text-[var(--jk-ink)]">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
