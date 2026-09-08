"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/site";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="container-jk flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <p className="text-sm text-[var(--jk-purple)]">{BRAND.name}</p>
      <h1 className="font-display text-4xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-[var(--jk-muted)]">
        Sign in to access your reports, horoscope, and AI assistant.
      </p>
      <form
        className="mt-8 space-y-4"
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
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="mt-1" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full bg-[var(--jk-gold)] text-[var(--jk-navy)]" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--jk-muted)]">
        New to {BRAND.name}?{" "}
        <Link href="/signup" className="text-[var(--jk-purple)] underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
