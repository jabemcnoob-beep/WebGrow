// Regenerates all favicons as a simplified small-size mark: a bold neon-pink
// "W" on a near-black rounded tile (the full detailed logo stays in the header
// and og images — it just can't survive 16px). Draws each size natively so
// every icon is pixel-crisp, then assembles a multi-size PNG-in-ICO file.
//   node scripts/make-favicons.js
const { createCanvas } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "public");
const BG = "#050505";
const PINK = "#ff1f8f";

// W polyline in a 100-unit box (chunky, round caps — reads at 16px)
const W_PTS = [ [18, 27], [33, 73], [50, 39], [67, 73], [82, 27] ];

function drawIcon(size) {
  const c = createCanvas(size, size);
  const x = c.getContext("2d");

  // rounded tile
  const r = size * 0.2;
  x.beginPath();
  x.moveTo(r, 0);
  x.arcTo(size, 0, size, size, r);
  x.arcTo(size, size, 0, size, r);
  x.arcTo(0, size, 0, 0, r);
  x.arcTo(0, 0, size, 0, r);
  x.closePath();
  x.fillStyle = BG;
  x.fill();

  // soft pink glow behind the mark on larger sizes
  if (size >= 48) {
    const g = x.createRadialGradient(size / 2, size * 0.55, 0, size / 2, size * 0.55, size * 0.6);
    g.addColorStop(0, "rgba(255, 31, 143, 0.28)");
    g.addColorStop(1, "rgba(255, 31, 143, 0)");
    x.fillStyle = g;
    x.fillRect(0, 0, size, size);
  }

  // the W
  x.strokeStyle = PINK;
  x.lineWidth = size * 0.15;
  x.lineCap = "round";
  x.lineJoin = "round";
  x.beginPath();
  W_PTS.forEach(([px, py], i) => {
    const sx = (px / 100) * size;
    const sy = (py / 100) * size;
    if (i === 0) x.moveTo(sx, sy);
    else x.lineTo(sx, sy);
  });
  x.stroke();

  return c.toBuffer("image/png");
}

// ICO container with PNG-compressed entries (valid for all modern browsers)
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dirs = [];
  let offset = 6 + entries.length * 16;
  for (const { size, buf } of entries) {
    const d = Buffer.alloc(16);
    d.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    d.writeUInt8(size >= 256 ? 0 : size, 1); // height
    d.writeUInt8(0, 2);  // palette
    d.writeUInt8(0, 3);  // reserved
    d.writeUInt16LE(1, 4);  // planes
    d.writeUInt16LE(32, 6); // bpp
    d.writeUInt32LE(buf.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += buf.length;
    dirs.push(d);
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.buf)]);
}

const sizes = { 16: "favicon-16.png", 32: "favicon-32.png", 48: "favicon-48.png", 180: "apple-touch-icon.png", 192: "icon-192.png", 512: "icon-512.png" };
const buffers = {};
for (const [size, name] of Object.entries(sizes)) {
  buffers[size] = drawIcon(Number(size));
  fs.writeFileSync(path.join(OUT, name), buffers[size]);
  console.log("wrote", name);
}

fs.writeFileSync(
  path.join(OUT, "favicon.ico"),
  buildIco([16, 32, 48].map((s) => ({ size: s, buf: buffers[s] })))
);
console.log("wrote favicon.ico (16+32+48)");

// matching SVG (crispest option for browsers that prefer it)
const svgPts = W_PTS.map(([px, py]) => `${px},${py}`).join(" ");
fs.writeFileSync(
  path.join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="${BG}"/>
  <polyline points="${svgPts}" fill="none" stroke="${PINK}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
);
console.log("wrote favicon.svg");
