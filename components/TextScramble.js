import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_/[]{}—=+*^?#$%";

/**
 * Decode/scramble text effect. Server renders the real text (per-char spans,
 * so there is no layout shift); after `delay` ms each character cycles through
 * glitch glyphs before locking in left-to-right over `duration` ms. Scrambling
 * characters light up pink via .fx-ch.fx-on. If `hover` is true the effect
 * replays on mouseenter. Reduced motion: final text, no animation.
 */
export default function TextScramble({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  duration = 900,
  hover = false,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // SSR markup already shows the final text

    const chars = text.split("");
    const spans = Array.from(el.querySelectorAll(".fx-ch"));
    if (spans.length !== chars.length) return;

    let raf = 0;
    let timer = 0;
    let frame = 0;

    const settle = () => {
      spans.forEach((s, i) => {
        s.textContent = chars[i];
        s.classList.remove("fx-on");
      });
    };

    const play = () => {
      if (raf) cancelAnimationFrame(raf);
      frame = 0;
      // Per-char lock times: left-to-right stagger, but every char scrambles
      // for at least ~20% of the duration so the first letters read as glitchy.
      const ends = chars.map((c, i) =>
        c === " " ? 0 : duration * (0.2 + (0.8 * (i + 1)) / chars.length)
      );
      const start = performance.now();

      const tick = (now) => {
        const t = now - start;
        let done = true;
        frame += 1;
        spans.forEach((s, i) => {
          if (t >= ends[i]) {
            if (s.textContent !== chars[i]) s.textContent = chars[i];
            s.classList.remove("fx-on");
          } else {
            done = false;
            // swap glyphs every other frame — full 60fps churn reads as static noise
            if (frame % 2 === 0) {
              s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
            s.classList.add("fx-on");
          }
        });
        if (done) {
          settle();
          raf = 0;
        } else {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    // If `text` changed, the previous effect's cleanup rewrote the OLD chars
    // into the reused spans (React no longer owns their text nodes) — sync the
    // DOM to the current text before the delayed play starts.
    settle();

    timer = setTimeout(play, delay);
    const onEnter = () => play();
    if (hover) el.addEventListener("mouseenter", onEnter);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      if (hover) el.removeEventListener("mouseenter", onEnter);
      settle();
    };
  }, [text, delay, duration, hover]);

  return (
    <Tag ref={ref} className={`fx-scramble ${className}`} aria-label={text} {...rest}>
      {text.split("").map((c, i) => (
        <span className="fx-ch" aria-hidden="true" key={i}>
          {c}
        </span>
      ))}
    </Tag>
  );
}
