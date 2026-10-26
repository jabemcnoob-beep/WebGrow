import Link from "next/link";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Counter from "@/components/Counter";
import StudioHero from "@/components/StudioHero";
import DriftImage from "@/components/DriftImage";
import LoopVideo from "@/components/LoopVideo";
import DeviceShowcase from "@/components/DeviceShowcase";
import ServicesRail from "@/components/ServicesRail";
import ReviewsBelt from "@/components/ReviewsBelt";
import Marquee from "@/components/Marquee";
import SplitWords from "@/components/SplitWords";
import InkText from "@/components/InkText";
import ScrollFrame from "@/components/ScrollFrame";
import RiseBand from "@/components/RiseBand";
import QuoteSection from "@/components/QuoteSection";
import { Arrow } from "@/components/Icon";
import { site, stats, founderQuote, marquee } from "@/data/site";

export default function Home() {
  return (
    <>
      <Seo path="/" />

      {/* ================= ACT 1 — studio push-in, through the screen ================= */}
      <StudioHero />

      {/* ================= results ticker ================= */}
      <Marquee items={marquee} />

      {/* ================= ACT 2 — it starts on paper ================= */}
      <section>
        <div className="container ph-split">
          <ScrollFrame>
            <DriftImage src="/media/desk-sketches.webp" alt="Hand-drawn website wireframes in a sketchbook next to a laptop" />
            <span className="ph-tag">Every site starts here</span>
          </ScrollFrame>
          <Reveal className="ph-copy" delay={80}>
            <span className="eyebrow">How we work</span>
            <SplitWords parts={["Designed by hand.", { accent: "Built to perform." }]} />
            <p className="lead">
              No templates and no page builders. Every {site.name} site is sketched around your
              customers first, then hand-coded so it loads fast and shows up on Google.
            </p>
            <ul className="ph-list">
              <li><b>01</b> Strategy — who your customers are and what makes them say yes</li>
              <li><b>02</b> Design — a look that's unmistakably yours</li>
              <li><b>03</b> Build — clean, lightning-fast code with SEO built in</li>
              <li><b>04</b> Launch — domain, Google setup, and support after go-live</li>
            </ul>
            <Link href="/services" className="btn btn-ghost">Explore services <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      {/* ================= ACT 3 — real work on every screen (black band) ================= */}
      <RiseBand className="theme-dark">
        <DeviceShowcase />
      </RiseBand>

      {/* ================= ACT 4 — your customers are on their phones ================= */}
      <section>
        <div className="container">
          <div className="ph-split flip">
            <ScrollFrame>
              <LoopVideo src="/media/cafe-owner.mp4" poster="/media/cafe-owner.webp" alt="A cafe owner smiling at her phone behind the counter" range={10} />
              <span className="ph-tag">Built for local business</span>
            </ScrollFrame>
            <Reveal className="ph-copy" delay={80}>
              <span className="eyebrow">Why it matters</span>
              <SplitWords parts={["Your next customer is", { accent: "searching right now." }]} />
              <p className="lead">
                They're on their phone, comparing you to the shop down the road. The business with
                the fast, trustworthy, easy-to-book website wins — we make sure that's you.
              </p>
              <Link href="/why-us" className="btn btn-ghost">Why WebGrow <Arrow /></Link>
            </Reveal>
          </div>
          <Reveal className="ph-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="n"><Counter value={s.num} /></div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= ACT 5 — local studio, Sedona light ================= */}
      <section className="ph-band" style={{ paddingBlock: 0 }}>
        <div className="ph-media">
          <LoopVideo src="/media/sedona-window.mp4" poster="/media/sedona-window.webp" alt="A studio desk with a laptop facing Sedona's red rocks at golden hour" range={12} />
        </div>
        <div className="container">
          <Reveal className="ph-card">
            <span className="eyebrow">Local studio · {site.area}</span>
            <SplitWords parts={["Made in the Verde Valley."]} />
            <p>
              {site.name} is {site.founder}'s studio — one person, start to finish, building sites
              for Sedona, Cottonwood, Camp Verde and businesses well beyond Arizona. You talk to
              the person actually building your site.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= ACT 6 — services rail ================= */}
      <ServicesRail />

      {/* ================= ACT 7 — reviews ================= */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Loved by owners</span>
            <SplitWords parts={["Five stars,", { accent: "every time." }]} />
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
          <div className="center">
            <InkText className="quote-xl" text={`“${founderQuote.quote}”`} />
            <p className="eyebrow" style={{ justifyContent: "center" }}>— {founderQuote.by}</p>
          </div>
        </div>
      </section>

      {/* ================= free quote ================= */}
      <QuoteSection />

      {/* ================= finale over the prism ================= */}
      <section className="ph-finale">
        <div className="ph-media">
          <LoopVideo src="/media/prism.mp4" poster="/media/prism.webp" />
        </div>
        <div className="container">
          <Reveal>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Ready when you are</span>
            <SplitWords parts={["Your website should be your best salesperson."]} />
            <p className="lead" style={{ maxWidth: "50ch" }}>
              Pick a package and get started today. Pay half to start, half when you love it.
            </p>
            <div className="row">
              <Magnetic><Link href="/pricing" className="btn btn-primary btn-lg">Buy your website <Arrow /></Link></Magnetic>
              <Magnetic><Link href="#free-quote" className="btn btn-ink btn-lg">Get a free quote</Link></Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
