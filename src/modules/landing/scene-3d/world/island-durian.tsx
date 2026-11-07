"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Mouse } from "../characters/mouse";
import { PALETTE, mat, enableShadows } from "../materials";
import { ISLANDS } from "../data/stops";
import { useNear } from "../hooks/use-near";
import { FloatingIsland, Fence, Flowers } from "./props";
import { Label } from "./label";
import { createSeededRandom } from "./seeded-random";

/**
 * Đảo trò chơi 02 — tái hiện "Cơn mưa sầu riêng":
 * 3 cây cao treo nhiều quả to nhỏ, thước đo độ cao, quả rơi theo trọng lực, chuột đội thúng chạy tới hứng.
 */
const GRAVITY = 9.8;
const BASKET_Y = 1.95; // độ cao miệng thúng trên đầu chuột
const TREES_X = [-3.4, 0, 3.4];
const METER = 0.24; // 1 mét trong game = 0.24 đơn vị (25 m ≈ 6 đơn vị)

/** Hình quả sầu riêng: thân cầu + gai, gộp làm một hình, tô màu theo đỉnh (1 lần vẽ cho mọi quả) */
function makeDurianGeometry() {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.SphereGeometry(0.5, 24, 18);
  body.scale(1, 1.12, 1);
  parts.push(body);
  const spike = new THREE.ConeGeometry(0.075, 0.2, 8);
  const dirs = new THREE.IcosahedronGeometry(1, 1).getAttribute("position");
  const seen = new Set<string>();
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < dirs.count; i++) {
    const d = new THREE.Vector3().fromBufferAttribute(dirs, i).normalize();
    const key = d.toArray().map((n) => n.toFixed(2)).join();
    if (seen.has(key)) continue;
    seen.add(key);
    const g = spike.clone();
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, d));
    g.translate(d.x * 0.5, d.y * 0.56, d.z * 0.5);
    parts.push(g);
  }
  const colorize = (g: THREE.BufferGeometry, c: THREE.Color) => {
    const n = g.getAttribute("position").count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    g.deleteAttribute("uv");
    return g;
  };
  const skin = new THREE.Color(PALETTE.durian);
  const thorn = new THREE.Color(PALETTE.durianDark);
  const merged = mergeGeometries(parts.map((g, i) => colorize(g.toNonIndexed(), i === 0 ? skin : thorn)));
  merged.computeVertexNormals();
  return merged;
}

const tmp = new THREE.Object3D(); // vật tạm để tính ma trận từng quả

interface Fruit {
  x: number;
  y: number;
  z: number;
  size: number;
  branchFromX: number;
}

function buildFruits(): Fruit[] {
  const r = createSeededRandom(21);
  const out: Fruit[] = [];
  TREES_X.forEach((tx, ti) => {
    for (let j = 0; j < 4; j++) {
      const side = j % 2 === 0 ? -1 : 1;
      const heightM = 10 + ((j * 4 + ti * 3) % 8) + r() * 1.5; // 10–19,5 m (dưới tán lá)
      out.push({ x: tx + side * (0.9 + r() * 0.5), y: heightM * METER + 0.6, z: -0.6 + r() * 0.4, size: 0.42 + r() * 0.3, branchFromX: tx });
    }
  });
  return out;
}

export function IslandDurian() {
  const root = useRef<THREE.Group>(null);
  const near = useNear(2, 0.13);
  const geo = useMemo(() => makeDurianGeometry(), []);
  const fruits = useMemo(() => buildFruits(), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }), []);
  const inst = useRef<THREE.InstancedMesh>(null);
  const catcher = useRef<THREE.Group>(null);
  const splat = useRef<THREE.Group>(null);
  const plus = useRef<THREE.Group>(null);
  const boom = useRef<THREE.Group>(null);
  const state = useRef({ t: 0, idx: -1, start: 0, missed: false, landed: false, landT: 0, round: 0, mouseX: 0 });

  useLayoutEffect(() => {
    if (root.current) enableShadows(root.current);
  }, [near]);

  // Đặt quả lên cây lúc đầu
  useLayoutEffect(() => {
    if (!inst.current) return;
    fruits.forEach((f, i) => {
      tmp.position.set(f.x, f.y, f.z);
      tmp.scale.setScalar(f.size);
      tmp.rotation.set(0, i, 0);
      tmp.updateMatrix();
      inst.current!.setMatrixAt(i, tmp.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;
  }, [fruits]);

  useFrame((_, delta) => {
    if (!near || !inst.current) return;
    const dt = Math.min(delta, 0.05);
    const s = state.current;
    s.t += dt;

    // Bắt đầu lượt rơi mới mỗi 2,4 giây
    if (s.idx < 0 || s.t - s.start > 2.4) {
      if (s.idx >= 0) {
        // trả quả cũ lên cây (hiện lại dần)
        const f = fruits[s.idx];
        tmp.position.set(f.x, f.y, f.z);
        tmp.scale.setScalar(0.001);
        tmp.updateMatrix();
        inst.current.setMatrixAt(s.idx, tmp.matrix);
      }
      s.round++;
      s.idx = (s.round * 5) % fruits.length;
      s.start = s.t;
      s.missed = s.round % 4 === 0; // cứ 4 quả thì hụt 1 quả cho giống chơi thật
      s.landed = false;
    }

    const f = fruits[s.idx];
    const e = s.t - s.start;
    const fallTime = Math.sqrt((2 * (f.y - BASKET_Y)) / GRAVITY);
    const groundTime = Math.sqrt((2 * (f.y - 0.3)) / GRAVITY);
    const wait = 0.35; // quả rung nhẹ trước khi rụng
    let y = f.y;
    let x = f.x;
    if (e < wait) {
      x = f.x + Math.sin(e * 60) * 0.03;
    } else {
      const ft = e - wait;
      const stopAt = s.missed ? groundTime : fallTime;
      const tt = Math.min(ft, stopAt);
      y = f.y - 0.5 * GRAVITY * tt * tt;
      if (ft >= stopAt && !s.landed) {
        s.landed = true;
        s.landT = s.t;
      }
    }

    // Chuột chạy tới dưới quả (hụt thì tới chậm, lệch một chút)
    const targetX = e < 0.15 ? s.mouseX : s.missed ? f.x - 1.1 : f.x;
    const speed = s.missed ? 3.2 : 9;
    s.mouseX = THREE.MathUtils.lerp(s.mouseX, targetX, 1 - Math.exp(-speed * dt));
    if (catcher.current) {
      catcher.current.position.x = s.mouseX;
      // hứng được thì thúng nhún xuống
      const sinceLand = s.landed && !s.missed ? s.t - s.landT : 9;
      catcher.current.scale.y = 1 - Math.max(0, 0.12 - sinceLand * 0.4);
    }

    const sinceLand = s.landed ? s.t - s.landT : -1;
    if (s.landed && !s.missed) {
      // quả nằm trong thúng rồi thu nhỏ biến mất
      x = s.mouseX;
      y = BASKET_Y + 0.15;
    }
    const shrink = s.landed ? Math.max(0.001, 1 - sinceLand * 1.6) : 1;
    tmp.position.set(x, y, s.landed && !s.missed ? 0.4 : f.z + (y < f.y ? (0.4 - f.z) * Math.min(1, (f.y - y) / 1.5) : 0));
    tmp.scale.setScalar(f.size * shrink);
    tmp.rotation.set(e * 3, s.idx, 0);
    tmp.updateMatrix();
    inst.current.setMatrixAt(s.idx, tmp.matrix);

    // Các quả khác từ từ hiện lại (sau khi bị lấy đi)
    fruits.forEach((ff, i) => {
      if (i === s.idx) return;
      inst.current!.getMatrixAt(i, tmp.matrix);
      tmp.matrix.decompose(tmp.position, tmp.quaternion, tmp.scale);
      if (tmp.scale.x < ff.size) {
        tmp.position.set(ff.x, ff.y, ff.z);
        tmp.scale.setScalar(Math.min(ff.size, tmp.scale.x + dt * 0.8));
        tmp.updateMatrix();
        inst.current!.setMatrixAt(i, tmp.matrix);
      }
    });
    inst.current.instanceMatrix.needsUpdate = true;

    // Hiệu ứng: "+1" khi hứng được, mảnh vỡ khi rơi đất
    if (plus.current) {
      plus.current.visible = s.landed && !s.missed && sinceLand < 1;
      plus.current.position.set(s.mouseX, 2.9 + sinceLand * 0.7, 0.4);
    }
    if (splat.current) {
      const on = s.landed && s.missed && sinceLand < 0.9;
      splat.current.visible = on;
      splat.current.position.set(f.x, 0.05, 0.4);
      splat.current.children.forEach((c, i) => {
        const a = (i / splat.current!.children.length) * Math.PI * 2;
        const b = Math.max(0, sinceLand);
        c.position.set(Math.cos(a) * b * 1.6, Math.max(0, b * 2.2 - b * b * 4), Math.sin(a) * b * 0.9);
        c.scale.setScalar(Math.max(0.01, 1 - b));
      });
    }
    if (boom.current) {
      boom.current.visible = s.landed && s.missed && sinceLand < 0.9;
      boom.current.position.set(f.x, 1.2 + Math.max(0, sinceLand) * 0.5, 0.4);
    }
  });

  return (
    <group ref={root} position={ISLANDS.durian}>
      <FloatingIsland radius={6.4} depth={4} />
      <mesh position={[0, 0.02, 0.9]} rotation={[-Math.PI / 2, 0, 0]} material={mat(PALETTE.path, { rough: 0.95 })} receiveShadow>
        <planeGeometry args={[11, 1.5]} />
      </mesh>

      {/* 3 cây sầu riêng cao, cành vươn ra treo quả */}
      {TREES_X.map((x) => (
        <group key={x} position={[x, 0, -0.8]}>
          <mesh position={[0, 3.2, 0]} material={mat(PALETTE.trunk)}>
            <cylinderGeometry args={[0.2, 0.32, 6.4, 20]} />
          </mesh>
          <mesh position={[0, 6.6, 0]} material={mat(PALETTE.leaf, { rough: 0.85 })}>
            <sphereGeometry args={[1.5, 32, 20]} />
          </mesh>
          <mesh position={[0.9, 6.2, 0.3]} material={mat(PALETTE.leafLight, { rough: 0.85 })}>
            <sphereGeometry args={[0.95, 28, 18]} />
          </mesh>
          <mesh position={[-0.9, 6.3, -0.2]} material={mat(PALETTE.leafDark, { rough: 0.85 })}>
            <sphereGeometry args={[1, 28, 18]} />
          </mesh>
        </group>
      ))}
      {/* Cành + cuống nối tới từng quả */}
      {fruits.map((f, i) => {
        const len = Math.abs(f.x - f.branchFromX);
        return (
          <group key={i}>
            <mesh position={[(f.x + f.branchFromX) / 2, f.y + 0.55, -0.7]} rotation={[0, 0, Math.sign(f.x - f.branchFromX) * 0.12]} material={mat(PALETTE.trunk)}>
              <boxGeometry args={[len + 0.1, 0.09, 0.09]} />
            </mesh>
            <mesh position={[f.x, f.y + 0.38, (f.z - 0.7) / 2 - 0.1]} material={mat(PALETTE.trunk)}>
              <cylinderGeometry args={[0.02, 0.02, 0.36, 6]} />
            </mesh>
          </group>
        );
      })}
      <instancedMesh ref={inst} args={[geo, material, fruits.length]} castShadow />

      {/* Thước đo độ cao 5–25 m */}
      <group position={[-5.4, 0, -0.2]}>
        <mesh position={[0, 3.3, 0]} material={mat("#6b5a4a")}>
          <boxGeometry args={[0.16, 6.6, 0.12]} />
        </mesh>
        {[5, 10, 15, 20, 25].map((m) => (
          <group key={m} position={[0, m * METER + 0.6, 0]}>
            <mesh position={[0.18, 0, 0]} material={mat("#ffffff")}>
              <boxGeometry args={[0.24, 0.04, 0.04]} />
            </mesh>
            <Label text={`${m}m`} position={[0.62, 0, 0.05]} height={0.3} color="#ffffff" bg="transparent" border="transparent" />
          </group>
        ))}
      </group>

      <Fence from={[-6, 2.6]} to={[6, 2.6]} posts={13} />
      <Flowers count={16} radius={6} inner={2.2} seed={11} />

      {near && (
        <>
          <group ref={catcher} position={[0, 0, 0.4]}>
            <Mouse pose="carry" holding="basket" blobShadow={false} />
          </group>
          <group ref={plus} visible={false}>
            <Label text="+1 🧺" height={0.5} billboard color="#ffffff" bg="#e3792c" border="#a8541a" />
          </group>
          <group ref={boom} visible={false}>
            <Label text="💥 Hụt rồi!" height={0.45} billboard color="#ffffff" bg="#c0392b" border="#7f1d14" />
          </group>
          <group ref={splat} visible={false}>
            {Array.from({ length: 9 }, (_, i) => (
              <mesh key={i} material={mat(i % 2 ? PALETTE.durian : "#f4e27a")}>
                <dodecahedronGeometry args={[0.12, 0]} />
              </mesh>
            ))}
          </group>
        </>
      )}
    </group>
  );
}
