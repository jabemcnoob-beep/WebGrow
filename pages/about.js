import Head from "next/head";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { site, values, timeline, stats } from "@/data/site";

export default function About() {
  return (
    <>
      <Head><title>About — {site.name}</title></Head>

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">About {site.name}</span>
            <h1>The website your business <span className="gradient-text">deserves</span>.</h1>
            <p className="lead">
              {site.name} is led by {site.founder} — a studio obsessed with one thing:
              turning visitors into customers. We help restaurants, local businesses, and
              brands worldwide with custom, personally-crafted websites — no templates, no
              bloat, just design built to grow your business.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
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

      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we believe</span>
            <h2>Principles we build by.</h2>
          </div>
          <div className="value-grid">
            {values.map((v, i) => (
              <Reveal key={v.title} className="card card-glow feature" delay={i * 70}>
                <div className="ic">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How we work</span>
            <h2>A simple, proven process.</h2>
          </div>
          <Reveal className="timeline">
            {timeline.map((row) => (
              <div className="row" key={row.title}>
                <div className="yr">{row.yr}</div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: 6 }}>{row.title}</h3>
                  <p style={{ margin: 0 }}>{row.desc}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand title="Let's build something worth bragging about." />
    </>
  );
}
