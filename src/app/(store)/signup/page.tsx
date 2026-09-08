import { Suspense } from "react";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="container-jk py-16 text-center text-sm text-[var(--jk-muted)]">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
