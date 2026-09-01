/**
 * Fixed full-viewport film-grain overlay (.fx-grain). Pure presentational div
 * — the SVG feTurbulence texture and the 8-step background-position loop live
 * entirely in effects.css, so no JS runs here and the global reduced-motion
 * rule freezes it into static grain automatically. Sits at z-index 9000, just
 * under the custom cursor (9999).
 */
export default function Grain() {
  return <div className="fx-grain" aria-hidden="true" />;
}
