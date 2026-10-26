import { useEffect, useRef } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

const ease = (t) => 1 - Math.pow(1 - t, 3);

/**
 * A photo/video frame that grows from a smaller, tilted card to full size as
 * it rises into view — scrubbed by scroll, so it moves with your thumb rather
 * than on a timer. Transform-only (no layout or paint). Positions come from
 * the parent, which isn't transformed, so measuring stays exact.
 */
export default function ScrollFrame({ children, className = "", tilt = 2.5 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let top = 0, last = "";
    return subscribe({
      measure: () => { top = docTop(el.parentElement); last = ""; },
      update: (y, vh) => {
        // from the frame's top entering the viewport to it sitting 25% up
        const p = Math.max(0, Math.min(1, (y + vh - top) / (vh * 0.75)));
        const e = ease(p);
        const v = e >= 0.999 ? "none"
          : `translate3d(0, ${((1 - e) * 60).toFixed(1)}px, 0) scale(${(0.84 + 0.16 * e).toFixed(4)}) rotate(${((1 - e) * tilt).toFixed(2)}deg)`;
        if (v === last) return;
        last = v;
        el.style.transform = v;
        el.style.opacity = Math.min(1, p * 2.5).toFixed(3);
      },
    });
  }, [tilt]);

  return <div ref={ref} className={`ph-frame scroll-frame ${className}`}>{children}</div>;
}
