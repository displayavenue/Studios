import { Suspense } from "react";
import EmailLoginForm from "../login-form-email";

export const metadata = { title: "Email sign in" };

export default function EmailLoginPage() {
  return (
    <div className="at-home min-h-[60vh]">
      <div className="container-jk py-12">
        <Suspense fallback={<p className="text-center text-sm text-[var(--jk-muted)]">Loading…</p>}>
          <EmailLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
