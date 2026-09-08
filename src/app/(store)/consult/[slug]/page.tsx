import { Suspense } from "react";
import ConsultSessionPage from "./consult-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="container-jk py-16 text-sm text-[var(--jk-muted)]">Opening session…</div>}>
      <ConsultSessionPage />
    </Suspense>
  );
}
