// Self-hosted web fonts (next/font downloads them at build time and serves
// them from this site): no render-blocking request to Google and `swap`
// display. Measured choices (throttled phone, Oct 2026):
// - preload: false — preloading ~120 KB of fonts delayed first paint by
//   ~0.6 s on slow connections; the text shows in the fallback right away.
// - size-matched fallbacks on the heading + body fonts keep text from
//   jumping when the real fonts arrive (layout shift ~0 vs 0.16 on /work).
//   The mono labels are tiny, so they skip it (each fallback costs a system
//   font lookup during the first layout).
import { Bricolage_Grotesque, Inter, Space_Mono } from "next/font/google";

export const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], display: "swap", preload: false });
export const body = Inter({ subsets: ["latin"], display: "swap", preload: false });
export const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, adjustFontFallback: false });

// handed to globals.css as --ff-display / --ff-body / --ff-mono
export const fontVars = `:root{--ff-display:${display.style.fontFamily};--ff-body:${body.style.fontFamily};--ff-mono:${mono.style.fontFamily};}`;
