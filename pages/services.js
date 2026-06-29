import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Arrow, Check } from "@/components/Icon";
import { site, services } from "@/data/site";

export default function Services() {
  return (
    <>
      <Seo path="/services" />

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">What we deliver</span>
            <h1>Every detail. Every interaction. <span className="gradient-text">Perfected.</span></h1>
            <p className="lead">
              Six disciplines. One obsessive focus: making your business grow faster through
              your website. Here's exactly what we do — and how we do it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- WHAT WE DELIVER ---------------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-3">
            {services.map((s, i) => (
              <Reveal key={s.title} className="card card-glow feature" delay={i * 50}>
                <div className="ic">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- THE WEBGROW METHOD ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The WebGrow Method</span>
            <h2>How we make it <span className="gradient-text">happen</span>.</h2>
            <p className="lead">No mystery, no jargon. Here's exactly how WebGrow turns each promise into a website that works for your business.</p>
          </div>

          <div className="grid" style={{ gap: 22 }}>
            {services.map((s, i) => (
              <Reveal key={s.title} className="card" delay={i * 40}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                  <div className="ic" style={{ margin: 0 }}>{s.icon}</div>
                  <div>
                    <div className="eyebrow" style={{ margin: 0 }}>How we do it · {String(i + 1).padStart(2, "0")}</div>
                    <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{s.title}</h3>
                  </div>
                </div>
                <p>{s.intro}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
                  {s.steps.map((step) => (
                    <li key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--text)", fontSize: "0.96rem" }}>
                      <span style={{ color: "var(--accent-2)", display: "inline-flex", marginTop: 3, flex: "none" }}><Check /></span>{step}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <div className="center mt-2">
            <Link href="/pricing" className="btn btn-primary">See pricing <Arrow /></Link>
          </div>
        </div>
      </section>

      <CtaBand title="Ready to put this to work?" primary={{ label: "Get a free quote", href: "/contact" }} secondary={{ label: "See pricing", href: "/pricing" }} />
    </>
  );
}
