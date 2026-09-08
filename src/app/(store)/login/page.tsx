import { Suspense } from "react";
import LoginForm from "./login-form";
import { PageHero, SectionShell } from "@/components/site/page-chrome";

export default function LoginPage() {
  return (
    <div>
      <PageHero eyebrow="Account" title="Sign in" subtitle="Access your Kundali reports and personalized dashboard." />
      <SectionShell muted>
        <Suspense fallback={<div className="text-center text-sm text-[var(--jk-muted)]">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </SectionShell>
    </div>
  );
}
