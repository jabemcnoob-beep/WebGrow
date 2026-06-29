// Cloudflare Pages Function — POST /api/create-checkout-session
// Creates a Stripe Checkout Session and returns its hosted URL.
//
// Talks to the Stripe REST API directly with fetch so it runs on the
// Cloudflare Workers runtime without bundling the Node SDK.
//
// Required environment variable (set in Cloudflare Pages → Settings → Variables):
//   STRIPE_SECRET_KEY = sk_live_...   (use sk_test_... while testing)

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const secret = env.STRIPE_SECRET_KEY;
    if (!secret) {
      return json({ error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const priceId = body.priceId;
    // "payment" (one-time) by default; pass mode:"subscription" for recurring prices.
    const mode = body.mode === "subscription" ? "subscription" : "payment";

    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_") || priceId.includes("REPLACE")) {
      return json({ error: "Missing or placeholder Stripe price ID. Set real price IDs in data/site.js." }, 400);
    }

    const origin = new URL(request.url).origin;

    const params = new URLSearchParams();
    params.append("mode", mode);
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${origin}/success/?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${origin}/cancel/`);
    params.append("billing_address_collection", "auto");
    params.append("allow_promotion_codes", "true");
    if (body.tier) params.append("metadata[tier]", String(body.tier));

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const session = await res.json();
    if (!res.ok) {
      return json({ error: session.error?.message || "Stripe error" }, res.status);
    }

    return json({ url: session.url, id: session.id });
  } catch (err) {
    return json({ error: err.message || "Unexpected error" }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
