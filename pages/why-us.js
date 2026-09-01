import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import CtaBand from "@/components/CtaBand";
import Spotlight from "@/components/Spotlight";
import SerpClimb from "@/components/SerpClimb";
import { Arrow } from "@/components/Icon";
import { site, values, timeline, stats, founderQuote } from "@/data/site";

// The three SEO pillars — why WebGrow sites actually rank.
const PILLARS = [
  {
    icon: "⚡",
    title: "Technical SEO",
    desc: "Lightning speed, clean structure, and behind-the-scenes labels that tell Google exactly what's on every page — so it understands your site instantly and favors it over slower, messier competitors.",
  },
  {
    icon: "◉",
    title: "Local SEO",
    desc: "Your Google Business profile, maps, and area keywords dialed in — so nearby customers searching \"near me\" find you first, not the shop down the road.",
  },
  {
    icon: "✺",
    title: "Keywords that buy",
    desc: "We target the exact phrases your customers actually type — not vanity terms. Traffic that turns into calls, bookings, and revenue.",
  },
];

// The rank → revenue funnel: each step is a stat chip with a one-line caption.
const FUNNEL = [
  { num: "#1", name: "Climb to #1", cap: "The goal: top of Google for the searches that matter." },
  { num: "+340%", name: "More eyeballs", cap: "Traffic growth our clients see as they climb." },
  { num: "5%+", name: "More buyers", cap: "Visitors arrive ready to call, book, or buy." },
  { num: "3×", name: "More revenue", cap: "Average revenue growth across WebGrow clients." },
];

/**
 * Why Us — the former About page rebuilt around WebGrow's SEO story:
 * who we are, what we believe, a plain-English explanation of SEO with the
 * SerpClimb scroll showpiece, the method timeline, stats, and a closing CTA.
 */
export default function WhyUs() {
  return (
    <>
      <Seo path="/why-us" />

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Why {site.name}</span>
            <h1>The website your business <span className="gradient-text">deserves</span>.</h1>
            <p className="lead">
              {site.name} is led by {site.founder} — a Verde Valley web design studio
              obsessed with one thing: turning visitors into customers. We help restaurants
              and local businesses across Arizona — Sedona, Cottonwood, Camp Verde and
              beyond — with custom, personally-crafted websites. No templates, no bloat,
              just design built to grow your business.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section style={{ paddingTop: 0 }}>
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

      {/* ---------------- SEO STORY ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">SEO, explained simply</span>
            <h2>Built to put you at the <span className="gradient-text">top of Google</span>.</h2>
            <p className="lead">
              When someone needs what you do, they search Google — and they click the
              first result they trust. That's the whole game. {site.name} builds SEO
              into every site from day one, so when your customers search, your
              business is the one they find. More people seeing your site means more
              calls, more visits, and more money — from searches that were already
              happening without you.
            </p>
          </div>
        </div>

        <SerpClimb />

        <div className="container">
          <div className="grid grid-3">
            {PILLARS.map((p, i) => (
              <Spotlight key={p.title} style={{ borderRadius: "var(--radius-lg)" }}>
                <Reveal className="card card-glow feature" delay={i * 60} style={{ height: "100%" }}>
                  <div className="ic">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </Reveal>
              </Spotlight>
            ))}
          </div>

          <Reveal className="wu-funnel">
            {FUNNEL.map((f, i) => (
              [
                i > 0 && (
                  <span className="wu-funnel-arrow" key={`${f.name}-arrow`} aria-hidden="true">
                    <Arrow />
                  </span>
                ),
                <div className="wu-funnel-step" key={f.name}>
                  <div className="wu-funnel-num"><Counter value={f.num} /></div>
                  <div className="wu-funnel-name">{f.name}</div>
                  <p className="wu-funnel-cap">{f.cap}</p>
                </div>,
              ]
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- THE WEBGROW METHOD ---------------- */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The {site.name} Method</span>
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

      {/* ---------------- STATS + FOUNDER QUOTE ---------------- */}
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

          <Reveal className="wu-quote mt-2">
            <blockquote>&ldquo;{founderQuote.quote}&rdquo;</blockquote>
            <cite>{founderQuote.by}</cite>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Ready to be found first?"
        text="Let's build a website engineered to climb to the top of Google — and stay there."
        primary={{ label: "Get a free quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
