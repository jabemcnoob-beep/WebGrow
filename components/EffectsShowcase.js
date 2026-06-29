import { useRef } from "react";

/* Magnetic element that springs toward the cursor (or finger) inside its card. */
function Magnetic() {
  const dot = useRef(null);
  const move = (clientX, clientY, el) => {
    const box = el.getBoundingClientRect();
    const x = clientX - (box.left + box.width / 2);
    const y = clientY - (box.top + box.height / 2);
    if (dot.current) dot.current.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  };
  const onMove = (e) => move(e.clientX, e.clientY, e.currentTarget);
  const onTouch = (e) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY, e.currentTarget); };
  const reset = () => { if (dot.current) dot.current.style.transform = "translate(0,0)"; };
  return (
    <div className="effect-card" onMouseMove={onMove} onMouseLeave={reset} onTouchMove={onTouch} onTouchEnd={reset}>
      <div className="stage cursor-demo"><div className="magnetic-dot" ref={dot} /></div>
      <div className="scrim" />
      <div className="label"><h3>Magnetic cursor</h3><p>Move your cursor or finger — elements lean toward it.</p></div>
    </div>
  );
}

/* Card that rotates in 3D following the pointer (or finger). */
function Tilt() {
  const card = useRef(null);
  const move = (clientX, clientY, el) => {
    const box = el.getBoundingClientRect();
    const px = (clientX - box.left) / box.width - 0.5;
    const py = (clientY - box.top) / box.height - 0.5;
    if (card.current) card.current.style.transform = `perspective(700px) rotateY(${px * 18}deg) rotateX(${-py * 18}deg)`;
  };
  const onMove = (e) => move(e.clientX, e.clientY, e.currentTarget);
  const onTouch = (e) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY, e.currentTarget); };
  const reset = () => { if (card.current) card.current.style.transform = "perspective(700px) rotateY(0) rotateX(0)"; };
  return (
    <div className="effect-card" onMouseMove={onMove} onMouseLeave={reset} onTouchMove={onTouch} onTouchEnd={reset}>
      <div className="stage cursor-demo">
        <div className="tilt" ref={card} style={{ width: 150, height: 100, borderRadius: 14, background: "var(--grad)", boxShadow: "var(--glow)" }} />
      </div>
      <div className="scrim" />
      <div className="label"><h3>3D tilt cards</h3><p>Move over it — surfaces rotate in real 3D space.</p></div>
    </div>
  );
}

function Blob() {
  return (
    <div className="effect-card">
      <div className="stage"><div className="blob" /><div className="blob" style={{ background: "radial-gradient(circle at 30% 30%, var(--accent-2), transparent 70%)", animationDelay: "-4s", right: 0 }} /></div>
      <div className="scrim" />
      <div className="label"><h3>Living gradients</h3><p>Animated color fields that drift and breathe.</p></div>
    </div>
  );
}

function Shimmer() {
  return (
    <div className="effect-card">
      <div className="stage" style={{ display: "grid", placeItems: "center" }}>
        <span className="shimmer" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem" }}>WebGrow</span>
      </div>
      <div className="scrim" />
      <div className="label"><h3>Shimmer reveal</h3><p>Text and edges catch the light as you scroll.</p></div>
    </div>
  );
}

function MarqueeFx() {
  const chips = ["Design", "Motion", "WebGL", "Stripe", "SEO", "Edge", "Cursor FX", "3D"];
  return (
    <div className="effect-card">
      <div className="stage" style={{ display: "grid", alignContent: "center", gap: 12, overflow: "hidden" }}>
        <div className="demo-marquee">{[...chips, ...chips].map((c, i) => <span className="demo-chip" key={i}>{c}</span>)}</div>
        <div className="demo-marquee" style={{ animationDirection: "reverse", animationDuration: "20s" }}>{[...chips, ...chips].map((c, i) => <span className="demo-chip" key={i}>{c}</span>)}</div>
      </div>
      <div className="scrim" />
      <div className="label"><h3>Infinite marquee</h3><p>Seamless looping strips that add motion, not noise.</p></div>
    </div>
  );
}

function Parallax() {
  const wrap = useRef(null);
  const move = (clientX, clientY, el) => {
    const box = el.getBoundingClientRect();
    const px = (clientX - box.left) / box.width - 0.5;
    const py = (clientY - box.top) / box.height - 0.5;
    wrap.current?.querySelectorAll("[data-depth]").forEach((layer) => {
      const d = parseFloat(layer.dataset.depth);
      layer.style.transform = `translate(${px * d * 40}px, ${py * d * 40}px)`;
    });
  };
  const onMove = (e) => move(e.clientX, e.clientY, e.currentTarget);
  const onTouch = (e) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY, e.currentTarget); };
  return (
    <div className="effect-card" onMouseMove={onMove} onTouchMove={onTouch} ref={wrap}>
      <div className="stage cursor-demo">
        <div data-depth="0.3" style={{ position: "absolute", width: 70, height: 70, borderRadius: 16, background: "var(--accent)", opacity: 0.7, left: "30%", top: "30%" }} />
        <div data-depth="0.7" style={{ position: "absolute", width: 50, height: 50, borderRadius: 12, background: "var(--accent-2)", opacity: 0.8, left: "55%", top: "45%" }} />
        <div data-depth="1.2" style={{ position: "absolute", width: 34, height: 34, borderRadius: 10, background: "var(--accent-3)", left: "45%", top: "60%" }} />
      </div>
      <div className="scrim" />
      <div className="label"><h3>Scroll &amp; pointer parallax</h3><p>Move your cursor or finger — layers shift at different speeds.</p></div>
    </div>
  );
}

export default function EffectsShowcase() {
  return (
    <div className="grid grid-3">
      <Magnetic /><Tilt /><Blob /><Shimmer /><MarqueeFx /><Parallax />
    </div>
  );
}
