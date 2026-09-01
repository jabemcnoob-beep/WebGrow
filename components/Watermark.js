import { useEffect, useRef } from "react";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Giant outline watermark word pinned to the top-right of its section. The
 * parent section must carry .fx-wm-clip (position:relative; overflow:hidden).
 * Drifts slowly (-6% to 6% translateY) as the section crosses the viewport via
 * a rAF-gated scroll listener; parallax is measured off the parent so the
 * watermark's own transform never feeds back into the math. Skipped entirely
 * under reduced motion. Decorative: aria-hidden, pointer-events none.
 */
export default function Watermark({ word, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const parent = el.parentElement;
    if (!parent) return;

    let raf = 0;
    const apply = () => {
      const r = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 = section top at viewport bottom, 1 = section bottom at viewport top
      const p = clamp01((vh - r.top) / (vh + r.height));
      el.style.transform = `translateY(${lerp(-6, 6, p).toFixed(3)}%)`;
    };
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          apply();
        });
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span className={`fx-wm ${className}`} ref={ref} aria-hidden="true">
      {word}
    </span>
  );
}
