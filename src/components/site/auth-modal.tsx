"use client";

import { useEffect } from "react";
import { useAuthModal } from "@/components/site/auth-provider";
import { AuthSheet } from "@/components/site/auth-sheet";

/** Overlay modal using the shared AstroTalk-style OTP sheet. */
export function AuthModal() {
  const { open, closeAuth, nextPath } = useAuthModal();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeAuth]);

  if (!open) return null;

  return (
    <div className="at-auth-overlay" role="dialog" aria-modal="true" aria-label="Sign in">
      <button type="button" className="absolute inset-0 cursor-default bg-black/75" aria-label="Close" onClick={closeAuth} />
      <AuthSheet variant="modal" nextPath={nextPath} onClose={closeAuth} showClose />
    </div>
  );
}
