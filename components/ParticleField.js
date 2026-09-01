import { useEffect, useRef } from "react";

/**
 * Full-bleed 2D canvas constellation for the hero background.
 * ~120 drifting dots (70% white, 30% glowing pink) with pink-tinted
 * linking lines between close neighbours, and a smooth cursor repel field.
 * DPR-aware (capped at 1.5), re-seeds on resize, pauses when the tab is
 * hidden or the canvas scrolls fully out of view, and renders exactly one
 * static frame under prefers-reduced-motion. Takes no props.
 */
export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const LINK = 110;   // px — max distance for a connecting line
    const REPEL = 140;  // px — cursor influence radius
    let raf = 0;
    let inView = true;
    let w = 0;
    let h = 0;
    let dpr = 0;
    let parts = [];
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      // retina sharpness is not worth 4x the pixels for a soft backdrop
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // density scales with viewport area; harder cap on small screens
      const cap = w < 760 ? 60 : 120;
      const n = Math.max(30, Math.min(cap, Math.round((w * h) / 15000)));
      parts = [];
      for (let i = 0; i < n; i++) {
        const vx = (Math.random() - 0.5) * 0.24;
        const vy = (Math.random() - 0.5) * 0.24;
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx,
          vy,
          // base drift that the repel force relaxes back toward
          bvx: vx,
          bvy: vy,
          r: 0.8 + Math.random() * 1.1,
          pink: Math.random() < 0.3,
        });
      }
    };

    const step = () => {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL && d2 > 0.01) {
          const d = Math.sqrt(d2);
          // linear falloff nudges velocity — a push, never a teleport
          const f = ((REPEL - d) / REPEL) * 0.42;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx += (p.bvx - p.vx) * 0.03;
        p.vy += (p.bvy - p.vy) * 0.03;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -12) p.x = w + 12;
        else if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12;
        else if (p.y > h + 12) p.y = -12;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const a = (1 - Math.sqrt(d2) / LINK) * 0.25;
          ctx.strokeStyle = "rgba(255, 82, 160, " + a.toFixed(3) + ")";
          ctx.beginPath();
          ctx.moveTo(parts[i].x, parts[i].y);
          ctx.lineTo(parts[j].x, parts[j].y);
          ctx.stroke();
        }
      }
      // white dots first (no glow), then pink ones with shadowBlur
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p.pink) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowColor = "rgba(255, 31, 143, 0.9)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#ff1f8f";
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!p.pink) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const frame = () => {
      step();
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !reduce && inView && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onResize = () => {
      // mobile URL-bar collapse fires resize with unchanged dimensions —
      // re-seeding then would visibly teleport the whole constellation
      const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas.clientWidth === w && canvas.clientHeight === h && nextDpr === dpr) return;
      seed();
      draw(); // keep the canvas populated even while paused / reduced
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // battery saver: no animation while the hero is scrolled past
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    seed();
    draw();
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      start();
    }
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="hv-canvas" aria-hidden="true" />;
}
