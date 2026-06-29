// Generates on-brand 1200x630 social-preview (Open Graph) images for each page.
// Run: node scripts/generate-og.mjs   (uses @napi-rs/canvas — a devDependency)
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const W = 1200, H = 630, M = 80;

// ---- fonts (Windows system fonts; clean + modern) ----
const FD = "C:\\Windows\\Fonts\\";
const reg = (file, name) => { try { GlobalFonts.registerFromPath(FD + file, name); } catch {} };
reg("segoeuib.ttf", "OGBold");
reg("seguisb.ttf", "OGSemi");
reg("segoeui.ttf", "OGReg");
reg("seguibl.ttf", "OGBlack");
const BOLD = '"OGBold"', SEMI = '"OGSemi"', REG = '"OGReg"', BLACK = '"OGBlack"';

// ---- palette ----
const C = { bg: "#07070b", indigo: "#7c5cff", cyan: "#22d3ee", pink: "#ff5ca8", text: "#f4f4f8", muted: "#bcbdd2", eyebrow: "#34d5ee" };

// deterministic RNG so the starfield is stable across runs
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function glow(ctx, x, y, r, color, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace(")", `, ${a})`).replace("rgb", "rgba"));
  g.addColorStop(1, color.replace(")", `, 0)`).replace("rgb", "rgba"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

async function draw(page) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // base
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // nebula glows
  glow(ctx, W * 0.82, -40, 620, "rgb(124,92,255)", 0.42);
  glow(ctx, 40, 120, 520, "rgb(34,211,238)", 0.26);
  glow(ctx, W * 0.5, H + 80, 560, "rgb(255,92,168)", 0.22);

  // faint grid
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // constellation
  const rnd = mulberry32(42);
  const stars = Array.from({ length: 70 }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() * 1.8 + 0.4 }));
  ctx.strokeStyle = "rgba(124,92,255,0.18)";
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
      if (Math.hypot(dx, dy) < 120 && rnd() > 0.6) { ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(stars[j].x, stars[j].y); ctx.stroke(); }
    }
  }
  for (const s of stars) { ctx.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.5})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }

  // brand lockup (logo + wordmark)
  try {
    const logo = await loadImage(join(PUBLIC, "logo.png"));
    ctx.drawImage(logo, M, 52, 86, 86);
  } catch {}
  ctx.textBaseline = "top";
  ctx.fillStyle = C.text;
  ctx.font = `40px ${BOLD}`;
  ctx.fillText("WebGrow", M + 104, 70);

  // eyebrow
  let y = 240;
  ctx.fillStyle = C.eyebrow;
  ctx.font = `23px ${SEMI}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
  ctx.fillText(page.eyebrow.toUpperCase(), M, y);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  y += 44;

  // headline
  ctx.fillStyle = C.text;
  ctx.font = `56px ${BLACK}`;
  const hLines = wrap(ctx, page.headline, W - M * 2 - 40);
  for (const l of hLines) { ctx.fillText(l, M, y); y += 64; }

  // subtext
  y += 16;
  ctx.fillStyle = C.muted;
  ctx.font = `26px ${REG}`;
  const sLines = wrap(ctx, page.sub, 1000);
  for (const l of sLines) { ctx.fillText(l, M, y); y += 36; }

  // CTA pill (black text)
  const cy = 540, ch = 58, label = "Get a Free Quote  →";
  ctx.font = `25px ${BOLD}`;
  const cw = ctx.measureText(label).width + 56;
  const grad = ctx.createLinearGradient(M, cy, M + cw, cy);
  grad.addColorStop(0, C.indigo); grad.addColorStop(0.6, C.cyan); grad.addColorStop(1, C.pink);
  ctx.fillStyle = grad;
  roundRect(ctx, M, cy, cw, ch, ch / 2);
  ctx.fill();
  ctx.fillStyle = "#0a0a12"; // BLACK text, fully visible
  ctx.fillText(label, M + 28, cy + 16);

  // watermark
  ctx.textAlign = "right";
  ctx.fillStyle = "#9a9bb4";
  ctx.font = `24px ${SEMI}`;
  ctx.fillText("webgrow.app", W - M, cy + 18);
  ctx.textAlign = "left";

  const buf = canvas.toBuffer("image/png");
  writeFileSync(join(PUBLIC, page.file), buf);
  console.log("wrote", page.file, hLines.length + "h", sLines.length + "s");
}

const PAGES = [
  { file: "og-image.png", eyebrow: "Verde Valley & Arizona Web Design", headline: "Websites that grow your business.", sub: "WebGrow helps restaurants and local businesses across Arizona's Verde Valley — and beyond — turn their website into their #1 revenue driver with design that converts." },
  { file: "og-about.png", eyebrow: "About WebGrow", headline: "Custom web design, done personally.", sub: "Led by Remington White — modern, high-converting websites for restaurants and local businesses across the Verde Valley & Arizona." },
  { file: "og-services.png", eyebrow: "What We Deliver", headline: "Design, SEO & branding that grows you.", sub: "Custom web design, local SEO, motion, payments and launch — everything your Verde Valley business needs, from one studio." },
  { file: "og-examples.png", eyebrow: "Effects Showcase", headline: "Effects that make people stay.", sub: "3D, motion and cursor magic WebGrow can build right into your Arizona business website. Live, interactive demos." },
  { file: "og-work.png", eyebrow: "Selected Work", headline: "Brands we've helped grow.", sub: "Real websites for Arizona businesses — The Handy Firemen, Almost Sedona & Best Clean Pros — and the results that followed." },
  { file: "og-reviews.png", eyebrow: "Kind Words", headline: "Loved by Arizona founders.", sub: "Five-star reviews for honest, hands-on web design and local SEO across the Verde Valley and beyond." },
  { file: "og-pricing.png", eyebrow: "Super Transparent Pricing", headline: "Simple pricing that scales with you.", sub: "Custom websites from $500, plus SEO & launch packages. No templates, no hidden fees — just clean, fast design." },
  { file: "og-contact.png", eyebrow: "Free Quote — No Obligations", headline: "Let's grow your business online.", sub: "Tell WebGrow about your Verde Valley or Arizona business and Remington will craft a free, personal website quote." },
];

for (const p of PAGES) await draw(p);
console.log("done");
