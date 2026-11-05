"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailedBody() {
  const params = useSearchParams();
  const reason = params.get("reason");
  const back = params.get("back");

  return (
    <main className="container" style={{ padding: "3rem 0", minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <section className="panel fade-up" style={{ padding: "2rem 1.5rem", maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(180,35,24,.1)", color: "var(--danger)", display: "grid", placeItems: "center", margin: "0 auto 1rem", fontWeight: 800, fontSize: "1.4rem" }}>
          !
        </div>
        <h1 className="display" style={{ margin: "0 0 .5rem", color: "var(--navy)" }}>Payment failed</h1>
        <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>
          {reason || "The payment could not be completed. You can return to the quotation and try again."}
        </p>
        <div style={{ display: "flex", gap: ".65rem", justifyContent: "center", flexWrap: "wrap" }}>
          {back && (
            <Link href={back} className="btn btn-primary">
              Return to quotation
            </Link>
          )}
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<main className="container" style={{ padding: "3rem 0" }}>Loading…</main>}>
      <FailedBody />
    </Suspense>
  );
}
