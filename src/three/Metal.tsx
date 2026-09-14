import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "../lib/supabase";

/* One raymarched liquid-metal surface for the whole page.
   The idea: a mirror has no image of its own, so what it reflects IS the
   content. Scroll brings the work into the room and the chrome picks it up. */

const frag = /* glsl */ `
precision highp float;
uniform vec2      uRes;
uniform float     uTime;
uniform vec2      uMouse;
uniform float     uPush;
uniform float     uForm;      // 0 drop, 1 spread
uniform float     uWorkMix;   // subtle: the work tints the room, it is not legible in it
uniform sampler2D uWork;      // horizontal atlas of covers
uniform float     uHasWork;
uniform float     uQuality;   // 1 full, <1 drops the soft-reflection term
uniform float     uVel;       // pointer speed, drives how hard it is struck
uniform vec3      uHit;       // where it was last struck
uniform float     uHitAge;    // seconds since, so the ripple can decay

#define STEPS 48
#define SURF 0.0016
#define FAR 13.0

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }

/* Was a 3-octave value-noise fbm: 24 sin calls per march step, which is what
   made this unplayable on a real GPU. A product of three sine fields costs 3
   and reads as flow rather than static grain, which suits liquid better. */
float turb(vec3 p){
  return sin(p.x*1.7 + p.y*1.1) * sin(p.y*1.9 - p.z*1.3) * sin(p.z*1.5 + p.x*0.9);
}
float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }

vec3 mouseWorld(){ return vec3(uMouse.x*2.0+0.45, uMouse.y*1.25, 0.85); }

float map(vec3 p){
  /* Drift. A shape anchored to one spot reads as wallpaper however much its
     reflections move, which is what made this feel like a background. */
  vec3 drift = vec3(sin(uTime*0.23)*0.42, cos(uTime*0.31)*0.26, sin(uTime*0.17)*0.20);
  vec3 q = p - drift;
  q.xz *= rot(uTime*0.19);
  q.xy *= rot(sin(uTime*0.13)*0.28);

  // the body flattens and widens as the page advances: a drop becoming a pool
  float squash = mix(1.0, 2.35, uForm);
  float thin   = mix(1.0, 0.42, uForm);
  vec3 s = vec3(q.x/squash, q.y/thin, q.z/squash);
  float d = (length(s) - 0.94) * min(min(squash, thin), 1.0);

  float w = 0.0;
  w += sin(q.x*2.0 + uTime*1.70) * 0.165;
  w += sin(q.y*2.4 - uTime*1.35) * 0.145;
  w += sin(q.z*2.2 + uTime*2.05) * 0.135;
  w += turb(q*1.35 + vec3(0.0, uTime*0.62, 0.0)) * 0.085;
  w += sin(uTime * 0.62) * 0.085;          // breath
  d += w * mix(1.0, 0.65, uForm);

  vec3 o1 = vec3(sin(uTime*0.95)*1.18, cos(uTime*0.79)*0.86, sin(uTime*0.63)*0.60);
  vec3 o2 = vec3(cos(uTime*0.57)*-1.10, sin(uTime*1.05)*0.92, cos(uTime*0.88)*0.55);
  d = smin(d, length(q-o1) - 0.42*(1.0-uForm*0.5), 0.26);
  d = smin(d, length(q-o2) - 0.36*(1.0-uForm*0.5), 0.24);

  // the cursor pulls the metal toward it, harder the faster it moves
  vec3 m = mouseWorld();
  float grab = exp(-dot(p-m, p-m) * 0.85);
  d -= uPush * (0.46 + uVel * 1.25) * grab;

  // and a ring travels out from wherever it was last struck, then decays
  float rr = length(p - uHit);
  d += sin(rr * 8.5 - uHitAge * 9.0) * exp(-rr * 1.35) * exp(-uHitAge * 2.4) * 0.13;

  return d;
}

/* Tetrahedral normal: 4 samples instead of the usual 6. */
vec3 normalAt(vec3 p){
  const float h = 0.0024;
  vec2 k = vec2(1.0, -1.0);
  return normalize(k.xyy*map(p + k.xyy*h) + k.yyx*map(p + k.yyx*h)
                 + k.yxy*map(p + k.yxy*h) + k.xxx*map(p + k.xxx*h));
}

/* The room. Studio first; the work is hung around the horizon and fades in. */
vec3 env(vec3 d){
  float y = d.y;
  vec3 c = mix(vec3(0.006,0.007,0.009), vec3(0.13,0.14,0.16), smoothstep(-0.06, 0.16, y));
  c = mix(c, vec3(0.50,0.53,0.58), smoothstep(0.30, 0.95, y));
  c += vec3(1.0)            * pow(max(dot(d, normalize(vec3(-0.32,0.88,0.35))),0.0), 24.0) * 3.4;
  c += vec3(0.82,0.88,1.00) * pow(max(dot(d, normalize(vec3( 0.78,0.30,-0.54))),0.0), 13.0) * 1.25;
  c += vec3(0.46,0.56,0.66) * pow(max(dot(d, normalize(vec3( 0.05,-0.72,0.69))),0.0), 7.0)  * 0.40;
  float ang = atan(d.z, d.x);
  c += vec3(0.30,0.34,0.40) * smoothstep(0.90,1.0, abs(sin(ang*3.0))) * smoothstep(-0.05,0.45,y) * 0.55;
  c += vec3(0.55,0.58,0.62) * smoothstep(0.085, 0.0, abs(y)) * 0.38;

  // the work, as a lit band the metal can pick up
  if (uHasWork > 0.5 && uWorkMix > 0.001){
    float u = fract(ang / 6.2831853 + 0.5 + uTime * 0.004);
    float v = clamp(y * 2.4 + 0.5, 0.0, 1.0);
    float band = smoothstep(0.42, 0.0, abs(y - 0.03));
    vec3 w = texture2D(uWork, vec2(u, v)).rgb;
    // blur across the strip so it reads as coloured light, never as an image
    w += texture2D(uWork, vec2(fract(u + 0.02), v)).rgb;
    w += texture2D(uWork, vec2(fract(u - 0.02), v)).rgb;
    w /= 3.0;
    c += w * band * uWorkMix * 0.55;
  }
  return c;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, 4.6);
  vec3 rd = normalize(vec3(uv.x - mix(0.40, 0.02, uForm), uv.y + 0.01, -1.75));

  /* The body always fits inside this sphere, so intersect it analytically and
     start marching at the entry point. Most pixels miss entirely and cost
     almost nothing; the rest skip the whole empty approach. */
  const float BR = 3.05;
  float b = dot(ro, rd);
  float disc = b*b - (dot(ro, ro) - BR*BR);

  float t = 0.0; bool hit = false;
  if (disc > 0.0){
    float sq = sqrt(disc);
    float tEnter = max(-b - sq, 0.0);
    float tExit  = min(-b + sq, FAR);
    t = tEnter;
    for (int i = 0; i < STEPS; i++){
      if (t > tExit) break;
      float d = map(ro + rd*t);
      if (d < SURF){ hit = true; break; }
      t += d * 0.92;
    }
  }

  vec3 col = mix(vec3(0.014,0.016,0.019), vec3(0.005,0.006,0.008), smoothstep(-0.5,0.8,uv.y));
  col += vec3(0.024,0.032,0.040) * smoothstep(0.85,0.0, length(uv - vec2(mix(0.40,0.02,uForm), 0.0)));

  if (hit){
    vec3 p = ro + rd*t;
    vec3 n = normalAt(p);
    vec3 r = reflect(rd, n);
    float fres = 0.06 + 0.94 * pow(1.0 - max(dot(n,-rd),0.0), 4.0);
    vec3 e0 = env(r);
    col  = e0 * vec3(0.94,0.96,1.0) * (0.55 + 0.45*fres);
    // body term reuses the same sample, biased, instead of marching env twice
    col += mix(e0, env(normalize(r + n*0.45)), 0.65 * uQuality) * 0.16;
    vec3 L = normalize(vec3(-0.32,0.88,0.35));
    col += vec3(1.0) * pow(max(dot(normalize(reflect(-L,n)),-rd),0.0), 220.0) * 1.6;
    col += vec3(0.65,0.75,0.88) * pow(fres,2.0) * 0.10;
  }

  col += (hash(vec3(gl_FragCoord.xy, uTime)) - 0.5) * 0.016;
  col *= 1.0 - 0.52*pow(length(uv*vec2(0.70,1.0)), 2.2);
  col = col/(col+0.9);
  col = pow(max(col,0.0), vec3(0.4545));
  gl_FragColor = vec4(col,1.0);
}
`;
const vert = /* glsl */ `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/** Stitches the covers into one strip so the shader can sample them as a room. */
function useWorkAtlas(projects: Project[]) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const urls = projects.map((p) => p.cover_url).filter(Boolean) as string[];
    if (!urls.length) return;
    let dead = false;
    const CELL_W = 512, CELL_H = 320;
    const cvs = document.createElement("canvas");
    cvs.width = CELL_W * urls.length; cvs.height = CELL_H;
    const ctx = cvs.getContext("2d")!;
    Promise.all(urls.map((u) => new Promise<HTMLImageElement | null>((res) => {
      const im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => res(im); im.onerror = () => res(null); im.src = u;
    }))).then((imgs) => {
      if (dead) return;
      imgs.forEach((im, i) => {
        if (!im) return;
        // cover-fit each cell
        const s = Math.max(CELL_W / im.width, CELL_H / im.height);
        const w = im.width * s, h = im.height * s;
        ctx.drawImage(im, i * CELL_W + (CELL_W - w) / 2, (CELL_H - h) / 2, w, h);
      });
      const t = new THREE.CanvasTexture(cvs);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
      setTex(t);
    });
    return () => { dead = true; };
  }, [projects]);
  return tex;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function Surface({ progress, projects, onReady, quality }: {
  progress: React.RefObject<number>; projects: Project[]; onReady?: () => void; quality: number;
}) {
  const { size, viewport, pointer, gl } = useThree();
  const push = useRef(0);

  /* A dropped WebGL context is the other way this scene can look broken until
     a refresh, and by default a lost context is never restored: the browser
     only attempts it if the lost event is cancelled. Without this the canvas
     simply stays dead. */
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => { e.preventDefault(); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl]);
  const atlas = useWorkAtlas(projects);

  const uniforms = useMemo(() => ({
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPush: { value: 0 },
    uForm: { value: 0 },
    uWorkMix: { value: 0 },
    uWork: { value: null as THREE.Texture | null },
    uHasWork: { value: 0 },
    uQuality: { value: 1 },
    uVel: { value: 0 },
    uHit: { value: new THREE.Vector3(0, 0, 0.85) },
    uHitAge: { value: 9 },
  }), []);

  useEffect(() => {
    const u = matRef.current?.uniforms;
    if (atlas && u) { u.uWork.value = atlas; u.uHasWork.value = 1; }
  }, [atlas]);

  /* Ready means DRAWN, not mounted. Firing on mount let the loader leave
     before the shader had compiled or a single pixel existed, so the surface
     appeared as a pop after the handover instead of during it. The second
     frame is the first one we know reached the screen. */
  const frames = useRef(0);
  const readyFired = useRef(false);

  /* Reduced motion should REDUCE motion, not freeze the centrepiece. Stopping
     time entirely made the surface look broken rather than considerate, and it
     was evaluated once at mount so a later change never took effect. */
  const [timeScale, setTimeScale] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setTimeScale(mq.matches ? 0.3 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const prev = useRef(new THREE.Vector2());
  const vel = useRef(0);

  useFrame((_, raw) => {
    // R3F CLONES the `uniforms` prop, so `uniforms` here is NOT what the GPU
    // reads. Everything must be written through the material ref.
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uQuality.value = quality;

    /* NEVER trust the frame delta.
       Toggling `frameloop` emits one frame whose delta is the clock's whole
       accumulated time: measured at 5053 SECONDS on a page that had been open
       for five. Unclamped it threw uTime from 3.55 to 5058 in a single frame,
       teleporting the surface to an unrelated state and snapping every
       smoothing lerp at once, which is what read as "broken". The same bogus
       frame is an FPS reading of 0.0002, which also tripped the performance
       monitor into its degraded mode.
       A backgrounded tab produces the same shape of spike, so this is the
       right guard regardless of the frameloop. */
    const dt = Math.min(raw, 1 / 30);

    // pointer speed in NDC per second, smoothed. Drives how hard the surface
    // is pulled and whether a new ripple is started.
    const dx = pointer.x - prev.current.x, dy = pointer.y - prev.current.y;
    const speed = Math.min(Math.hypot(dx, dy) / Math.max(dt, 1e-3), 6) / 6;
    prev.current.copy(pointer);
    vel.current += (speed - vel.current) * (1 - Math.pow(0.02, dt));
    u.uVel.value = vel.current;

    u.uHitAge.value += dt;
    // a decisive movement strikes the surface at that point
    if (speed > 0.16 && u.uHitAge.value > 0.28) {
      (u.uHit.value as THREE.Vector3).set(pointer.x * 2.0 + 0.45, pointer.y * 1.25, 0.85);
      u.uHitAge.value = 0;
    }
    /* Wrapped so a tab left open for hours cannot drift uTime into a
       magnitude where float32 can no longer resolve a frame's worth of phase.
       The shader's coefficients share no common period, so any wrap has a
       seam; 10000s puts it roughly once every three hours. */
    u.uTime.value = ((u.uTime.value as number) + dt * timeScale) % 10000;
    (u.uRes.value as THREE.Vector2).set(size.width * viewport.dpr, size.height * viewport.dpr);
    (u.uMouse.value as THREE.Vector2).lerp(pointer, 1 - Math.pow(0.0015, dt));
    const near = pointer.length() > 0.001 ? 1 : 0;
    push.current += (near - push.current) * (1 - Math.pow(0.05, dt));
    u.uPush.value = push.current;

    /* `progress` is now local to the scene stage, not the whole document, so
       the choreography always fills exactly the part of the page you can see
       the surface in however long the index below it grows.

       A drop that spreads into a pool and STAYS spread: the index rises over
       the pool to end the act, so gathering the surface back up would be a
       move nobody is there to watch. */
    const p = progress.current ?? 0;
    const form = smoothstep(0.22, 0.72, p);
    const mix  = smoothstep(0.40, 0.82, p);
    u.uForm.value += (form - u.uForm.value) * (1 - Math.pow(0.02, dt));
    u.uWorkMix.value += (mix - u.uWorkMix.value) * (1 - Math.pow(0.05, dt));

    frames.current += 1;
    if (frames.current >= 2 && !readyFired.current) { readyFired.current = true; onReady?.(); }
  });

  const matRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <ScreenQuad>
      <shaderMaterial ref={matRef} fragmentShader={frag} vertexShader={vert} uniforms={uniforms} depthTest={false} />
    </ScreenQuad>
  );
}

export default function Metal({ progress, projects, onReady, active = true }: {
  progress: React.RefObject<number>; projects: Project[]; onReady?: () => void; active?: boolean;
}) {
  /* Raymarching cost is per pixel, so resolution is the biggest single lever.
     A polished chrome surface has almost no high-frequency detail, so rendering
     below device resolution and letting the browser upscale is nearly free
     visually. Start at 1 (never the 2x of a retina panel) and fall to 0.65 if
     the GPU cannot keep up. */
  const [dpr, setDpr] = useState(1);
  const [quality, setQuality] = useState(1);

  /* The performance monitor must not see the frame either side of a frameloop
     toggle: that frame reports a delta of thousands of seconds, i.e. an FPS of
     effectively zero, and one of them is enough to drop the scene into its
     degraded mode (dpr 0.65, soft reflections off) and leave it there. So it
     is unmounted whenever the scene is paused and stays out for a beat after
     it resumes, sampling only settled frames. */
  const [sampling, setSampling] = useState(false);
  useEffect(() => {
    if (!active) { setSampling(false); return; }
    const t = setTimeout(() => setSampling(true), 900);
    return () => clearTimeout(t);
  }, [active]);

  return (
    // data-scene is readable from the outside so "is the frameloop actually
    // stopped?" is a measurement rather than an assumption
    <div className="fixed inset-0 z-0" data-scene={active ? "running" : "stopped"}>
      {/* Once the scene stage has left the viewport the frameloop stops dead.
          Raymarching is the most expensive thing on the page and the index
          below it is plain DOM, so scrolling the work costs no GPU at all. */}
      <Canvas
        dpr={dpr}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance", depth: false, stencil: false }}
      >
        {/* flipflops caps how many times it may change its mind. Without it a
            GPU sitting near the bound oscillates between the two looks, which
            is visible and worse than simply settling for the lower one. */}
        {sampling && (
          <PerformanceMonitor
            bounds={() => [45, 60]}
            flipflops={3}
            onDecline={() => { setDpr(0.65); setQuality(0); }}
            onIncline={() => { setDpr(1); setQuality(1); }}
            onFallback={() => { setDpr(0.65); setQuality(0); }}
          />
        )}
        <Surface progress={progress} projects={projects} onReady={onReady} quality={quality} />
      </Canvas>
    </div>
  );
}
