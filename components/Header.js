import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { site, nav } from "@/data/site";

const MENU = [{ label: "Home", href: "/" }, ...nav, { label: "Contact", href: "/contact" }];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasLogo, setHasLogo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use /logo.png automatically if the file exists (drop it in /public).
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasLogo(true);
    img.src = "/logo.png";
  }, []);

  // close the menu on route change + lock page scroll while open
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled && !open ? "scrolled" : ""}`}>
        <div className="container">
          <Link href="/" className="brand" aria-label={`${site.name} home`} style={{ position: "relative", zIndex: 101 }}>
            {hasLogo ? (
              <span className="brand-badge"><img src="/logo.png" alt={site.name} /></span>
            ) : (
              <span className="dot" />
            )}
            {site.name}
          </Link>

          <div className="nav-right" style={{ position: "relative", zIndex: 101 }}>
            <Link href="/contact" className="btn btn-primary nav-cta" style={{ display: open ? "none" : undefined }}>
              Get a free quote
            </Link>
            <button
              className={`menu-btn ${open ? "open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="lines" aria-hidden><i /><i /><i /></span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div className={`menu-overlay ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav className="menu-links" aria-label="Primary">
          {MENU.map((item, i) => {
            const active = item.href === "/" ? router.pathname === "/" : router.pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={active ? { color: "var(--accent)" } : undefined}>
                <span className="idx">0{i + 1}</span>
                <span className="inner" style={{ "--i": i }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="menu-foot">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/-/g, "")}`}>{site.phone}</a>
          <span>{site.area}</span>
        </div>
      </div>
    </>
  );
}
