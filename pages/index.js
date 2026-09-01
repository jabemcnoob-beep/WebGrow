import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Counter from "@/components/Counter";
import HeroV4 from "@/components/HeroV4";
import Watermark from "@/components/Watermark";
import BuildSequence from "@/components/BuildSequence";
import DeviceShowcase from "@/components/DeviceShowcase";
import ServicesRail from "@/components/ServicesRail";
import WorkGallery from "@/components/WorkGallery";
import ReviewsBelt from "@/components/ReviewsBelt";
import { Arrow } from "@/components/Icon";
import { site, stats, founderQuote, effects } from "@/data/site";

export default function Home() {
  return (
    <>
      <Seo path="/" />

      {/* ================= ACT 1 — constellation hero ================= */}
      <HeroV4 />

      {/* ================= ACT 2 — the build sequence ================= */}
      <BuildSequence />

      {/* ================= ACT 3 — every screen ================= */}
      <DeviceShowcase />

      {/* ================= stats counters ================= */}
      <section style={{ paddingBlock: 0 }}>
        <div className="container">
          <Reveal className="stats-k">
            {stats.map((s) => (
              <div className="stat-k" key={s.label}>
                <div className="num"><span className="accent"><Counter value={s.num} /></span></div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= ACT 4 — horizontal services rail ================= */}
      <ServicesRail />

      {/* ================= ACT 5 — work index with floating previews ================= */}
      <section className="fx-wm-clip">
        <Watermark word="Work" />
        <div className="container" style={{ position: "relative" }}>
          <div className="section-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, maxWidth: "none", flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 style={{ marginBottom: 0 }}>Real sites. <span className="gradient-text">Real growth.</span></h2>
            </div>
            <Link href="/work" className="btn btn-ghost">All case studies <Arrow /></Link>
          </div>
          <WorkGallery />
        </div>
      </section>

      {/* ================= effects strip ================= */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span className="eyebrow" style={{ margin: 0 }}>The wow factor</span>
              {effects.slice(0, 6).map((e) => (
                <span className="pill" key={e.kind}>{e.title}</span>
              ))}
              <Link href="/examples" className="work-link" style={{ color: "var(--accent)" }}>
                Play with live demos <Arrow />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= ACT 6 — reviews belt ================= */}
      <section className="fx-wm-clip" style={{ paddingTop: 0 }}>
        <Watermark word="Loved" />
        <div className="container" style={{ position: "relative" }}>
          <div className="section-head">
            <span className="eyebrow">Loved by founders</span>
            <h2>Five stars, <span className="gradient-text">every time</span>.</h2>
          </div>
        </div>
        <ReviewsBelt />
        <div className="container center" style={{ marginTop: 28 }}>
          <Link href="/reviews" className="btn btn-ghost">Read all reviews <Arrow /></Link>
        </div>
      </section>

      {/* ================= founder quote ================= */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="center">
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.6rem, 3.6vw, 2.6rem)", lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--text)", maxWidth: "20ch", margin: "0 auto 1rem" }}>
              “{founderQuote.quote}”
            </p>
            <p className="eyebrow" style={{ justifyContent: "center" }}>— {founderQuote.by}</p>
          </Reveal>
        </div>
      </section>

      {/* ================= finale ================= */}
      <section className="finale" style={{ paddingBlock: 0 }}>
        <span className="ring" aria-hidden />
        <span className="ring r2" aria-hidden />
        <Reveal className="inner">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Let's talk</span>
          <h2>Your website should be your <span className="gradient-text">best salesperson</span>.</h2>
          <p className="lead" style={{ maxWidth: "52ch" }}>
            Tell us a bit about your business and {site.founder} will personally craft a quote for you.
          </p>
          <div className="finale-actions">
            <Magnetic><Link href="/contact" className="btn btn-primary btn-lg">Get a free quote <Arrow /></Link></Magnetic>
            <Magnetic><Link href="/pricing" className="btn btn-white btn-lg">See pricing</Link></Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
