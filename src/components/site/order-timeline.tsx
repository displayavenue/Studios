import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const STEPS = [
  { key: "PAYMENT_PROCESSING", label: "Payment started" },
  { key: "PAID", label: "Payment confirmed" },
  { key: "REPORT_GENERATING", label: "Report generating" },
  { key: "REPORT_READY", label: "Report ready" },
] as const;

function stepIndex(status: string) {
  if (status === "REPORT_READY") return 3;
  if (status === "REPORT_GENERATING") return 2;
  if (status === "PAID") return 1;
  if (status === "PAYMENT_PROCESSING" || status === "PENDING") return 0;
  return 0;
}

export function OrderTimeline({ status }: { status: string }) {
  const active = stepIndex(status);
  return (
    <ol className="space-y-3">
      {STEPS.map((step, idx) => {
        const done = idx < active || (idx === active && status === "REPORT_READY");
        const current = idx === active && status !== "REPORT_READY";
        return (
          <li key={step.key} className="flex items-center gap-3 text-sm">
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-[var(--jk-gold-dark)]" />
            ) : current ? (
              <Loader2 className="h-5 w-5 animate-spin text-[var(--jk-navy)]" />
            ) : (
              <Circle className="h-5 w-5 text-[var(--jk-muted)]" />
            )}
            <span className={done || current ? "font-medium text-[var(--jk-ink)]" : "text-[var(--jk-muted)]"}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
