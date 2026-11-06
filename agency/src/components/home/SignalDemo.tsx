import { useEffect, useRef, useState } from "react";
import "./SignalDemo.css";

/**
 * Hero illustration: one customer's journey to an enquiry.
 * Scene 0 Google search → Scene 1 Instagram ad → Scene 2 website enquiry on WhatsApp.
 * Purely illustrative (aria-hidden); the scene index is lifted so the headline can echo it.
 */
export const SIGNAL_SCENES = ["google", "instagram", "website"] as const;
export type SignalScene = (typeof SIGNAL_SCENES)[number];

const QUERY = "marketing agency near me";
const SCENE_MS = 4200;

export function SignalDemo({ onScene }: { onScene?: (scene: SignalScene) => void }) {
  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState(0);
  const [count, setCount] = useState(11);
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  // Pause when off-screen or tab hidden
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(QUERY.length);
      return;
    }
    const id = window.setInterval(() => {
      if (!visible.current || document.hidden) return;
      setScene((s) => (s + 1) % SIGNAL_SCENES.length);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    onScene?.(SIGNAL_SCENES[scene]);
    if (scene === 0) {
      setTyped(0);
      let i = 0;
      const t = window.setInterval(() => {
        i += 1;
        setTyped(i);
        if (i >= QUERY.length) window.clearInterval(t);
      }, 45);
      return () => window.clearInterval(t);
    }
    if (scene === 2) {
      const t = window.setTimeout(() => setCount((c) => (c >= 19 ? 12 : c + 1)), 1900);
      return () => window.clearTimeout(t);
    }
  }, [scene, onScene]);

  const cls = (i: number) => `sd-scene${scene === i ? " is-on" : ""}`;

  return (
    <div className="signal-demo" ref={rootRef} aria-hidden data-scene={SIGNAL_SCENES[scene]}>
      <div className="sd-rings">
        <span />
        <span />
        <span />
      </div>

      <div className="sd-device">
        <div className="sd-device__bar">
          <span className="sd-device__notch" />
        </div>

        {/* Scene 0 — Google */}
        <div className={cls(0)}>
          <div className="sd-search">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>
              {QUERY.slice(0, typed)}
              <i className="sd-caret" />
            </span>
          </div>
          <div className="sd-map">
            <span className="sd-pin sd-pin--a" />
            <span className="sd-pin sd-pin--b" />
            <span className="sd-pin sd-pin--you" />
          </div>
          <div className="sd-result">
            <div>
              <strong>Your Business</strong>
              <small>
                <b>4.9 ★★★★★</b> Open now
              </small>
            </div>
            <span className="sd-chip">Call</span>
          </div>
          <div className="sd-result sd-result--muted">
            <div>
              <strong>Competitor</strong>
              <small>4.1 ★★★★ Closes soon</small>
            </div>
          </div>
        </div>

        {/* Scene 1 — Instagram */}
        <div className={cls(1)}>
          <div className="sd-post">
            <div className="sd-post__head">
              <span className="sd-avatar" />
              <div>
                <strong>yourbusiness</strong>
                <small>Sponsored</small>
              </div>
            </div>
            <div className="sd-post__media">
              <span className="sd-post__offer">
                Free consultation
                <br />
                this week
              </span>
              <span className="sd-heart">♥</span>
            </div>
            <div className="sd-post__cta">
              Book now <span>›</span>
            </div>
          </div>
        </div>

        {/* Scene 2 — Website → WhatsApp enquiry */}
        <div className={cls(2)}>
          <div className="sd-form">
            <strong>Get a quote</strong>
            <span className="sd-field">Priya Mehta</span>
            <span className="sd-field">+91 98•••• ••210</span>
            <span className="sd-submit">Send enquiry</span>
          </div>
          <div className="sd-toast">
            <span className="sd-toast__icon">✓</span>
            <div>
              <strong>New enquiry</strong>
              <small>"Is Saturday available?"</small>
            </div>
          </div>
        </div>
      </div>

      <div className="sd-tally">
        <span>Enquiries this week</span>
        <strong key={count}>{count}</strong>
      </div>

      <ol className="sd-steps">
        {["Found on Google", "Saw your ad", "Sent an enquiry"].map((label, i) => (
          <li key={label} className={scene === i ? "is-on" : scene > i ? "is-done" : ""}>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
