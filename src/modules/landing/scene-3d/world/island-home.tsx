"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Mouse, type MouseAccessory } from "../characters/mouse";
import { Crown, Glasses, Mask } from "../characters/accessories";
import { PALETTE, mat, enableShadows } from "../materials";
import { ISLANDS } from "../data/stops";
import { useNear } from "../hooks/use-near";
import { scrollStore } from "../store/scroll-store";
import { FloatingIsland, RoundTree, PineTree, Rock, Flowers, Fence } from "./props";
import { Label } from "./label";
import { createSeededRandom } from "./seeded-random";

/**
 * Đảo nhà chú chuột: chào đón (chặng 0), rương tủ đồ (chặng 4), bạn bè đi dạo (chặng 5), pháo hoa (chặng 6).
 */
const HERO = new THREE.Vector3(0, 0, 1.4);
const CHEST = new THREE.Vector3(2.0, 0, 0.8);
const WEARER = new THREE.Vector3(3.2, 0, 1.7);
const WEARER_ROT = 0.52;
const ITEMS: MouseAccessory[] = ["crown", "glasses", "mask"];
const WARD_CYCLE = 6.6;

function House() {
  return (
    <group position={[-4.6, 0, -4.2]} rotation={[0, 0.6, 0]}>
      <mesh position={[0, 0.85, 0]} material={mat("#f3e2c4")}>
        <boxGeometry args={[2.2, 1.7, 1.9]} />
      </mesh>
      <mesh position={[0, 2.25, 0]} rotation={[0, Math.PI / 4, 0]} material={mat("#c0392b", { rough: 0.55 })}>
        <coneGeometry args={[1.85, 1.2, 4]} />
      </mesh>
      <mesh position={[0, 0.55, 0.96]} material={mat(PALETTE.woodDark)}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 32, 1, false, 0, Math.PI]} />
      </mesh>
      <mesh position={[0, 0.3, 0.96]} material={mat(PALETTE.woodDark)}>
        <boxGeometry args={[0.76, 0.6, 0.05]} />
      </mesh>
      <mesh position={[0.68, 1.1, 0.96]} material={mat("#bfe6ff", { rough: 0.2 })}>
        <circleGeometry args={[0.22, 24]} />
      </mesh>
    </group>
  );
}

function Signpost() {
  return (
    <group position={[-1.9, 0, 2.5]} rotation={[0, 0.25, 0]}>
      <mesh position={[0, 1.1, 0]} material={mat(PALETTE.wood)}>
        <cylinderGeometry args={[0.07, 0.09, 2.2, 16]} />
      </mesh>
      {[
        { y: 1.9, text: "← Trò chơi", bg: "#2e9a3c", x: -0.25 },
        { y: 1.45, text: "Thí nghiệm →", bg: "#e3792c", x: 0.25 },
        { y: 1.0, text: "↑ Kiến thức", bg: "#3d7be0", x: -0.1 },
      ].map((b) => (
        <Label key={b.text} text={b.text} position={[b.x, b.y, 0.1]} height={0.34} color="#ffffff" bg={b.bg} border="#3b2214" />
      ))}
    </group>
  );
}

function Chest({ open }: { open: number }) {
  return (
    <group position={CHEST} rotation={[0, 0.6, 0]}>
      <mesh position={[0, 0.3, 0]} material={mat(PALETTE.wood)}>
        <boxGeometry args={[0.9, 0.6, 0.6]} />
      </mesh>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} material={mat(PALETTE.gold, { rough: 0.3, metal: 0.8 })}>
          <boxGeometry args={[0.07, 0.62, 0.62]} />
        </mesh>
      ))}
      {/* Nắp xoay quanh mép sau */}
      <group position={[0, 0.6, -0.3]} rotation={[-open * 1.9, 0, 0]}>
        <mesh position={[0, 0.08, 0.3]} material={mat("#8a5a2e")}>
          <boxGeometry args={[0.94, 0.16, 0.64]} />
        </mesh>
        <mesh position={[0, 0.08, 0.62]} material={mat(PALETTE.gold, { rough: 0.3, metal: 0.8 })}>
          <boxGeometry args={[0.16, 0.12, 0.04]} />
        </mesh>
      </group>
      {/* Ánh sáng vàng toả ra khi mở */}
      <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={open > 0.2}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color="#ffe79a" toneMapped={false} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

/** Đồ bay theo đường cong từ rương lên đầu chuột */
function FlyingItem({ item, k }: { item: MouseAccessory; k: number }) {
  const from = new THREE.Vector3(CHEST.x, 0.8, CHEST.z);
  const to = new THREE.Vector3(WEARER.x, 1.22, WEARER.z);
  const p = from.clone().lerp(to, k);
  p.y += Math.sin(k * Math.PI) * 1.3;
  const offset = item === "crown" ? 0.4 : item === "glasses" ? 0.06 : -0.05;
  return (
    <group position={[p.x, p.y - offset, p.z]} rotation={[0, WEARER_ROT + k * Math.PI * 2, 0]} scale={1 + Math.sin(k * Math.PI) * 0.35}>
      {item === "crown" && <Crown />}
      {item === "glasses" && <Glasses />}
      {item === "mask" && <Mask />}
    </group>
  );
}

function Wardrobe({ near }: { near: boolean }) {
  const t = useRef(0);
  const [phase, setPhase] = useState({ open: 0, worn: 0, flying: -1, k: 0, cheer: false });
  useFrame((_, delta) => {
    if (!near) return;
    t.current += Math.min(delta, 0.05);
    const c = t.current % WARD_CYCLE;
    const open = c < 0.6 ? c / 0.6 : c > 6.0 ? Math.max(0, 1 - (c - 6.0) / 0.5) : 1;
    let worn = 0;
    let flying = -1;
    let k = 0;
    for (let i = 0; i < ITEMS.length; i++) {
      const s = 0.7 + i * 1.25;
      if (c >= s + 0.9) worn = i + 1;
      else if (c >= s) {
        flying = i;
        k = (c - s) / 0.9;
      }
    }
    if (c > 6.0) worn = 0;
    const cheer = worn === 3 && c < 6.0;
    // chỉ setState khi có thay đổi đáng kể để đỡ vẽ lại
    setPhase((p) =>
      Math.abs(p.open - open) > 0.02 || p.worn !== worn || p.flying !== flying || Math.abs(p.k - k) > 0.02 || p.cheer !== cheer
        ? { open, worn, flying, k, cheer }
        : p,
    );
  });
  return (
    <group>
      <Chest open={phase.open} />
      <group position={WEARER} rotation={[0, WEARER_ROT, 0]}>
        <Mouse pose={phase.cheer ? "cheer" : "idle"} accessories={ITEMS.slice(0, phase.worn)} furColor={PALETTE.furWhite} blobShadow={false} />
      </group>
      {phase.flying >= 0 && <FlyingItem item={ITEMS[phase.flying]} k={phase.k} />}
      {phase.cheer && <Label text="✨ Mặc đồ mới!" position={[WEARER.x, 3, WEARER.z]} height={0.42} billboard color="#ffffff" bg="#e2532f" border="#8a2410" />}
    </group>
  );
}

const FRIENDS = [PALETTE.furGrey, PALETTE.furBrown, PALETTE.furCaramel, "#e8b98a"];
function Friends() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    group.current?.children.forEach((c, i) => {
      const a = clock.elapsedTime * 0.28 + (i * Math.PI * 2) / FRIENDS.length;
      c.position.set(Math.cos(a) * 4.6, 0, Math.sin(a) * 4.6);
      c.rotation.y = -a; // hướng đi tiếp tuyến vòng tròn
    });
  });
  return (
    <group ref={group}>
      {FRIENDS.map((f) => (
        <group key={f}>
          <Mouse pose="walk" furColor={f} hat={false} blobShadow={false} />
        </group>
      ))}
    </group>
  );
}

/** Pháo hoa: một khối hạt, nổ lần lượt từng chùm (dữ liệu nằm trong geometry, cập nhật qua ref) */
const FW_COUNT = 360;
const FW_COLORS = ["#ff5d5d", "#ffd23f", "#4fd1ff", "#6bff8f", "#ff7ad9"].map((c) => new THREE.Color(c));
function makeFireworkGeometry() {
  const r = createSeededRandom(42);
  const dirs = new Float32Array(FW_COUNT * 3);
  for (let i = 0; i < FW_COUNT; i++) {
    const u = r() * 2 - 1;
    const th = r() * Math.PI * 2;
    const rr = Math.sqrt(1 - u * u);
    dirs.set([rr * Math.cos(th), u, rr * Math.sin(th)], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FW_COUNT * 3), 3));
  g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(FW_COUNT * 3), 3));
  g.userData.dirs = dirs;
  return g;
}
function Fireworks() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => makeFireworkGeometry(), []);
  useFrame(({ clock }) => {
    const g = points.current?.geometry;
    if (!g) return;
    const dirs = g.userData.dirs as Float32Array;
    const pos = g.attributes.position.array as Float32Array;
    const col = g.attributes.color.array as Float32Array;
    const t = clock.elapsedTime;
    const bursts = 3;
    const per = FW_COUNT / bursts;
    for (let b = 0; b < bursts; b++) {
      const life = ((t + b * 0.9) % 2.7) / 2.7;
      const seed = Math.floor((t + b * 0.9) / 2.7) + b * 7;
      const cx = Math.sin(seed * 12.9) * 6;
      const cy = 7 + Math.cos(seed * 4.1) * 1.5;
      const cz = -4 + Math.sin(seed * 7.7) * 3;
      const c = FW_COLORS[seed % FW_COLORS.length];
      for (let i = b * per; i < (b + 1) * per; i++) {
        const r = life * 3.2;
        pos[i * 3] = cx + dirs[i * 3] * r;
        pos[i * 3 + 1] = cy + dirs[i * 3 + 1] * r - life * life * 2;
        pos[i * 3 + 2] = cz + dirs[i * 3 + 2] * r;
        const fade = 1 - life;
        col[i * 3] = c.r * fade;
        col[i * 3 + 1] = c.g * fade;
        col[i * 3 + 2] = c.b * fade;
      }
    }
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
  });
  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.22} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

export function IslandHome() {
  const root = useRef<THREE.Group>(null);
  const heroNear = useNear([0, 4, 5], 0.2);
  const wardNear = useNear(4, 0.12);
  const friendsNear = useNear([5, 6], 0.1);
  const finale = useNear(6, 0.1);
  const [wave, setWave] = useState(true);

  useLayoutEffect(() => {
    if (root.current) enableShadows(root.current);
  }, [heroNear, wardNear, friendsNear]);

  useFrame(() => {
    const w = scrollStore.progress < 0.09 || scrollStore.progress > 0.95;
    if (w !== wave) setWave(w);
  });

  return (
    <group ref={root} position={ISLANDS.home}>
      <FloatingIsland radius={7.6} depth={5.5} />
      {/* Lối đi đất tới nhà */}
      <mesh position={[-1.6, 0.02, -0.8]} rotation={[-Math.PI / 2, 0, 0.9]} material={mat(PALETTE.path, { rough: 0.95 })} receiveShadow>
        <planeGeometry args={[1.3, 6]} />
      </mesh>
      <House />
      {!wardNear && <Signpost />}
      <RoundTree position={[4.6, 0, -3.8]} scale={1.2} tone={0} />
      <PineTree position={[6.0, 0, -1.2]} scale={1.1} />
      <RoundTree position={[-6.2, 0, 0.6]} tone={1} />
      <PineTree position={[-5.4, 0, 3.6]} scale={0.9} />
      <RoundTree position={[1.4, 0, -6.1]} tone={2} scale={0.9} />
      <Rock position={[5.6, 0, 3.4]} scale={1.3} />
      <Rock position={[-3.2, 0, 5.4]} />
      <Fence from={[-6.4, -2.4]} to={[-3.0, -6.2]} posts={6} />
      <Flowers count={26} radius={7} inner={2.2} seed={5} />

      {heroNear && (
        <group position={HERO}>
          <Mouse pose={wave ? "wave" : "idle"} blobShadow={false} />
        </group>
      )}
      {wardNear ? <Wardrobe near={wardNear} /> : <Chest open={0} />}
      {friendsNear && <Friends />}
      {finale && <Fireworks />}
    </group>
  );
}
