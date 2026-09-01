import { useEffect, useRef } from "react";

/**
 * 3D tilt wrapper: the inner face rotates toward the pointer (rAF-lerped,
 * perspective 900px on the wrapper) and a pink/white glare sweep follows the
 * cursor. Resets smoothly on leave. Coarse pointers and reduced motion get the
 * exact same static markup with no listeners attached — children render plain.
 */
export default function TiltCard({ children, className = "", max = 10, glare = true }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let raf = 0;
    let tRx = 0, tRy = 0, cRx = 0, cRy = 0;

    // Runs only until converged on the target — a missed pointerleave (e.g.
    // scrolling the card away from a stationary cursor) must not leave a
    // perpetual no-op rAF loop alive.
    const loop = () => {
      cRx += (tRx - cRx) * 0.14;
      cRy += (tRy - cRy) * 0.14;
      if (Math.abs(tRx - cRx) > 0.02 || Math.abs(tRy - cRy) > 0.02) {
        inner.style.transform = `rotateX(${cRx.toFixed(3)}deg) rotateY(${cRy.toFixed(3)}deg)`;
        raf = requestAnimationFrame(loop);
      } else {
        cRx = tRx;
        cRy = tRy;
        inner.style.transform = (tRx === 0 && tRy === 0)
          ? ""
          : `rotateX(${tRx.toFixed(3)}deg) rotateY(${tRy.toFixed(3)}deg)`;
        raf = 0;
      }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tRy = (px - 0.5) * 2 * max;
      tRx = (0.5 - py) * 2 * max;
      const g = glareRef.current;
      if (g) {
        g.style.setProperty("--fx-gx", `${(px * 100).toFixed(2)}%`);
        g.style.setProperty("--fx-gy", `${(py * 100).toFixed(2)}%`);
      }
      wrap.classList.add("fx-tilt-on");
      start();
    };
    const onLeave = () => {
      tRx = 0;
      tRy = 0;
      wrap.classList.remove("fx-tilt-on");
      start();
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div className={`fx-tilt ${className}`} ref={wrapRef}>
      <div className="fx-tilt-inner" ref={innerRef}>
        {children}
        {glare && <div className="fx-glare" ref={glareRef} aria-hidden="true" />}
      </div>
    </div>
  );
}
