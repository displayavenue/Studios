import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-[var(--velora-ink)]/15 bg-white px-3 py-2 text-sm placeholder:text-[var(--velora-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--velora-accent)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-[var(--velora-ink)]", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-[var(--velora-ink)]/15 bg-white px-3 py-2 text-sm placeholder:text-[var(--velora-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--velora-accent)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[var(--velora-ink)] text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
