import type { ReactNode } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const badgeColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "var(--hp-color-sage-100)", text: "var(--hp-color-teal-900)" },
  success: { bg: "#ecfdf3", text: "var(--hp-color-success)" },
  warning: { bg: "#fffaeb", text: "var(--hp-color-warning)" },
  error: { bg: "#fef3f2", text: "var(--hp-color-error)" },
  info: { bg: "var(--hp-color-sage-100)", text: "var(--hp-color-teal-800)" },
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const colors = badgeColors[variant];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "var(--hp-space-1) var(--hp-space-3)",
        fontFamily: "var(--hp-font-ui)",
        fontSize: "var(--hp-text-xs)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        borderRadius: "var(--hp-radius-full)",
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {children}
    </span>
  );
}
