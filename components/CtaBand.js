import Link from "next/link";
import Reveal from "./Reveal";
import { Arrow } from "./Icon";

export default function CtaBand({
  title = "Ready to grow?",
  text = "Let's build a website that actually moves the needle for your business.",
  primary = { label: "See pricing", href: "/pricing" },
  secondary = { label: "Get in touch", href: "/contact" },
}) {
  return (
    <section>
      <div className="container">
        {/* fx-beam draws its rotating border on this wrapper — the band itself
            has overflow:hidden and its own ::before, so it can't host it */}
        <div className="fx-beam" style={{ borderRadius: "var(--radius-lg)" }}>
        <Reveal className="cta-band">
          <span className="eyebrow">Let's talk</span>
          <h2 style={{ maxWidth: "16ch", marginInline: "auto" }}>{title}</h2>
          <p className="lead mx-auto" style={{ maxWidth: "52ch" }}>{text}</p>
          <div style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.6rem" }}>
            <Link href={primary.href} className="btn btn-primary btn-lg">
              {primary.label} <Arrow />
            </Link>
            <Link href={secondary.href} className="btn btn-ghost btn-lg">
              {secondary.label}
            </Link>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
