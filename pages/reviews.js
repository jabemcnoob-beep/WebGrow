import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { site, reviews } from "@/data/site";

export default function Reviews() {
  const avg = (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1);
  return (
    <>
      <Seo path="/reviews" />

      <section className="page-hero">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Reviews</span>
            <h1>Founders who <span className="gradient-text">grew</span> with us.</h1>
            <p className="lead">
              <span style={{ color: "var(--accent-3)", letterSpacing: 2 }}>{"★".repeat(5)}</span>{" "}
              {avg} average across {reviews.length}+ projects. Here's what it's like to work with {site.name}.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} className="card review-card" delay={i * 60}>
                <div className="stars">{"★".repeat(r.stars)}</div>
                <blockquote>“{r.quote}”</blockquote>
                <div className="who">
                  <div className="avatar">{r.name[0]}</div>
                  <div>
                    <div className="name">{r.name}</div>
                    <div className="role">{r.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Join them." text="Let's make your business the next success story." primary={{ label: "See pricing", href: "/pricing" }} />
    </>
  );
}
