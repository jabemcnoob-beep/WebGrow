import { useEffect, useRef, useState } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

const FADE = 0.7; // seconds of crossfade at the loop seam

/**
 * A silent background clip that loops without the visible "jump" of a plain
 * <video loop>: two copies of the same clip trade places, the incoming one
 * fading in over the last FADE seconds of the outgoing one.
 * - Loads only when the section nears the viewport, pauses when off-screen.
 * - The seam is caught with the video's own `timeupdate` event (≈4×/s), so
 *   there's no per-frame polling.
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
    if (!wrap || prefersReducedMotion()) return;

    const vids = [aRef.current, bRef.current];
    let front = 0, started = false, fading = false, timer = 0;

    const onTime = (e) => {
      const cur = e.currentTarget;
      if (fading || cur !== vids[front] || !cur.duration) return;
      // timeupdate fires every ~250ms, so start the handoff a beat early
      if (cur.currentTime > cur.duration - FADE - 0.25) {
        fading = true;
        const next = vids[1 - front];
        next.currentTime = 0;
        next.play().catch(() => {});
        next.style.opacity = "1";
        cur.style.opacity = "0";
        timer = setTimeout(() => { cur.pause(); front = 1 - front; fading = false; }, FADE * 1000);
      }
    };
    vids.forEach((v) => v.addEventListener("timeupdate", onTime));

    const start = () => {
      if (!started) {
        started = true;
        vids.forEach((v) => { v.src = src; v.load(); });
        vids[0].addEventListener("playing", () => setMode("video"), { once: true });
      }
      vids[front].play().catch(() => {});
    };
    const stop = () => vids.forEach((v) => v.pause());

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) start(); else stop();
    }, { rootMargin: "200px 0px" });
    io.observe(wrap);

    // slow parallax on the whole media stack
    let unsub = () => {};
    if (range) {
      let top = 0, h = 0, last = null;
      unsub = subscribe({
        measure: () => { top = docTop(wrap.parentElement); h = wrap.parentElement.offsetHeight; last = null; },
        update: (y, vh) => {
          if (y + vh < top || y > top + h) return;
          const t = ((y + vh - top) / (vh + h)) * 2 - 1;
          const v = ((-t * range) / 2).toFixed(2);
          if (v === last) return;
          last = v;
          wrap.style.transform = `translate3d(0, ${v}%, 0)`;
        },
      });
    }

    return () => {
      io.disconnect();
      stop();
      clearTimeout(timer);
      vids.forEach((v) => v.removeEventListener("timeupdate", onTime));
      unsub();
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
