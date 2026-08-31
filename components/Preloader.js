import { useEffect, useState } from "react";

const WORD = "WEBGROW";

/**
 * First-visit intro: the wordmark rises letter by letter while a counter
 * runs 0→100, then the whole screen wipes up. Runs once per browser
 * session; skipped entirely for reduced motion.
 */
export default function Preloader() {
  // null = undecided (SSR-safe), true = play, false = skip
  const [play, setPlay] = useState(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("wg-intro") === "1"; } catch {}
    if (reduce || seen) { setPlay(false); return; }
    try { sessionStorage.setItem("wg-intro", "1"); } catch {}
    setPlay(true);

    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    const DUR = 1500;
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      // ease so the counter sprints then settles
      const eased = 1 - Math.pow(1 - p, 2.4);
      setPct(Math.round(eased * 100));
      if (p < 1) { raf = requestAnimationFrame(tick); return; }
      setDone(true);
      document.documentElement.style.overflow = "";
      setTimeout(() => setGone(true), 750);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (play !== true || gone) return null;

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} aria-hidden>
      <div className="word">
        {WORD.split("").map((ch, i) => (
          <span key={i} className={i >= 3 ? "pink" : ""} style={{ "--i": i }}>{ch}</span>
        ))}
      </div>
      <div className="bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <div className="pct">{String(pct).padStart(3, "0")}%</div>
    </div>
  );
}
