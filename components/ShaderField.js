import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Fullscreen fragment shader: black field with drifting neon-pink aurora
   ribbons, a faint perspective grid and a soft vignette. The pointer pulls
   the ribbons; scroll advances the flow. */
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = (uv - 0.5) * asp;

    float t = uTime * 0.06 + uScroll * 0.4;

    // aurora ribbons
    vec2 q = p * 1.4 + vec2(t * 0.5, -t * 0.25);
    q += (uMouse - 0.5) * 0.35;
    float n = fbm(q + fbm(q + t * 0.15));
    float ribbon = smoothstep(0.42, 0.72, n) * smoothstep(0.98, 0.6, n);

    // second, softer layer
    float n2 = fbm(p * 0.8 - vec2(t * 0.3, t * 0.1));
    float haze = smoothstep(0.35, 0.85, n2) * 0.5;

    vec3 pink = vec3(1.0, 0.12, 0.56);
    vec3 pinkSoft = vec3(1.0, 0.43, 0.72);
    vec3 col = vec3(0.012);
    col += pink * ribbon * 0.55;
    col += pinkSoft * haze * 0.16;

    // perspective grid floor, fading upward
    vec2 g = vec2(p.x / (uv.y * 0.9 + 0.24), 1.0 / (uv.y * 0.9 + 0.24));
    g.y += uScroll * 2.0 + uTime * 0.05;
    vec2 grid = abs(fract(g * 3.0) - 0.5);
    float gl = smoothstep(0.48, 0.5, max(grid.x, grid.y));
    col += pink * gl * (1.0 - uv.y) * 0.05;

    // vignette
    float vig = 1.0 - dot(p * 0.75, p * 0.75);
    col *= clamp(vig, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function ShaderPlane({ scrollRef }) {
  const mat = useRef();
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const u = mat.current.uniforms;
    const reduce = state.gl.domElement.dataset.reduce === "1";
    if (!reduce) u.uTime.value = state.clock.elapsedTime;
    u.uRes.value.set(size.width, size.height);
    u.uMouse.value.x += (state.pointer.x * 0.5 + 0.5 - u.uMouse.value.x) * 0.04;
    u.uMouse.value.y += (state.pointer.y * 0.5 + 0.5 - u.uMouse.value.y) * 0.04;
    u.uScroll.value = scrollRef?.current ?? 0;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} />
    </mesh>
  );
}

/**
 * Neon aurora background. `scrollRef` (optional) holds 0..1 page-scroll
 * progress that flows into the shader. Client-only — import with
 * next/dynamic ssr:false.
 */
export default function ShaderField({ scrollRef }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.domElement.dataset.reduce = reduce ? "1" : "0";
      }}
    >
      <ShaderPlane scrollRef={scrollRef} />
    </Canvas>
  );
}
