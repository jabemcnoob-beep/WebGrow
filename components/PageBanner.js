import ScrollFrame from "@/components/ScrollFrame";
import LoopVideo from "@/components/LoopVideo";

/**
 * Wide cinematic clip under an inner page's headline: a rounded frame that
 * grows into place as you scroll (ScrollFrame) with a slow-drifting,
 * seamlessly looping background video inside (LoopVideo). `focus` is the
 * subject's position, kept in view when phones crop the clip tall.
 */
export default function PageBanner({ src, poster, alt = "", tag, focus = "50% 50%" }) {
  return (
    <div className="container page-banner-wrap" style={{ "--focus": focus }}>
      <ScrollFrame className="page-banner" tilt={0}>
        <LoopVideo src={src} poster={poster} alt={alt} range={10} />
        {tag && <span className="ph-tag">{tag}</span>}
      </ScrollFrame>
    </div>
  );
}
