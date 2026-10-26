import { Fragment, useEffect, useRef } from "react";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

/**
 * A paragraph that "inks in" word by word as you scroll through it: words
 * start faint and turn solid in reading order, tied to scroll position (scroll
 * back up and they fade again). Per frame it only toggles the classes of the
 * words whose state changed. Fully inked under reduced motion.
 */
export default function InkText({ text, as: Tag = "p", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll(".ink-w");
    if (prefersReducedMotion()) { words.forEach((w) => w.classList.add("on")); return; }

    let top = 0, h = 0, lit = -1;
    return subscribe({
      measure: () => { top = docTop(el); h = el.offsetHeight; lit = -1; },
      update: (y, vh) => {
        // starts when the text is 88% down the viewport, done by 45%
        const start = top - vh * 0.88;
        const end = top + h - vh * 0.45;
        const p = Math.max(0, Math.min(1, (y - start) / (end - start)));
        const n = Math.round(p * words.length);
        if (n === lit) return;
        const lo = lit < 0 ? 0 : Math.min(n, lit);
        const hi = lit < 0 ? words.length : Math.max(n, lit);
        for (let i = lo; i < hi; i++) words[i].classList.toggle("on", i < n);
        lit = n;
      },
    });
  }, [text]);

  return (
    <Tag ref={ref} className={`ink-text ${className}`}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}><span className="ink-w" aria-hidden="true">{w}</span>{" "}</Fragment>
      ))}
    </Tag>
  );
}
