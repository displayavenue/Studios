"use client";

import { useState } from "react";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <PageHero
        eyebrow="Support"
        title="Contact"
        subtitle="Questions about reports, membership, payments, or refunds? Reach the JyotishKundali team."
      />
      <SectionShell muted>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <Surface>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--jk-gold-dark)]">Email</p>
            <a
              href="mailto:hello@jyotishkundali.com"
              className="mt-3 block font-display text-2xl text-[var(--jk-navy)] hover:text-[var(--jk-gold-dark)]"
            >
              hello@jyotishkundali.com
            </a>
            <p className="mt-3 text-sm text-[var(--jk-muted)]">We typically reply within one business day.</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--jk-muted)]">
              <li>Include your order ID for payment issues.</li>
              <li>Birth-detail corrections can be updated in your profile.</li>
              <li>
                Read the <a className="underline" href="/legal/refund">refund policy</a>.
              </li>
            </ul>
          </Surface>
          <Surface>
            <h2 className="font-display text-xl font-semibold">Send a message</h2>
            {done ? (
              <p className="mt-4 text-sm text-emerald-700">Message sent. We’ll get back to you soon.</p>
            ) : (
              <form
                className="mt-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPending(true);
                  setError(null);
                  const fd = new FormData(e.currentTarget);
                  try {
                    const res = await fetch("/api/support", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: fd.get("email"),
                        subject: fd.get("subject"),
                        message: fd.get("message"),
                        orderId: fd.get("orderId"),
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Failed");
                    setDone(true);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed");
                  } finally {
                    setPending(false);
                  }
                }}
              >
                <input name="email" type="email" required placeholder="Your email" className="h-11 w-full rounded-xl border px-3 text-sm" />
                <input name="orderId" placeholder="Order ID (optional)" className="h-11 w-full rounded-xl border px-3 text-sm" />
                <input name="subject" required placeholder="Subject" className="h-11 w-full rounded-xl border px-3 text-sm" />
                <textarea name="message" required minLength={10} rows={5} placeholder="How can we help?" className="w-full rounded-xl border px-3 py-2 text-sm" />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={pending} className="gold-btn h-11 w-full text-sm disabled:opacity-60">
                  {pending ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </Surface>
        </div>
      </SectionShell>
    </div>
  );
}
