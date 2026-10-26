import { useEffect, useRef } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

/**
 * A full-bleed band that arrives as an inset, rounded card and widens to the
 * full screen as its top edge climbs to the top of the viewport. Scales from
 * its top edge, so the measured top never moves; once it's full width the
 * transform is removed so pinned (sticky) content inside behaves normally.
 */
export default function RiseBand({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let top = 0, last = "";
    return subscribe({
      measure: () => { top = docTop(el); last = ""; },
      update: (y, vh) => {
        if (y > top + vh) return; // well past the entrance: already full width
        const p = Math.max(0, Math.min(1, (y + vh - top) / vh));
        const s = 0.9 + 0.1 * (1 - Math.pow(1 - p, 2));
        const v = s >= 0.9995 ? "none" : `scale(${s.toFixed(4)})`;
        if (v === last) return;
        last = v;
        el.style.transform = v;
      },
    });
  }, []);

  return <div ref={ref} className={`rise-band ${className}`}>{children}</div>;
}
