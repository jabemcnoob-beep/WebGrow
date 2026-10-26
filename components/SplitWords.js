import { Fragment, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/scroll";

/**
 * A heading whose words rise out of a mask one after another the first time
 * it scrolls into view. `parts` mixes plain strings and { accent } segments
 * (rendered in the pink→purple gradient). The motion is a CSS transition, so
 * it costs nothing per frame. Screen readers get the plain sentence once.
 */
export default function SplitWords({ as: Tag = "h2", parts, className = "", stagger = 55 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { rootMargin: "0px 0px -12% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const text = parts.map((p) => (typeof p === "string" ? p : p.accent)).join(" ");
  let n = 0;

  return (
    <Tag ref={ref} className={`split-words ${on ? "is-on" : ""} ${className}`}>
      <span className="sr-only">{text}</span>
      {parts.map((part, k) => {
        const accent = typeof part !== "string";
        return (accent ? part.accent : part).split(" ").filter(Boolean).map((w) => {
          const i = n++;
          return (
            <Fragment key={`${k}-${i}`}>
              <span className="sw" aria-hidden="true">
                <span className={`sw-in${accent ? " gradient-text" : ""}`} style={{ transitionDelay: `${i * stagger}ms` }}>{w}</span>
              </span>{" "}
            </Fragment>
          );
        });
      })}
    </Tag>
  );
}
