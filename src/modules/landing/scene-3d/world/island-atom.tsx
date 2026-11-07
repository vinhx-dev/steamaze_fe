"use client";

import { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Mouse } from "../characters/mouse";
import { PALETTE, mat, enableShadows } from "../materials";
import { ISLANDS } from "../data/stops";
import { useNear } from "../hooks/use-near";
import { FloatingIsland, PineTree, RoundTree, Rock, Flowers } from "./props";
import { Label } from "./label";

/**
 * Đảo trò chơi 01 — tái hiện "Con đường hoá học":
 * đường chạy 2 làn, cổng 2 bệ đáp án lao tới, chú chuột đổi làn vào bệ đúng, bệ loé xanh, xu bay lên.
 */
const QUESTIONS = [
  { name: "Natri", sym: "Na", right: 23, wrong: 52 },
  { name: "Oxi", sym: "O", right: 16, wrong: 32 },
  { name: "Cacbon", sym: "C", right: 12, wrong: 24 },
  { name: "Sắt", sym: "Fe", right: 56, wrong: 65 },
] as const;

const LANE = 0.75; // làn trái/phải theo trục z
const MOUSE_X = 2.4; // chuột chạy tại chỗ, cổng lao về phía chuột (trục +x)
const START_X = -6.2;
const CYCLE = 4.2; // giây cho mỗi câu hỏi
const TRAVEL = 2.6; // thời gian cổng chạy tới chuột

/** Cổng vòm của một làn: chuột chạy lọt qua bên dưới, bảng đáp án trên đỉnh, nền loé xanh khi đúng */
function AnswerGate({ value, sym, glow }: { value: number; sym: string; glow: number }) {
  const wood = mat(PALETTE.wood);
  return (
    <group>
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 40]} />
        <meshStandardMaterial color="#e9cf9c" roughness={0.6} emissive="#38e56f" emissiveIntensity={glow * 1.8} />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 1.05, 0]} material={wood}>
          <cylinderGeometry args={[0.07, 0.09, 2.1, 16]} />
        </mesh>
      ))}
      {/* xà ngang mảnh phía trên, không che bảng số */}
      <mesh position={[0, 2.12, 0]} rotation={[0, 0, Math.PI / 2]} material={mat(PALETTE.woodDark)}>
        <cylinderGeometry args={[0.06, 0.06, 1.35, 12]} />
      </mesh>
      <Label text={`${value} – ${sym}`} position={[0, 1.78, 0]} height={0.44} billboard />
    </group>
  );
}

export function IslandAtom() {
  const root = useRef<THREE.Group>(null);
  const near = useNear(1, 0.13);
  const gate = useRef<THREE.Group>(null);
  const runner = useRef<THREE.Group>(null);
  const stripes = useRef<THREE.Group>(null);
  const coins = useRef<THREE.Group>(null);
  const plus = useRef<THREE.Group>(null);
  const time = useRef(0);
  const [q, setQ] = useState(0);
  const [rightLane, setRightLane] = useState(-1);
  const [glow, setGlow] = useState(0);

  useLayoutEffect(() => {
    if (root.current) enableShadows(root.current);
  }, [near]);

  useFrame((_, delta) => {
    if (!near) return;
    const dt = Math.min(delta, 0.05);
    time.current += dt;
    const c = time.current % CYCLE;
    const cycleIndex = Math.floor(time.current / CYCLE);

    // Đổi câu hỏi mỗi vòng
    if (cycleIndex % QUESTIONS.length !== q) {
      setQ(cycleIndex % QUESTIONS.length);
      setRightLane(cycleIndex % 2 === 0 ? -1 : 1);
      setGlow(0);
    }

    // Cổng lao từ xa tới chuột
    const k = Math.min(1, c / TRAVEL);
    const x = START_X + (MOUSE_X - START_X) * k + Math.max(0, c - TRAVEL) * 3.2;
    if (gate.current) {
      gate.current.position.x = x;
      gate.current.visible = x < 6.4;
    }

    // Chuột đổi làn sau khi đọc câu hỏi
    if (runner.current) {
      const targetZ = c > 0.9 ? rightLane * LANE : 0;
      runner.current.position.z = THREE.MathUtils.lerp(runner.current.position.z, targetZ, 1 - Math.exp(-7 * dt));
      runner.current.rotation.y = -Math.PI / 2 + (targetZ - runner.current.position.z) * 0.6;
    }

    // Vạch đường chạy trôi để tạo cảm giác tốc độ
    stripes.current?.children.forEach((s) => {
      s.position.x += 3.2 * dt;
      if (s.position.x > 5.6) s.position.x -= 11.2;
    });

    // Qua cổng: bệ đúng loé xanh, xu bay lên, "+1 ★"
    const passed = c >= TRAVEL;
    const g = passed ? Math.max(0, 1 - (c - TRAVEL) / 1.2) : 0;
    if (Math.abs(g - glow) > 0.04) setGlow(g);
    const burst = passed ? (c - TRAVEL) / 1.2 : -1;
    if (coins.current) {
      coins.current.visible = burst >= 0 && burst <= 1;
      coins.current.position.set(MOUSE_X, 0, rightLane * LANE);
      coins.current.children.forEach((coin, i) => {
        const a = (i / coins.current!.children.length) * Math.PI * 2;
        const b = Math.max(0, burst);
        coin.position.set(Math.cos(a) * b * 1.1, 1.2 + b * 2.2 - b * b * 1.2, Math.sin(a) * b * 1.1);
        coin.rotation.y += dt * 9;
        coin.scale.setScalar(1 - b * 0.6);
      });
    }
    if (plus.current) {
      plus.current.visible = burst >= 0 && burst <= 1;
      plus.current.position.set(MOUSE_X, 2.6 + Math.max(0, burst) * 0.8, rightLane * LANE);
    }
  });

  const question = QUESTIONS[q];
  const leftValue = rightLane === -1 ? question.right : question.wrong;
  const rightValue = rightLane === -1 ? question.wrong : question.right;

  return (
    <group ref={root} position={ISLANDS.atom}>
      <FloatingIsland radius={6.6} depth={4.5} />

      {/* Đường đất 2 làn + viền gỗ */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat(PALETTE.path, { rough: 0.95 })} receiveShadow>
        <planeGeometry args={[11.4, 2.6]} />
      </mesh>
      {[-1.38, 1.38].map((z) => (
        <mesh key={z} position={[0, 0.09, z]} material={mat(PALETTE.wood)}>
          <boxGeometry args={[11.4, 0.16, 0.16]} />
        </mesh>
      ))}
      <group ref={stripes}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[-5.6 + i * 1.4, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat("#f3d9a8")}>
            <planeGeometry args={[0.6, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* Cảnh rừng hai bên đường */}
      <PineTree position={[-4.2, 0, -3.2]} scale={1.15} />
      <PineTree position={[-2.2, 0, -4.1]} />
      <RoundTree position={[0.6, 0, -3.8]} tone={1} />
      <PineTree position={[3.4, 0, -3.4]} scale={0.95} />
      <RoundTree position={[-4.6, 0, 3.0]} tone={2} scale={0.9} />
      <PineTree position={[-1.6, 0, 3.6]} scale={0.8} />
      <Rock position={[4.6, 0, 2.6]} scale={1.2} />
      <Rock position={[1.5, 0, -2.1]} />
      <Flowers count={18} radius={6} inner={1.8} seed={3} />

      {near && (
        <>
          {/* Câu hỏi nổi phía trên đường (chỉ hiện khi đang xem đảo này) */}
          <Label
            text={`❓ Nguyên tử khối của ${question.name} (${question.sym})?`}
            position={[-0.6, 3.5, -1.2]}
            height={0.5}
            billboard
          />
          {/* Cổng 2 bệ đáp án */}
          <group ref={gate} position={[START_X, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <group position={[LANE, 0, 0]}>
              <AnswerGate value={leftValue} sym={question.sym} glow={rightLane === -1 ? glow : 0} />
            </group>
            <group position={[-LANE, 0, 0]}>
              <AnswerGate value={rightValue} sym={question.sym} glow={rightLane === 1 ? glow : 0} />
            </group>
          </group>

          {/* Chú chuột đội vương miện, kính râm, mặt nạ — như ảnh trong game */}
          <group ref={runner} position={[MOUSE_X, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <Mouse pose="run" accessories={["crown", "glasses", "mask"]} blobShadow={false} />
          </group>

          {/* Xu vàng bay lên */}
          <group ref={coins} visible={false}>
            {Array.from({ length: 7 }, (_, i) => (
              <mesh key={i} rotation={[Math.PI / 2, 0, 0]} material={mat(PALETTE.gold, { rough: 0.3, metal: 0.8, emissive: "#a86b00", emissiveIntensity: 0.4 })}>
                <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
              </mesh>
            ))}
          </group>
          <group ref={plus} visible={false}>
            <Label text="+1 ★  Đúng rồi!" height={0.5} billboard color="#ffffff" bg="#2e9a3c" border="#1f6a2a" />
          </group>
        </>
      )}
    </group>
  );
}
