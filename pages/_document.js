import { Html, Head, Main, NextScript } from "next/document";
import { site, seo, reviews } from "@/data/site";

// Local-business structured data (JSON-LD) — emitted into every page's HTML
// so Google can show rich results and understand WebGrow's service area.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      alternateName: "WebGrow Web Design",
      description: seo.default.description,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      image: `${site.url}/og-image.png`,
      logo: `${site.url}/logo.png`,
      priceRange: "$$",
      founder: { "@type": "Person", name: site.founder },
      knowsAbout: ["Web Design", "Website Development", "Local SEO", "Brand Identity"],
      address: { "@type": "PostalAddress", addressRegion: site.regionCode, addressCountry: "US" },
      areaServed: site.areaServed.map((a) => ({ "@type": "Place", name: a })),
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
      sameAs: Object.values(site.social),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: String(reviews.length),
        bestRating: "5",
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: String(r.stars), bestRating: "5" },
        reviewBody: r.quote,
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#business` },
    },
  ],
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* WebGrow type system:
            Display/headings — Space Grotesk · Body — Inter · Mono accents — Space Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#07070b" />
        <meta name="author" content={site.founder} />

        {/* Local geo signals */}
        <meta name="geo.region" content="US-AZ" />
        <meta name="geo.placename" content="Verde Valley, Arizona" />
        <meta name="geo.position" content={`${site.geo.lat};${site.geo.lng}`} />
        <meta name="ICBM" content={`${site.geo.lat}, ${site.geo.lng}`} />

        {/* Icons — WebGrow logo favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
