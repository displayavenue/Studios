export interface SkipLinkProps {
  href?: string;
  targetId?: string;
  children?: string;
}

/** WCAG 2.2 skip navigation link — first focusable element in layout shells. */
export function SkipLink({
  href,
  targetId = "main-content",
  children = "Skip to main content",
}: SkipLinkProps) {
  const linkHref = href ?? `#${targetId}`;

  return (
    <a
      href={linkHref}
      className="hp-focus-ring"
      style={{
        position: "absolute",
        top: "var(--hp-space-2)",
        left: "var(--hp-space-2)",
        zIndex: 9999,
        padding: "var(--hp-space-3) var(--hp-space-4)",
        backgroundColor: "var(--hp-color-primary)",
        color: "var(--hp-color-white)",
        fontFamily: "var(--hp-font-ui)",
        fontSize: "var(--hp-text-sm)",
        fontWeight: 600,
        borderRadius: "var(--hp-radius-md)",
        textDecoration: "none",
        transform: "translateY(-200%)",
        transition: "transform var(--hp-duration-normal) var(--hp-ease-out)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "translateY(-200%)";
      }}
    >
      {children}
    </a>
  );
}
