import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import WorkCard from "@/components/WorkCard";
import { site, work } from "@/data/site";
import PageBanner from "@/components/PageBanner";

export default function Work() {
  return (
    <>
      <Seo path="/work" />

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Selected work</span>
            <h1>Real sites. Real <span className="gradient-text">results</span>.</h1>
            <p className="lead">
              A look at brands we've helped grow — and the numbers that followed.
              Every one was custom-designed and hand-coded by {site.name}.
            </p>
          </Reveal>
        </div>
      </section>

      <PageBanner src="/media/work.mp4" poster="/media/work.webp" alt="A hand scrolling a local business website on a phone" tag="Built for phones first" focus="74% 50%" />

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid" style={{ gap: 28 }}>
            {work.map((w, i) => (
              <WorkCard key={w.title} work={w} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Your project could be next." primary={{ label: "Start yours", href: "/contact" }} secondary={{ label: "See pricing", href: "/pricing" }} />
    </>
  );
}
