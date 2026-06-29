/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so Cloudflare Pages can serve the site as static assets.
  // The Stripe checkout endpoint lives in /functions (Cloudflare Pages Functions),
  // so we don't need Next.js API routes at runtime.
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    // next/image optimization isn't available on a static export.
    unoptimized: true,
  },
  // three.js ships ES modules that Next can transpile for us.
  transpilePackages: ["three"],
};

module.exports = nextConfig;
