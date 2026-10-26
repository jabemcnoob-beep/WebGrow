import { useEffect, useRef } from "react";
import Link from "next/link";
import { subscribe, docTop, prefersReducedMotion } from "@/lib/scroll";

const WORD = "Let’s grow";

/**
 * The giant "LET'S GROW." wordmark. Its letters climb out of the footer's
 * edge one after another as the footer scrolls up, tied to scroll position.
 * Transform-only, and only while the footer is on screen.
 */
export default function FooterShout() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const letters = [...el.querySelectorAll(".fs-l")];
    const last = letters.map(() => "");
    let top = 0, maxY = 0;
    const set = (i, v) => { if (last[i] !== v) { last[i] = v; letters[i].style.transform = v; } };
    return subscribe({
      measure: () => {
        top = docTop(el);
        maxY = document.documentElement.scrollHeight - window.innerHeight;
        last.fill("");
      },
      update: (y, vh) => {
        if (y + vh < top - 40) return; // footer not reached yet
        // all letters are home once the wordmark is ~40% up the screen — or
        // at the very bottom of the page, if it can't scroll that far
        const start = top - vh;
        const end = Math.min(top - vh * 0.4, maxY);
        const p = end > start ? Math.max(0, Math.min(1, (y - start) / (end - start))) : 1;
        letters.forEach((_, i) => {
          const t = Math.max(0, Math.min(1, p * 1.6 - i * 0.055));
          const e = 1 - Math.pow(1 - t, 3);
          set(i, e >= 0.999 ? "none" : `translate3d(0, ${((1 - e) * 105).toFixed(1)}%, 0) rotate(${((1 - e) * 9).toFixed(2)}deg)`);
        });
      },
    });
  }, []);

  return (
    <Link href="/contact" className="footer-shout" aria-label="Let's grow — get in touch" ref={ref}>
      {[...WORD].map((c, i) => (
        <span className="fs-l" key={i} aria-hidden="true">{c === " " ? "\u00a0" : c}</span>
      ))}
      <span className="fs-l tail" aria-hidden="true">.</span>
    </Link>
  );
}
