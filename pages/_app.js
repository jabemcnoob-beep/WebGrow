import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import "@/styles/globals.css";
import "@/styles/effects.css";
import "@/styles/hero.css";
import "@/styles/showcase.css";
import "@/styles/whyus.css";
import Layout from "@/components/Layout";

const normalize = (url) => (url.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/");

export default function App({ Component, pageProps }) {
  // "idle" | "in" (covering) | "out" (revealing)
  const [wipe, setWipe] = useState("idle");
  const timer = useRef(0);
  const safety = useRef(0);

  // Subscribe exactly once to the Router singleton — resubscribing on
  // re-render would clear in-flight reveal timers and strand the cover.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const reveal = () => {
      clearTimeout(timer.current);
      clearTimeout(safety.current);
      timer.current = setTimeout(() => {
        setWipe("out");
        timer.current = setTimeout(() => setWipe("idle"), 460);
      }, 120);
    };
    const start = (url, opts) => {
      if (opts?.shallow) return;
      if (normalize(url) === normalize(Router.asPath)) return;
      clearTimeout(timer.current);
      clearTimeout(safety.current);
      setWipe("in");
      // never let the cover stick, even if complete/error is missed
      safety.current = setTimeout(reveal, 1200);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", reveal);
    Router.events.on("routeChangeError", reveal);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", reveal);
      Router.events.off("routeChangeError", reveal);
      clearTimeout(timer.current);
      clearTimeout(safety.current);
    };
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
      <div className={`route-wipe ${wipe === "idle" ? "" : wipe}`} aria-hidden />
    </Layout>
  );
}
