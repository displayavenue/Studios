"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { BRAND } from "@/config/site";
import { useAuthModal } from "@/components/site/auth-provider";

type Step = "phone" | "otp";

export function AuthModal() {
  const { open, closeAuth, nextPath } = useAuthModal();
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setCode("");
      setError(null);
      setHint(null);
      setPending(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAuth]);

  if (!open) return null;

  async function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setPending(true);
    setError(null);
    setHint(null);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode: "+91" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to send OTP");
      setStep("otp");
      if (data.debugCode) setHint(`Demo OTP: ${data.debugCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  async function verifyOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Invalid OTP");
      closeAuth();
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "OAuth failed");
      closeAuth();
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="at-auth-overlay" role="dialog" aria-modal="true" aria-label="Sign in">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={closeAuth} />
      <div className="at-auth-modal relative z-10">
        <button
          type="button"
          onClick={closeAuth}
          className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Close sign in"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-2">
          <div className="at-auth-logo" aria-hidden>
            <span>✦</span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">Sign In</h2>
          <p className="mt-2 text-sm text-white/55">
            {step === "phone" ? "Enter your phone number to continue" : `Enter OTP sent to +91 ${phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendOtp} className="mt-7 space-y-4">
            <div className="flex gap-2">
              <div className="at-auth-input flex w-[6.5rem] shrink-0 items-center justify-center gap-1.5 px-2 text-sm text-white">
                <span aria-hidden>🇮🇳</span>
                <span>+91</span>
                <span className="text-white/40">▾</span>
              </div>
              <input
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="at-auth-input flex-1 px-4 text-sm text-white placeholder:text-white/35"
                required
              />
            </div>
            <button type="submit" disabled={pending || phone.length < 10} className="at-auth-cta">
              {pending ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-7 space-y-4">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="at-auth-input w-full px-4 text-center text-lg tracking-[0.35em] text-white placeholder:tracking-normal placeholder:text-white/35"
              required
            />
            <button type="submit" disabled={pending || code.length < 4} className="at-auth-cta">
              {pending ? "Verifying…" : "Verify OTP"}
            </button>
            <button
              type="button"
              className="w-full text-center text-xs text-white/50 hover:text-white/80"
              onClick={() => {
                setStep("phone");
                setCode("");
                setHint(null);
              }}
            >
              Change phone number
            </button>
          </form>
        )}

        <div className="at-auth-or my-6">
          <span>OR</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" disabled={pending} onClick={() => oauth("google")} className="at-auth-social">
            <GoogleMark />
            Google
          </button>
          <button type="button" disabled={pending} onClick={() => oauth("apple")} className="at-auth-social">
            <AppleMark />
            Apple
          </button>
        </div>

        {hint && <p className="mt-4 text-center text-xs text-[var(--at-auth-gold)]">{hint}</p>}
        {error && <p className="mt-4 text-center text-xs text-rose-300">{error}</p>}

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/40">
          By continuing, you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-white/70" onClick={closeAuth}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline hover:text-white/70" onClick={closeAuth}>
            Privacy Policy
          </Link>
          .
        </p>
        <p className="mt-3 text-center text-[10px] text-white/30">{BRAND.name}</p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.8 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
      <path d="M16.4 12.6c0-1.9 1.6-2.8 1.6-2.8s-1.3-1.9-3.4-1.9c-1.3 0-1.9.6-2.9.6-1 0-1.8-.6-2.9-.6-1.8 0-3.8 1.6-3.8 4.7 0 3.7 3.2 8 4.6 8 .9 0 1.2-.6 2.5-.6s1.5.6 2.5.6c1.4 0 3.7-3.3 3.7-3.3s-2.2-1.1-2-3.7zm-2-5.5c.8-.9 1.3-2.2 1.1-3.5-1.1.1-2.4.8-3.2 1.7-.7.8-1.3 2.1-1.1 3.3 1.2.1 2.4-.6 3.2-1.5z" />
    </svg>
  );
}
