import { useEffect, useState } from "react";
import Link from "next/link";
import { site, nav } from "@/data/site";

export default function Footer() {
  // Static export bakes the build-time year into the HTML; hydrate with the
  // same constant, then correct to the visitor's year after mount.
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  return (
    <footer className="footer">
      <Link href="/contact" className="footer-shout" aria-label="Let's grow — get in touch">
        Let&rsquo;s grow<span className="tail">.</span>
      </Link>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <span className="brand-badge"><img src="/logo.png" alt={site.name} /></span>
              {site.name}
            </Link>
            <p style={{ marginTop: 16, maxWidth: "38ch" }}>{site.blurb} By {site.founder}.</p>
            <a href={`mailto:${site.email}`} className="btn btn-ghost" style={{ marginTop: 8 }}>
              {site.email}
            </a>
          </div>

          <div>
            <h4>Pages</h4>
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>

          <div>
            <h4>Services</h4>
            <Link href="/services">Custom design</Link>
            <Link href="/services">Motion &amp; 3D</Link>
            <Link href="/services">Payments</Link>
            <Link href="/examples">Effects</Link>
          </div>

          <div>
            <h4>Connect</h4>
            <a href={site.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={site.social.x} target="_blank" rel="noreferrer">X / Twitter</a>
            <a href={site.social.dribbble} target="_blank" rel="noreferrer">Dribbble</a>
            <a href={site.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {site.name}. All rights reserved.</span>
          <span>Proudly serving Sedona, Cottonwood, Camp Verde &amp; the Verde Valley, Arizona.</span>
        </div>
      </div>
    </footer>
  );
}
