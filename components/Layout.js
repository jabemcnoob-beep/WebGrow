import { useEffect } from "react";
import Router from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import ScrollProgress from "./ScrollProgress";
import Grain from "./Grain";
import { measureAll } from "@/lib/scroll";

export default function Layout({ children }) {
  useEffect(() => {
    // a new page means fresh positions for every scroll effect
    const onDone = () => requestAnimationFrame(measureAll);
    Router.events.on("routeChangeComplete", onDone);
    return () => Router.events.off("routeChangeComplete", onDone);
  }, []);

  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Grain />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
