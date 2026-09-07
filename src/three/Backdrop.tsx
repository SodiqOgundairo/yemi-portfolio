import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** A lit ground for the frame. Flat black reads as "nothing rendered";
 *  a slow vertical gradient with a warm-cool lift reads as a room. */
export function Backdrop() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            vec3 d = normalize(vPos);
            float h = d.y * 0.5 + 0.5;
            vec3 low  = vec3(0.021, 0.025, 0.032);
            vec3 high = vec3(0.007, 0.009, 0.013);
            vec3 col = mix(low, high, smoothstep(0.0, 0.9, h));
            // a cold pool of light behind the subject so it has something to sit in
            float pool = smoothstep(0.62, 0.0, distance(d, normalize(vec3(0.45, 0.02, 0.6))));
            col += vec3(0.026, 0.036, 0.045) * pool;
            float drift = sin(d.x * 2.4 + uTime * 0.06) * sin(d.y * 2.0 - uTime * 0.04);
            col += drift * 0.003;
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  );
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { mat.uniforms.uTime.value = s.clock.elapsedTime; });
  return (
    <mesh ref={ref} material={mat} scale={70}>
      <sphereGeometry args={[1, 40, 40]} />
    </mesh>
  );
}

/** Far dust. Gives parallax something to bite on so the space has size. */
export function Dust({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 26;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(p) * Math.cos(t);
      a[i * 3 + 1] = r * Math.cos(p) * 0.7;
      a[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
    }
    return a;
  }, [count]);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.006; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#9FB4C2" transparent opacity={0.28} sizeAttenuation depthWrite={false} />
    </points>
  );
}
