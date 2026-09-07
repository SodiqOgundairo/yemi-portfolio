import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const COUNT = 54;

export type ShardState = "core" | "grid";

type Target = { pos: THREE.Vector3; rot: THREE.Euler; scale: THREE.Vector3 };

/** Deterministic pseudo-random so states are stable across reloads. */
const rnd = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** CORE: an orbital shell. Random rotation and varied scale read as fragments. */
function coreTargets(): Target[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const a = (i / COUNT) * Math.PI * 8.6;
    const r = 2.2 + (i % 9) * 0.78;
    return {
      pos: new THREE.Vector3(Math.cos(a) * r, (rnd(i, 1) - 0.5) * r * 1.15, Math.sin(a) * r * 0.9),
      rot: new THREE.Euler(rnd(i, 2) * 3, rnd(i, 3) * 3, rnd(i, 4) * 3),
      scale: (() => { const s = 0.22 + Math.pow(rnd(i, 5), 2.2) * 1.5; return new THREE.Vector3(s, s, s); })(),
    };
  });
}

/** GRID: the same slabs laid flat and aligned. Rotation goes to zero, scale
 *  becomes uniform, and they resolve into a layout: columns, rows, two depth
 *  layers. Fragments become a component tree without changing material. */
function gridTargets(): Target[] {
  const COLS = 10, ROWS = 6, GX = 0.74, GY = 0.58;
  return Array.from({ length: COUNT }, (_, i) => {
    const c = i % COLS, r = Math.floor(i / COLS) % ROWS;
    const layer = rnd(i, 7) > 0.78 ? 1 : 0;           // a few lift forward
    return {
      pos: new THREE.Vector3(
        1.9 + (c - (COLS - 1) / 2) * GX,
        ((ROWS - 1) / 2 - r) * GY,
        -0.9 + layer * 0.5,
      ),
      rot: new THREE.Euler(-0.10, 0.20, 0),
      scale: new THREE.Vector3(0.58, 0.38, 0.04),      // substrate cells
    };
  });
}

const STATES: Record<ShardState, Target[]> = { core: coreTargets(), grid: gridTargets() };

export function Shards({ state }: { state: ShardState }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // live transforms, lerped toward the active state's targets
  const live = useMemo(
    () => STATES.core.map((t) => ({ pos: t.pos.clone(), rot: t.rot.clone(), scale: t.scale.clone() })),
    [],
  );
  const q = useMemo(() => ({ a: new THREE.Quaternion(), b: new THREE.Quaternion(), e: new THREE.Euler() }), []);

  useFrame((s, dt) => {
    const targets = STATES[state];
    const t = s.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const tgt = targets[i], cur = live[i];
      // per-instance speed gives a staggered arrival: assembly, not a snap
      const speed = 1.6 + rnd(i, 9) * 2.2;
      const k = 1 - Math.pow(0.0001, dt * speed);

      cur.pos.lerp(tgt.pos, k);
      cur.scale.lerp(tgt.scale, k);
      q.a.setFromEuler(cur.rot); q.b.setFromEuler(tgt.rot);
      q.a.slerp(q.b, k); q.e.setFromQuaternion(q.a); cur.rot.copy(q.e);

      dummy.position.copy(cur.pos);
      // a breath of drift only while scattered, so the grid reads as settled
      if (state === "core") {
        dummy.position.y += Math.sin(t * 0.5 + i) * 0.05;
        dummy.rotation.set(cur.rot.x + t * 0.06, cur.rot.y + t * 0.05, cur.rot.z);
      } else {
        dummy.rotation.copy(cur.rot);
      }
      dummy.scale.copy(cur.scale);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      {/* one primitive, two readings: a slab is a shard when tumbled, a card when aligned */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#5C646E" roughness={0.46} metalness={0.72} />
    </instancedMesh>
  );
}
