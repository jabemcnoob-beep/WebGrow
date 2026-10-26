import Head from "next/head";
import { site, seo, nav } from "@/data/site";

const PAGE_NAMES = Object.fromEntries([...nav, { label: "Contact", href: "/contact" }].map((n) => [n.href, n.label]));

/**
 * Per-page SEO head tags: title, meta description, canonical, robots,
 * Open Graph and Twitter cards, plus a breadcrumb trail (JSON-LD) on inner
 * pages. Looks up title/description from the `seo` map in data/site.js by
 * `path`, or accepts explicit overrides. `jsonLd` adds page-specific
 * structured data (e.g. the pricing page's offers and FAQ).
 */
export default function Seo({ path = "/", title, description, image, noindex = false, jsonLd }) {
  const meta = seo[path] || seo.default;
  const pageTitle = title || meta.title;
  const pageDesc = description || meta.description;
  const url = site.url + (path === "/" ? "/" : path.endsWith("/") ? path : path + "/");
  const imgPath = image || meta.image || "/og-image.png";
  const ogImage = imgPath.startsWith("http") ? imgPath : site.url + imgPath;

  const graph = [];
  if (!noindex && path !== "/" && PAGE_NAMES[path]) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: PAGE_NAMES[path], item: url },
      ],
    });
  }
  if (jsonLd) graph.push(...[].concat(jsonLd));

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"}
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
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={pageTitle} />

      {graph.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
        />
      )}
    </Head>
  );
}
