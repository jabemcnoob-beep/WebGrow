import Link from "next/link";
import { useEffect, useRef } from "react";
import Magnetic from "@/components/Magnetic";
import TextScramble from "@/components/TextScramble";
import ParticleField from "@/components/ParticleField";
import { Arrow } from "@/components/Icon";
import { site, marquee } from "@/data/site";

/**
 * HeroV4 — center-stage monumental hero.
 * Constellation canvas behind a centered three-line scrambled headline
 * (outline / solid / neon pink), floating orb, rotating circular text,
 * two angled counter-scrolling marquee strips along the bottom edge, and
 * a pulsing scroll hint. The foreground stack parallaxes up and fades as
 * you scroll (skipped under prefers-reduced-motion). No props.
 */
export default function HeroV4() {
  const foreRef = useRef(null);

  // Parallax: lift the centered stack at 0.18x scroll, fully faded by 90% of a viewport.
  useEffect(() => {
    const el = foreRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const fade = Math.min(1, y / (window.innerHeight * 0.9));
      el.style.transform = "translate3d(0, " + (-y * 0.18).toFixed(1) + "px, 0)";
      el.style.opacity = String(1 - fade);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Track content is doubled so the translateX(-50%) keyframe loops seamlessly.
  const stripItems = [...marquee, ...marquee];

  return (
    <section className="hv-hero">
      <ParticleField />
      <div className="hv-orb" aria-hidden="true" />

      <div className="hv-fore container" ref={foreRef}>
        <p className="eyebrow hv-eyebrow">{site.area} — by {site.founder}</p>
        <h1 className="hv-title">
          <span className="hv-line hv-line-stroke">
            <TextScramble text="WEBSITES THAT" delay={0} />
          </span>
          <span className="hv-line hv-line-solid">
            <TextScramble text="MAKE YOU" delay={150} />
          </span>
          <span className="hv-line hv-line-pink">
            <TextScramble text="MONEY." delay={300} />
          </span>
        </h1>
        <p className="hv-sub lead">
          Custom design, ruthless speed, and search rankings that put you in
          front of customers — built personally for your business.
        </p>
        <div className="hv-cta">
          <Magnetic>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get a free quote <Arrow />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/work" className="btn btn-ghost btn-lg">
              See real results
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="hv-ring" aria-hidden="true">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path
              id="hv-ring-path"
              d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
              fill="none"
            />
          </defs>
          {/* textLength pins the phrase to the full circumference so it loops with no seam */}
          <text className="hv-ring-text">
            <textPath href="#hv-ring-path" textLength="489" lengthAdjust="spacing">
              WEBGROW • WEB DESIGN • SEO • GROWTH •&#160;
            </textPath>
          </text>
        </svg>
      </div>

      <div className="hv-strips" aria-hidden="true">
        <div className="hv-strip hv-strip-a">
          <div className="hv-strip-track">
            {stripItems.map((t, i) => (
              <span className="hv-strip-item" key={"a" + i}>
                {t}
                <i className="hv-strip-star">✦</i>
              </span>
            ))}
          </div>
        </div>
        <div className="hv-strip hv-strip-b">
          <div className="hv-strip-track">
            {stripItems.map((t, i) => (
              <span className="hv-strip-item" key={"b" + i}>
                {t}
                <i className="hv-strip-star">✦</i>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hv-scrollhint" aria-hidden="true">
        <span>Scroll</span>
        <i className="hv-scrollline" />
      </div>
    </section>
  );
}
