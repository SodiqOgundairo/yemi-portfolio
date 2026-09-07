import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Shards, type ShardState } from "./Shards";
import { WorkCards } from "./WorkCards";

/** The object is the subject, not wallpaper.
 *  A faceted glass core: refraction, not colour, carries the image. */
export function Monolith({ progress, state }: { progress: number; state: ShardState }) {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Group>(null);
  const target = useRef({ rx: 0, ry: 0 });


  // NB: the useFrame arg is named `s` because `state` is already the shard-state prop.
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const grid = state === "grid";
    const k = 1 - Math.pow(0.0006, dt);
    target.current.ry += dt * (grid ? 0.03 : 0.16);

    if (core.current) {
      core.current.rotation.y = target.current.ry;
      core.current.rotation.x = Math.sin(t * 0.22) * 0.14;
      core.current.position.y = Math.sin(t * 0.5) * 0.09;
      // the core yields the frame when the fragments resolve into a layout
      const cs = THREE.MathUtils.lerp(core.current.scale.x, grid ? 0.34 : 1, k);
      core.current.scale.setScalar(cs);
    }

    if (shell.current) {
      // grid must settle square-on; scattered state keeps its slow orbit
      shell.current.rotation.y = THREE.MathUtils.lerp(
        shell.current.rotation.y, grid ? 0 : -target.current.ry * 0.42, k,
      );
      shell.current.scale.setScalar(
        THREE.MathUtils.lerp(shell.current.scale.x, grid ? 1 : 1 - Math.min(progress * 2.4, 1) * 0.5, k),
      );
    }
  });

  return (
    <group position={[2.2, 0, 0]}>
      <Environment resolution={256}>
        {/* Hand-placed lights: the whole read of the object comes from these. */}
        <Lightformer intensity={3.2} position={[-4, 2, 3]} scale={[8, 8, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[5, -1, 2]} scale={[6, 6, 1]} color="#BFD9E6" />
        <Lightformer intensity={0.7} position={[0, 5, -4]} scale={[10, 3, 1]} color="#ffffff" />
      </Environment>

      <mesh ref={core}>
        <icosahedronGeometry args={[1.95, 0]} />
        <MeshTransmissionMaterial
          samples={6}
          resolution={512}
          thickness={1.4}
          roughness={0.06}
          anisotropy={0.4}
          chromaticAberration={0.22}
          distortion={0.25}
          distortionScale={0.3}
          temporalDistortion={0.08}
          ior={1.45}
          color="#ffffff"
        />
      </mesh>

      <group ref={shell}>
        <Shards state={state} />
        <WorkCards state={state} />
      </group>
    </group>
  );
}
