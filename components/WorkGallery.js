import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { Arrow } from "./Icon";
import { work } from "@/data/site";

/**
 * Work as an editorial index: big rows, and on desktop a floating site
 * screenshot that chases the cursor while a row is hovered.
 */
export default function WorkGallery() {
  const floatRef = useRef(null);
  const [active, setActive] = useState(null); // index of hovered row

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let x = 0, y = 0, cx = -9999, cy = -9999;
    let raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (cx < -999) { cx = x; cy = y; }
      // position immediately too, so the preview appears even before the
      // lerp loop gets its first frame
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = active != null ? work[active] : null;

  return (
    <div className="wgal" onMouseLeave={() => setActive(null)}>
      {work.map((w, i) => (
        <Reveal
          as="a"
          key={w.title}
          href={w.url}
          target="_blank"
          rel="noreferrer"
          className="wgal-row"
          delay={i * 60}
          onMouseEnter={() => setActive(i)}
        >
          <span className="idx">0{i + 1}</span>
          <h3>{w.title}</h3>
          <span className="tags">
            {w.tags.slice(0, 2).map((t) => <span className="pill" key={t}>{t}</span>)}
          </span>
          <span className="arrow"><Arrow /></span>
        </Reveal>
      ))}

      <div
        className={`wgal-float ${current ? "on" : ""} ${current?.imageFit === "contain" ? "contain" : ""}`}
        ref={floatRef}
        style={current?.thumbBg ? { background: current.thumbBg } : undefined}
        aria-hidden
      >
        {current && <img src={current.image} alt="" />}
      </div>
    </div>
  );
}
