"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type AuthModalContextValue = {
  open: boolean;
  openAuth: (opts?: { next?: string }) => void;
  closeAuth: () => void;
  nextPath: string;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [nextPath, setNextPath] = useState("/dashboard");

  const openAuth = useCallback((opts?: { next?: string }) => {
    setNextPath(opts?.next || "/dashboard");
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openAuth, closeAuth, nextPath }),
    [open, openAuth, closeAuth, nextPath],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    return {
      open: false,
      openAuth: (opts?: { next?: string }) => {
        const next = opts?.next ? `?next=${encodeURIComponent(opts.next)}` : "";
        window.location.href = `/login${next}`;
      },
      closeAuth: () => undefined,
      nextPath: "/dashboard",
    };
  }
  return ctx;
}
