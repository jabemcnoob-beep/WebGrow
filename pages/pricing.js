import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Check, Arrow } from "@/components/Icon";
import { site, pricing } from "@/data/site";

export default function Pricing() {
  return (
    <>
      <Seo path="/pricing" />

      <section className="page-hero center">
        <div className="container">
          <Reveal>
            <span className="eyebrow" style={{ justifyContent: "center" }}>{pricing.eyebrow}</span>
            <h1 style={{ marginInline: "auto" }}>
              Plans built to <span className="gradient-text">grow with you.</span>
            </h1>
            <p className="lead mx-auto">{pricing.sub}</p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Please read before purchasing — collapsible */}
          <Reveal>
            <details className="readme-collapse" open>
              <summary>
                <span className="nb-ic">⚠</span>
                <span className="nb-title">{pricing.hosting.title}</span>
              </summary>
              <div className="readme-body">
                <p className="nb-text">{pricing.hosting.text}</p>
                <div className="hosting-plans">
                  {pricing.hosting.plans.map((p) => (
                    <a key={p.label} className="hosting-plan" href={pricing.hosting.framerUrl} target="_blank" rel="noreferrer">
                      <div className="hp-price"><strong>{p.price}</strong><span>{p.per}</span></div>
                      <div className="hp-label">{p.label}</div>
                      <span className="hp-link">View on Framer <Arrow /></span>
                    </a>
                  ))}
                </div>
                <p className="note">{pricing.hosting.closing}</p>
              </div>
            </details>
          </Reveal>

          <div className="pricing-grid">
            {pricing.tiers.map((tier, i) => (
              <Reveal key={tier.id} className={`price-card ${tier.featured ? "featured" : ""}`} delay={i * 70}>
                {tier.badge && <span className="badge">{tier.badge}</span>}
                <span className="tier">{tier.name}</span>
                <div className="amount">
                  <span className="val">{tier.price}</span>
                  <span className="per">one-time</span>
                </div>
                <p className="desc">{tier.tagline}</p>

                <a href={tier.paymentLink} className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"}`}>
                  {tier.cta}
                </a>

                <ul>
                  {tier.features.map((f) => (
                    <li key={f.label} className={f.on ? "" : "off"}>
                      <Check /> {f.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <p className="note center" style={{ marginTop: 28 }}>
            Not sure which plan fits? Remington will personally help you choose the right one for your goals —{" "}
            <Link href="/contact" style={{ color: "var(--accent-2)" }}>get a free quote</Link>.
          </p>

          {/* ---------------- FAQ ---------------- */}
          <div className="pricing-faq">
            <div className="section-head center" style={{ marginInline: "auto" }}>
              <h2>Questions, answered.</h2>
            </div>
            {pricing.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Your website should be your best salesperson."
        text="Tell us about your business and Remington will craft a quote, no obligation."
        primary={{ label: "Get a free quote", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
      />
    </>
  );
}
