import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="at-home min-h-[60vh]">
      <div className="container-jk py-16">
        <Suspense fallback={<div className="text-center text-sm text-[var(--jk-muted)]">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
