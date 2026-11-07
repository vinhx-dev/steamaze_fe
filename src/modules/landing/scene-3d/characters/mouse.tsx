"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PALETTE, mat, blobShadowMaterial } from "../materials";
import { Crown, Glasses, Mask } from "./accessories";

export type MousePose = "idle" | "wave" | "run" | "carry" | "aim" | "cheer" | "walk";
export type MouseAccessory = "crown" | "glasses" | "mask";
export type MouseHolding = "none" | "basket" | "gun";

export interface MouseProps {
  pose?: MousePose;
  accessories?: readonly MouseAccessory[];
  holding?: MouseHolding;
  furColor?: string;
  /** Giữ mũ thám hiểm khi không đội vương miện */
  hat?: boolean;
  /** Tắt hoạt cảnh khi ở xa camera để tiết kiệm */
  active?: boolean;
  /** Bóng tròn mờ dưới chân (dùng khi tắt đổ bóng thật) */
  blobShadow?: boolean;
}

const SEG = 24; // số mặt khối cầu: đủ mịn mà vẫn nhẹ

/**
 * Chú chuột dựng bằng khối hình. Gốc toạ độ (0,0,0) nằm ĐÚNG dưới lòng bàn chân,
 * nên đặt nhân vật ở độ cao mặt đất là chân chạm đất, không bị chìm.
 */
export function Mouse({
  pose = "idle",
  accessories = [],
  holding = "none",
  furColor,
  hat = true,
  active = true,
  blobShadow = true,
}: MouseProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const t = useRef(-1);
  const blink = useRef(3);

  const fur = furColor ? mat(furColor) : mat(PALETTE.fur);
  const furDark = mat(PALETTE.furShade);
  const belly = mat(PALETTE.belly);

  const tailGeo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.04, -0.22),
      new THREE.Vector3(0.06, 0.12, -0.42),
      new THREE.Vector3(-0.03, 0.34, -0.5),
      new THREE.Vector3(0.05, 0.46, -0.42),
    ]);
    return new THREE.TubeGeometry(c, 24, 0.038, 8, false);
  }, []);

  useFrame((_, delta) => {
    if (!active) return;
    const dt = Math.min(delta, 0.05);
    if (t.current < 0) t.current = Math.random() * 10; // lệch pha để các chú chuột không cử động giống hệt nhau
    t.current += dt;
    const tt = t.current;
    const k = 1 - Math.exp(-12 * dt); // làm mượt không phụ thuộc FPS

    // Chớp mắt
    blink.current -= dt;
    if (eyes.current) eyes.current.scale.y = blink.current < 0 ? 0.12 : 1;
    if (blink.current < -0.12) blink.current = 2.5 + Math.random() * 3;

    let y = 0, bodyX = 0, headY = 0, headX = 0;
    let aLx = 0, aLz = 0.25, aRx = 0, aRz = -0.25, lL = 0, lR = 0, tailY = Math.sin(tt * 3) * 0.25;
    switch (pose) {
      case "idle":
        y = Math.sin(tt * 2.2) * 0.015;
        aLz = 0.22 + Math.sin(tt * 2.2) * 0.04;
        aRz = -0.22 - Math.sin(tt * 2.2) * 0.04;
        headY = Math.sin(tt * 0.8) * 0.15;
        break;
      case "wave":
        y = Math.abs(Math.sin(tt * 3)) * 0.03;
        aRz = -2.5 + Math.sin(tt * 8) * 0.35;
        aRx = -0.2;
        headY = 0.15;
        headX = -0.08;
        break;
      case "walk":
        y = Math.abs(Math.sin(tt * 6)) * 0.035;
        aLx = Math.sin(tt * 6) * 0.5;
        aRx = -Math.sin(tt * 6) * 0.5;
        lL = -Math.sin(tt * 6) * 0.5;
        lR = Math.sin(tt * 6) * 0.5;
        break;
      case "run":
        y = Math.abs(Math.sin(tt * 13)) * 0.08;
        bodyX = 0.18;
        aLx = Math.sin(tt * 13) * 1.0;
        aRx = -Math.sin(tt * 13) * 1.0;
        lL = -Math.sin(tt * 13) * 0.9;
        lR = Math.sin(tt * 13) * 0.9;
        tailY = Math.sin(tt * 13) * 0.45;
        break;
      case "carry":
        y = Math.abs(Math.sin(tt * 9)) * 0.03;
        aLz = 2.75;
        aRz = -2.75;
        lL = Math.sin(tt * 9) * 0.35;
        lR = -Math.sin(tt * 9) * 0.35;
        break;
      case "aim":
        bodyX = 0.04;
        aLx = -1.45;
        aLz = 0.45;
        aRx = -1.5;
        aRz = -0.15;
        headX = 0.05;
        break;
      case "cheer":
        y = Math.max(0, Math.sin(tt * 6)) * 0.28;
        aLz = 2.6 + Math.sin(tt * 12) * 0.15;
        aRz = -2.6 - Math.sin(tt * 12) * 0.15;
        headY = Math.sin(tt * 3) * 0.2;
        tailY = Math.sin(tt * 10) * 0.6;
        break;
    }

    const L = THREE.MathUtils.lerp;
    if (root.current) root.current.position.y = L(root.current.position.y, y, k);
    if (body.current) body.current.rotation.x = L(body.current.rotation.x, bodyX, k);
    if (head.current) {
      head.current.rotation.y = L(head.current.rotation.y, headY, k);
      head.current.rotation.x = L(head.current.rotation.x, headX, k);
    }
    if (armL.current) {
      armL.current.rotation.x = L(armL.current.rotation.x, aLx, k);
      armL.current.rotation.z = L(armL.current.rotation.z, aLz, k);
    }
    if (armR.current) {
      armR.current.rotation.x = L(armR.current.rotation.x, aRx, k);
      armR.current.rotation.z = L(armR.current.rotation.z, aRz, k);
    }
    if (legL.current) legL.current.rotation.x = L(legL.current.rotation.x, lL, k);
    if (legR.current) legR.current.rotation.x = L(legR.current.rotation.x, lR, k);
    if (tail.current) tail.current.rotation.y = L(tail.current.rotation.y, tailY, k);
  });

  const hasCrown = accessories.includes("crown");

  return (
    <group>
      {blobShadow && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={blobShadowMaterial}>
          <circleGeometry args={[0.5, 24]} />
        </mesh>
      )}
      <group ref={root}>
        {/* Thân: tâm cao 0.66, đáy thân chạm hông */}
        <group ref={body} position={[0, 0.66, 0]}>
          <mesh material={fur}>
            <capsuleGeometry args={[0.3, 0.36, 12, SEG]} />
          </mesh>
          <mesh position={[0, -0.04, 0.17]} scale={[0.82, 1, 0.5]} material={belly}>
            <sphereGeometry args={[0.27, SEG, 16]} />
          </mesh>
          {/* Balo */}
          <group position={[0, 0.06, -0.27]}>
            <mesh material={mat(PALETTE.backpack)}>
              <capsuleGeometry args={[0.15, 0.14, 8, 16]} />
            </mesh>
            <mesh position={[0, -0.06, -0.12]} material={mat(PALETTE.hatBand)}>
              <boxGeometry args={[0.2, 0.12, 0.06]} />
            </mesh>
          </group>
          {/* Đuôi */}
          <group ref={tail} position={[0, -0.24, -0.2]}>
            <mesh geometry={tailGeo} material={mat(PALETTE.innerEar)} />
          </group>

          {/* Đầu */}
          <group ref={head} position={[0, 0.56, 0.03]}>
            <mesh material={fur}>
              <sphereGeometry args={[0.4, 32, 24]} />
            </mesh>
            {/* Mõm */}
            <mesh position={[0, -0.11, 0.25]} scale={[1.05, 0.78, 0.9]} material={belly}>
              <sphereGeometry args={[0.2, SEG, 16]} />
            </mesh>
            <mesh position={[0, -0.05, 0.43]} material={mat(PALETTE.nose, { rough: 0.4 })}>
              <sphereGeometry args={[0.05, 16, 12]} />
            </mesh>
            {/* Mắt */}
            <group ref={eyes} position={[0, 0.06, 0]}>
              {[-1, 1].map((s) => (
                <group key={s} position={[s * 0.15, 0, 0.33]}>
                  <mesh material={mat(PALETTE.eye, { rough: 0.2 })} scale={[1, 1.15, 0.7]}>
                    <sphereGeometry args={[0.065, 16, 12]} />
                  </mesh>
                  <mesh position={[s * -0.015 - 0.01, 0.025, 0.045]} material={mat(PALETTE.white, { rough: 0.2 })}>
                    <sphereGeometry args={[0.02, 10, 8]} />
                  </mesh>
                </group>
              ))}
            </group>
            {/* Má hồng */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.25, -0.09, 0.29]} rotation={[0, s * 0.65, 0]} material={mat(PALETTE.cheek)}>
                <circleGeometry args={[0.06, 20]} />
              </mesh>
            ))}
            {/* Tai */}
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.31, 0.3, -0.05]} rotation={[0.15, s * -0.25, s * -0.45]}>
                <mesh material={fur} scale={[1, 1, 0.28]}>
                  <sphereGeometry args={[0.24, SEG, 16]} />
                </mesh>
                <mesh position={[0, 0, 0.04]} material={mat(PALETTE.innerEar)} scale={[0.72, 0.72, 0.2]}>
                  <sphereGeometry args={[0.22, SEG, 16]} />
                </mesh>
              </group>
            ))}
            {/* Mũ thám hiểm */}
            {hat && !hasCrown && (
              <group position={[0, 0.3, -0.02]} rotation={[-0.08, 0, 0]}>
                <mesh material={mat(PALETTE.hat)}>
                  <cylinderGeometry args={[0.5, 0.52, 0.035, 32]} />
                </mesh>
                <mesh position={[0, 0.1, 0]} material={mat(PALETTE.hat)}>
                  <sphereGeometry args={[0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                </mesh>
                <mesh position={[0, 0.06, 0]} material={mat(PALETTE.hatBand)}>
                  <cylinderGeometry args={[0.285, 0.285, 0.06, 32]} />
                </mesh>
              </group>
            )}
            {hasCrown && <Crown />}
            {accessories.includes("glasses") && <Glasses />}
            {accessories.includes("mask") && <Mask />}
          </group>

          {/* Tay: điểm xoay ở vai */}
          {([
            [armL, -1],
            [armR, 1],
          ] as const).map(([ref, s]) => (
            <group key={s} ref={ref} position={[s * 0.32, 0.17, 0]}>
              <mesh position={[0, -0.15, 0]} material={fur}>
                <capsuleGeometry args={[0.075, 0.2, 8, 16]} />
              </mesh>
              <mesh position={[0, -0.29, 0]} material={furDark}>
                <sphereGeometry args={[0.085, 16, 12]} />
              </mesh>
              {s === 1 && holding === "gun" && (
                <group position={[0, -0.32, 0.16]}>
                  <mesh material={mat("#2f3640", { rough: 0.35, metal: 0.4 })}>
                    <boxGeometry args={[0.1, 0.12, 0.3]} />
                  </mesh>
                  <mesh position={[0, 0.02, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={mat(PALETTE.optic, { emissive: PALETTE.laser, emissiveIntensity: 0.8 })}>
                    <cylinderGeometry args={[0.035, 0.045, 0.16, 16]} />
                  </mesh>
                </group>
              )}
            </group>
          ))}

          {/* Thúng trên đầu */}
          {holding === "basket" && (
            <group position={[0, 1.12, 0]}>
              <mesh material={mat(PALETTE.wood)}>
                <cylinderGeometry args={[0.56, 0.38, 0.32, 32, 1, true]} />
              </mesh>
              <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat(PALETTE.woodDark)}>
                <torusGeometry args={[0.56, 0.035, 10, 40]} />
              </mesh>
              <mesh position={[0, -0.15, 0]} material={mat(PALETTE.woodDark)}>
                <cylinderGeometry args={[0.38, 0.38, 0.03, 32]} />
              </mesh>
            </group>
          )}
        </group>

        {/* Chân: điểm xoay ở hông (cao 0.3), bàn chân chạm y=0 */}
        {([
          [legL, -1],
          [legR, 1],
        ] as const).map(([ref, s]) => (
          <group key={s} ref={ref} position={[s * 0.15, 0.3, 0]}>
            <mesh position={[0, -0.12, 0]} material={fur}>
              <capsuleGeometry args={[0.085, 0.14, 8, 16]} />
            </mesh>
            <mesh position={[0, -0.25, 0.06]} scale={[1, 0.55, 1.45]} material={furDark}>
              <sphereGeometry args={[0.1, 16, 12]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
