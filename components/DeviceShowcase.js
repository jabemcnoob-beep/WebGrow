import { useEffect, useRef } from "react";
import { work } from "@/data/site";
import { Arrow } from "@/components/Icon";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Exclusive window: ramps 0→1 across [in0,in1], holds 1, ramps 1→0 across [out0,out1].
const win = (x, in0, in1, out0, out1) =>
  clamp01((x - in0) / (in1 - in0)) * (1 - clamp01((x - out0) / (out1 - out0)));

const N = work.length;
const CHAPTER = 1 / N;
// Half-width (in global progress) of the wipe transition straddling each chapter boundary.
const WIPE = 0.028;
// Half-width of the device-swing / glow pulse around each boundary.
const PULSE = 0.07;
const pad2 = (n) => String(n).padStart(2, "0");

/**
 * DeviceShowcase — pinned scroll gallery (~520vh) where a CSS-built laptop and
 * phone cycle through the four real client sites from data/site.js. Each
 * quarter of the scroll is one "chapter": the screenshot slowly pans inside
 * both screens (vertical on the laptop, horizontal on the phone), then wipes
 * to the next project with a clip-path transition while the devices swing on
 * rotateY. A left-hand HUD shows the chapter index, project title, tags, a
 * live-site link, and four sequential progress tracks.
 */
export default function DeviceShowcase() {
  const stageRef = useRef(null);
  const laptopRef = useRef(null);
  const phoneRef = useRef(null);
  const glareRef = useRef(null);
  const glowRef = useRef(null);
  const indexNumRef = useRef(null);
  const laptopShotRefs = useRef([]);
  const phoneShotRefs = useRef([]);
  const titleRefs = useRef([]);
  const panelRefs = useRef([]);
  const linkRefs = useRef([]);
  const fillRefs = useRef([]);

  useEffect(() => {
    const isContain = work.map((w) => w.imageFit === "contain");
    let lastCi = -1;

    const apply = (p) => {
      const ci = Math.min(N - 1, Math.floor(p * N));
      const q = clamp01(p * N - ci); // progress within the current chapter

      // Signed swing pulse near chapter boundaries (direction alternates).
      let swing = 0;
      for (let i = 1; i < N; i++) {
        const d = (p - i * CHAPTER) / PULSE;
        if (Math.abs(d) < 1) {
          const amp = easeInOut(1 - Math.abs(d));
          if (amp > Math.abs(swing)) swing = amp * (i % 2 ? -1 : 1);
        }
      }
      const pulse = Math.abs(swing);

      // Devices: quick entrance settle + boundary swings (phone counter-swings).
      const e = easeOut(clamp01(p / 0.1));
      if (laptopRef.current) {
        laptopRef.current.style.transform =
          `rotateX(${lerp(10, 4, e)}deg) rotateY(${(swing * 6).toFixed(2)}deg) ` +
          `translateY(${lerp(3, 0, e).toFixed(2)}%) scale(${lerp(0.96, 1, e).toFixed(4)})`;
      }
      if (phoneRef.current) {
        phoneRef.current.style.transform =
          `rotateY(${(lerp(-18, -9, e) - swing * 9).toFixed(2)}deg) translateY(${lerp(6, 0, e).toFixed(2)}%)`;
      }

      // Per-image wipe (outgoing), slide+scale (incoming), and screen pan.
      for (let i = 0; i < N; i++) {
        const start = i * CHAPTER;

        // Outgoing: clip-path inset grows from the left, revealing the shot beneath.
        let clip = "inset(0 0 0 0%)";
        if (i < N - 1) {
          const t = easeInOut(clamp01((p - ((i + 1) * CHAPTER - WIPE)) / (WIPE * 2)));
          clip = `inset(0 0 0 ${(t * 100).toFixed(2)}%)`;
        }

        // Incoming: settles from a slight slide + 1.06 scale as its chapter opens.
        let tf = "none";
        if (i > 0) {
          const s = easeOut(clamp01((p - (start - WIPE)) / (WIPE * 2)));
          tf = `translateX(${lerp(2.5, 0, s).toFixed(2)}%) scale(${lerp(1.06, 1, s).toFixed(4)})`;
        }

        // Pan across the shot for the duration of this image's own chapter.
        const qi = easeInOut(clamp01((p - start) / CHAPTER));

        const lap = laptopShotRefs.current[i];
        if (lap) {
          lap.style.clipPath = clip;
          lap.style.transform = tf;
          if (!isContain[i]) lap.style.objectPosition = `50% ${lerp(0, 70, qi).toFixed(2)}%`;
        }
        const ph = phoneShotRefs.current[i];
        if (ph) {
          ph.style.clipPath = clip;
          ph.style.transform = tf;
          if (!isContain[i]) ph.style.objectPosition = `${lerp(20, 80, qi).toFixed(2)}% 50%`;
        }
      }

      // Glare: one sheen sweep per chapter, parked off-screen otherwise.
      if (glareRef.current) {
        const g = easeInOut(clamp01((q - 0.15) / 0.6));
        glareRef.current.style.transform = `skewX(-14deg) translateX(${lerp(-180, 420, g).toFixed(1)}%)`;
      }

      // Floor glow pulses at transitions.
      if (glowRef.current) {
        glowRef.current.style.opacity = (0.45 + pulse * 0.55).toFixed(3);
        glowRef.current.style.transform = `translateX(-50%) scale(${(1 + pulse * 0.18).toFixed(3)})`;
      }

      // HUD titles + panels: exclusive fade windows so two never overlap.
      for (let i = 0; i < N; i++) {
        const in0 = i === 0 ? -1 : i * CHAPTER + 0.01;
        const in1 = i === 0 ? -0.5 : i * CHAPTER + 0.06;
        const out0 = i === N - 1 ? 2 : (i + 1) * CHAPTER - 0.06;
        const out1 = i === N - 1 ? 3 : (i + 1) * CHAPTER - 0.01;
        const v = win(p, in0, in1, out0, out1);
        const t = titleRefs.current[i];
        if (t) {
          t.style.opacity = v.toFixed(3);
          t.style.transform = `translateY(${((1 - v) * 14).toFixed(1)}px)`;
        }
        const pa = panelRefs.current[i];
        if (pa) {
          pa.style.opacity = v.toFixed(3);
          pa.style.transform = `translateY(${((1 - v) * 10).toFixed(1)}px)`;
          // interactivity follows visibility — during the wipe band no panel is
          // clickable/focusable, so an invisible link can never be activated.
          // The exclusive windows guarantee at most one panel is active.
          const active = v > 0.05;
          if (pa.dataset.active !== String(active)) {
            pa.dataset.active = String(active);
            pa.style.pointerEvents = active ? "auto" : "none";
            pa.setAttribute("aria-hidden", active ? "false" : "true");
            const ln = linkRefs.current[i];
            if (ln) ln.tabIndex = active ? 0 : -1;
          }
        }
      }

      // Progress tracks fill sequentially.
      for (let i = 0; i < N; i++) {
        const f = fillRefs.current[i];
        if (f) f.style.transform = `scaleX(${clamp01(p * N - i).toFixed(4)})`;
      }

      // Discrete chapter switch: the index readout only (interactivity is
      // handled per-panel above, tied to actual visibility).
      if (ci !== lastCi) {
        lastCi = ci;
        if (indexNumRef.current) indexNumRef.current.textContent = pad2(ci + 1);
      }
    };

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      apply(1);
      // collapse the pin: the sticky child is 100vh, so the stage becomes one
      // static viewport instead of ~4 dead scroll-heights
      if (stageRef.current) stageRef.current.style.height = "auto";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      apply(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Stack of the four project screenshots used inside both device viewports.
  const renderShots = (refStore, screen) =>
    work.map((w, i) => (
      <img
        key={w.image}
        src={w.image}
        alt={screen === "phone" ? "" : `${w.title} website`}
        className={`ds-shot ds-shot--${screen}${w.imageFit === "contain" ? " ds-shot--contain" : ""}`}
        style={{ zIndex: N - i, background: w.imageFit === "contain" ? w.thumbBg : undefined }}
        loading={i === 0 ? "eager" : "lazy"}
        draggable={false}
        ref={(el) => (refStore.current[i] = el)}
      />
    ));

  return (
    <div className="ds-stage" ref={stageRef}>
      <div className="ds-sticky">
        <div className="ds-head">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Real client work</span>
          <h2>Our work, on <span className="gradient-text">every screen</span>.</h2>
        </div>

        <div className="ds-body">
          <div className="ds-scene">
            <div className="ds-glow" ref={glowRef} aria-hidden="true" />
            <div className="ds-rig">
              <div className="ds-laptop" ref={laptopRef}>
                <div className="ds-laptop-lid">
                  <div className="ds-laptop-viewport">
                    {renderShots(laptopShotRefs, "laptop")}
                    <div className="ds-glare" ref={glareRef} aria-hidden="true" />
                  </div>
                </div>
                <div className="ds-laptop-base" aria-hidden="true">
                  <span className="ds-laptop-notch" />
                </div>
              </div>

              <div className="ds-phone" ref={phoneRef}>
                <div className="ds-phone-frame">
                  <div className="ds-phone-viewport">
                    {renderShots(phoneShotRefs, "phone")}
                    <span className="ds-phone-pill" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ds-hud">
            <div className="ds-index" aria-hidden="true">
              <span className="ds-index-num" ref={indexNumRef}>01</span>
              <span className="ds-index-slash">/</span>
              <span className="ds-index-total">{pad2(N)}</span>
            </div>

            <div className="ds-titles">
              {work.map((w, i) => (
                <div
                  key={w.title}
                  className="ds-title"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  ref={(el) => (titleRefs.current[i] = el)}
                >
                  {w.title}
                </div>
              ))}
            </div>

            <div className="ds-panels">
              {work.map((w, i) => (
                <div
                  key={w.title}
                  className="ds-panel"
                  aria-hidden={i !== 0}
                  style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
                  ref={(el) => (panelRefs.current[i] = el)}
                >
                  <div className="ds-pills">
                    {w.tags.map((t) => <span className="pill" key={t}>{t}</span>)}
                  </div>
                  <a
                    className="btn btn-ghost ds-visit"
                    href={w.url}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={i === 0 ? 0 : -1}
                    ref={(el) => (linkRefs.current[i] = el)}
                  >
                    Visit live site <Arrow />
                  </a>
                </div>
              ))}
            </div>

            <div className="ds-tracks" aria-hidden="true">
              {work.map((w, i) => (
                <span className="ds-track" key={w.title}>
                  <i className="ds-track-fill" ref={(el) => (fillRefs.current[i] = el)} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
