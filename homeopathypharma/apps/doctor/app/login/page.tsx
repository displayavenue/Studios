"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@homeopathypharma/ui";
import { loginDoctor } from "@/lib/api";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await loginDoctor(String(form.get("email")), String(form.get("password")));
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError("Sign-in failed. Check your email and password, then try again.");
    }
  }

  return (
    <div className="login-card">
      <h1 className="font-display" style={{ marginTop: 0, fontSize: "var(--hp-text-2xl)" }}>
        Doctor sign in
      </h1>
      <p style={{ color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
        For listed BHMS practitioners. Use your clinic email to continue.
      </p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "var(--hp-space-4)", marginTop: "var(--hp-space-6)" }}>
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {error ? (
          <p role="alert" style={{ color: "var(--hp-color-error)", fontSize: "var(--hp-text-sm)", margin: 0 }}>
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="primary" loading={loading}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
