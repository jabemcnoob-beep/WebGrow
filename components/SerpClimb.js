import { useEffect, useRef } from "react";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Slot-hop ease with a slight overshoot so each climb lands with a spring.
const spring = (t) => {
  const c1 = 1.4, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
// Exclusive fade window: ramps 0→1 over [in0,in1], then 1→0 over [out0,out1].
const win = (x, in0, in1, out0, out1) =>
  clamp01((x - in0) / (in1 - in0)) * (1 - clamp01((x - out0) / (out1 - out0)));

const fmt = (n) => Math.round(n).toLocaleString("en-US");

// Gray competitor rows — abstract bars, no real names. `slot` is the starting
// position (0-based). Slots 0-4 sit above the client row; slot 6 sits below.
const COMPETITORS = [
  { slot: 0, t: 74, u: 46 },
  { slot: 1, t: 58, u: 38 },
  { slot: 2, t: 66, u: 52 },
  { slot: 3, t: 50, u: 34 },
  { slot: 4, t: 62, u: 44 },
  { slot: 6, t: 55, u: 40 },
];

const CAPTIONS = [
  "You're invisible on page two.",
  "Climbing — more eyes every week.",
  "#1. Now every search is a sales lead.",
];

/**
 * Pinned scroll-scrubbed showpiece: a neutral search-results mock in which the
 * client's row ("yourbusiness.com") climbs from position 6 to #1, one springy
 * slot at a time, while live metric counters (visitors, calls, revenue) rise
 * beside it and a phase caption narrates. Locks in at #1 with a badge + glow
 * burst around p≈0.85. Reduced motion renders the finished state statically.
 */
export default function SerpClimb() {
  const stageRef = useRef(null);
  const yourRef = useRef(null);
  const badgeRef = useRef(null);
  const burstRef = useRef(null);
  const compRefs = useRef([]);
  const capRefs = useRef([]);
  const visRef = useRef(null);
  const callsRef = useRef(null);
  const revRef = useRef(null);

  useEffect(() => {
    const apply = (p) => {
      // --- the climb: 5 slot-hops between p 0.06 and 0.85, then the #1 lock ---
      const climb = clamp01((p - 0.06) / 0.79);
      const f = climb * 5;
      const step = Math.min(4, Math.floor(f));
      const yourSlot = 5 - (step + spring(f - step));
      const lockT = easeOut(clamp01((p - 0.85) / 0.07));

      if (yourRef.current) {
        yourRef.current.style.transform =
          `translateY(${yourSlot * 100}%) scale(${1 + 0.045 * lockT})`;
      }
      if (badgeRef.current) {
        badgeRef.current.style.opacity = String(lockT);
        badgeRef.current.style.transform =
          `scale(${0.4 + 0.6 * lockT}) rotate(${(1 - lockT) * -12}deg)`;
      }
      if (burstRef.current) {
        burstRef.current.style.opacity = String(win(p, 0.85, 0.9, 0.94, 1) * 0.85);
        burstRef.current.style.transform = `scale(${lerp(0.6, 1.25, lockT)})`;
      }

      // Competitors above the client shuffle down one slot as they're passed.
      COMPETITORS.forEach((c, i) => {
        const el = compRefs.current[i];
        if (!el || c.slot > 4) return; // the bottom row never moves
        const shift = easeInOut(clamp01(c.slot + 1 - yourSlot));
        el.style.transform = `translateY(${(c.slot + shift) * 100}%)`;
      });

      // --- live metrics, driven straight from p ---
      const m = easeInOut(clamp01((p - 0.04) / 0.81));
      if (visRef.current) visRef.current.textContent = fmt(Math.round(lerp(120, 2400, m) / 10) * 10);
      if (callsRef.current) callsRef.current.textContent = fmt(lerp(4, 85, m));
      if (revRef.current) revRef.current.textContent = "$" + fmt(Math.round(lerp(1000, 18000, m) / 100) * 100);

      // --- phase captions in exclusive windows ---
      const capOpacity = [
        win(p, -1, -0.5, 0.26, 0.38),
        win(p, 0.42, 0.52, 0.74, 0.84),
        win(p, 0.86, 0.94, 2, 3),
      ];
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(capOpacity[i]);
        el.style.transform = `translateY(${(1 - capOpacity[i]) * 12}px)`;
      });
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

  return (
    <div className="wu-serp-stage" ref={stageRef}>
      <div className="wu-serp-sticky">
        <div className="wu-serp-wrap">

          {/* ---- the search-results mock (decorative) ---- */}
          <div className="wu-serp" aria-hidden="true">
            <div className="wu-serp-bar">
              <svg className="wu-serp-mag" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
                <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="wu-serp-q">best web design near me<span className="wu-caret" /></span>
            </div>

            <div className="wu-serp-results">
              <div className="wu-ranks">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <div className="wu-rank" key={n}>{n}</div>
                ))}
              </div>

              <div className="wu-serp-list">
                {COMPETITORS.map((c, i) => (
                  <div
                    className="wu-slot"
                    key={c.slot}
                    ref={(el) => (compRefs.current[i] = el)}
                    style={{ transform: `translateY(${c.slot * 100}%)` }}
                  >
                    <div className="wu-row wu-row-comp">
                      <span className="wu-fav" />
                      <span className="wu-lines">
                        <span className="wu-tbar" style={{ width: `${c.t}%` }} />
                        <span className="wu-ubar" style={{ width: `${c.u}%` }} />
                      </span>
                    </div>
                  </div>
                ))}

                <div
                  className="wu-slot wu-slot-you"
                  ref={yourRef}
                  style={{ transform: "translateY(500%)" }}
                >
                  <span className="wu-burst" ref={burstRef} />
                  <div className="wu-row wu-row-you">
                    <span className="wu-fav wu-fav-you" />
                    <span className="wu-you-lines">
                      <span className="wu-you-title">Your Business — official site</span>
                      <span className="wu-you-url">yourbusiness.com</span>
                    </span>
                    <span className="wu-badge" ref={badgeRef}>#1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- live metrics + phase caption ---- */}
          <div className="wu-serp-side">
            <div className="wu-live-tag">The compounding effect</div>
            <div className="wu-caps">
              {CAPTIONS.map((cap, i) => (
                <p
                  className="wu-cap"
                  key={cap}
                  ref={(el) => (capRefs.current[i] = el)}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {cap}
                </p>
              ))}
            </div>
            <div className="wu-live">
              <div className="wu-live-metric">
                <div className="wu-live-num" ref={visRef}>120</div>
                <div className="wu-live-lbl">Visitors /mo</div>
              </div>
              <div className="wu-live-metric">
                <div className="wu-live-num" ref={callsRef}>4</div>
                <div className="wu-live-lbl">Calls &amp; bookings</div>
              </div>
              <div className="wu-live-metric">
                <div className="wu-live-num" ref={revRef}>$1,000</div>
                <div className="wu-live-lbl">Revenue</div>
              </div>
            </div>
            <p className="wu-live-note">
              Illustrative example of the rank-to-revenue effect — not actual client data.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
