import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import SplitWords from "@/components/SplitWords";
import ScrollFrame from "@/components/ScrollFrame";
import LoopVideo from "@/components/LoopVideo";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icon";
import { site } from "@/data/site";

const STEPS = [
  { n: "01", title: "Tell us about your business", desc: "A short form: what you do, who your customers are and what you need." },
  { n: "02", title: `${site.founder.split(" ")[0]} crafts your quote`, desc: "Reviewed personally — a price and plan built around your business, not a template." },
  { n: "03", title: "Decide with zero pressure", desc: "No obligation. If you go ahead, pay half to start and half when you love it." },
];

/**
 * The homepage's free-quote section — the place for owners who aren't sure
 * which package fits. (The header button goes straight to pricing.)
 */
export default function QuoteSection() {
  return (
    <section id="free-quote" className="quote-sec">
      <div className="container ph-split flip">
        <ScrollFrame>
          <LoopVideo src="/media/contact.mp4" poster="/media/contact.webp" alt="A coffee mug, notebook and phone on a sunny desk" range={10} />
          <span className="ph-tag">Free · no obligation</span>
        </ScrollFrame>
        <Reveal className="ph-copy" delay={80}>
          <span className="eyebrow">Not sure what you need?</span>
          <SplitWords parts={["Get a", { accent: "free quote." }]} />
          <p className="lead">
            Every business is different. Tell us about yours and get a custom quote from the
            person who will actually build your site.
          </p>
          <ol className="quote-steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <b>{s.n}</b>
                <span><strong>{s.title}</strong>{s.desc}</span>
              </li>
            ))}
          </ol>
          <div className="quote-ctas">
            <Magnetic><Link href="/contact" className="btn btn-primary btn-lg">Get my free quote <Arrow /></Link></Magnetic>
            <a href={`mailto:${site.email}`} className="quote-mail">or email {site.email}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
