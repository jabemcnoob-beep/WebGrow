import Seo from "@/components/Seo";
import Link from "next/link";
import { site } from "@/data/site";

export default function Success() {
  return (
    <>
      <Seo title={`Payment received — ${site.name}`} description="Thank you for your purchase." noindex />
      <section className="page-hero center" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <div className="container">
          <div className="ic" style={{ width: 64, height: 64, fontSize: "2rem", marginInline: "auto", borderRadius: 18 }}>✓</div>
          <h1 style={{ marginInline: "auto" }}>You're <span className="gradient-text">in</span>. 🎉</h1>
          <p className="lead mx-auto">
            Thanks for choosing {site.name}. Your payment went through and we've received
            your order — check your inbox for a receipt. We'll reach out within one
            business day to kick things off.
          </p>
          <Link href="/" className="btn btn-ghost mt-2">Back to home</Link>
        </div>
      </section>
    </>
  );
}
