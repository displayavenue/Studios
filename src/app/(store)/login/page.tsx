import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="at-auth-page min-h-[70vh]">
      <div className="container-jk flex justify-center py-8 sm:py-12">
        <Suspense fallback={<div className="text-center text-sm text-white/50">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
