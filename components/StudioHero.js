import { useEffect, useRef } from "react";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import { Arrow } from "@/components/Icon";
import { site, work } from "@/data/site";

const FRAMES = 72;
const SRC = (i) => `/media/hero/${String(i).padStart(3, "0")}.jpg`;
const FW = 1280, FH = 716; // frame size the screen corners were measured on
// inner glass of the laptop screen in the LAST frame (video px): TL, TR, BR, BL
const QUAD = [[468, 166], [1050, 204], [1000, 642], [386, 556]];
// the screen centroid doubles as the crop focal point on narrow screens
const FOCUS_X = (QUAD[0][0] + QUAD[1][0] + QUAD[2][0] + QUAD[3][0]) / 4;
const FOCUS_Y = (QUAD[0][1] + QUAD[1][1] + QUAD[2][1] + QUAD[3][1]) / 4;
// size of the site screenshot plane before it is warped onto the screen
const PW = 1280, PH = 800;

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const span = (p, a, b) => clamp01((p - a) / (b - a));

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

/**
 * Homepage opener. A sticky 100vh stage scrubbed by scroll:
 * headline over a rounded window → window opens full-bleed → camera pushes
 * in over the designer's shoulder (72-frame sequence drawn on a canvas, far
 * smoother than seeking an mp4) → a real client site appears on the laptop
 * screen, warped to its exact perspective → the view zooms through the
 * screen into the flat, full-size site. The footage is AI-generated; the
 * website on the screen is the real thing.
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
    const imgs = new Array(FRAMES);
    let loaded = 0, lastDrawn = -1, raf = 0, p = 0;
    let geo = null; // cover geometry, recomputed on resize

    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      const s = Math.max(vw / FW, vh / FH);
      // centre the crop on the laptop screen, never past the frame's edges
      const ox = Math.min(0, Math.max(vw - FW * s, vw / 2 - FOCUS_X * s));
      const oy = Math.min(0, Math.max(vh - FH * s, vh / 2 - FOCUS_Y * s));
      const q = QUAD.map(([x, y]) => [x * s + ox, y * s + oy]);
      const cx = q.reduce((t, v) => t + v[0], 0) / 4, cy = q.reduce((t, v) => t + v[1], 0) / 4;
      const qw = Math.max(q[1][0], q[2][0]) - Math.min(q[0][0], q[3][0]);
      const qh = Math.max(q[2][1], q[3][1]) - Math.min(q[0][1], q[1][1]);
      // the window starts just below the headline block, whatever its height
      const head = headRef.current;
      const headBottom = head ? head.offsetTop + head.offsetHeight + 28 : vh * 0.4;
      const insetTop = Math.max(24, Math.min(72, (headBottom / vh) * 100));
      geo = { vw, vh, dpr, s, ox, oy, q, cx, cy, insetTop, k: Math.max(vw / qw, vh / qh) * 1.12 };
      if (screenRef.current) screenRef.current.style.transform = quadMatrix(PW, PH, q);
      if (zoomRef.current) zoomRef.current.style.transformOrigin = `${cx}px ${cy}px`;
      lastDrawn = -1;
    };

    const draw = (i) => {
      // nearest loaded frame at or before i, so early scrolling never blanks
      let j = i;
      while (j > 0 && !(imgs[j] && imgs[j].complete && imgs[j].naturalWidth)) j--;
      const img = imgs[j];
      if (!img || !img.complete || !img.naturalWidth || j === lastDrawn) return;
      lastDrawn = j;
      const { dpr, s, ox, oy } = geo;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(img, ox, oy, FW * s, FH * s);
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
      // 2. push-in frames
      draw(Math.round(ease(span(p, 0.08, 0.58)) * (FRAMES - 1)));
      // 3. the real site lights up on the screen
      if (screenRef.current) screenRef.current.style.opacity = String(span(p, 0.56, 0.64));
      // 4. zoom through the screen
      const z = ease(span(p, 0.64, 0.86));
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

    const onFrameLoad = () => {
      loaded++;
      if (loaded === 1 || lastDrawn < 0) apply();
    };

    measure();
    // the headline reflows once the display font arrives; re-fit the window
    document.fonts?.ready.then(() => { measure(); apply(); });
    // first frame first (it's the poster), then the rest in order
    for (let i = 0; i < FRAMES; i++) {
      const im = new Image();
      im.decoding = "async";
      im.onload = onFrameLoad;
      im.src = SRC(i);
      imgs[i] = im;
    }

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // static: the opened frame with the headline, no scrub, no pinned scroll
      p = 0.15;
      stage.style.height = "auto";
      apply();
      if (headRef.current) { headRef.current.style.opacity = "1"; headRef.current.style.transform = "none"; headRef.current.style.pointerEvents = "auto"; }
      const onResize = () => { measure(); apply(); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      p = total > 0 ? clamp01(-rect.top / total) : 0;
      apply();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="sh-stage" ref={stageRef} aria-label="WebGrow studio">
      <div className="sh-sticky">
        <div className="sh-head container" ref={headRef}>
          <span className="eyebrow">{site.name} — web design studio · {site.area}</span>
          <h1 className="sh-title">
            Beautiful websites, <span className="gradient-text">built to sell.</span>
          </h1>
          <div className="sh-row">
            <p className="lead">
              Custom, hand-coded sites for Arizona businesses and beyond — fast, found on
              Google, and designed to turn visitors into customers.
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
