import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Seo from "@/components/Seo";

/**
 * Redirect stub: /about moved to /why-us. Cloudflare Pages serves a real
 * 301 via public/_redirects; this client-side fallback covers local dev
 * and any cached HTML. Noindexed so search engines only see /why-us.
 */
export default function About() {
  const router = useRouter();

  useEffect(() => {
    // Hard-redirect fallback in case the SPA transition is aborted
    // (e.g. by a hydration hiccup); cleared once the route change unmounts us.
    const t = setTimeout(() => {
      if (window.location.pathname.startsWith("/about")) {
        window.location.replace("/why-us/");
      }
    }, 1200);
    router.replace("/why-us").catch(() => {});
    return () => clearTimeout(t);
  }, [router]);

  return (
    <>
      <Seo path="/about" noindex />
      <section className="page-hero">
        <div className="container center">
          <p className="lead">
            Redirecting… If nothing happens, <Link href="/why-us">head to Why Us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
