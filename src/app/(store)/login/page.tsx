import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-jk py-16 text-center text-sm text-[var(--jk-muted)]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
