import Reveal from "./Reveal";

// A single testimonial card. If `review.url` is set, the client name/role
// links out to their live site with a small ↗.
export default function ReviewCard({ review: r, delay = 0 }) {
  return (
    <Reveal className="card review-card" delay={delay}>
      <div className="stars">{"★".repeat(r.stars)}</div>
      <blockquote>“{r.quote}”</blockquote>
      <div className="who">
        <div className="avatar">{r.name[0]}</div>
        <div>
          <div className="name">{r.name}</div>
          <div className="role">
            {r.url ? (
              <a href={r.url} target="_blank" rel="noreferrer" className="review-link">
                {r.role} <span aria-hidden>↗</span>
              </a>
            ) : (
              r.role
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
