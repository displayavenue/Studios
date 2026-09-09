import { Suspense } from "react";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <div className="at-home min-h-[60vh]">
      <div className="container-jk py-16">
        <Suspense fallback={<div className="text-center text-sm text-[var(--jk-muted)]">Loading…</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
