import type { HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
  children: ReactNode;
}

export function Container({ narrow, children, style, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: narrow ? "var(--hp-container-narrow)" : "var(--hp-container-max)",
        marginInline: "auto",
        paddingInline: "var(--hp-space-4)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  children: ReactNode;
  /** Accessible label when no visible heading is present. */
  "aria-label"?: string;
}

export function Section({
  as: Tag = "section",
  children,
  style,
  className = "",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={className}
      style={{
        paddingBlock: "var(--hp-space-12)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
