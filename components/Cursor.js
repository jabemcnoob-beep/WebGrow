import { useEffect, useRef } from "react";

/**
 * Custom neon cursor: a pink dot that tracks the pointer 1:1 and a ring
 * that trails it with a lerp. The ring swells over interactive elements.
 * Only activates for fine pointers with motion allowed — touch devices and
 * reduced-motion users keep the native cursor.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let seen = false;

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        rx = x; ry = y;
        document.body.classList.remove("cursor-hidden");
      }
      const t = e.target;
      const interactive = t.closest?.("a, button, summary, [data-cursor]");
      const field = t.closest?.("input, textarea, select");
      ring.classList.toggle("is-active", !!interactive);
      dot.style.opacity = field ? "0" : "1";
      ring.style.opacity = field ? "0" : "1";
    };
    const onLeave = () => document.body.classList.add("cursor-hidden");
    const onEnter = () => document.body.classList.remove("cursor-hidden");

    document.body.classList.add("cursor-hidden");
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      document.body.classList.remove("cursor-hidden");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden />
      <div className="cursor-ring" ref={ringRef} aria-hidden />
    </>
  );
}
