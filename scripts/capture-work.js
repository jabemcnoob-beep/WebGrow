// Captures fresh, tall screenshots of the client sites for the device
// showcase / work cards, using the locally installed Chrome via puppeteer-core.
// Full-page capture (so vh-based sections render correctly), cropped to at
// most ~3.2 viewport-heights and re-encoded as JPEG to keep files lean.
//   node scripts/capture-work.js            (all sites)
//   node scripts/capture-work.js pasture    (only sites whose URL contains "pasture")
const puppeteer = require("puppeteer-core");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

const BROWSER = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = path.join(__dirname, "..", "public");
const WIDTH = 1280;
const VIEW_H = 800;
const MAX_H = 2600; // ~3.2 screens of scroll for the showcase pan

const SITES = [
  { url: "https://www.azwildfiremitigation.com", file: "work-az-wildfire.jpg" },
  // apex has no DNS record — only www resolves
  { url: "https://www.bestcleanpros.com", file: "work-best-clean-pros.jpg" },
  { url: "https://thehandyfiremen.com", file: "work-handy-firemen.jpg" },
  { url: "https://almostsedona.com", file: "work-almost-sedona.jpg" },
  { url: "https://pasture-paw.com", file: "work-pasture-paw.jpg" },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: BROWSER,
    headless: "new",
    args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  const only = process.argv[2];
  for (const site of SITES.filter((s) => !only || s.url.includes(only))) {
    try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: VIEW_H, deviceScaleFactor: 1 });
    // reduced motion => scroll-reveal sections render composed instead of
    // waiting for IntersectionObservers that never fire in a fullPage shot
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    console.log("visiting", site.url);
    await page.goto(site.url, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));
    // scroll through the page to trigger any lazy loads / stubborn reveals
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          y += 600;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight + 600) setTimeout(step, 120);
          else resolve();
        };
        step();
      });
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 800));
    const raw = await page.screenshot({ fullPage: true, type: "png" });
    await page.close();

    const img = await loadImage(raw);
    const h = Math.min(img.height, MAX_H);
    const c = createCanvas(WIDTH, h);
    c.getContext("2d").drawImage(img, 0, 0, WIDTH, h, 0, 0, WIDTH, h);
    const jpg = c.toBuffer("image/jpeg", 82);
    fs.writeFileSync(path.join(OUT, site.file), jpg);
    console.log("  saved", site.file, `${WIDTH}x${h}`, (jpg.length / 1024).toFixed(0) + "KB");
    } catch (e) {
      console.error("  FAILED", site.url, "-", e.message);
    }
  }

  await browser.close();
})();
