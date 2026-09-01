import { useEffect, useRef } from "react";
import TiltCard from "@/components/TiltCard";
import { services } from "@/data/site";

/**
 * Horizontal-scroll services: the section pins and the card track slides
 * sideways as the page scrolls. Collapses to a plain vertical list on
 * mobile / reduced motion (handled in CSS via the 760px breakpoint).
 */
export default function ServicesRail() {
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const layout = () => {
      if (window.innerWidth <= 760) { stage.style.height = ""; return false; }
      const span = track.scrollWidth - window.innerWidth;
      stage.style.height = `${window.innerHeight + span}px`;
      return true;
    };

    const update = () => {
      raf = 0;
      if (!layout()) { track.style.transform = ""; return; }
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      track.style.transform = `translateX(${-p * total}px)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    // reduced motion: CSS renders the plain vertical list — no scrub needed
    if (reduce) return;

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="rail-stage" ref={stageRef}>
      <div className="rail-sticky">
        <div className="rail-head">
          <span className="eyebrow">What we deliver</span>
          <h2>Six disciplines. <span className="gradient-text">One obsession.</span></h2>
        </div>
        <div className="rail-track" ref={trackRef}>
          {services.map((s, i) => (
            <TiltCard key={s.title} max={7} className="rail-tilt">
              <article className="rail-card">
                <div className="no">0{i + 1}</div>
                <div className="ic">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            </TiltCard>
          ))}
        </div>
        <div className="rail-progress"><i ref={barRef} /></div>
      </div>
    </div>
  );
}
