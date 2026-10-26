import { useEffect, useRef } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

/**
 * An <img> that drifts vertically as its container crosses the viewport
 * (a slow parallax, `range` = total travel in % of its own height). The
 * container must clip it (ph-frame / ph-media have overflow hidden and
 * oversize the image to leave room). Static under reduced motion.
 */
export default function DriftImage({ src, alt = "", range = 10, className = "", eager = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let top = 0, h = 0, last = null;
    return subscribe({
      measure: () => { top = docTop(el.parentElement); h = el.parentElement.offsetHeight; last = null; },
      update: (y, vh) => {
        if (y + vh < top || y > top + h) return; // off screen: no work
        // -1 when the container enters at the bottom, +1 when it leaves the top
        const t = ((y + vh - top) / (vh + h)) * 2 - 1;
        const v = ((-t * range) / 2).toFixed(2);
        if (v === last) return;
        last = v;
        el.style.transform = `translate3d(0, ${v}%, 0)`;
      },
    });
  }, [range]);

  return <img ref={ref} src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} draggable={false} />;
}
