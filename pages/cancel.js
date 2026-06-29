import Seo from "@/components/Seo";
import Link from "next/link";
import { site } from "@/data/site";

export default function Cancel() {
  return (
    <>
      <Seo title={`Checkout cancelled — ${site.name}`} description="Your checkout was cancelled." noindex />
      <section className="page-hero center" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <div className="container">
          <h1 style={{ marginInline: "auto" }}>No worries.</h1>
          <p className="lead mx-auto">
            Your checkout was cancelled and you haven't been charged. If something went
            wrong or you have questions, we're happy to help.
          </p>
          <div style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pricing" className="btn btn-primary mt-2">Back to pricing</Link>
            <Link href="/contact" className="btn btn-ghost mt-2">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
