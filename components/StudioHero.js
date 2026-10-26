import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import { Arrow } from "@/components/Icon";
import { site, work } from "@/data/site";
import { subscribe, docTop, prefersReducedMotion, requestFrame } from "@/lib/scroll";

// Two cuts of the same push-in: a wide one for desktops/tablets and a tall
// one for phones. `quad` is the inner glass of the laptop screen in the LAST
// frame (frame px): TL, TR, BR, BL.
const SEQS = {
  wide: { dir: "/media/hero", count: 120, w: 1600, h: 904, quad: [[490, 132], [1235, 136], [1222, 602], [480, 578]] },
  tall: { dir: "/media/hero-m", count: 120, w: 720, h: 1275, quad: [[159, 367], [643, 380], [631, 708], [139, 677]] },
};
// size of the site screenshot plane before it is warped onto the screen
const PW = 1280, PH = 800;

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const span = (p, a, b) => clamp01((p - a) / (b - a));
// frames kept decoded on each side of the playhead (each ≈ 3–6 MB of pixels)
const WIN = 6;

/* CSS matrix3d that maps the rect (0,0)-(w,h) onto quad [tl, tr, br, bl] */
function quadMatrix(w, h, q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / det;
  const hh = (dx1 * sy - sx * dy1) / det;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // unit square -> quad, pre-scaled by 1/w, 1/h
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${hh / h},0,0,1,0,${c},${f},0,1)`;
}

/* load order: every 8th frame, then every 4th, 2nd, 1st — scrubbing works
   (coarsely) almost immediately and sharpens as the rest arrive */
function loadOrder(n) {
  const seen = new Set(), order = [];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < n; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
  }
  if (!seen.has(n - 1)) order.splice(1, 0, n - 1);
  return order;
}

/**
 * Homepage opener. A sticky 100vh stage scrubbed by scroll:
 * headline over a rounded window → window opens full-bleed → camera pushes
 * in over the designer's shoulder (an image sequence drawn on a canvas, far
 * smoother than seeking an mp4) → a real client site appears on the laptop
 * screen, warped to its exact perspective → the view zooms through the
 * screen into the flat, full-size site. The footage is AI-generated; the
 * website on the screen is the real thing.
 *
 * Smoothness: neighbouring frames are cross-blended for sub-frame motion, and
 * the hero's progress glides after the scroll position rather than jumping
 * with every wheel notch (the page itself still scrolls natively).
 */
export default function StudioHero() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const zoomRef = useRef(null);
  const screenRef = useRef(null);
  const flatRef = useRef(null);
  const headRef = useRef(null);
  const capRef = useRef(null);
  const hintRef = useRef(null);
  const project = work[0];

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    // Frames arrive as compressed blobs; only a small window around the
    // playhead is decoded, in the background, into ImageBitmaps. Drawing an
    // ImageBitmap never decodes on the main thread, so a fast scroll can't
    // stall on a 1600px frame.
    let seq = null, blobs = [], bmps = new Map();
    let lastDraw = "", p = 0, target = 0, lastP = -1, dirty = true;
    let geo = null; // cover geometry, recomputed on resize
    let stageTop = 0, stageH = 0;

    const release = () => { for (const bm of bmps.values()) bm && bm.close(); bmps = new Map(); };

    const load = (next) => {
      if (seq === next) return;
      release();
      const gen = (seq = next);
      blobs = new Array(seq.count);
      for (const i of loadOrder(seq.count)) {
        fetch(`${seq.dir}/${String(i).padStart(3, "0")}.webp`)
          .then((r) => (r.ok ? r.blob() : null))
          .then((b) => { if (b && seq === gen) { blobs[i] = b; dirty = true; requestFrame(); } })
          .catch(() => {});
      }
    };

    // decode the frames around c; drop ones that have fallen well behind
    const prime = (c) => {
      for (let d = 0; d <= WIN; d++) {
        for (const i of d ? [c + d, c - d] : [c]) {
          if (i < 0 || i >= seq.count || bmps.has(i) || !blobs[i]) continue;
          bmps.set(i, null);
          const gen = seq;
          createImageBitmap(blobs[i]).then((bm) => {
            if (seq !== gen || !bmps.has(i)) { bm.close(); return; }
            bmps.set(i, bm); dirty = true; requestFrame();
          }).catch(() => bmps.delete(i));
        }
      }
      for (const [i, bm] of bmps) if (Math.abs(i - c) > WIN + 2) { if (bm) bm.close(); bmps.delete(i); }
    };

    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      load(vw / vh < 0.8 ? SEQS.tall : SEQS.wide);
      const { w: FW, h: FH, quad } = seq;
      // 1.5x is visually identical for soft-focus footage and far fewer pixels
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      const s = Math.max(vw / FW, vh / FH);
      // centre the crop on the laptop screen, never past the frame's edges
      const fx = quad.reduce((t, v) => t + v[0], 0) / 4, fy = quad.reduce((t, v) => t + v[1], 0) / 4;
      const ox = Math.min(0, Math.max(vw - FW * s, vw / 2 - fx * s));
      const oy = Math.min(0, Math.max(vh - FH * s, vh / 2 - fy * s));
      const q = quad.map(([x, y]) => [x * s + ox, y * s + oy]);
      const cx = q.reduce((t, v) => t + v[0], 0) / 4, cy = q.reduce((t, v) => t + v[1], 0) / 4;
      const qw = Math.max(q[1][0], q[2][0]) - Math.min(q[0][0], q[3][0]);
      const qh = Math.max(q[2][1], q[3][1]) - Math.min(q[0][1], q[1][1]);
      // the window starts just below the headline block, whatever its height
      const head = headRef.current;
      const headBottom = head ? head.offsetTop + head.offsetHeight + 28 : vh * 0.4;
      const insetTop = Math.max(24, Math.min(72, (headBottom / vh) * 100));
      geo = { vw, vh, dpr, s, ox, oy, FW, FH, q, cx, cy, insetTop, k: Math.max(vw / qw, vh / qh) * 1.12 };
      if (screenRef.current) screenRef.current.style.transform = quadMatrix(PW, PH, q);
      if (zoomRef.current) zoomRef.current.style.transformOrigin = `${cx}px ${cy}px`;
      stageTop = docTop(stage);
      stageH = stage.offsetHeight;
      lastDraw = "";
      lastP = -1; // resizing the canvas cleared it — force a redraw
    };

    // f is a fractional frame index: blend frame ⌊f⌋ with the next one
    const draw = (f) => {
      prime(Math.round(f));
      let a = Math.floor(f), t = f - a;
      let b = Math.min(a + 1, seq.count - 1);
      // until those are decoded, show the nearest frame that is
      if (!bmps.get(a)) {
        let k = 1;
        while (k <= WIN + 2 && !bmps.get(a - k) && !bmps.get(a + k)) k++;
        a = bmps.get(a - k) ? a - k : a + k;
        b = a; t = 0;
      }
      if (!bmps.get(a)) return;
      if (!bmps.get(b)) { b = a; t = 0; }
      const key = `${a}:${b}:${Math.round(t * 24)}`;
      if (key === lastDraw) return;
      lastDraw = key;
      const { dpr, s, ox, oy, FW, FH } = geo;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(bmps.get(a), ox, oy, FW * s, FH * s);
      if (t > 0.02 && b !== a) {
        ctx.globalAlpha = t;
        ctx.drawImage(bmps.get(b), ox, oy, FW * s, FH * s);
        ctx.globalAlpha = 1;
      }
    };

    const apply = () => {
      if (!geo) return;
      const { vw, vh, k, cx, cy, insetTop } = geo;
      // 1. window opens: inset clip shrinks to nothing
      const open = ease(span(p, 0, 0.14));
      if (frameRef.current) {
        const t = lerp(insetTop, 0, open), sd = lerp(vw < 760 ? 4 : 6, 0, open), b = lerp(vw < 760 ? 3 : 5, 0, open), r = lerp(28, 0, open);
        frameRef.current.style.clipPath = `inset(${t}% ${sd}% ${b}% ${sd}% round ${r}px)`;
      }
      if (headRef.current) {
        headRef.current.style.opacity = String(1 - span(p, 0.02, 0.1));
        headRef.current.style.transform = `translateY(${-open * 40}px)`;
        headRef.current.style.pointerEvents = p > 0.08 ? "none" : "auto";
      }
      if (hintRef.current) hintRef.current.style.opacity = String(1 - span(p, 0, 0.05));
      // 2. push-in frames (linear: the footage already eases in and out)
      draw(span(p, 0.06, 0.6) * (seq.count - 1));
      // 3. the real site lights up on the screen
      if (screenRef.current) screenRef.current.style.opacity = String(span(p, 0.57, 0.65));
      // 4. zoom through the screen
      const z = ease(span(p, 0.65, 0.86));
      if (zoomRef.current) {
        zoomRef.current.style.transform =
          `translate(${(vw / 2 - cx) * z}px, ${(vh / 2 - cy) * z}px) scale(${1 + (k - 1) * z})`;
      }
      // 5. hand off to the flat, sharp screenshot, which then scrolls a little
      if (flatRef.current) {
        flatRef.current.style.opacity = String(span(p, 0.8, 0.88));
        flatRef.current.querySelector("img").style.objectPosition = `50% ${lerp(0, 35, span(p, 0.88, 1))}%`;
      }
      if (capRef.current) {
        const c = span(p, 0.86, 0.93);
        capRef.current.style.opacity = String(c);
        capRef.current.style.transform = `translateY(${(1 - c) * 16}px)`;
        capRef.current.style.pointerEvents = c > 0.5 ? "auto" : "none";
      }
    };

    measure();
    // the headline reflows once the display font arrives; re-fit the window
    document.fonts?.ready.then(() => { measure(); apply(); });

    if (prefersReducedMotion()) {
      // static: the opened frame with the headline, no scrub, no pinned scroll
      p = 0.15;
      stage.style.height = "auto";
      apply();
      if (headRef.current) { headRef.current.style.opacity = "1"; headRef.current.style.transform = "none"; headRef.current.style.pointerEvents = "auto"; }
      return subscribe({ measure: () => { measure(); apply(); } });
    }

    let first = true;
    const unsub = subscribe({
      measure,
      update: (y, vh) => {
        const total = stageH - vh;
        if (y > stageTop + stageH + vh) { if (bmps.size) { release(); lastDraw = ""; } return; }
        target = total > 0 ? clamp01((y - stageTop) / total) : 0;
        // glide toward the scroll position; jump when far away (first paint,
        // anchor links, returning from below) so it never lags visibly
        const d = target - p;
        if (first || Math.abs(d) > 0.25) { p = target; first = false; }
        else if (Math.abs(d) > 0.0004) { p += d * 0.16; requestFrame(); }
        else p = target;
        if (p === lastP && !dirty) return;
        lastP = p;
        dirty = false;
        apply();
      },
    });
    return () => { unsub(); release(); seq = null; };
  }, []);

  return (
    <section className="sh-stage" ref={stageRef} aria-label="WebGrow studio">
      <Head>
        {/* first frame of whichever cut this screen will use, so the hero never paints blank */}
        <link rel="preload" as="fetch" crossOrigin="anonymous" href={`${SEQS.wide.dir}/000.webp`} media="(min-aspect-ratio: 4/5)" />
        <link rel="preload" as="fetch" crossOrigin="anonymous" href={`${SEQS.tall.dir}/000.webp`} media="(max-aspect-ratio: 4/5)" />
      </Head>
      <div className="sh-sticky">
        <div className="sh-head container" ref={headRef}>
          <span className="eyebrow">{site.name} — web design studio · {site.area}</span>
          <h1 className="sh-title">
            Beautiful websites, <span className="gradient-text">built to sell.</span>
          </h1>
          <div className="sh-row">
            <p className="lead">
              Custom, hand-coded websites for Sedona, Cottonwood and Verde Valley businesses —
              fast, found on Google, and designed to turn visitors into customers.
            </p>
            <div className="sh-ctas">
              <Magnetic><Link href="/contact" className="btn btn-primary btn-lg">Get a free quote <Arrow /></Link></Magnetic>
              <Magnetic><Link href="/work" className="btn btn-ghost btn-lg">See the work</Link></Magnetic>
            </div>
          </div>
        </div>

        <div className="sh-frame" ref={frameRef} aria-hidden="true">
          <div className="sh-zoom" ref={zoomRef}>
            <canvas className="sh-canvas" ref={canvasRef} />
            <div className="sh-screen" ref={screenRef} style={{ width: PW, height: PH }}>
              <img src={project.image} alt="" draggable={false} />
            </div>
          </div>
          <div className="sh-flat" ref={flatRef}>
            <picture>
              {project.mobileImage && <source media="(max-width: 760px)" srcSet={project.mobileImage} />}
              <img src={project.image} alt="" draggable={false} />
            </picture>
          </div>
        </div>

        <div className="sh-hint" ref={hintRef} aria-hidden="true">Scroll</div>

        <div className="sh-cap" ref={capRef}>
          <span className="sh-cap-tag">Real client work</span>
          <strong>{project.title}</strong>
          <span className="sh-cap-url">{project.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
          <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-white">Visit the live site ↗</a>
        </div>
      </div>
    </section>
  );
}
