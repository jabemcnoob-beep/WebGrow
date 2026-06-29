import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import WorkCard from "@/components/WorkCard";
import { Arrow } from "@/components/Icon";
import { site, stats, services, effects, work, reviews, marquee, founderQuote } from "@/data/site";

// 3D scene is client-only (uses WebGL / window).
const LaptopScene = dynamic(() => import("@/components/LaptopScene"), { ssr: false });

export default function Home() {
  const progressRef = useRef(0);
  const stageRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      progressRef.current = p;

      // fade the intro copy out as the laptop opens
      if (overlayRef.current) {
        const fade = Math.max(0, 1 - p / 0.22);
        overlayRef.current.style.opacity = String(fade);
        overlayRef.current.style.transform = `translateY(${(1 - fade) * -28}px)`;
        overlayRef.current.style.pointerEvents = fade < 0.1 ? "none" : "auto";
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
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
    <>
      <Seo path="/" />

      {/* ---------------- HERO: scroll-driven exploding laptop ---------------- */}
      <div className="explode-stage" ref={stageRef}>
        <div className="explode-sticky">
          <div className="hero-canvas">
            <LaptopScene progressRef={progressRef} />
          </div>

          <div className="container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
            <div className="hero-inner" ref={overlayRef} style={{ transition: "none" }}>
              <span className="eyebrow">By {site.founder}</span>
              <h1>
                Website designs that <span className="gradient-text">grow</span> your business.
              </h1>
              <p className="lead">
                {site.name} helps restaurants and local businesses across Arizona's Verde
                Valley — and beyond — turn their website into their #1 revenue driver with
                precision-crafted design that converts visitors into loyal customers.
                Scroll to watch one come to life.
              </p>
              <div className="hero-actions">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Get a free quote <Arrow />
                </Link>
                <Link href="/work" className="btn btn-ghost btn-lg">
                  See our work
                </Link>
              </div>
            </div>
          </div>

          <div className="scroll-hint">
            <span className="mouse" />
            Scroll to explode
          </div>
        </div>
      </div>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span className="marquee-item" key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* ---------------- STATS ---------------- */}
      <section>
        <div className="container">
          <Reveal className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="num">{s.num}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- SERVICES PREVIEW ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we deliver</span>
            <h2>Every detail. Every interaction. <span className="gradient-text">Perfected.</span></h2>
            <p className="lead">Six disciplines, one obsessive focus: making your business grow faster through your website.</p>
          </div>
          <div className="grid grid-3">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s.title} className="card card-glow feature" delay={i * 60}>
                <div className="ic">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="center mt-2">
            <Link href="/services" className="btn btn-ghost">Explore services <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* ---------------- EFFECTS PREVIEW ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The wow factor</span>
            <h2>Effects that make people <span className="gradient-text">stay</span>.</h2>
            <p className="lead">Cursor magic, 3D, living gradients, and scroll choreography — a taste of what we can build for you.</p>
          </div>
          <div className="grid grid-4">
            {effects.slice(0, 4).map((e, i) => (
              <Reveal key={e.kind} className="card feature" delay={i * 60}>
                <h3 style={{ fontSize: "1.15rem" }}>{e.title}</h3>
                <p>{e.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="center mt-2">
            <Link href="/examples" className="btn btn-ghost">See live demos <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* ---------------- WORK PREVIEW ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h2>Brands we helped <span className="gradient-text">grow</span>.</h2>
          </div>
          <div className="grid grid-2">
            {work.slice(0, 2).map((w, i) => (
              <WorkCard key={w.title} work={w} delay={i * 80} />
            ))}
          </div>
          <div className="center mt-2">
            <Link href="/work" className="btn btn-ghost">View all work <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* ---------------- REVIEWS PREVIEW ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Loved by founders</span>
            <h2>Don't take our word for it.</h2>
          </div>
          <div className="grid grid-3">
            {reviews.slice(0, 3).map((r, i) => (
              <Reveal key={r.name} className="card review-card" delay={i * 70}>
                <div className="stars">{"★".repeat(r.stars)}</div>
                <blockquote>“{r.quote}”</blockquote>
                <div className="who">
                  <div className="avatar">{r.name[0]}</div>
                  <div>
                    <div className="name">{r.name}</div>
                    <div className="role">{r.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOUNDER QUOTE ---------------- */}
      <section>
        <div className="container">
          <Reveal className="center">
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.6rem, 3.6vw, 2.6rem)", lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "20ch", margin: "0 auto 1rem" }}>
              “{founderQuote.quote}”
            </p>
            <p className="eyebrow" style={{ justifyContent: "center" }}>— {founderQuote.by}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Your website should be your best salesperson."
        text="Tell us a bit about your business and Remington will personally craft a quote for you."
        primary={{ label: "Get a free quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
