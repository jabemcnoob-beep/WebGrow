import { useEffect, useRef } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";
import TiltCard from "@/components/TiltCard";
import { services } from "@/data/site";
import SplitWords from "@/components/SplitWords";

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

    // reduced motion: CSS renders the plain vertical list — no scrub needed
    if (prefersReducedMotion()) return;

    // measure (on resize only): size the stage to the track's overflow
    let top = 0, total = 0, active = false, lastP = -1;
    return subscribe({
      measure: () => {
        active = window.innerWidth > 760;
        if (!active) { stage.style.height = ""; track.style.transform = ""; return; }
        total = track.scrollWidth - window.innerWidth;
        stage.style.height = `${window.innerHeight + total}px`;
        top = docTop(stage);
        lastP = -1;
      },
      update: (y) => {
        if (!active) return;
        const p = total > 0 ? Math.min(1, Math.max(0, (y - top) / total)) : 0;
        if (p === lastP) return;
        lastP = p;
        track.style.transform = `translate3d(${-p * total}px, 0, 0)`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      },
    });
  }, []);

  return (
    <div className="rail-stage" ref={stageRef}>
      <div className="rail-sticky">
        <div className="rail-head">
          <span className="eyebrow">What we deliver</span>
          <SplitWords parts={["Six disciplines.", { accent: "One obsession." }]} />
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
