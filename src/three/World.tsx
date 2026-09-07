import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Monolith } from "./Monolith";
import { Backdrop, Dust } from "./Backdrop";
import type { ShardState } from "./Shards";

/** Camera waypoints. Scroll dollies between them, so the page reads as one
 *  continuous space rather than a stack of sections. */
const STATIONS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0.2, 0.2, 8.6], look: [1.2, 0, 0] },    // 00 hero: subject right, type breathes left
  { pos: [5.4, 0.9, 5.2], look: [2.2, 0.1, 0] },  // 01 close on the subject
  { pos: [3.1, 0.1, 10.6], look: [2.9, 0.0, 0] }, // 02 grid: square-on, pulled back
  { pos: [-1.2, 3.0, 6.2], look: [2.2, 0, 0] },   // 03 above and across
  { pos: [2.2, 0, 12.0], look: [2.2, 0, 0] },     // 04 pull back, centred
];

function Rig({ progress }: { progress: number }) {
  const { camera, pointer } = useThree();
  const pos = useRef(new THREE.Vector3(...STATIONS[0].pos));
  const look = useRef(new THREE.Vector3(...STATIONS[0].look));
  const tmpP = useRef(new THREE.Vector3());
  const tmpL = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const seg = progress * (STATIONS.length - 1);
    const i = Math.min(Math.floor(seg), STATIONS.length - 2);
    const f = seg - i;
    // smoothstep between waypoints so arrivals settle instead of snapping
    const e = f * f * (3 - 2 * f);

    tmpP.current.set(...STATIONS[i].pos).lerp(new THREE.Vector3(...STATIONS[i + 1].pos), e);
    tmpL.current.set(...STATIONS[i].look).lerp(new THREE.Vector3(...STATIONS[i + 1].look), e);

    // pointer adds a small handheld drift; never enough to fight the type
    tmpP.current.x += pointer.x * 0.5;
    tmpP.current.y += pointer.y * 0.35;

    const k = 1 - Math.pow(0.0015, dt);
    pos.current.lerp(tmpP.current, k);
    look.current.lerp(tmpL.current, k);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });
  return null;
}

/** Which formation the fragments hold, per station. Adding "spectrum" and
 *  "lattice" later is just two more entries. */
const STATION_STATE: ShardState[] = ["core", "core", "grid", "core", "core"];

export default function World({ progress, onReady }: { progress: number; onReady?: () => void }) {
  const idx = Math.min(
    STATION_STATE.length - 1,
    Math.max(0, Math.round(progress * (STATION_STATE.length - 1))),
  );
  const shardState = STATION_STATE[idx];

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: STATIONS[0].pos, fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={() => onReady?.()}
      >
        <fog attach="fog" args={["#080A0D", 22, 62]} />
        <ambientLight intensity={0.16} />
        <directionalLight position={[5, 6, 4]} intensity={0.95} />
        <pointLight position={[-4, -2, 3]} intensity={7} color="#BFD9E6" distance={16} />
        <directionalLight position={[-2, 1.5, 9]} intensity={2.4} color="#DCE7EF" />
        <Suspense fallback={null}>
          <Backdrop />
          <Dust />
          <Monolith progress={progress} state={shardState} />
          <Rig progress={progress} />
          <EffectComposer enableNormalPass={false}>
            <DepthOfField
              focusDistance={shardState === "grid" ? 0.062 : 0.025}
              focalLength={shardState === "grid" ? 0.5 : 0.22}
              bokehScale={shardState === "grid" ? 0.8 : 2.2}
              height={480}
            />
            <Bloom intensity={0.3} luminanceThreshold={0.78} luminanceSmoothing={0.9} mipmapBlur />
            <Noise opacity={0.035} />
            <Vignette offset={0.22} darkness={1.0} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
