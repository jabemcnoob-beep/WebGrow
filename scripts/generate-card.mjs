// Generates a print-ready (300 DPI) WebGrow business card, front + back.
// 3.5 x 2 in  ->  1050 x 600 px.  Run: node scripts/generate-card.mjs
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const OUT = "C:\\Users\\Remi White\\Downloads\\webgrow-business-card";
mkdirSync(OUT, { recursive: true });

const FD = "C:\\Windows\\Fonts\\";
const reg = (f, n) => { try { GlobalFonts.registerFromPath(FD + f, n); } catch {} };
reg("seguibl.ttf", "CBlack");
reg("segoeuib.ttf", "CBold");
reg("seguisb.ttf", "CSemi");
reg("segoeui.ttf", "CReg");

const W = 1050, H = 600;
const C = { bg: "#0a0a12", white: "#ffffff", text: "#f5f5fa", muted: "#9a9bb4", cyan: "#2dd6ee", indigo: "#7c5cff", pink: "#ff5ca8" };

const logo = await loadImage(join(PUBLIC, "logo.png"));
const li = 0.06; // crop the logo's white padding
const L = { sx: logo.width * li, sy: logo.height * li, sw: logo.width * (1 - li * 2), sh: logo.height * (1 - li * 2) };

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function bg(ctx) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  // very subtle corner glow for depth (not an aggressive gradient)
  const g = ctx.createRadialGradient(W * 0.85, -40, 0, W * 0.85, -40, 520);
  g.addColorStop(0, "rgba(124,92,255,0.16)");
  g.addColorStop(1, "rgba(124,92,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function logoBadge(ctx, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.clip();
  const d = r * 1.62;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(logo, L.sx, L.sy, L.sw, L.sh, cx - d / 2, cy - d / 2, d, d);
  ctx.restore();
}

function gradLine(ctx, x, y, w, h = 4) {
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, C.indigo); g.addColorStop(0.55, C.cyan); g.addColorStop(1, C.pink);
  ctx.fillStyle = g;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
}

// --- minimal line icons ---
function icon(ctx, kind, x, y, s) {
  ctx.save();
  ctx.strokeStyle = C.cyan;
  ctx.fillStyle = C.cyan;
  ctx.lineWidth = 2.8;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (kind === "mail") {
    const w = s, h = s * 0.72, x0 = x - w / 2, y0 = y - h / 2;
    roundRect(ctx, x0, y0, w, h, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + 2, y0 + 3); ctx.lineTo(x, y + 2); ctx.lineTo(x0 + w - 2, y0 + 3); ctx.stroke();
  } else if (kind === "phone") {
    const w = s * 0.62, h = s * 0.94, x0 = x - w / 2, y0 = y - h / 2;
    roundRect(ctx, x0, y0, w, h, 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 5, y0 + 5); ctx.lineTo(x + 5, y0 + 5); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y0 + h - 7, 1.7, 0, Math.PI * 2); ctx.fill();
  } else if (kind === "web") {
    ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, s * 0.2, s / 2, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - s / 2, y); ctx.lineTo(x + s / 2, y); ctx.stroke();
  } else if (kind === "pin") {
    ctx.beginPath();
    ctx.arc(x, y - s * 0.12, s * 0.32, Math.PI * 0.82, Math.PI * 0.18, false);
    ctx.lineTo(x, y + s * 0.46);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.11, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function tracked(ctx, text, x, y, tracking) {
  // manual letter-spacing (reliable across builds)
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  return cx - tracking;
}
function trackedWidth(ctx, text, tracking) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  return w - tracking;
}

// ============ FRONT ============
{
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  bg(ctx);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";

  logoBadge(ctx, W / 2, 195, 118);

  ctx.fillStyle = C.text;
  ctx.font = `78px "CBlack"`;
  ctx.fillText("WebGrow", W / 2, 405);

  // tracked descriptor
  ctx.textAlign = "left";
  ctx.fillStyle = C.cyan;
  ctx.font = `26px "CSemi"`;
  const label = "WEB DESIGN & SEO";
  const tw = trackedWidth(ctx, label, 6);
  tracked(ctx, label, W / 2 - tw / 2, 452, 6);

  gradLine(ctx, W / 2 - 80, 480, 160, 4);

  ctx.textAlign = "center";
  ctx.fillStyle = C.muted;
  ctx.font = `25px "CReg"`;
  ctx.fillText("webgrow.app", W / 2, 552);

  writeFileSync(join(OUT, "webgrow-card-front.png"), canvas.toBuffer("image/png"));
  console.log("wrote front");
}

// ============ BACK ============
{
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  bg(ctx);
  const M = 92;

  // small brand lockup top-left
  logoBadge(ctx, M + 34, 74, 34);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.text;
  ctx.font = `34px "CBold"`;
  ctx.fillText("WebGrow", M + 82, 86);

  // name + role
  ctx.fillStyle = C.text;
  ctx.font = `52px "CBold"`;
  ctx.fillText("Remington White", M, 214);

  ctx.fillStyle = C.muted;
  ctx.font = `25px "CReg"`;
  ctx.fillText("Founder & Web Designer  ·  Verde Valley, AZ", M, 252);

  gradLine(ctx, M, 282, 96, 4);

  // contact rows
  const rows = [
    ["mail", "webgrow.app@gmail.com"],
    ["phone", "928-679-0973"],
    ["web", "webgrow.app"],
  ];
  let y = 348;
  ctx.font = `28px "CReg"`;
  for (const [k, val] of rows) {
    icon(ctx, k, M + 15, y - 9, 30);
    ctx.fillStyle = C.text;
    ctx.fillText(val, M + 52, y);
    y += 62;
  }

  writeFileSync(join(OUT, "webgrow-card-back.png"), canvas.toBuffer("image/png"));
  console.log("wrote back");
}

console.log("done ->", OUT);
