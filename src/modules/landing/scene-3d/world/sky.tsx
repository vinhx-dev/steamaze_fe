"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollStore } from "../store/scroll-store";
import { createSeededRandom } from "./seeded-random";
import { mat } from "../materials";

/**
 * Bầu trời: vòm gradient (ban ngày → hoàng hôn ở chặng cuối) + mây bồng trôi chậm.
 */
const DAY = { top: new THREE.Color("#2f86d6"), mid: new THREE.Color("#8fd0f5"), bottom: new THREE.Color("#e8f6fb") };
const DUSK = { top: new THREE.Color("#3b3f8c"), mid: new THREE.Color("#f08a5d"), bottom: new THREE.Color("#ffd29a") };

export function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          top: { value: DAY.top.clone() },
          mid: { value: DAY.mid.clone() },
          bottom: { value: DAY.bottom.clone() },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;
          void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.6, h)) : mix(mid, bottom, smoothstep(0.0, -0.4, h)); gl_FragColor = vec4(c,1.0); }`,
      }),
    [],
  );
  useFrame(() => {
    const s = THREE.MathUtils.smoothstep(scrollStore.progress, 0.86, 1);
    material.uniforms.top.value.copy(DAY.top).lerp(DUSK.top, s);
    material.uniforms.mid.value.copy(DAY.mid).lerp(DUSK.mid, s);
    material.uniforms.bottom.value.copy(DAY.bottom).lerp(DUSK.bottom, s);
  });
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[180, 32, 16]} />
    </mesh>
  );
}

export function Clouds({ count = 14 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(() => {
    const r = createSeededRandom(99);
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 110,
      y: -6 + r() * 26,
      z: -70 + r() * 80,
      s: 1.2 + r() * 2.2,
      speed: 0.2 + r() * 0.4,
      puffs: 3 + Math.floor(r() * 3),
    }));
  }, [count]);
  useFrame((_, dt) => {
    group.current?.children.forEach((c, i) => {
      c.position.x += clouds[i].speed * Math.min(dt, 0.05);
      if (c.position.x > 60) c.position.x = -60;
    });
  });
  const white = mat("#ffffff", { rough: 1, emissive: "#ffffff", emissiveIntensity: 0.25 });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
          {Array.from({ length: c.puffs }, (_, j) => (
            <mesh key={j} position={[(j - c.puffs / 2) * 0.9, Math.sin(j * 1.7) * 0.25, Math.cos(j) * 0.3]} material={white} scale={[1, 0.75, 0.85]}>
              <sphereGeometry args={[0.8 + (j % 2) * 0.25, 20, 14]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
