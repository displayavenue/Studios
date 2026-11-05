export function ModuleNotReady({ moduleName }: { moduleName?: string }) {
  return (
    <div className="panel" style={{ padding: "1.25rem" }}>
      <div className="display" style={{ color: "var(--navy)", fontWeight: 700, marginBottom: ".35rem" }}>
        Module API not ready
      </div>
      <p style={{ margin: 0, color: "var(--muted)" }}>
        {moduleName
          ? `The ${moduleName} API is not available yet. Check back once the backend route is live.`
          : "This module’s API is not available yet. Check back once the backend route is live."}
      </p>
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="panel" style={{ padding: "1.25rem" }}>
      <div style={{ fontWeight: 800, color: "var(--navy)", marginBottom: detail ? ".35rem" : 0 }}>{title}</div>
      {detail ? <p style={{ margin: 0, color: "var(--muted)" }}>{detail}</p> : null}
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <main className="container" style={{ padding: "3rem 0", minHeight: "40vh", display: "grid", placeItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".65rem", color: "var(--muted)", fontWeight: 600 }}>
        <span className="pulse-dot" />
        {label}
      </div>
    </main>
  );
}
