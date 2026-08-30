import { useEffect, useRef, useState } from "react";

function parseStat(raw: string): { prefix: string; value: number; suffix: string; decimals: number } {
  const m = String(raw).trim().match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!m) return { prefix: "", value: 0, suffix: raw, decimals: 0 };
  const num = m[2];
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix: m[1], value: Number(num), suffix: m[3], decimals };
}

/** Count-up once when visible. Passes through original formatting. */
export function useCountUp(raw: string, durationMs = 1100) {
  const ref = useRef<HTMLElement | null>(null);
  const parsed = parseStat(raw);
  const [display, setDisplay] = useState(raw);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(raw);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || done.current) return;
        done.current = true;
        io.disconnect();
        const start = performance.now();
        const from = 0;
        const to = parsed.value;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = from + (to - from) * eased;
          const text =
            parsed.decimals > 0 ? current.toFixed(parsed.decimals) : String(Math.round(current));
          setDisplay(`${parsed.prefix}${text}${parsed.suffix}`);
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(raw);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [raw, durationMs, parsed.value, parsed.prefix, parsed.suffix, parsed.decimals]);

  return { ref, display };
}
