import type { ReactNode } from "react";

export interface VisuallyHiddenProps {
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  children: ReactNode;
}

/** Screen-reader-only content — visible to assistive tech, hidden visually. */
export function VisuallyHidden({ as: Tag = "span", children }: VisuallyHiddenProps) {
  return (
    <Tag
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </Tag>
  );
}

/** Re-export focus ring class name for custom interactive elements. */
export const FOCUS_RING_CLASS = "hp-focus-ring";
