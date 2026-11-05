"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessBody() {
  const params = useSearchParams();
  const receipt = params.get("receipt");
  const invoice = params.get("invoice");
  const number = params.get("quotation");

  return (
    <main className="container" style={{ padding: "3rem 0", minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <section className="panel fade-up" style={{ padding: "2rem 1.5rem", maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(15,122,78,.12)", color: "var(--ok)", display: "grid", placeItems: "center", margin: "0 auto 1rem", fontWeight: 800, fontSize: "1.4rem" }}>
          ✓
        </div>
        <h1 className="display" style={{ margin: "0 0 .5rem", color: "var(--navy)" }}>Payment successful</h1>
        <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>
          Thank you. Your quotation payment has been received
          {number ? ` for ${number}` : ""}.
        </p>
        {(receipt || invoice) && (
          <div style={{ textAlign: "left", marginBottom: "1.25rem", padding: "1rem", borderRadius: 14, background: "var(--blue-soft)" }}>
            {receipt && <div style={{ fontWeight: 700 }}>Receipt: {receipt}</div>}
            {invoice && <div style={{ fontWeight: 700, marginTop: ".35rem" }}>Invoice: {invoice}</div>}
          </div>
        )}
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<main className="container" style={{ padding: "3rem 0" }}>Loading…</main>}>
      <SuccessBody />
    </Suspense>
  );
}
