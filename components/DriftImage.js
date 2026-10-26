import { useEffect, useRef } from "react";

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
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = el.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      if (box.bottom < 0 || box.top > vh) return;
      // -1 when the container enters at the bottom, +1 when it leaves the top
      const t = (vh - box.top) / (vh + box.height) * 2 - 1;
      el.style.transform = `translate3d(0, ${(-t * range) / 2}%, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [range]);

  return <img ref={ref} src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} draggable={false} />;
}
