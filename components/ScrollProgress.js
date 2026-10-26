import { useEffect, useRef, useState } from "react";
import { subscribe } from "@/lib/scroll";

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

    let total = 1;
    return subscribe({
      measure: () => { total = document.documentElement.scrollHeight - window.innerHeight; },
      update: (y) => {
        const p = total > 0 ? clamp01(y / total) : 0;
        bar.style.transform = `scaleX(${p.toFixed(4)})`;
      },
    });
  }, []);

  if (hidden) return null;
  return <div className="fx-progress" ref={barRef} aria-hidden="true" />;
}
