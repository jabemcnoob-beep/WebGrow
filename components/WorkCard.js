import Reveal from "./Reveal";

// A single case-study card. If `work.url` is set, the title and a
// "Visit live site" button link out to the real site.
export default function WorkCard({ work: w, delay = 0 }) {
  return (
    <Reveal className="card work-card" delay={delay}>
      <div className="thumb" style={w.thumbBg ? { background: w.thumbBg } : undefined}>
        {w.image ? (
          <img
            src={w.image}
            alt={`${w.title} website`}
            className={`thumb-img ${w.imageFit === "contain" ? "thumb-contain" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="mock" />
        )}
      </div>
      <div className="body">
        <div className="tags">
          {w.tags.map((t) => <span className="pill" key={t}>{t}</span>)}
        </div>

        <h3>
          {w.url ? (
            <a href={w.url} target="_blank" rel="noreferrer" className="work-link">
              {w.title} <span className="ext" aria-hidden>↗</span>
            </a>
          ) : (
            w.title
          )}
        </h3>

        <p>{w.summary}</p>

        {w.metrics?.length > 0 && (
          <div className="metrics">
            {w.metrics.map((m) => (
              <div key={m.lbl}>
                <div className="num">{m.num}</div>
                <div className="lbl">{m.lbl}</div>
              </div>
            ))}
          </div>
        )}

        {w.url && (
          <a href={w.url} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 18, alignSelf: "flex-start" }}>
            Visit live site ↗
          </a>
        )}
      </div>
    </Reveal>
  );
}
