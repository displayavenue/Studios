"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthModal } from "@/components/site/auth-provider";

export default function SignupForm() {
  const { openAuth } = useAuthModal();
  useEffect(() => {
    openAuth({ next: "/dashboard" });
  }, [openAuth]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--jk-line)] bg-white p-8 text-center">
      <p className="text-sm text-[var(--jk-muted)]">New users sign up with phone OTP — same as Sign In.</p>
      <button type="button" onClick={() => openAuth({ next: "/dashboard" })} className="at-cta mt-4 inline-flex h-11 items-center px-6 text-sm">
        Continue with phone
      </button>
      <p className="mt-4 text-xs text-[var(--jk-muted)]">
        Admin email signup still available via{" "}
        <Link href="/login/email" className="font-semibold text-[var(--at-yellow-ink)]">
          email sign in
        </Link>
        .
      </p>
    </div>
  );
}
