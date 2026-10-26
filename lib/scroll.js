// One scroll engine for every scroll-driven effect on the site.
//
// Each effect subscribes with two callbacks:
//   measure()            — READ layout (getBoundingClientRect, offsetHeight…).
//                           Runs once on subscribe, then only on resize or when
//                           the page's height changes — never per frame.
//   update(y, vh, vel)   — WRITE styles from cached numbers + scroll position.
//                           Runs inside a single shared requestAnimationFrame.
// Keeping reads out of the per-frame path avoids forced layouts, and one rAF
// for everything means effects never fight each other for frames.
//
// Scrolling itself stays native: the browser scrolls on its compositor
// thread, so a busy main thread never makes the page itself stutter.

const subs = new Set();
let raf = 0;
let started = false;
let lastY = 0;
let vel = 0;

function frame() {
  raf = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  // smoothed velocity (px/frame) for effects that react to scroll speed
  vel += (y - lastY - vel) * 0.25;
  lastY = y;
  for (const s of subs) s.update && s.update(y, vh, vel);
  // keep ticking while the velocity decays back to rest
  if (Math.abs(vel) > 0.05) requestFrame();
  else vel = 0;
}

export function requestFrame() {
  if (!raf) raf = requestAnimationFrame(frame);
}

export function measureAll() {
  for (const s of subs) s.measure && s.measure();
  requestFrame();
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  lastY = window.scrollY;
  window.addEventListener("scroll", requestFrame, { passive: true });
  let t = 0;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(measureAll, 120);
  });
  // images/fonts/route changes alter the page height → positions move
  if ("ResizeObserver" in window) {
    let pending = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(measureAll);
    }).observe(document.body);
  }
}

/** Subscribe an effect; returns an unsubscribe function. */
export function subscribe(effect) {
  start();
  subs.add(effect);
  effect.measure && effect.measure();
  requestFrame();
  return () => subs.delete(effect);
}

/** Document-space top of an element (call inside measure only). */
export function docTop(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

/** 0 when `top` reaches the bottom of the viewport, 1 when `top + h` passes the top. */
export function passProgress(y, vh, top, h) {
  return Math.max(0, Math.min(1, (y + vh - top) / (vh + h)));
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}
