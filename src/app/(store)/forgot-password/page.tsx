"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <PageHero eyebrow="Account" title="Forgot password" subtitle="We’ll email a secure reset link if the account exists." />
      <SectionShell muted>
        <Surface className="mx-auto max-w-md">
          {done ? (
            <p className="text-sm text-[var(--jk-muted)]">
              If an account exists for that email, a reset link is on the way. Check spam too.{" "}
              <Link href="/login" className="underline">
                Back to login
              </Link>
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setPending(true);
                setError(null);
                const fd = new FormData(e.currentTarget);
                try {
                  const res = await fetch("/api/auth/password-reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: fd.get("email") }),
                  });
                  if (!res.ok) throw new Error("Request failed");
                  setDone(true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed");
                } finally {
                  setPending(false);
                }
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="h-11 w-full rounded-xl border px-3 text-sm"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={pending} className="gold-btn h-11 w-full text-sm disabled:opacity-60">
                {pending ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
        </Surface>
      </SectionShell>
    </div>
  );
}
