import { useEffect, useRef } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

/**
 * The results ticker. It drifts on its own (a CSS animation on the
 * compositor), speeds up with scroll speed and runs backwards while you scroll
 * up. Only the animation's playback rate is touched, and only when it changes
 * noticeably — the movement itself never runs on the main thread.
 */
export default function Marquee({ items }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || prefersReducedMotion()) return;
    const anim = track.getAnimations?.()[0];
    if (!anim) return;

    let top = 0, h = 0, dir = 1, rate = 1;
    return subscribe({
      measure: () => { top = docTop(wrap); h = wrap.offsetHeight; },
      update: (y, vh, vel) => {
        if (y + vh < top || y > top + h) return; // off screen
        if (Math.abs(vel) > 0.5) dir = vel > 0 ? 1 : -1;
        const next = dir * (1 + Math.min(5, Math.abs(vel) * 0.18));
        if (Math.abs(next - rate) < 0.05) return;
        rate = next;
        anim.updatePlaybackRate(rate);
      },
    });
  }, []);

  return (
    <div className="marquee" aria-hidden ref={wrapRef}>
      <div className="marquee-track" ref={trackRef}>
        {[...items, ...items].map((m, i) => (
          <span className="marquee-item" key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}
