"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="container-velora flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <h1 className="font-display text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-[var(--velora-muted)]">
        Local auth for development. Supabase Auth activates when credentials are configured.
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
            router.push(data.role === "CUSTOMER" ? "/account" : "/admin");
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
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--velora-muted)]">
        No account?{" "}
        <Link href="/signup" className="text-[var(--velora-accent)] underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
