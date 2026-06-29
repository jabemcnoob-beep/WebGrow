import Head from "next/head";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import EffectsShowcase from "@/components/EffectsShowcase";
import CtaBand from "@/components/CtaBand";
import { Arrow } from "@/components/Icon";
import { site, effects } from "@/data/site";

export default function Examples() {
  return (
    <>
      <Head><title>Examples &amp; Effects — {site.name}</title></Head>

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Effects showcase</span>
            <h1>The kind of <span className="gradient-text">magic</span> we can build for you.</h1>
            <p className="lead">
              These are live, interactive demos — move your cursor around and scroll.
              Every effect here can be tailored to your brand and dropped into your site.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
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
