import { useEffect, useRef, useState } from "react";

const FADE = 0.7; // seconds of crossfade at the loop seam

/**
 * A silent background clip that loops without the visible "jump" of a plain
 * <video loop>: two copies of the same clip trade places, the incoming one
 * fading in over the last FADE seconds of the outgoing one.
 * - Loads only when the section nears the viewport, pauses when off-screen.
 * - The poster still shows until the first copy can play.
 * - Reduced motion: just the poster image.
 * - Optional slow parallax (`range`, % of its own height), like DriftImage.
 */
export default function LoopVideo({ src, poster, alt = "", range = 0 }) {
  const wrapRef = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);
  const [mode, setMode] = useState("poster"); // "poster" | "video"

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const vids = [aRef.current, bRef.current];
    let front = 0, raf = 0, inView = false, started = false, fading = false;

    const tick = () => {
      raf = 0;
      const cur = vids[front], next = vids[1 - front];
      if (cur.duration && !fading && cur.currentTime > cur.duration - FADE) {
        fading = true;
        next.currentTime = 0;
        next.play().catch(() => {});
        next.style.opacity = "1";
        cur.style.opacity = "0";
        setTimeout(() => { cur.pause(); front = 1 - front; fading = false; }, FADE * 1000);
      }
      if (inView) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!started) {
        started = true;
        vids.forEach((v) => { v.src = src; v.load(); });
        vids[0].addEventListener("playing", () => setMode("video"), { once: true });
      }
      vids[front].play().catch(() => {});
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      vids.forEach((v) => v.pause());
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start(); else stop();
    }, { rootMargin: "200px 0px" });
    io.observe(wrap);

    // slow parallax on the whole media stack
    let praf = 0;
    const drift = () => {
      praf = 0;
      const box = wrap.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      if (box.bottom < 0 || box.top > vh) return;
      const t = ((vh - box.top) / (vh + box.height)) * 2 - 1;
      wrap.style.transform = `translate3d(0, ${(-t * range) / 2}%, 0)`;
    };
    const onScroll = () => { if (range && !praf) praf = requestAnimationFrame(drift); };
    if (range) {
      drift();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      io.disconnect();
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (praf) cancelAnimationFrame(praf);
    };
  }, [src, range]);

  return (
    <div className="lv" ref={wrapRef}>
      <img className="lv-poster" src={poster} alt={alt} loading="lazy" draggable={false}
        style={{ opacity: mode === "poster" ? 1 : 0 }} />
      <video ref={aRef} className="lv-vid" muted playsInline preload="none" aria-hidden="true" style={{ opacity: 1 }} />
      <video ref={bRef} className="lv-vid" muted playsInline preload="none" aria-hidden="true" style={{ opacity: 0 }} />
    </div>
  );
}
