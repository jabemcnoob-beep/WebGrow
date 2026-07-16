// ============================================================
// WebGrow — single source of truth for all site content.
// Edit copy, pricing, reviews, and work here; every page reads from this file.
// ============================================================

export const site = {
  name: "WebGrow",
  founder: "Remington White",
  tagline: "Website designs that grow your business.",
  // Short line used in the footer / meta.
  blurb: "Custom websites for restaurants and local businesses across Arizona's Verde Valley — and beyond.",
  email: "webgrow.app@gmail.com",
  phone: "928-679-0973",
  // ---- canonical domain (used for SEO: canonical URLs, sitemap, OG tags) ----
  url: "https://webgrow.app",
  // ---- local SEO ----
  region: "Arizona",
  regionCode: "AZ",
  area: "Verde Valley, Arizona",
  areaServed: [
    "Verde Valley", "Sedona", "Cottonwood", "Camp Verde",
    "Clarkdale", "Cornville", "Rimrock", "Jerome", "Arizona",
  ],
  geo: { lat: 34.7, lng: -111.9 }, // approximate Verde Valley center
  social: {
    instagram: "https://instagram.com/webgrow",
    x: "https://x.com/webgrow",
    dribbble: "https://dribbble.com/webgrow",
    linkedin: "https://linkedin.com/company/webgrow",
  },
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Examples", href: "/examples" },
  { label: "Work", href: "/work" },
  { label: "Reviews", href: "/reviews" },
  { label: "Pricing", href: "/pricing" },
];

export const stats = [
  { num: "3×", label: "Avg. revenue growth" },
  { num: "100%", label: "Client satisfaction" },
  { num: "+340%", label: "Traffic growth" },
  { num: "100", label: "Performance score" },
];

export const marquee = [
  "+200% Sales Rate", "5%+ Conversion Rate", "Booked Stays",
  "+340% Traffic", "3× Revenue Growth", "60-Day Turnaround",
];

// The founder's signature line.
export const founderQuote = {
  quote: "A website isn't a cost — it's the hardest-working employee you'll ever hire.",
  by: "Remington White, Founder of WebGrow",
};

// ------------------------------------------------------------
// SERVICES — "What We Deliver" + "The WebGrow Method"
// `desc` is the short card copy; `intro` + `steps` power the method section.
// ------------------------------------------------------------
export const services = [
  {
    icon: "✦",
    title: "Conversion-Focused Design",
    desc: "Every layout, color, and call-to-action is engineered to turn casual visitors into paying customers — not just look pretty.",
    intro: "A beautiful website that doesn't drive action is just decoration. Everything we design starts with one question: what do we want your visitor to do next?",
    steps: [
      "We learn your business and your customers first — who they are, what they need, and what makes them say yes.",
      "Every page is structured around a single clear goal, with strong visual hierarchy that guides the eye exactly where it should go.",
      "Calls-to-action are placed and worded to feel natural, not pushy — so booking, calling, or buying becomes the obvious next step.",
    ],
  },
  {
    icon: "⚡",
    title: "Lightning-Fast Performance",
    desc: "Sub-second load times and perfect SEO scores — so Google ranks you higher and customers never bounce before they buy.",
    intro: "Slow sites lose customers and rank lower on Google. Speed isn't an afterthought for us — it's built in from the very first line.",
    steps: [
      "We compress and right-size every image and asset so nothing heavier than necessary ever loads.",
      "Pages are built lean and clean, loading only what each visitor actually needs to see.",
      "We test on real phones and connections to make sure your site stays fast everywhere, not just on a fast office computer.",
    ],
  },
  {
    icon: "◈",
    title: "End-to-End Delivery",
    desc: "Strategy, design, development, launch, and beyond. You focus on running your business — we handle everything digital.",
    intro: "You shouldn't have to juggle five vendors to get one website. With WebGrow, you get a single partner for the entire journey.",
    steps: [
      "We start with strategy and planning so we're building toward real business goals, not just a pretty page.",
      "Design and development happen under one roof, so nothing gets lost in translation between teams.",
      "We handle launch, domain setup, and the technical details — then stay available for support after you go live.",
    ],
  },
  {
    icon: "◉",
    title: "Restaurant & Local Business",
    desc: "Specialized in businesses that need foot traffic and local dominance — menus, booking systems, Google Maps integration, and more.",
    intro: "Local businesses win or lose by foot traffic and phone calls. We build sites designed specifically to bring nearby customers through your door.",
    steps: [
      "Menus, booking, and online ordering are built right in, so customers can act the moment they're interested.",
      "We connect Google Maps, reviews, and your business profile so you show up when people search nearby.",
      "Everything is mobile-first, because your customers are searching on their phones while they're out and about.",
    ],
  },
  {
    icon: "✺",
    title: "SEO & Organic Growth",
    desc: "We build with search engines in mind from day one — structured data, performance scores, and content strategies that compound over time.",
    intro: "The best customers are the ones who find you on their own. We lay the groundwork so your site climbs search rankings and earns steady, free traffic.",
    steps: [
      "We build with a clean, search-friendly structure and proper metadata so Google understands your site.",
      "Local SEO and your Google Business profile are set up so you appear for searches in your area.",
      "Fast load times and solid fundamentals mean your rankings compound and grow over time.",
    ],
  },
  {
    icon: "◐",
    title: "Brand Identity & Visual Design",
    desc: "From logo to color palette to typography — we craft a visual identity that makes your brand unmistakable and unforgettable.",
    intro: "A consistent, polished brand earns instant trust. We craft a visual identity that makes your business look established and unmistakably yours.",
    steps: [
      "We define a cohesive palette and typography that fit your business's personality.",
      "Your logo, imagery, and visual style are treated with care so everything feels intentional.",
      "That identity stays consistent across every page and screen, so you look professional everywhere.",
    ],
  },
];

// Visual effects to showcase on the Examples page.
export const effects = [
  { kind: "magnetic", title: "Magnetic cursor", desc: "Buttons and elements that lean toward the cursor with spring physics." },
  { kind: "tilt", title: "3D tilt cards", desc: "Cards that rotate in 3D space following the pointer for a tactile feel." },
  { kind: "blob", title: "Living gradients", desc: "Animated WebGL-style gradient blobs that drift and breathe behind content." },
  { kind: "shimmer", title: "Shimmer reveal", desc: "Text and edges that catch light as the user scrolls into view." },
  { kind: "marquee", title: "Infinite marquee", desc: "Seamless looping logo and keyword strips that add motion without noise." },
  { kind: "parallax", title: "Scroll parallax", desc: "Layers that move at different speeds to create real depth on scroll." },
  { kind: "reveal", title: "Scroll choreography", desc: "Content that animates in with precise easing as it enters the viewport." },
  { kind: "explode", title: "3D explode hero", desc: "A 3D laptop that opens and bursts with templates as you scroll — like the one on our home page." },
];

export const values = [
  { icon: "✶", title: "Custom, always", desc: "No themes, no page builders. Every line is written personally for your brand." },
  { icon: "✦", title: "Growth obsessed", desc: "We treat every pixel as a chance to win you another customer." },
  { icon: "✷", title: "One partner, end to end", desc: "Strategy, design, build, launch, and support — all handled by WebGrow." },
];

// "The WebGrow Method" process at a glance (for About page).
export const timeline = [
  { yr: "Discover", title: "Strategy & goals", desc: "We learn your business, your customers, and what 'success' actually means in numbers." },
  { yr: "Design", title: "Bespoke visuals", desc: "Conversion-focused, custom design with your brand identity baked in from the start." },
  { yr: "Build", title: "Hand-coded", desc: "Lean, fast, accessible code — no bloat, deployed to Cloudflare's edge." },
  { yr: "Grow", title: "Launch & optimize", desc: "Domain setup, SEO, analytics, and ongoing care so the site keeps converting." },
];

export const work = [
  {
    title: "The Handy Firemen",
    url: "https://thehandyfiremen.com",
    image: "/work-handy-firemen.png",
    tags: ["Handyman Services", "Redesign", "Local SEO"],
    summary: "A complete website redesign engineered for higher traffic and effortless smoothness — we transformed a low-quality, outdated site into a fast, polished online presence that wins trust and books jobs.",
    metrics: [ { num: "+200%", lbl: "Sales rate" }, { num: "5%+", lbl: "Conversion rate" } ],
  },
  {
    title: "Almost Sedona",
    url: "https://almostsedona.com",
    image: "/work-almost-sedona.png",
    tags: ["Airbnb Business", "Built from scratch", "Bookings"],
    summary: "Built their website entirely from scratch — a modern, one-of-a-kind design crafted to captivate tourists and travelers from afar and turn curious browsers into booked stays.",
    metrics: [ { num: "5%+", lbl: "Conversion rate" }, { num: "↑", lbl: "Booked stays" } ],
  },
  {
    title: "Best Clean Pros",
    url: "https://bestcleanpros.com",
    image: "/work-best-clean-pros.png",
    imageFit: "contain",
    thumbBg: "linear-gradient(135deg, #eaf3fc, #ffffff 55%, #dceefb)",
    tags: ["Cleaning Service", "Built from scratch", "Booking & SEO"],
    summary: "A bright, modern website for a residential and commercial cleaning company — built from the ground up to turn local searches into booked cleanings, with clear services, trust-building design, and an easy path to a quote.",
    // metrics intentionally omitted until real numbers are provided
  },
];

export const reviews = [
  {
    stars: 5,
    quote: "I hired WebGrow to completely revamp the website for my growing small construction business in Northern Arizona. From the very first conversation, Remi was outstanding. He worked tirelessly to deliver a premium, professional website that truly represents my business — clean, modern, and built to convert visitors into leads. Remi guided me through every step with clear communication and expert attention to detail, handling everything from design and functionality to properly connecting my domain, making the entire experience seamless. His dedication and responsiveness went above and beyond what I expected. I'm already looking forward to the positive impact this new site will have on my lead flow and job opportunities. I highly recommend Remi and WebGrow to any business owner looking for a high-quality website and exceptional service.",
    name: "Mackenzie White",
    role: "Owner, The Handy Firemen",
  },
  {
    stars: 5,
    quote: "We couldn't be happier with the website that was created for our cleaning service! The communication was outstanding, and that's hard to find these days. Every idea we had was listened to and brought to life. Remi has an incredible eye for design and created a modern, professional website that truly reflects our business. It also makes it easy for our customers to find what they need. The experience exceeded our expectations and was smooth from start to finish. If you're looking for a talented professional who genuinely cares, we highly recommend WebGrow.",
    name: "Wendy Gist",
    role: "Best Clean Pros",
  },
  {
    stars: 5,
    quote: "Highly recommend this site for website building! He listened carefully to every request, used all the exact language and features we asked for, and had everything fixed and launched incredibly fast. Professional, responsive, and a pleasure to work with. Perfect for anyone needing a quality site quickly. 5 stars!",
    name: "Alison White",
    role: "Verified client",
  },
];

// ------------------------------------------------------------
// PRICING  (matches the WebGrow pricing screenshot)
// `stripePriceId` is the Stripe Price ID used at checkout — replace the
// placeholders with the real IDs from your Stripe dashboard.
// Tiers with `custom: true` send people to the contact page instead of Stripe.
// ------------------------------------------------------------
export const pricing = {
  eyebrow: "Super transparent pricing",
  heading: "Plans built to grow with you.",
  sub: "Premium, custom websites built personally for your business. No templates, no hidden fees — just clean, fast, beautiful design that works.",
  // ---- "Please read before purchasing" — collapsible hosting / Framer subscription note ----
  hosting: {
    title: "Please read before purchasing",
    text: "Most WebGrow websites are designed and built on Framer, a premium website platform — and I now build on Cloudflare and GitHub as well. If your site is built on Framer, it requires an active Framer subscription to stay online. This is a recurring monthly fee billed by Framer, and it is separate from your one-time design fee above. You can view Framer's full plans on their official pricing page.",
    framerUrl: "https://www.framer.com/pricing/",
    plans: [
      { price: "$10", per: "/ month", label: "Basic website hosting" },
      { price: "$30", per: "/ month", label: "Pro website hosting" },
    ],
    closing: "Tap either plan above to see it on Framer's pricing page. I'll always recommend the right tier for your needs and walk you through getting set up — so there are never any surprises.",
  },
  tiers: [
    {
      id: "custom-website",
      name: "Custom Website",
      price: "$500",
      tagline: "A high-quality, lightning-fast custom website — designed and built personally for your business, all in one.",
      paymentLink: "https://buy.stripe.com/fZu8wQ7Bh33d94udYQ0oM00",
      cta: "Get Started",
      featured: false,
      features: [
        { label: "Custom, made-from-scratch design", on: true },
        { label: "Next-level user experience", on: true },
        { label: "Conversion-focused structure", on: true },
        { label: "Perfect on every device", on: true },
        { label: "Lightning-fast, clean code", on: true },
      ],
    },
    {
      id: "website-seo-launch",
      name: "Website + SEO & Launch",
      price: "$1,000",
      tagline: "Everything in the Custom Website, plus full SEO and a hands-on launch so customers actually find you on Google.",
      paymentLink: "https://buy.stripe.com/fZu9AU08P33d5Si3kc0oM01",
      cta: "Get Started",
      featured: true,
      badge: "Most Popular",
      features: [
        { label: "Everything in Custom Website", on: true },
        { label: "Full on-page & local SEO", on: true },
        { label: "Hands-on launch & domain setup", on: true },
        { label: "Performance & speed tuning", on: true },
      ],
    },
    {
      id: "custom-build",
      name: "Custom Build",
      price: "$5,000",
      tagline: "For ambitious projects — e-commerce, booking systems, or something bigger, built around your exact goals.",
      paymentLink: "https://buy.stripe.com/9B66oIf3J7jt6Wmg6Y0oM02",
      cta: "Get Started",
      featured: false,
      features: [
        { label: "Everything in Website + SEO", on: true },
        { label: "E-commerce, booking & custom features", on: true },
        { label: "Ongoing support & maintenance", on: true },
        { label: "Built around your exact goals", on: true },
      ],
    },
  ],
  faqs: [
    { q: "How long does a build take?", a: "Most websites ship within a 60-day turnaround, and often much faster depending on scope. You'll get a clear timeline before we start." },
    { q: "Do I own the site?", a: "Completely. We hand over a clean, fast site and deploy it to your own hosting. No platform lock-in, no monthly ransom." },
    { q: "What's the difference between the plans?", a: "Custom Website is the core build. Website + SEO & Launch adds full search optimization and a hands-on launch. Custom / Let's Talk is for e-commerce, booking, or anything more ambitious." },
    { q: "Can you take payments or bookings for me?", a: "Yes — we wire Stripe checkout, subscriptions, or booking directly into your site so you can start earning from day one." },
    { q: "What kinds of businesses do you work with?", a: "We specialize in restaurants, local businesses, and brands worldwide — anyone who wants their website to become their #1 revenue driver." },
  ],
};

export const faqsHome = pricing.faqs.slice(0, 4);

// ------------------------------------------------------------
// SEO — per-page titles + meta descriptions (local, Verde Valley AZ focus).
// Keep titles ~60 chars and descriptions ~150-160 chars. Keyed by route path.
// ------------------------------------------------------------
export const seo = {
  default: {
    title: "WebGrow | Verde Valley & Arizona Web Design",
    description: "WebGrow builds fast, modern, conversion-focused websites for restaurants and local businesses across Arizona's Verde Valley — Sedona, Cottonwood & beyond.",
    image: "/og-image.png",
  },
  "/": {
    title: "Verde Valley Web Design That Grows Your Business | WebGrow",
    description: "Custom, high-converting websites for Verde Valley & Arizona businesses. WebGrow makes your site your #1 salesperson with modern design and local SEO. Free quote.",
    image: "/og-image.png",
  },
  "/about": {
    title: "Verde Valley Web Designer | About WebGrow, AZ",
    description: "Meet Remington White of WebGrow — a Verde Valley web designer crafting custom, conversion-focused websites for restaurants and local businesses across Arizona.",
    image: "/og-about.png",
  },
  "/services": {
    title: "Web Design, Local SEO & Branding | WebGrow Verde Valley",
    description: "From custom design and local SEO to branding, payments and launch, WebGrow handles everything Verde Valley and Arizona businesses need to grow online.",
    image: "/og-services.png",
  },
  "/examples": {
    title: "Website Effects, 3D & Live Demos | WebGrow Arizona",
    description: "Explore the 3D, motion and cursor effects WebGrow can build into your site — live, interactive demos showing what's possible for your Arizona business.",
    image: "/og-examples.png",
  },
  "/work": {
    title: "Our Work | Verde Valley & Arizona Websites — WebGrow",
    description: "See real websites WebGrow built for Arizona businesses — The Handy Firemen, Almost Sedona and Best Clean Pros — and the growth that followed. View our work.",
    image: "/og-work.png",
  },
  "/reviews": {
    title: "Reviews | Verde Valley Web Design Clients — WebGrow",
    description: "Read 5-star reviews from Arizona business owners who grew with WebGrow. Honest, hands-on web design and local SEO for the Verde Valley and beyond.",
    image: "/og-reviews.png",
  },
  "/pricing": {
    title: "Web Design Pricing for Arizona Businesses | WebGrow",
    description: "Transparent web design pricing for Verde Valley and Arizona businesses — custom sites from $500, plus SEO and launch packages. No templates, no hidden fees.",
    image: "/og-pricing.png",
  },
  "/contact": {
    title: "Get a Free Website Quote | Verde Valley, AZ — WebGrow",
    description: "Tell WebGrow about your Verde Valley or Arizona business and Remington will craft a free, no-obligation website quote. Serving Sedona, Cottonwood & beyond.",
    image: "/og-contact.png",
  },
};

// ------------------------------------------------------------
// POST-PURCHASE "What happens next" pages, keyed by plan id.
// Each Stripe Payment Link's "after payment" redirect points at /next/<id>.
// Add a new entry here + a thin page in pages/next/ when a plan's copy arrives.
// ------------------------------------------------------------
export const nextSteps = {
  "custom-website": {
    plan: "Custom Website",
    price: "$500",
    heading: "What happens next.",
    intro: "Thanks for choosing your Custom Website! To build something that truly represents your business, here's everything I'll need from you to get started.",
    sectionTitle: "What to send me",
    steps: [
      { title: "Tell me about your business", desc: "Send a short overview — what you do, who your customers are, your location, hours, and what makes you different. The more detail, the better the result." },
      { title: "Send your photos & media", desc: "Share high-quality photos of your work, team, storefront, products, or projects. These bring your site to life — phone photos are fine, just keep them clear and well-lit." },
      { title: "Share your portfolio & past work", desc: "If you have examples of completed jobs, products, or projects you're proud of, send them over so we can showcase them and build trust with your visitors." },
      { title: "Provide your contact details & links", desc: "Phone number, email, address, and any social media or booking links you want included so customers can reach you easily." },
      { title: "Share any branding you have", desc: "Logo, brand colors, or fonts if you have them. No worries if you don't — I can help create a clean, professional look from scratch." },
    ],
  },
  "website-seo-launch": {
    plan: "Website + SEO & Launch",
    price: "$1,000",
    heading: "What happens next.",
    intro: "Thank you for choosing the Website + SEO & Launch plan! Along with everything for your custom website, I'll handle getting you found online and fully launched. Here's what I'll need.",
    sectionTitle: "What to send me",
    steps: [
      { title: "Everything from the Custom Website plan", desc: "Your business info, photos, portfolio, contact details, and any branding — all the essentials to build your site." },
      { title: "Your domain details", desc: "If you already own a domain, send me your registrar login or invite me as a collaborator so I can connect it. Don't have one yet? Tell me your preferred name and I'll guide you through getting it." },
      { title: "Your target keywords & area", desc: "What words would customers type into Google to find you, and which towns or regions do you serve? This shapes your SEO so the right people find you." },
      { title: "Your social & analytics goals", desc: "Let me know which social platforms matter most and whether you'd like Google Analytics connected so we can track visitors and engagement." },
      { title: "Your preferred social preview", desc: "I'll set up your meta title, description, and a custom social media link preview — just confirm the wording and image you'd like shown when your site is shared." },
    ],
  },
  "custom-build": {
    plan: "Custom / Tailored Package",
    price: "Custom",
    heading: "What happens next.",
    intro: "Thank you! Since your project is tailored to your specific goals, our first step is a quick conversation to map everything out together.",
    sectionTitle: "What to send me",
    ctaTitle: "Ready to get started?",
    ctaText: "Reach out and we'll book your kickoff call to talk through your goals, scope, and timeline.",
    ctaButtonLabel: "Book your kickoff chat",
    steps: [
      { title: "Book your kickoff chat", desc: "Reach out and we'll schedule a call to discuss your goals, scope, timeline, and any special features like e-commerce or ongoing support." },
      { title: "Gather your business materials", desc: "Start collecting your business info, photos, portfolio, and branding — we'll confirm exactly what's needed for your specific build during our chat." },
      { title: "Share your must-haves", desc: "Make a list of the features and pages you need so we can scope the project precisely and build a plan around your goals." },
    ],
  },
};
