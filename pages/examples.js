import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import EffectsShowcase from "@/components/EffectsShowcase";
import CtaBand from "@/components/CtaBand";
import WorkCard from "@/components/WorkCard";
import { Arrow } from "@/components/Icon";
import { site, effects, work } from "@/data/site";

export default function Examples() {
  return (
    <>
      <Seo path="/examples" />

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Examples</span>
            <h1>Real sites. Live <span className="gradient-text">magic</span>.</h1>
            <p className="lead">
              Websites {site.name} has built for real businesses — every one designed and
              hand-coded from scratch — plus live effects we can add to yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CLIENT SITES ---------------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sites we've built</span>
            <h2>Websites that are <span className="gradient-text">live right now</span>.</h2>
          </div>
          <div className="grid grid-2">
            {work.map((w, i) => (
              // an odd count would strand the last card alone; the newest spans the row instead
              <WorkCard key={w.title} work={w} delay={(i % 2) * 80} wide={i === 0 && work.length % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- EFFECTS DEMOS ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Effects showcase</span>
            <h2>Live demos — move your cursor and <span className="gradient-text">play</span>.</h2>
            <p className="lead">Every effect here can be tailored to your brand and dropped into your site.</p>
          </div>
          <Reveal><EffectsShowcase /></Reveal>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">And more</span>
            <h2>A full toolbox of <span className="gradient-text">interaction</span>.</h2>
            <p className="lead">Beyond the demos above, here's the wider menu of effects we reach for.</p>
          </div>
          <div className="grid grid-4">
            {effects.map((e, i) => (
              <Reveal key={e.kind} className="card feature" delay={i * 50}>
                <h3 style={{ fontSize: "1.1rem" }}>{e.title}</h3>
                <p>{e.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="center mt-2">
            <Link href="/pricing" className="btn btn-primary">Get these on your site <Arrow /></Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Want effects like these on your site?"
        text="Tell us your vision — we'll show you what's possible."
        primary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
