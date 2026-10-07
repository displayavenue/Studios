"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@homeopathypharma/ui";
import { loginAdmin } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await loginAdmin(String(form.get("email")), String(form.get("password")));
    setLoading(false);

    if (result.ok) {
      router.push(search.get("next") || "/dashboard");
      router.refresh();
      return;
    }
    setError("Sign-in failed. Use the admin password (default: admin123).");
  }

  return (
    <div className="login-card">
      <h1 className="font-display" style={{ marginTop: 0, fontSize: "var(--hp-text-2xl)" }}>
        Admin sign in
      </h1>
      <p style={{ color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
        WordPress-style CMS for homepage, pages, products, media, menus, and settings. Set{" "}
        <code>ADMIN_PASSWORD</code> in production.
      </p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "var(--hp-space-4)", marginTop: "var(--hp-space-6)" }}>
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue="admin@homeopathypharma.com"
            required
          />
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
        <Button type="submit" variant="accent" loading={loading}>
          Sign in
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="login-card">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
