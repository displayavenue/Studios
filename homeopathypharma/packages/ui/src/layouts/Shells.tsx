import type { ReactNode } from "react";
import { SkipLink } from "../components/SkipLink.js";
import { Container } from "../components/Container.js";

export interface ShellProps {
  header?: ReactNode;
  nav?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  mainId?: string;
  className?: string;
}

function BaseShell({ header, nav, children, footer, mainId = "main-content", className = "" }: ShellProps) {
  return (
    <div className={`hp-root ${className}`.trim()} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <SkipLink targetId={mainId} />
      {header ? (
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backgroundColor: "var(--hp-color-surface-elevated)",
            borderBottom: "1px solid var(--hp-color-border)",
            minHeight: "var(--hp-header-height)",
          }}
        >
          <Container>{header}</Container>
        </header>
      ) : null}
      {nav ? (
        <nav aria-label="Primary navigation" style={{ backgroundColor: "var(--hp-color-teal-950)" }}>
          <Container>{nav}</Container>
        </nav>
      ) : null}
      <main
        id={mainId}
        tabIndex={-1}
        style={{ flex: 1, outline: "none" }}
      >
        {children}
      </main>
      {footer ? (
        <footer
          style={{
            borderTop: "1px solid var(--hp-color-border)",
            backgroundColor: "var(--hp-color-teal-950)",
            color: "var(--hp-color-sage-100)",
            paddingBlock: "var(--hp-space-8)",
          }}
        >
          <Container>{footer}</Container>
        </footer>
      ) : null}
    </div>
  );
}

/** Storefront layout — open, editorial hero patterns without card chrome. */
export function StorefrontShell(props: ShellProps) {
  return <BaseShell {...props} />;
}

/** Doctor portal layout — clinical workspace framing. */
export function DoctorShell(props: ShellProps) {
  return (
    <BaseShell
      {...props}
      className={`hp-doctor-shell ${props.className ?? ""}`.trim()}
    />
  );
}

/** Admin layout — dense operational surface. */
export function AdminShell(props: ShellProps) {
  return (
    <BaseShell
      {...props}
      className={`hp-admin-shell ${props.className ?? ""}`.trim()}
    />
  );
}
