"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent } from "react";
import { Button } from "@homeopathypharma/ui";

export type LoginRole = "patient" | "doctor" | "admin";

const roles: { id: LoginRole; label: string; blurb: string; submit: string; next: string }[] = [
  {
    id: "patient",
    label: "Patient / Customer",
    blurb: "Orders, consultations, addresses, and prescriptions.",
    submit: "Sign in to shop & care",
    next: "/account/",
  },
  {
    id: "doctor",
    label: "Doctor",
    blurb: "Clinic calendar, patient requests, and profile tools.",
    submit: "Sign in as doctor",
    next: "/doctor/",
  },
  {
    id: "admin",
    label: "Admin",
    blurb: "Catalogue, homepage CMS, doctor verification, and ops.",
    submit: "Sign in as admin",
    next: "/ops/",
  },
];

export function RoleLogin({ initialRole = "patient" }: { initialRole?: LoginRole }) {
  const router = useRouter();
  const [role, setRole] = useState<LoginRole>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const active = roles.find((r) => r.id === role)!;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const identifier = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!identifier || password.length < 4) {
      setLoading(false);
      setError("Enter a valid email/mobile and password.");
      return;
    }
    // Static Hostinger deploy: establish a local session flag for portal shells.
    try {
      window.localStorage.setItem(
        "hp.session",
        JSON.stringify({ role, identifier, signedInAt: new Date().toISOString() }),
      );
    } catch {
      // ignore storage failures
    }
    router.push(active.next);
  }

  return (
    <div className="role-login">
      <div className="role-login__tabs" role="tablist" aria-label="Sign in as">
        {roles.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={role === item.id}
            className={`role-login__tab${role === item.id ? " is-active" : ""}`}
            onClick={() => {
              setRole(item.id);
              setError(null);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="role-login__blurb">{active.blurb}</p>

      <form onSubmit={onSubmit} className="role-login__form">
        <label>
          <span>Email or mobile</span>
          <input
            name="identifier"
            type="text"
            autoComplete="username"
            required
            className="hp-focus-ring"
            style={inputStyle}
            placeholder={role === "patient" ? "you@email.com or mobile" : "work email"}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={4}
            className="hp-focus-ring"
            style={inputStyle}
          />
        </label>
        {role === "admin" ? (
          <label>
            <span>Admin access code (optional)</span>
            <input name="mfa" inputMode="numeric" className="hp-focus-ring" style={inputStyle} placeholder="MFA / PIN" />
          </label>
        ) : null}
        {error ? (
          <p role="alert" className="role-login__error">
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="accent" loading={loading}>
          {active.submit}
        </Button>
      </form>

      <p className="role-login__links">
        {role === "patient" ? (
          <>
            <Link href="/forgot-password/" className="hp-link">
              Forgot password
            </Link>
            {" · "}
            <Link href="/signup/" className="hp-link">
              Create patient account
            </Link>
          </>
        ) : role === "doctor" ? (
          <Link href="/doctor-verification/" className="hp-link">
            Apply for doctor listing
          </Link>
        ) : (
          <span>Admin access is restricted to authorised HomeopathyPharma staff.</span>
        )}
      </p>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.8rem 0.95rem",
  border: "1px solid var(--hp-color-border)",
  borderRadius: "0.65rem",
  font: "inherit",
  background: "#fff",
  minHeight: "2.85rem",
};
