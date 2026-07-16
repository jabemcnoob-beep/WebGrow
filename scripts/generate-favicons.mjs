// Generates favicons (tab icon) + app icons from public/logo.png.
// Run: node scripts/generate-favicons.mjs
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const logo = await loadImage(join(PUBLIC, "logo.png"));
// crop a little of the white padding so the emblem fills the small icon better
const inset = 0.055;
const sx = logo.width * inset, sy = logo.height * inset;
const sw = logo.width * (1 - inset * 2), sh = logo.height * (1 - inset * 2);

function render(size) {
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff"; // white bg so the black mark is visible on any tab theme
  ctx.fillRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(logo, sx, sy, sw, sh, 0, 0, size, size);
  return c.toBuffer("image/png");
}

const outputs = {
  "favicon-16.png": 16,
  "favicon-32.png": 32,
  "favicon-48.png": 48,
  "apple-touch-icon.png": 180,
  "icon-192.png": 192,
  "icon-512.png": 512,
};
const pngs = {};
for (const [file, size] of Object.entries(outputs)) {
  const buf = render(size);
  pngs[size] = buf;
  writeFileSync(join(PUBLIC, file), buf);
  console.log("wrote", file);
}

// Build a favicon.ico embedding the 16/32/48 PNGs (modern ICO supports PNG data)
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(entries.length * 16);
  let offset = 6 + entries.length * 16;
  entries.forEach((e, i) => {
    const b = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1);
    dir.writeUInt8(0, b + 2);
    dir.writeUInt8(0, b + 3);
    dir.writeUInt16LE(1, b + 4);
    dir.writeUInt16LE(32, b + 6);
    dir.writeUInt32LE(e.buf.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += e.buf.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.buf)]);
}
const ico = buildIco([
  { size: 16, buf: pngs[16] },
  { size: 32, buf: pngs[32] },
  { size: 48, buf: pngs[48] },
]);
writeFileSync(join(PUBLIC, "favicon.ico"), ico);
console.log("wrote favicon.ico");
console.log("done");
