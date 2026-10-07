import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className = "", style, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`hp-focus-ring ${className}`.trim()}
      style={{
        width: "100%",
        padding: "var(--hp-space-3) var(--hp-space-4)",
        fontFamily: "var(--hp-font-body)",
        fontSize: "var(--hp-text-base)",
        lineHeight: "var(--hp-leading-normal)",
        color: "var(--hp-color-text)",
        backgroundColor: "var(--hp-color-surface-elevated)",
        border: `1px solid ${invalid ? "var(--hp-color-error)" : "var(--hp-color-border)"}`,
        borderRadius: "var(--hp-radius-md)",
        minHeight: "44px",
        ...style,
      }}
      {...props}
    />
  );
}

export interface LabelProps {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Label({ htmlFor, required, children, className = "" }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={className}
      style={{
        display: "block",
        fontFamily: "var(--hp-font-ui)",
        fontSize: "var(--hp-text-sm)",
        fontWeight: 600,
        color: "var(--hp-color-text)",
        marginBottom: "var(--hp-space-2)",
      }}
    >
      {children}
      {required ? (
        <span aria-hidden="true" style={{ color: "var(--hp-color-error)", marginLeft: "var(--hp-space-1)" }}>
          *
        </span>
      ) : null}
    </label>
  );
}

export interface FieldErrorProps {
  id: string;
  children: ReactNode;
}

export function FieldError({ id, children }: FieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      style={{
        marginTop: "var(--hp-space-2)",
        fontSize: "var(--hp-text-sm)",
        color: "var(--hp-color-error)",
        fontFamily: "var(--hp-font-ui)",
      }}
    >
      {children}
    </p>
  );
}
