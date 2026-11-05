import { Suspense } from "react";
import Growth360Wizard from "./Growth360Wizard";

export default function Growth360Page() {
  return (
    <Suspense
      fallback={
        <main className="container" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
          <p style={{ color: "var(--muted)" }}>Loading Growth360…</p>
        </main>
      }
    >
      <Growth360Wizard />
    </Suspense>
  );
}
