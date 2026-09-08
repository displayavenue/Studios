import { Suspense } from "react";
import SignupForm from "./signup-form";
import { PageHero, SectionShell } from "@/components/site/page-chrome";

export default function SignupPage() {
  return (
    <div>
      <PageHero eyebrow="Account" title="Create Account" subtitle="Start your self-discovery journey with JyotishKundali." />
      <SectionShell muted>
        <Suspense fallback={<div className="text-center text-sm text-[var(--jk-muted)]">Loading…</div>}>
          <SignupForm />
        </Suspense>
      </SectionShell>
    </div>
  );
}
