"use client";

import { useMemo } from "react";
import { PALETTE, mat } from "../materials";
import { createSeededRandom } from "./seeded-random";

/**
 * Đảo nổi: mặt cỏ PHẲNG ở đúng y=0 (nhân vật đặt y=0 là đứng trên cỏ), lớp đất và chóp đá phía dưới.
 */
export function FloatingIsland({ radius = 6, depth = 4, grass = PALETTE.grass }: { radius?: number; depth?: number; grass?: string }) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]} material={mat(grass, { rough: 0.9 })} receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.97, 0.4, 64]} />
      </mesh>
      <mesh position={[0, -0.75, 0]} material={mat(PALETTE.dirt, { rough: 1 })}>
        <cylinderGeometry args={[radius * 0.97, radius * 0.86, 0.7, 64]} />
      </mesh>
      <mesh position={[0, -1.1 - depth / 2, 0]} rotation={[Math.PI, 0, 0]} material={mat(PALETTE.rock, { rough: 1 })}>
        <coneGeometry args={[radius * 0.86, depth, 48]} />
      </mesh>
      {/* vài tảng đá treo lơ lửng dưới đảo cho sinh động */}
      <mesh position={[radius * 0.55, -1.6 - depth * 0.55, radius * 0.2]} material={mat(PALETTE.rockDark, { rough: 1 })}>
        <dodecahedronGeometry args={[0.45, 1]} />
      </mesh>
    </group>
  );
}

export function RoundTree({ position = [0, 0, 0] as [number, number, number], scale = 1, tone = 0 }) {
  const leaves = [PALETTE.leaf, PALETTE.leafLight, PALETTE.leafDark][tone % 3];
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} material={mat(PALETTE.trunk)}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 16]} />
      </mesh>
      <mesh position={[0, 1.55, 0]} material={mat(leaves, { rough: 0.85 })}>
        <sphereGeometry args={[0.72, 24, 18]} />
      </mesh>
      <mesh position={[0.45, 1.3, 0.15]} material={mat(leaves, { rough: 0.85 })}>
        <sphereGeometry args={[0.45, 20, 14]} />
      </mesh>
      <mesh position={[-0.4, 1.35, -0.1]} material={mat(leaves, { rough: 0.85 })}>
        <sphereGeometry args={[0.5, 20, 14]} />
      </mesh>
    </group>
  );
}

export function PineTree({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} material={mat(PALETTE.trunk)}>
        <cylinderGeometry args={[0.1, 0.14, 0.6, 12]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.85 + i * 0.5, 0]} material={mat(i === 1 ? PALETTE.leaf : PALETTE.leafDark, { rough: 0.85 })}>
          <coneGeometry args={[0.75 - i * 0.18, 0.9, 24]} />
        </mesh>
      ))}
    </group>
  );
}

export function Rock({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  return (
    <mesh position={[position[0], position[1] + 0.12 * scale, position[2]]} scale={[scale * 1.3, scale * 0.8, scale]} material={mat(PALETTE.rock, { rough: 1 })}>
      <dodecahedronGeometry args={[0.25, 1]} />
    </mesh>
  );
}

/** Rải hoa nhỏ trong một vòng tròn (seed cố định) */
export function Flowers({ count = 14, radius = 5, inner = 0, seed = 7 }: { count?: number; radius?: number; inner?: number; seed?: number }) {
  const items = useMemo(() => {
    const r = createSeededRandom(seed);
    const colors = [PALETTE.flowerA, PALETTE.flowerB, PALETTE.flowerC];
    return Array.from({ length: count }, () => {
      const a = r() * Math.PI * 2;
      const d = inner + r() * (radius - inner);
      return { x: Math.cos(a) * d, z: Math.sin(a) * d, c: colors[Math.floor(r() * 3)] };
    });
  }, [count, radius, inner, seed]);
  return (
    <group>
      {items.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]}>
          <mesh position={[0, 0.08, 0]} material={mat(PALETTE.grassDark)}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
          </mesh>
          <mesh position={[0, 0.17, 0]} material={mat(f.c, { rough: 0.6 })}>
            <sphereGeometry args={[0.055, 12, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Hàng rào gỗ thẳng từ điểm a tới b */
export function Fence({ from, to, posts = 6 }: { from: [number, number]; to: [number, number]; posts?: number }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  const ang = Math.atan2(dx, dz);
  return (
    <group position={[from[0], 0, from[1]]} rotation={[0, ang, 0]}>
      {Array.from({ length: posts }, (_, i) => (
        <mesh key={i} position={[0, 0.3, (i / (posts - 1)) * len]} material={mat(PALETTE.wood)}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
        </mesh>
      ))}
      {[0.22, 0.45].map((y) => (
        <mesh key={y} position={[0, y, len / 2]} material={mat(PALETTE.woodDark)}>
          <boxGeometry args={[0.05, 0.07, len]} />
        </mesh>
      ))}
    </group>
  );
}
