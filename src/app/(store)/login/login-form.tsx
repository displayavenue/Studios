"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthModal } from "@/components/site/auth-provider";

/** Opens the AstroTalk-style auth modal; keeps /login as a deep-link entry. */
export default function LoginForm() {
  const { openAuth } = useAuthModal();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    openAuth({ next });
  }, [openAuth, next]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--jk-line)] bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-[var(--jk-muted)]">Opening sign-in…</p>
      <button type="button" onClick={() => openAuth({ next })} className="at-cta mt-4 inline-flex h-11 items-center px-6 text-sm">
        Open Sign In
      </button>
      <p className="mt-4 text-xs text-[var(--jk-muted)]">
        Prefer email?{" "}
        <Link href="/login/email" className="font-semibold text-[var(--at-yellow-ink)]">
          Use email & password
        </Link>
      </p>
    </div>
  );
}
