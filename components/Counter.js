import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat up when it scrolls into view. Handles values like
 * "+340%", "3×", "100" — the digits animate, affixes stay put.
 */
export default function Counter({ value, duration = 1400 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value.replace(/\d+/, "0"));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.match(/\d+/);
    if (!match) { setDisplay(value); return; }
    const target = parseInt(match[0], 10);

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(value); return; }

    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value.replace(/\d+/, String(Math.round(eased * target))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
