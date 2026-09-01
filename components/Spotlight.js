import { useEffect, useRef } from "react";

/**
 * Cursor spotlight surface: writes --fx-mx / --fx-my (percent) onto the
 * wrapper on pointermove; effects.css paints a pink radial glow overlay plus a
 * masked border highlight near the cursor (both fade in on hover). Direct
 * style-var writes, no rAF needed. Coarse pointers get no listeners — the
 * surface renders static.
 */
export default function Spotlight({ children, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--fx-mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`);
      el.style.setProperty("--fx-my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={`fx-spot ${className}`} ref={ref} {...rest}>
      {children}
    </div>
  );
}
