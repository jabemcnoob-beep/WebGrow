import { useEffect, useRef } from "react";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* One fake website drawn with divs — reused inside both device screens.
   `long` doubles the content so it has room to scroll. */
function MiniSite({ long = false, innerRef }) {
  const block = (key) => (
    <div key={key}>
      <div className="mini-hero">
        <div className="mini-h1" />
        <div className="mini-h1 short" />
        <div className="mini-p" />
        <div className="mini-p short" />
        <span className="mini-cta" />
      </div>
      <div className="mini-img" />
      <div className="mini-cards">
        {[0, 1, 2].map((i) => (
          <div className="mini-card" key={i}><i /><i /><i /></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mini-site" ref={innerRef}>
      <div className="mini-nav">
        <span className="mini-logo" />
        <span className="mini-link" />
        <span className="mini-link" />
        <span className="mini-link" />
      </div>
      {block("a")}
      {long && block("b")}
      <div className="mini-footer" />
    </div>
  );
}

const CAPTIONS = [
  {
    title: "Designed to sell on desktop.",
    text: "Bold layouts, instant load, and calls-to-action your customers can't miss.",
  },
  {
    title: "Flawless on every phone.",
    text: "Most of your visitors are on mobile — we design for their thumbs first.",
  },
  {
    title: "One brand. Every screen.",
    text: "Laptop, phone, tablet — your site looks hand-crafted on all of them. Because it is.",
  },
];

/**
 * Pinned scroll section: a CSS-built laptop and phone glide through three
 * scenes as the visitor scrolls, with a fake website scrolling inside each
 * screen. Pure transforms — no WebGL — so it stays smooth everywhere.
 */
export default function DeviceShowcase() {
  const stageRef = useRef(null);
  const laptopRef = useRef(null);
  const phoneRef = useRef(null);
  const laptopSiteRef = useRef(null);
  const phoneSiteRef = useRef(null);
  const glowRef = useRef(null);
  const capRefs = useRef([]);

  useEffect(() => {
    const apply = (p) => {
      // --- phase splits: 0-0.4 laptop solo · 0.4-0.72 phone joins · 0.72-1 duo ---
      const a = easeInOut(clamp01(p / 0.4));            // laptop entrance / straighten
      const b = easeInOut(clamp01((p - 0.4) / 0.32));   // phone entrance, laptop steps aside
      const c = easeInOut(clamp01((p - 0.72) / 0.28));  // final settle

      if (laptopRef.current) {
        const rotX = lerp(38, 8, a) - c * 6;
        const rotY = lerp(0, -14, b) + c * 6;
        const x = lerp(0, -22, b) + c * 4; // percent of own width
        const scale = lerp(0.86, 1, a) - b * 0.14;
        const y = lerp(10, 0, a);
        laptopRef.current.style.transform =
          `translate(-50%, -50%) translate(${x}%, ${y}%) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        laptopRef.current.style.opacity = String(clamp01(a * 2));
      }

      if (phoneRef.current) {
        const x = lerp(140, 78, b) - c * 10; // percent of own width, from off-screen right
        const rotY = lerp(-40, -10, b) + c * 4;
        const rotZ = lerp(8, 0, b);
        const scale = lerp(0.8, 1, b);
        phoneRef.current.style.transform =
          `translate(-50%, -50%) translate(${x}%, 0%) scale(${scale}) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        phoneRef.current.style.opacity = String(clamp01(b * 2.2));
      }

      // fake page-scroll inside each screen
      if (laptopSiteRef.current)
        laptopSiteRef.current.style.transform = `translateY(${lerp(0, -46, easeInOut(clamp01((p - 0.08) / 0.5)))}%)`;
      if (phoneSiteRef.current)
        phoneSiteRef.current.style.transform = `translateY(${lerp(0, -52, easeInOut(clamp01((p - 0.48) / 0.4)))}%)`;

      if (glowRef.current) glowRef.current.style.opacity = String(0.4 + p * 0.6);

      // captions fade in/out in exclusive windows so two never overlap
      const win = (x, in0, in1, out0, out1) =>
        clamp01((x - in0) / (in1 - in0)) * (1 - clamp01((x - out0) / (out1 - out0)));
      const capOpacity = [
        win(p, -1, -0.5, 0.3, 0.4),
        win(p, 0.42, 0.5, 0.64, 0.72),
        win(p, 0.76, 0.84, 2, 3),
      ];
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(capOpacity[i]);
        el.style.transform = `translateY(${(1 - capOpacity[i]) * 14}px)`;
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
    <div className="showcase-stage" ref={stageRef}>
      <div className="showcase-sticky">
        <div className="showcase-head">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Built for every screen</span>
          <h2>Pixel-perfect on <span className="gradient-text">every device</span>.</h2>
        </div>

        <div className="showcase-devices">
          <div className="device device-laptop" ref={laptopRef}>
            <div className="laptop-screen">
              <div className="laptop-viewport">
                <MiniSite long innerRef={laptopSiteRef} />
              </div>
            </div>
            <div className="laptop-base" />
          </div>

          <div className="device device-phone" ref={phoneRef}>
            <div className="phone-frame">
              <div className="phone-viewport">
                <MiniSite long innerRef={phoneSiteRef} />
              </div>
            </div>
          </div>
        </div>

        <div className="showcase-glow" ref={glowRef} />

        <div className="showcase-captions">
          {CAPTIONS.map((cap, i) => (
            <div
              className="showcase-caption"
              key={cap.title}
              ref={(el) => (capRefs.current[i] = el)}
            >
              <div className="cap-title">{cap.title}</div>
              <p className="cap-text">{cap.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
