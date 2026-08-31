import { useEffect, useRef } from "react";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
/* ramp up over [in0,in1], back down over [out0,out1] */
const win = (x, in0, in1, out0, out1) =>
  clamp01((x - in0) / (in1 - in0)) * (1 - clamp01((x - out0) / (out1 - out0)));

const STEPS = ["Wireframe", "Design", "Code", "Launch"];

const CODE_LINES = [
  ["pk", "$ webgrow create --client you"],
  ["wh", "▸ scaffolding pages…        done"],
  ["wh", "▸ wiring conversions…       done"],
  ["wh", "▸ tuning performance…       100/100"],
  ["wh", "▸ local SEO + schema…       done"],
  ["gr", "✓ build finished in 2.1s"],
  ["pk", "$ webgrow deploy --edge"],
  ["gr", "✓ live at yourbusiness.com"],
];

const CHIPS = [
  { n: "+340%", l: "traffic", x: "6%", y: "26%" },
  { n: "3×", l: "revenue", x: "80%", y: "24%" },
  { n: "100", l: "perf score", x: "84%", y: "64%" },
  { n: "5%+", l: "conversion", x: "2%", y: "68%" },
];

/**
 * The signature scroll piece: a browser window that builds itself as you
 * scroll — wireframe boxes draw in, the real design wipes over them, a
 * terminal ships the code, then the site "goes live" with metric chips.
 */
export default function BuildSequence() {
  const stageRef = useRef(null);
  const browserRef = useRef(null);
  const wfRef = useRef(null);
  const designRef = useRef(null);
  const termRef = useRef(null);
  const chipsRef = useRef(null);
  const glowRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    const wfBoxes = wfRef.current ? [...wfRef.current.querySelectorAll(".wf-box")] : [];
    const codeLines = termRef.current ? [...termRef.current.querySelectorAll(".ln")] : [];
    const chips = chipsRef.current ? [...chipsRef.current.querySelectorAll(".build-chip")] : [];
    const hudSteps = hudRef.current ? [...hudRef.current.querySelectorAll(".step")] : [];

    const apply = (p) => {
      // ---- stage windows: 0-.28 wireframe · .28-.52 design · .52-.78 code · .78-1 launch
      const wire = clamp01(p / 0.28);
      const design = clamp01((p - 0.28) / 0.24);
      const code = clamp01((p - 0.52) / 0.26);
      const launch = easeOut(clamp01((p - 0.78) / 0.2));

      // wireframe boxes draw in, staggered
      wfBoxes.forEach((box, i) => {
        const local = easeOut(clamp01((wire - i * 0.12) / (1 - i * 0.12 || 1)));
        box.style.transform = `scaleX(${local})`;
        box.style.opacity = String(local);
      });

      // designed layer wipes across left→right
      if (designRef.current) {
        const wipe = easeOut(design) * 100;
        designRef.current.style.clipPath = `inset(0 ${100 - wipe}% 0 0)`;
        designRef.current.style.opacity = design > 0 ? "1" : "0";
      }

      // terminal slides in, lines reveal one by one, slides away on launch
      if (termRef.current) {
        const inT = easeOut(clamp01(code * 2.2));
        const outT = easeOut(clamp01((p - 0.8) / 0.1));
        termRef.current.style.opacity = String(inT * (1 - outT));
        termRef.current.style.transform =
          `translateY(${lerp(46, 0, inT) + outT * 30}px) scale(${lerp(0.94, 1, inT)})`;
        const shown = Math.floor(code * (codeLines.length + 1));
        codeLines.forEach((ln, i) => ln.classList.toggle("show", i < shown));
      }

      // browser lifts and glows on launch; chips pop out around it
      if (browserRef.current) {
        browserRef.current.style.transform =
          `translateY(${lerp(18, -10, easeOut(wire)) - launch * 8}px) scale(${1 + launch * 0.025})`;
        browserRef.current.classList.toggle("is-live", p > 0.8);
      }
      if (glowRef.current) glowRef.current.style.opacity = String(launch);
      chips.forEach((chip, i) => {
        const local = easeOut(clamp01((launch - i * 0.12) / 0.6));
        chip.style.opacity = String(local);
        chip.style.transform =
          `translateY(${lerp(26, 0, local)}px) scale(${lerp(0.7, 1, local)}) rotate(${lerp(i % 2 ? 6 : -6, 0, local)}deg)`;
      });

      // HUD: active + done states
      const active = p < 0.28 ? 0 : p < 0.52 ? 1 : p < 0.78 ? 2 : 3;
      hudSteps.forEach((el, i) => {
        el.classList.toggle("active", i === active);
        el.classList.toggle("done", i < active);
      });
    };

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { apply(1); return; }

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

  return (
    <div className="build-stage" ref={stageRef}>
      <div className="build-sticky">
        <div className="build-head">
          <span className="eyebrow" style={{ justifyContent: "center" }}>How it feels to hire us</span>
          <h2>Watch us <span className="gradient-text">build</span> your site.</h2>
        </div>

        <div className="build-hud" ref={hudRef} aria-hidden>
          {STEPS.map((s, i) => (
            <div className="step" key={s}>
              <span className="tick" />
              <span className="no">0{i + 1}</span>
              <span className="label">{s}</span>
            </div>
          ))}
        </div>

        <div className="build-glow" ref={glowRef} />

        <div className="build-browser" ref={browserRef}>
          <div className="build-chrome">
            <div className="dots"><i /><i /><i /></div>
            <div className="url"><span className="lock">●</span> yourbusiness.com</div>
            <span className="build-live">LIVE</span>
          </div>

          <div className="build-canvas">
            {/* layer 1: wireframe */}
            <div className="build-layer" ref={wfRef} aria-hidden>
              <div className="wf-box wf-nav"><span className="tag">nav</span></div>
              <div className="wf-cols">
                <div className="wf-box wf-copy"><span className="tag">headline + cta</span></div>
                <div className="wf-box wf-img"><span className="tag">hero image</span></div>
              </div>
              <div className="wf-cards">
                <div className="wf-box"><span className="tag">service</span></div>
                <div className="wf-box"><span className="tag">service</span></div>
                <div className="wf-box"><span className="tag">service</span></div>
              </div>
            </div>

            {/* layer 2: the designed site, wiped in over the wireframe */}
            <div className="build-layer design-layer" ref={designRef} aria-hidden>
              <div className="dz-nav">
                <span className="logo" /><span className="lk" /><span className="lk" /><span className="cta" />
              </div>
              <div className="dz-cols">
                <div className="dz-copy">
                  <div className="t1" /><div className="t2" /><div className="p1" /><div className="p2" /><div className="btn-mock" />
                </div>
                <div className="dz-img" />
              </div>
              <div className="dz-cards">
                {[0, 1, 2].map((i) => (
                  <div className="dz-card" key={i}><div className="h" /><div className="l" /><div className="l s" /></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* code terminal */}
        <div className="build-term" ref={termRef} aria-hidden>
          <div className="t-bar"><span className="dots"><i /><i /><i /></span> webgrow — deploy</div>
          <pre>
            {CODE_LINES.map(([cls, text], i) => (
              <span className={`ln ${cls}`} key={i}>{text}</span>
            ))}
            <span className="caret" />
          </pre>
        </div>

        {/* launch metric chips */}
        <div className="build-chips" ref={chipsRef} aria-hidden>
          {CHIPS.map((c) => (
            <div className="build-chip" key={c.l} style={{ left: c.x, top: c.y }}>
              <span className="n">{c.n}</span>
              <span className="l">{c.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
