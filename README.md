# WebGrow

Modern marketing site for **WebGrow** — a web design studio that builds fast, custom,
high-converting websites.

Built with **Next.js (Pages Router, static export)** + **react-three-fiber / three.js**
for the 3D scroll-driven hero, and deployed to **Cloudflare Pages**. Stripe Checkout
runs through a Cloudflare Pages Function.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

> Note: the Stripe checkout endpoint lives in `functions/` and only runs on Cloudflare
> (or via `wrangler pages dev`). In plain `npm run dev`, pricing buttons fall back to the
> contact page — that's expected.

## Scripts

| Command            | What it does                                              |
| ------------------ | -------------------------------------------------------- |
| `npm run dev`      | Next dev server (hot reload)                             |
| `npm run build`    | Static export → `out/`                                   |
| `npm run pages:dev`| Serve `out/` with Cloudflare functions (needs `wrangler`)|

## Project structure

```
pages/            One file per route: index, about, examples, services, work,
                  reviews, pricing, contact, success, cancel
components/       Header, Footer, Layout, Reveal, CtaBand, Icon,
                  LaptopScene (3D hero), EffectsShowcase, PricingButton
data/site.js      ALL copy, pricing, reviews, work — edit here
styles/globals.css  The full design system (colors, type, components)
functions/api/    Cloudflare Pages Function for Stripe Checkout
public/           favicon
```

## Editing content

Almost everything — services, pricing tiers, reviews, case studies, contact details —
lives in [`data/site.js`](data/site.js). Components read from it, so update there.

## Typography

- **Display / headings** — Space Grotesk
- **Body** — Inter
- **Labels / mono accents** — Space Mono

Loaded from Google Fonts in `pages/_document.js`.

## The 3D hero

[`components/LaptopScene.js`](components/LaptopScene.js) renders a procedural laptop that
**opens and bursts with website templates as you scroll**. The home page tracks scroll
progress (0→1) over a tall sticky stage and feeds it to the scene via a ref, so the lid
opens and the template cards fly out smoothly. It's client-only (`ssr: false`) and respects
`prefers-reduced-motion`.

## Stripe payments

Payments use **Stripe Payment Links** — the simplest setup, with no backend or API keys
required. Each pricing tier's "Get Started" button links straight to its hosted Stripe
checkout page. The links live in [`data/site.js`](data/site.js) → `pricing.tiers[].paymentLink`.

To change a price or link: create/edit the Payment Link in your Stripe dashboard
(account: **WebGrow**) and paste the new URL into `data/site.js`. To set where customers
land after paying, configure each Payment Link's confirmation/redirect in Stripe (you can
point it at `/success`).

> The Cloudflare Function at `functions/api/create-checkout-session.js` is **not used** by
> the current Payment-Link setup. It's left in place only as a starting point if you ever
> want a fully branded, in-house Checkout flow instead (which would need `STRIPE_SECRET_KEY`).

## Deploying to Cloudflare Pages

1. Push this `webgrow/` folder to a Git repo (GitHub/GitLab).
2. In Cloudflare → **Pages → Create application → Connect to Git**.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** `webgrow` (if the repo contains other folders)
4. Deploy. Cloudflare serves the static `out/` directory. (No environment variables are
   needed — payments go through Stripe Payment Links.)

You can also deploy without Git using `wrangler pages deploy out` after `npm run build`.

## Logo

Drop your logo PNG into `public/` as **`logo.png`**. The header auto-detects it and shows
it on a white circular badge (so the black mark reads on the dark header); if no file is
present it falls back to the wordmark. Replace `public/favicon.svg` to update the browser tab icon.
