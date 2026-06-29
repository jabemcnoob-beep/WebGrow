import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { site, nav } from "@/data/site";
import { Menu, Close } from "./Icon";

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

  // close the mobile menu on route change
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  const isActive = (href) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link href="/" className="brand" aria-label={`${site.name} home`}>
          {hasLogo ? (
            <span className="brand-badge"><img src="/logo.png" alt={site.name} /></span>
          ) : (
            <span className="dot" />
          )}
          {site.name}
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary nav-cta">
            Get a free quote
          </Link>
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
