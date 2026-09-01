import { useEffect, useRef, useState } from "react";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * Fixed 2px page-progress bar at the top of the viewport (.fx-progress):
 * pink gradient with glow, scaleX driven by the page scroll fraction through a
 * rAF-gated passive scroll listener. Removed entirely under reduced motion.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setHidden(true);
      return;
    }

    let raf = 0;
    const apply = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? clamp01(window.scrollY / total) : 0;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
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

  if (hidden) return null;
  return <div className="fx-progress" ref={barRef} aria-hidden="true" />;
}
