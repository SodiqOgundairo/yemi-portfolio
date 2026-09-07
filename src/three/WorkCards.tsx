import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ShardState } from "./Shards";

/** The featured layer. Six real products, captured from the live sites.
 *  Unlit on purpose: a bright UI screenshot is self-luminous against a dark
 *  scene, so the grid reads without adding light that would undo the dark pass.
 *  The colour in the frame is the colour of the work, which is the only
 *  colour a portfolio has any business showing. */
export const WORK = [
  { id: "flock",     src: "/work/flock.jpg",     label: "Flock ChMS" },
  { id: "devign",    src: "/work/devign.jpg",    label: "Devign" },
  { id: "outout",    src: "/work/outout.jpg",    label: "OutOut" },
  { id: "lightlife", src: "/work/lightlife.jpg", label: "LightLife Church" },
  { id: "gr8qm",     src: "/work/gr8qm.jpg",     label: "Gr8QM Platform" },
  { id: "academy",   src: "/work/academy.jpg",   label: "AIENAI Academy" },
] as const;

const AR = 1280 / 800;           // capture aspect, cards must match or they stretch
const CARD_H = 1.12;
const CARD_W = CARD_H * AR;

const rnd = (i: number, salt = 0) => {
  const x = Math.sin(i * 91.7 + salt * 217.3) * 43758.5453;
  return x - Math.floor(x);
};

type T = { pos: THREE.Vector3; rot: THREE.Euler };

/** Scattered: part of the debris, tumbling with everything else. */
const coreT = (i: number): T => {
  const a = (i / WORK.length) * Math.PI * 2 + 0.6;
  const r = 3.1 + rnd(i, 1) * 1.5;
  return {
    pos: new THREE.Vector3(Math.cos(a) * r, (rnd(i, 2) - 0.5) * 3.2, Math.sin(a) * r * 0.8),
    rot: new THREE.Euler((rnd(i, 3) - 0.5) * 2.4, (rnd(i, 4) - 0.5) * 2.4, (rnd(i, 5) - 0.5) * 1.2),
  };
};

/** Resolved: a 3x2 board sitting in front of the blank substrate. */
const gridT = (i: number): T => {
  const COLS = 3, GX = CARD_W + 0.2, GY = CARD_H + 0.2;
  const c = i % COLS, r = Math.floor(i / COLS);
  return {
    pos: new THREE.Vector3(1.9 + (c - (COLS - 1) / 2) * GX, (0.5 - r) * GY, 1.5),
    rot: new THREE.Euler(-0.06, 0.14, 0),
  };
};

export function WorkCards({ state }: { state: ShardState }) {
  const maps = useTexture(WORK.map((w) => w.src));
  useMemo(() => {
    (Array.isArray(maps) ? maps : [maps]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
  }, [maps]);

  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const live = useMemo(
    () => WORK.map((_, i) => { const t = coreT(i); return { pos: t.pos.clone(), rot: t.rot.clone(), s: 0 }; }),
    [],
  );
  const q = useMemo(() => ({ a: new THREE.Quaternion(), b: new THREE.Quaternion(), e: new THREE.Euler() }), []);

  useFrame((s, dt) => {
    const grid = state === "grid";
    const t = s.clock.elapsedTime;
    for (let i = 0; i < WORK.length; i++) {
      const m = refs.current[i]; if (!m) return;
      const tgt = grid ? gridT(i) : coreT(i);
      const cur = live[i];
      const speed = 1.5 + rnd(i, 6) * 1.6;
      const k = 1 - Math.pow(0.0001, dt * speed);

      cur.pos.lerp(tgt.pos, k);
      q.a.setFromEuler(cur.rot); q.b.setFromEuler(tgt.rot);
      q.a.slerp(q.b, k); q.e.setFromQuaternion(q.a); cur.rot.copy(q.e);
      // scale in only once resolved, so scattered cards stay abstract slabs
      cur.s = THREE.MathUtils.lerp(cur.s, grid ? 1 : 0.34, k);

      m.position.copy(cur.pos);
      if (!grid) m.position.y += Math.sin(t * 0.45 + i * 1.7) * 0.08;
      m.rotation.copy(cur.rot);
      m.scale.setScalar(cur.s);
    }
  });

  const list = Array.isArray(maps) ? maps : [maps];
  return (
    <group>
      {WORK.map((w, i) => (
        <mesh key={w.id} ref={(el) => { refs.current[i] = el; }} scale={0}>
          <planeGeometry args={[CARD_W, CARD_H]} />
          <meshBasicMaterial map={list[i]} toneMapped side={THREE.FrontSide} />
        </mesh>
      ))}
    </group>
  );
}
