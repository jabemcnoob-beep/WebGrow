import { useEffect, useRef } from "react";
import { reviews } from "@/data/site";

function Chip({ r }) {
  return (
    <figure className="rev-chip" style={{ margin: 0 }}>
      <div className="stars" aria-label={`${r.stars} stars`}>{"★".repeat(r.stars)}</div>
      <blockquote>“{r.quote}”</blockquote>
      <figcaption className="who">
        <span className="avatar">{r.name[0]}</span>
        <span>
          <div className="name">{r.name}</div>
          <div className="role">{r.role}</div>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Two counter-scrolling belts of review cards. The wrapper skews slightly
 * with scroll velocity for a tactile feel.
 */
export default function ReviewsBelt() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lastY = window.scrollY;
    let skew = 0;
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const vel = y - lastY;
      lastY = y;
      skew += (Math.max(-6, Math.min(6, vel * 0.12)) - skew) * 0.1;
      el.style.transform = `skewY(${skew}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const row = (list, cls) => (
    <div className={`rev-belt ${cls}`}>
      <div className="belt-track">
        {[...list, ...list].map((r, i) => <Chip r={r} key={`${r.name}-${i}`} />)}
      </div>
    </div>
  );

  return (
    <div className="rev-belt-wrap" ref={wrapRef}>
      {row(reviews, "")}
      {row([...reviews].reverse(), "reverse")}
    </div>
  );
}
