"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@homeopathypharma/ui";
import { loginAdmin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await loginAdmin(
      String(form.get("email")),
      String(form.get("password")),
      mfaRequired ? String(form.get("mfaCode")) : undefined,
    );
    setLoading(false);

    if (result.ok) {
      router.push("/dashboard");
      return;
    }
    if (result.mfaRequired) {
      setMfaRequired(true);
      return;
    }
    setError("Sign-in failed — credentials and MFA validated at /v1/admin/auth/login.");
  }

  return (
    <div className="login-card">
      <h1 className="font-display" style={{ marginTop: 0, fontSize: "var(--hp-text-2xl)" }}>
        Admin sign in
      </h1>
      <p style={{ color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
        Multi-factor authentication is required for admin access when{" "}
        <code>ADMIN_REQUIRE_MFA</code> is enabled.
      </p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "var(--hp-space-4)", marginTop: "var(--hp-space-6)" }}>
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {mfaRequired ? (
          <div>
            <Label htmlFor="mfaCode" required>
              MFA code
            </Label>
            <Input id="mfaCode" name="mfaCode" inputMode="numeric" autoComplete="one-time-code" required />
          </div>
        ) : null}
        {error ? (
          <p role="alert" style={{ color: "var(--hp-color-error)", fontSize: "var(--hp-text-sm)", margin: 0 }}>
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="accent" loading={loading}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
