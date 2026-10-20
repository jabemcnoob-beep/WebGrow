import { useState } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icon";
import { site } from "@/data/site";

export default function Contact() {
  const router = useRouter();
  const plan = typeof router.query.plan === "string" ? router.query.plan : "";
  const deposit = router.query.deposit === "1";
  const [form, setForm] = useState({ name: "", business: "", address: "", email: "", phone: "", job: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      deposit
        ? `Deposit request — ${plan} — ${form.business || form.name || "New client"}`
        : `Free quote request — ${form.business || form.name || "New enquiry"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}` +
        (form.business ? `\nBusiness name (bill to): ${form.business}` : "") +
        (form.address ? `\nBusiness billing address: ${form.address}` : "") +
        `\nEmail: ${form.email}\nPhone: ${form.phone}` +
        (plan ? `\nPlan of interest: ${plan}` : "") +
        (deposit
          ? `\nPayment: 50% deposit now, 50% at launch — please send my deposit invoice.` +
            `\nInvoice purpose: business services (website design & development), billed to the business above.`
          : "") +
        `\n\nJob needed:\n${form.job}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Seo path="/contact" />

      <section className="page-hero">
        <div className="container">
          <div className="grid grid-2" style={{ gap: "clamp(28px,5vw,64px)", alignItems: "start" }}>
            <Reveal>
              <span className="eyebrow">Free quote — no obligations</span>
              <h1>Your website should be your <span className="gradient-text">best salesperson</span>.</h1>
              <p className="lead">
                Tell us a bit about your business and what you're looking for, and {site.founder} will
                personally craft a quote for you.
              </p>
              <p className="note">Prefer to reach out directly? Email{" "}
                <a href={`mailto:${site.email}`} style={{ color: "var(--accent-2)" }}>{site.email}</a>
                {site.phone ? <> or call <a href={`tel:${site.phone}`} style={{ color: "var(--accent-2)" }}>{site.phone}</a></> : null}.
              </p>
              {plan && <p className="pill" style={{ marginTop: 12 }}>Plan of interest: {plan}</p>}
              {deposit && (
                <p className="note" style={{ marginTop: 12 }}>
                  Send this form and {site.founder} will email you a secure Stripe invoice for your
                  50% deposit, billed to your business as website design &amp; development services.
                  The other half is only due at launch, after you approve your site.
                </p>
              )}
            </Reveal>

            <Reveal delay={80}>
              <form className="form glass" style={{ padding: "clamp(22px,3vw,32px)" }} onSubmit={submit}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" required value={form.name} onChange={set("name")} placeholder="Jane Smith" />
                </div>
                <div className="field">
                  <label htmlFor="business">
                    Business name{deposit ? " (appears on your invoice)" : ""}
                  </label>
                  <input id="business" required={deposit} value={form.business} onChange={set("business")} placeholder="Smith's Cleaning LLC" />
                </div>
                {deposit && (
                  <div className="field">
                    <label htmlFor="address">Business billing address</label>
                    <input id="address" value={form.address} onChange={set("address")} placeholder="123 Main St, Cottonwood, AZ 86326" />
                  </div>
                )}
                <div className="row2">
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="jane@business.com" />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone number</label>
                    <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="928-679-0973" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="job">Job needed</label>
                  <textarea id="job" required value={form.job} onChange={set("job")} placeholder="I need a smooth and modern e-commerce website built." />
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  {deposit ? "Request my deposit invoice" : "Get my free quote"} <Arrow />
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
