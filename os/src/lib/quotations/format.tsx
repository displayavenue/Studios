/** Client-safe INR formatting helpers for quotation UI. */

export function formatInrFromPaise(paise: number | null | undefined): string {
  const inr = Math.round(Number(paise || 0)) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(inr);
}

export function formatInrAmount(inr: number | null | undefined): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(inr || 0));
}

export function statusTone(status?: string | null): { bg: string; color: string } {
  const s = String(status || "").toUpperCase();
  if (["PAID", "ACCEPTED"].includes(s)) return { bg: "rgba(15,122,78,.12)", color: "var(--ok)" };
  if (["SENT", "VIEWED", "PARTIALLY_PAID", "INITIATED"].includes(s))
    return { bg: "var(--blue-soft)", color: "var(--navy-2)" };
  if (["EXPIRED", "CANCELLED", "REJECTED", "FAILED"].includes(s))
    return { bg: "rgba(180,35,24,.1)", color: "var(--danger)" };
  if (["DRAFT", "UNPAID"].includes(s)) return { bg: "rgba(154,107,0,.12)", color: "var(--warn)" };
  return { bg: "rgba(15,40,70,.08)", color: "var(--muted)" };
}

export function StatusBadge({ status }: { status?: string | null }) {
  const tone = statusTone(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: ".2rem .55rem",
        borderRadius: 999,
        fontSize: ".75rem",
        fontWeight: 800,
        letterSpacing: ".02em",
        background: tone.bg,
        color: tone.color,
        textTransform: "uppercase",
      }}
    >
      {status || "—"}
    </span>
  );
}
