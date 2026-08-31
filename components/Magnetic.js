import { useEffect, useRef } from "react";

/** Wraps children in a span that leans toward the cursor with a spring. */
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let hovering = false;

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      if (hovering || Math.abs(cx) > 0.1 || Math.abs(cy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        el.style.transform = "";
        raf = 0;
      }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
      hovering = true;
      start();
    };
    const onLeave = () => { tx = 0; ty = 0; hovering = false; start(); };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return <span className="magnetic" ref={ref}>{children}</span>;
}
