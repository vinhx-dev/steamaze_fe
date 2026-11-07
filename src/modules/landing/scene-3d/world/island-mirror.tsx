"use client";

import { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Mouse } from "../characters/mouse";
import { PALETTE, mat, mirrorMaterial, enableShadows } from "../materials";
import { ISLANDS } from "../data/stops";
import { useNear } from "../hooks/use-near";
import { FloatingIsland, RoundTree, PineTree } from "./props";
import { Label } from "./label";

/**
 * Đảo trò chơi 03 — tái hiện "Cao thủ cân gương":
 * chuột ngắm → 2 gương xoay về đúng góc → tia laser nảy qua 2 gương (góc tới = góc phản xạ) → trúng robot "MÁY".
 */
const BEAM_Y = 0.92;
const MOUSE_POS = new THREE.Vector3(-3.6, 0, 2.5);
const M1 = new THREE.Vector3(-2.7, BEAM_Y, -2.3);
const M2 = new THREE.Vector3(2.7, BEAM_Y, -2.3);
const ROBOT_POS = new THREE.Vector3(3.6, 0, 2.5);
const TARGET = new THREE.Vector3(3.6, BEAM_Y, 2.5);
const CYCLE = 5;
const AIM = 1.6;
const FIRE = 0.9;

// Hướng chuột nhìn tới gương 1, đầu nòng súng
const AIM_DIR = new THREE.Vector3(M1.x - MOUSE_POS.x, 0, M1.z - MOUSE_POS.z).normalize();
const MUZZLE = MOUSE_POS.clone().addScaledVector(AIM_DIR, 0.62).setY(BEAM_Y);
const PATH = [MUZZLE, M1, M2, TARGET];

/** Pháp tuyến gương = phân giác tia tới (đảo chiều) và tia phản xạ -> đúng định luật phản xạ */
function mirrorNormal(prev: THREE.Vector3, at: THREE.Vector3, next: THREE.Vector3) {
  const a = prev.clone().sub(at).normalize();
  const b = next.clone().sub(at).normalize();
  return a.add(b).normalize();
}
const N1 = mirrorNormal(MUZZLE, M1, M2);
const N2 = mirrorNormal(M1, M2, TARGET);
const angleDeg = (prev: THREE.Vector3, at: THREE.Vector3, n: THREE.Vector3) =>
  Math.round(THREE.MathUtils.radToDeg(prev.clone().sub(at).normalize().angleTo(n)));
const I1 = angleDeg(MUZZLE, M1, N1);
const I2 = angleDeg(M1, M2, N2);

const SEGMENTS = PATH.slice(0, -1).map((p, i) => {
  const q = PATH[i + 1];
  const dir = q.clone().sub(p);
  const len = dir.length();
  dir.normalize();
  return { from: p, dir, len, quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir) };
});
const TOTAL = SEGMENTS.reduce((s, x) => s + x.len, 0);

// Vật liệu tia laser (chỉ có 1 đảo gương nên dùng chung ở cấp module)
const glowMat = new THREE.MeshBasicMaterial({ color: PALETTE.laser, transparent: true, opacity: 0.45, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
const coreMat = new THREE.MeshBasicMaterial({ color: "#e8f6ff", toneMapped: false });

function MirrorStand({ normal, refObj }: { normal: THREE.Vector3; refObj: React.RefObject<THREE.Group | null> }) {
  const rotY = Math.atan2(normal.x, normal.z);
  return (
    <group ref={refObj} rotation={[0, rotY, 0]} userData={{ base: rotY }}>
      <mesh position={[0, 0.9, 0]} material={mirrorMaterial}>
        <boxGeometry args={[1.25, 1.25, 0.04]} />
      </mesh>
      {/* khung gỗ + viền vàng như trong game */}
      {[
        [0, 1.55, 1.4, 0.1],
        [0, 0.25, 1.4, 0.1],
        [-0.67, 0.9, 0.1, 1.4],
        [0.67, 0.9, 0.1, 1.4],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} material={mat(i < 2 ? PALETTE.gold : PALETTE.woodDark, i < 2 ? { rough: 0.3, metal: 0.7 } : {})}>
          <boxGeometry args={[w, h, 0.1]} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, -0.15]} material={mat(PALETTE.woodDark)}>
        <boxGeometry args={[0.9, 0.2, 0.4]} />
      </mesh>
    </group>
  );
}

function Robot({ hp }: { hp: number }) {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} material={mat(PALETTE.robot, { rough: 0.35, metal: 0.5 })}>
        <capsuleGeometry args={[0.32, 0.45, 10, 24]} />
      </mesh>
      <mesh position={[0, 1.22, 0]} material={mat("#7f8a92", { rough: 0.35, metal: 0.5 })}>
        <boxGeometry args={[0.55, 0.42, 0.45]} />
      </mesh>
      <mesh position={[0, 1.24, 0.23]} material={mat("#ff4d5e", { emissive: "#ff2033", emissiveIntensity: 1.2 })}>
        <boxGeometry args={[0.4, 0.1, 0.02]} />
      </mesh>
      <mesh position={[0, 1.55, 0]} material={mat("#7f8a92")}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
      </mesh>
      <mesh position={[0, 1.68, 0]} material={mat("#ff4d5e", { emissive: "#ff2033", emissiveIntensity: 1 })}>
        <sphereGeometry args={[0.06, 16, 12]} />
      </mesh>
      {/* Thanh máu */}
      <group position={[0, 2.05, 0]}>
        <Label text={`MÁY  ${hp}`} position={[0, 0.32, 0]} height={0.32} billboard color="#ffffff" bg="#c0392b" border="#7f1d14" />
        <mesh material={mat("#333a40")}>
          <boxGeometry args={[1.05, 0.12, 0.04]} />
        </mesh>
        <mesh position={[(-1 + hp / 100) * 0.5, 0, 0.03]} scale={[hp / 100, 1, 1]} material={mat("#3ddc6a", { emissive: "#1fa34a", emissiveIntensity: 0.5 })}>
          <boxGeometry args={[1, 0.08, 0.02]} />
        </mesh>
      </group>
    </group>
  );
}

export function IslandMirror() {
  const root = useRef<THREE.Group>(null);
  const near = useNear(3, 0.13);
  const m1 = useRef<THREE.Group>(null);
  const m2 = useRef<THREE.Group>(null);
  const beams = useRef<THREE.Group>(null);
  const aimDots = useRef<THREE.Group>(null);
  const robot = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Mesh>(null);
  const labels = useRef<THREE.Group>(null);
  const time = useRef(0);
  const [hits, setHits] = useState(0);
  const hitDone = useRef(false);

  useLayoutEffect(() => {
    if (root.current) enableShadows(root.current);
  }, [near]);

  useFrame((_, delta) => {
    if (!near) return;
    const dt = Math.min(delta, 0.05);
    time.current += dt;
    const c = time.current % CYCLE;
    if (c < dt * 1.5) hitDone.current = false;

    // Gương xoay dần về đúng góc trong lúc ngắm
    const settle = THREE.MathUtils.smoothstep(c, 0.2, AIM - 0.2);
    [m1, m2].forEach((m, i) => {
      if (!m.current) return;
      const base = m.current.userData.base as number;
      m.current.rotation.y = base + (1 - settle) * (i === 0 ? 0.55 : -0.5);
    });

    // Chấm ngắm nhấp nháy dọc đoạn đầu
    if (aimDots.current) {
      aimDots.current.visible = c < AIM;
      aimDots.current.children.forEach((d, i) => {
        const s = 0.6 + 0.4 * Math.sin(time.current * 10 - i * 0.8);
        d.scale.setScalar(s);
      });
    }

    // Tia laser chạy dần qua từng đoạn
    const d = c < AIM ? 0 : Math.min(TOTAL, ((c - AIM) / FIRE) * TOTAL);
    const fade = c > AIM + FIRE + 0.9 ? Math.max(0, 1 - (c - AIM - FIRE - 0.9) / 0.5) : 1;
    glowMat.opacity = 0.45 * fade;
    coreMat.opacity = fade;
    coreMat.transparent = fade < 1;
    let acc = 0;
    beams.current?.children.forEach((seg, i) => {
      const S = SEGMENTS[i];
      const shown = Math.max(0, Math.min(S.len, d - acc));
      acc += S.len;
      seg.visible = shown > 0.001 && fade > 0;
      seg.position.copy(S.from).addScaledVector(S.dir, shown / 2);
      seg.quaternion.copy(S.quat);
      seg.scale.set(1, Math.max(0.001, shown), 1);
    });
    if (labels.current) {
      labels.current.children[0].visible = d > SEGMENTS[0].len && fade > 0;
      labels.current.children[1].visible = d > SEGMENTS[0].len + SEGMENTS[1].len && fade > 0;
    }

    // Trúng robot: loé sáng, rung, mất máu
    const hit = d >= TOTAL;
    if (hit && !hitDone.current) {
      hitDone.current = true;
      setHits((h) => h + 1);
    }
    const sinceHit = hit ? c - AIM - FIRE : -1;
    if (flash.current) {
      flash.current.visible = hit && sinceHit < 0.5;
      flash.current.scale.setScalar(0.3 + Math.max(0, sinceHit) * 2.4);
      (flash.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - sinceHit * 2);
    }
    if (robot.current) {
      robot.current.position.x = ROBOT_POS.x + (hit && sinceHit < 0.4 ? Math.sin(sinceHit * 80) * 0.06 : 0);
      robot.current.rotation.z = hit && sinceHit < 0.4 ? Math.sin(sinceHit * 60) * 0.08 : 0;
    }
  });

  const hp = 100 - (hits % 4) * 25;
  const mouseRotY = Math.atan2(AIM_DIR.x, AIM_DIR.z);

  return (
    <group ref={root} position={ISLANDS.mirror}>
      <FloatingIsland radius={7.2} depth={5} />
      {/* Sân lát đá */}
      <mesh position={[0, 0.02, 0.1]} rotation={[-Math.PI / 2, 0, 0]} material={mat(PALETTE.stoneTile, { rough: 0.85 })} receiveShadow>
        <planeGeometry args={[10, 7.6]} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={`v${i}`} position={[-4 + i, 0.025, 0.1]} rotation={[-Math.PI / 2, 0, 0]} material={mat("#c4bba9")}>
          <planeGeometry args={[0.03, 7.6]} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`h${i}`} position={[0, 0.025, -3 + i]} rotation={[-Math.PI / 2, 0, 0]} material={mat("#c4bba9")}>
          <planeGeometry args={[10, 0.03]} />
        </mesh>
      ))}

      {/* Tường gạch chắn giữa: không bắn thẳng được */}
      <mesh position={[0, 0.8, 1.7]} material={mat("#9b9286", { rough: 0.95 })}>
        <boxGeometry args={[0.4, 1.6, 4.6]} />
      </mesh>
      <mesh position={[0, 1.65, 1.7]} material={mat("#6f8f3a")}>
        <boxGeometry args={[0.5, 0.1, 4.7]} />
      </mesh>

      {/* Đền nhỏ phía sau */}
      <group position={[0, 0, -4.9]}>
        <mesh position={[0, 0.15, 0]} material={mat(PALETTE.stoneTile)}>
          <boxGeometry args={[4.4, 0.3, 1.6]} />
        </mesh>
        {[-1.7, 1.7].map((x) => (
          <mesh key={x} position={[x, 1.4, 0]} material={mat(PALETTE.pillar)}>
            <cylinderGeometry args={[0.16, 0.16, 2.3, 20]} />
          </mesh>
        ))}
        <mesh position={[0, 2.85, 0]} rotation={[0, Math.PI / 4, 0]} material={mat(PALETTE.roof, { rough: 0.5 })}>
          <coneGeometry args={[3.1, 1.1, 4]} />
        </mesh>
        <mesh position={[0, 2.5, 0]} material={mat(PALETTE.woodDark)}>
          <boxGeometry args={[4, 0.2, 0.3]} />
        </mesh>
      </group>
      <RoundTree position={[-5.6, 0, -2.6]} tone={0} />
      <PineTree position={[5.7, 0, -2.4]} scale={1.1} />
      <RoundTree position={[5.4, 0, 4.4]} tone={2} scale={0.8} />

      {/* 2 gương */}
      <group position={[M1.x, 0, M1.z]}>
        <MirrorStand normal={N1} refObj={m1} />
      </group>
      <group position={[M2.x, 0, M2.z]}>
        <MirrorStand normal={N2} refObj={m2} />
      </group>

      {near && (
        <>
          {/* Chuột cầm súng laser */}
          <group position={MOUSE_POS} rotation={[0, mouseRotY, 0]}>
            <Mouse pose="aim" holding="gun" blobShadow={false} />
          </group>

          {/* Robot "MÁY" */}
          <group ref={robot} position={ROBOT_POS} rotation={[0, -2.4, 0]}>
            <Robot hp={hp} />
          </group>

          {/* Chấm ngắm */}
          <group ref={aimDots}>
            {Array.from({ length: 6 }, (_, i) => (
              <mesh key={i} position={MUZZLE.clone().addScaledVector(SEGMENTS[0].dir, 0.45 + i * 0.6)} material={coreMat}>
                <sphereGeometry args={[0.04, 10, 8]} />
              </mesh>
            ))}
          </group>

          {/* 3 đoạn tia laser (lõi trắng + quầng xanh) */}
          <group ref={beams}>
            {SEGMENTS.map((_, i) => (
              <group key={i} visible={false}>
                <mesh material={coreMat}>
                  <cylinderGeometry args={[0.035, 0.035, 1, 12]} />
                </mesh>
                <mesh material={glowMat}>
                  <cylinderGeometry args={[0.12, 0.12, 1, 16]} />
                </mesh>
              </group>
            ))}
          </group>
          <mesh ref={flash} position={TARGET} visible={false}>
            <sphereGeometry args={[0.5, 24, 16]} />
            <meshBasicMaterial color="#bfe4ff" transparent toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>

          {/* Nhãn góc tới = góc phản xạ tại mỗi gương */}
          <group ref={labels}>
            <group visible={false}>
              <Label text={`i = r = ${I1}°`} position={[M1.x + 0.2, 2.3, M1.z + 0.4]} height={0.38} billboard color="#ffffff" bg="#3d7be0" border="#24529c" />
            </group>
            <group visible={false}>
              <Label text={`i = r = ${I2}°`} position={[M2.x - 0.2, 2.3, M2.z + 0.4]} height={0.38} billboard color="#ffffff" bg="#3d7be0" border="#24529c" />
            </group>
          </group>
        </>
      )}
    </group>
  );
}
