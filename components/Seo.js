import Head from "next/head";
import { site, seo } from "@/data/site";

/**
 * Per-page SEO head tags: title, meta description, canonical, robots,
 * Open Graph and Twitter cards. Looks up title/description from the
 * `seo` map in data/site.js by `path`, or accepts explicit overrides.
 */
export default function Seo({ path = "/", title, description, image, noindex = false }) {
  const meta = seo[path] || seo.default;
  const pageTitle = title || meta.title;
  const pageDesc = description || meta.description;
  const url = site.url + (path === "/" ? "/" : path.endsWith("/") ? path : path + "/");
  const ogImage = (image || "/og-image.png").startsWith("http")
    ? image
    : site.url + (image || "/og-image.png");

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
