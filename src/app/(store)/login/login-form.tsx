"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthSheet } from "@/components/site/auth-sheet";

/** Dedicated AstroTalk-style dark OTP login page (stable, no modal race). */
export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  return (
    <div className="space-y-4">
      <AuthSheet variant="page" nextPath={next} showClose={false} />
      <p className="text-center text-xs text-white/40">
        Admin accounts:{" "}
        <Link href={`/login/email?next=${encodeURIComponent(next)}`} className="text-[var(--at-auth-gold)] underline-offset-2 hover:underline">
          Email & password
        </Link>
      </p>
    </div>
  );
}
