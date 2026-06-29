import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* Draw a tiny website mock onto a canvas → used as a flying "template". */
function makeSiteTexture(hue) {
  const c = document.createElement("canvas");
  c.width = 320; c.height = 220;
  const x = c.getContext("2d");

  const g = x.createLinearGradient(0, 0, 320, 220);
  g.addColorStop(0, `hsl(${hue}, 65%, 17%)`);
  g.addColorStop(1, `hsl(${(hue + 46) % 360}, 70%, 9%)`);
  x.fillStyle = g; x.fillRect(0, 0, 320, 220);

  // nav bar
  x.fillStyle = "rgba(255,255,255,0.07)"; x.fillRect(0, 0, 320, 30);
  x.fillStyle = `hsl(${hue}, 90%, 66%)`;
  x.beginPath(); x.arc(18, 15, 6, 0, Math.PI * 2); x.fill();
  x.fillStyle = "rgba(255,255,255,0.45)";
  for (let i = 0; i < 4; i++) x.fillRect(214 + i * 24, 12, 16, 6);

  // hero copy
  x.fillStyle = "rgba(255,255,255,0.9)";
  x.fillRect(22, 60, 170, 16);
  x.fillRect(22, 84, 116, 16);
  x.fillStyle = `hsl(${hue}, 90%, 62%)`;
  x.fillRect(22, 112, 76, 22);

  // hero visual
  x.fillStyle = "rgba(255,255,255,0.06)"; x.fillRect(210, 54, 92, 84);

  // content row
  x.fillStyle = "rgba(255,255,255,0.07)";
  x.fillRect(22, 156, 84, 50);
  x.fillRect(118, 156, 84, 50);
  x.fillRect(214, 156, 84, 50);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  tex.anisotropy = 4;
  return tex;
}

// final "exploded" layout for the template cards
const CARD_LAYOUT = [
  { end: [-3.4, 2.2, 0.6], rot: [0.05, 0.5, 0.12], hue: 258 },
  { end: [-2.1, 3.1, -0.4], rot: [-0.05, 0.28, -0.08], hue: 190 },
  { end: [0.0, 3.5, 0.3], rot: [0.04, 0.0, 0.0], hue: 318 },
  { end: [2.1, 3.05, -0.4], rot: [-0.05, -0.28, 0.08], hue: 168 },
  { end: [3.4, 2.15, 0.6], rot: [0.05, -0.5, -0.12], hue: 268 },
  { end: [-2.9, 0.9, 1.4], rot: [0.1, 0.42, 0.1], hue: 210 },
  { end: [2.9, 0.85, 1.4], rot: [0.1, -0.42, -0.1], hue: 300 },
  { end: [0.0, 1.5, 1.9], rot: [0.14, 0.0, 0.0], hue: 240 },
];

function TemplateCard({ data, index, progressRef }) {
  const ref = useRef();
  const tex = useMemo(() => makeSiteTexture(data.hue), [data.hue]);
  const delay = (index / CARD_LAYOUT.length) * 0.45;
  const start = [0, 0.95, 0.05];

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const p = progressRef.current ?? 0;
    const local = easeOut(clamp01((p - delay) / (1 - delay)));
    const t = state.clock.elapsedTime;

    m.position.x = lerp(start[0], data.end[0], local);
    m.position.y = lerp(start[1], data.end[1], local) + Math.sin(t * 0.8 + index) * 0.06 * local;
    m.position.z = lerp(start[2], data.end[2], local);

    m.rotation.x = lerp(0, data.rot[0], local) + Math.sin(t * 0.5 + index) * 0.03 * local;
    m.rotation.y = lerp(0, data.rot[1], local);
    m.rotation.z = lerp(0, data.rot[2], local) + Math.cos(t * 0.4 + index) * 0.02 * local;

    const s = lerp(0.04, 1, local);
    m.scale.set(s, s, s);
    m.material.opacity = clamp01(local * 1.6);
  });

  return (
    <mesh ref={ref} position={start}>
      <planeGeometry args={[1.5, 1.03]} />
      <meshBasicMaterial map={tex} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Laptop({ progressRef }) {
  const rig = useRef();
  const hinge = useRef();
  const screenTex = useMemo(() => makeSiteTexture(258), []);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const reduce = state.gl.domElement.dataset.reduce === "1";

    // lid opens through the first third of the scroll
    const open = easeInOut(clamp01(p / 0.34));
    const closed = 1.52;   // folded flat over keyboard
    const upright = -0.18; // open, leaning back slightly
    if (hinge.current) hinge.current.rotation.x = lerp(closed, upright, open);

    // gentle pointer parallax + idle sway on the whole rig
    if (rig.current) {
      const px = reduce ? 0 : state.pointer.x;
      const py = reduce ? 0 : state.pointer.y;
      const t = state.clock.elapsedTime;
      const targetY = px * 0.4 + Math.sin(t * 0.25) * 0.06;
      const targetX = -0.12 + py * -0.18;
      rig.current.rotation.y += (targetY - rig.current.rotation.y) * 0.05;
      rig.current.rotation.x += (targetX - rig.current.rotation.x) * 0.05;
      // float the whole assembly down a touch as it explodes so cards have room
      rig.current.position.y += ((-0.4 - p * 0.6) - rig.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={rig} position={[0, -0.4, 0]}>
      {/* base / keyboard deck */}
      <RoundedBox args={[3.4, 0.16, 2.3]} radius={0.07} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#c9ccd6" metalness={0.85} roughness={0.32} />
      </RoundedBox>
      {/* keyboard inset */}
      <mesh position={[0, 0.085, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.9, 1.5]} />
        <meshStandardMaterial color="#1b1c22" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* trackpad */}
      <mesh position={[0, 0.086, 0.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 0.62]} />
        <meshStandardMaterial color="#2a2b33" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* hinged lid */}
      <group ref={hinge} position={[0, 0.08, -1.15]} rotation={[1.52, 0, 0]}>
        <group position={[0, 1.05, 0]}>
          <RoundedBox args={[3.4, 2.1, 0.12]} radius={0.07} smoothness={4}>
            <meshStandardMaterial color="#c9ccd6" metalness={0.85} roughness={0.32} />
          </RoundedBox>
          {/* glowing screen */}
          <mesh position={[0, 0, 0.067]}>
            <planeGeometry args={[3.1, 1.85]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Scene({ progressRef }) {
  const { camera, size } = useThree();
  const groupRef = useRef();

  // Fit the whole explosion to the viewport: pull the camera back and scale
  // the scene down on narrow/portrait screens so no cards fly off-frame.
  useEffect(() => {
    const w = size.width;
    let z = 8, s = 1;
    if (w < 600) { z = 11; s = 0.5; }
    else if (w < 1024) { z = 9; s = 0.78; }
    camera.position.set(0, 0.6, z);
    camera.updateProjectionMatrix();
    if (groupRef.current) groupRef.current.scale.setScalar(s);
  }, [size.width, camera]);

  return (
    <>
      <ambientLight intensity={0.9} color="#cfe0ff" />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.7} color="#7c5cff" />
      <pointLight position={[0, 1.5, 3]} intensity={1.2} color="#22d3ee" />
      <group ref={groupRef}>
        <Laptop progressRef={progressRef} />
        {CARD_LAYOUT.map((data, i) => (
          <TemplateCard key={i} data={data} index={i} progressRef={progressRef} />
        ))}
      </group>
    </>
  );
}

/**
 * The exploding-laptop hero.
 * `progressRef` is a React ref holding a 0..1 scroll value, updated by the
 * parent without re-rendering. useFrame reads it each frame.
 */
export default function LaptopScene({ progressRef }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 8], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.domElement.dataset.reduce = reduce ? "1" : "0";
      }}
    >
      <Suspense fallback={null}>
        <Scene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
