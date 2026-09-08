"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Surface className="mx-auto max-w-md">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError(null);
          const fd = new FormData(e.currentTarget);
          try {
            const res = await fetch("/api/auth/password-reset", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, password: fd.get("password") }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Reset failed");
            router.push("/login");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          } finally {
            setPending(false);
          }
        }}
      >
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="New password (min 8 chars)"
          className="h-11 w-full rounded-xl border px-3 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={pending || !token} className="gold-btn h-11 w-full text-sm disabled:opacity-60">
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </Surface>
  );
}

export default function ResetPasswordPage() {
  return (
    <div>
      <PageHero eyebrow="Account" title="Reset password" subtitle="Choose a new password for your JyotishKundali account." />
      <SectionShell muted>
        <Suspense fallback={<p className="text-center text-sm text-[var(--jk-muted)]">Loading…</p>}>
          <ResetForm />
        </Suspense>
      </SectionShell>
    </div>
  );
}
