import { Html, Head, Main, NextScript } from "next/document";
import { site, seo, pricing } from "@/data/site";

// Business structured data (JSON-LD) — emitted into every page so Google
// understands who WebGrow is, where it works and what it sells.
// - Review stars are deliberately NOT marked up here: Google ignores (and
//   discourages) a business marking up reviews of itself on its own site.
// - sameAs (social profiles) is only added for real, verified profiles —
//   list them in site.verifiedProfiles.
const num = (p) => Number(String(p).replace(/[^0-9.]/g, "")) || undefined;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      alternateName: "WebGrow Web Design",
      description: seo.default.description,
      slogan: site.tagline,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      image: `${site.url}/og-image.png`,
      logo: `${site.url}/logo.png`,
      priceRange: "$500–$5,000",
      currenciesAccepted: "USD",
      paymentAccepted: "Credit card, Debit card",
      founder: { "@type": "Person", name: site.founder },
      knowsAbout: ["Web Design", "Website Development", "Local SEO", "Search Engine Optimization", "Responsive Web Design", "E-commerce Websites", "Brand Identity"],
      address: { "@type": "PostalAddress", addressRegion: site.regionCode, addressCountry: "US" },
      areaServed: site.areaServed.map((a) =>
        a === site.region ? { "@type": "State", name: a }
        : a === "Verde Valley" ? { "@type": "Place", name: "Verde Valley, Arizona" }
        : { "@type": "City", name: `${a}, ${site.regionCode}` }),
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
      ...(site.verifiedProfiles?.length ? { sameAs: site.verifiedProfiles } : {}),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Website design packages",
        itemListElement: pricing.tiers.map((t) => ({
          "@type": "Offer",
          name: t.name,
          description: t.tagline,
          price: num(t.price),
          priceCurrency: "USD",
          url: `${site.url}/pricing/`,
          itemOffered: { "@type": "Service", name: t.name, serviceType: "Web design", provider: { "@id": `${site.url}/#business` } },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "en-US",
      publisher: { "@id": `${site.url}/#business` },
    },
  ],
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#fafaf8" />
        <meta name="author" content={site.founder} />

        {/* Local geo signals */}
        <meta name="geo.region" content="US-AZ" />
        <meta name="geo.placename" content="Verde Valley, Arizona" />
        <meta name="geo.position" content={`${site.geo.lat};${site.geo.lng}`} />
        <meta name="ICBM" content={`${site.geo.lat}, ${site.geo.lng}`} />

        {/* Icons — simplified pink-W mark (the full logo doesn't survive 16px) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
