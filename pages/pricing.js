import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { Check, Arrow } from "@/components/Icon";
import { site, pricing } from "@/data/site";

const toNumber = (price) => Number(String(price).replace(/[^0-9.]/g, ""));
const money = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

// Deposit goes to the tier's half-price Stripe link when one exists;
// otherwise to the contact page, where Remington emails a deposit invoice.
const depositHref = (tier) =>
  tier.depositLink || `/contact?plan=${encodeURIComponent(tier.name)}&deposit=1`;

function Invoice({ tier }) {
  const total = toNumber(tier.price);
  const half = total / 2;
  return (
    <div className="invoice" aria-label={`Payment schedule for ${tier.name}`}>
      <div className="invoice-head">
        <span>Invoice</span>
        <span>50 / 50</span>
      </div>
      <div className="invoice-row">
        <span>
          <b>Deposit · 50%</b>
          <small>Due today</small>
        </span>
        <span className="amt">{money(half)}</span>
      </div>
      <div className="invoice-row">
        <span>
          <b>Balance · 50%</b>
          <small>Due at launch, after you approve</small>
        </span>
        <span className="amt">{money(half)}</span>
      </div>
      <div className="invoice-total">
        <span>Total</span>
        <span className="amt">{money(total)}</span>
      </div>
    </div>
  );
}

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
                <ul className="readme-points">
                  {pricing.hosting.points.map((p) => (
                    <li key={p}><Check /> {p}</li>
                  ))}
                </ul>
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

                <Invoice tier={tier} />

                <a href={depositHref(tier)} className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"}`}>
                  Start with {money(toNumber(tier.price) / 2)} deposit
                </a>
                {tier.paymentLink && (
                  <a href={tier.paymentLink} className="pay-full">
                    Prefer to pay in full? Pay {tier.price} now →
                  </a>
                )}

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

          {/* ---------------- 50 / 50 TERMS ---------------- */}
          <Reveal className="terms">
            <div className="terms-copy">
              <span className="eyebrow">{pricing.terms.eyebrow}</span>
              <h2>{pricing.terms.heading}</h2>
              <p>{pricing.terms.text}</p>
            </div>
            <ol className="terms-steps">
              {pricing.terms.steps.map((s, i) => (
                <li key={s.label}>
                  <span className="terms-pct">50%</span>
                  <span>
                    <b>{i + 1}. {s.label} <em>{s.when}</em></b>
                    <small>{s.desc}</small>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

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
