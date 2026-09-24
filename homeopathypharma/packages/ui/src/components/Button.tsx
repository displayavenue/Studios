import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--hp-color-primary)",
    color: "var(--hp-color-white)",
    border: "1px solid var(--hp-color-primary)",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "var(--hp-color-primary)",
    border: "1px solid var(--hp-color-border-strong)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--hp-color-text)",
    border: "1px solid transparent",
  },
  accent: {
    backgroundColor: "var(--hp-color-accent)",
    color: "var(--hp-color-white)",
    border: "1px solid var(--hp-color-accent)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "var(--hp-space-2) var(--hp-space-3)", fontSize: "var(--hp-text-sm)" },
  md: { padding: "var(--hp-space-3) var(--hp-space-5)", fontSize: "var(--hp-text-base)" },
  lg: { padding: "var(--hp-space-4) var(--hp-space-6)", fontSize: "var(--hp-text-lg)" },
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  style,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`hp-focus-ring ${className}`.trim()}
      style={{
        fontFamily: "var(--hp-font-ui)",
        fontWeight: 600,
        borderRadius: "var(--hp-radius-md)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--hp-space-2)",
        minHeight: "44px",
        transition: "background-color var(--hp-duration-normal) var(--hp-ease-out)",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
