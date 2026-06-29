import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import { Arrow, Check } from "@/components/Icon";
import { site, nextSteps } from "@/data/site";

/**
 * Post-purchase "What happens next" page, driven by data/site.js → nextSteps[planKey].
 * Each Stripe Payment Link redirects here after payment.
 */
export default function NextSteps({ planKey }) {
  const data = nextSteps[planKey];
  if (!data) return null;

  const mailto =
    `mailto:${site.email}` +
    `?subject=${encodeURIComponent(`My WebGrow project details — ${data.plan}`)}` +
    `&body=${encodeURIComponent(
      `Hi Remington! I just purchased the ${data.plan} (${data.price}). Here are my details:\n\n` +
        data.steps.map((s, i) => `${i + 1}. ${s.title}:\n`).join("\n")
    )}`;

  return (
    <>
      <Seo title={`What happens next — ${data.plan} — ${site.name}`} description={`Your next steps after purchasing the ${data.plan} from ${site.name}.`} noindex />

      <section className="page-hero">
        <div className="container" style={{ maxWidth: 840 }}>
          <Reveal>
            <span className="pill" style={{ marginBottom: 18, color: "var(--accent-2)" }}>
              <Check /> Payment received
            </span>
            <div className="eyebrow">{data.plan} · {data.price}</div>
            <h1>{data.heading}</h1>
            <p className="lead">{data.intro}</p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="section-head"><span className="eyebrow">{data.sectionTitle}</span></div>

          <div className="steps-list">
            {data.steps.map((s, i) => (
              <Reveal key={s.title} className="step-row" delay={i * 50}>
                <div className="step-num">{i + 1}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="glass" style={{ padding: "clamp(24px,4vw,36px)", marginTop: 32, textAlign: "center" }}>
            <h3>{data.ctaTitle || "Ready to send it over?"}</h3>
            <p style={{ maxWidth: "52ch", marginInline: "auto" }}>
              {data.ctaText ? (
                <>
                  {data.ctaText} Reach me at{" "}
                  <a href={`mailto:${site.email}`} style={{ color: "var(--accent-2)" }}>{site.email}</a>.
                </>
              ) : (
                <>
                  Email everything to{" "}
                  <a href={`mailto:${site.email}`} style={{ color: "var(--accent-2)" }}>{site.email}</a>.
                  Don't have it all yet? Send what you can — we can fill in the rest together. I'll
                  reply within one business day to kick things off.
                </>
              )}
            </p>
            <div style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.4rem" }}>
              <a href={mailto} className="btn btn-primary btn-lg">{data.ctaButtonLabel || "Email my details"} <Arrow /></a>
              <Link href="/" className="btn btn-ghost btn-lg">Back to home</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
