"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraRig } from "./camera-rig";
import { QualityMonitor, type QualityTier } from "./quality";
import { SkyDome, Clouds } from "../world/sky";
import { IslandHome } from "../world/island-home";
import { IslandAtom } from "../world/island-atom";
import { IslandDurian } from "../world/island-durian";
import { IslandMirror } from "../world/island-mirror";
import { getCameraPoseAt } from "../data/stops";
import { scrollStore } from "../store/scroll-store";

const SUN_DAY = new THREE.Color("#fff3dc");
const SUN_DUSK = new THREE.Color("#ffa060");
const HEMI_DAY = new THREE.Color("#d6ecff");
const HEMI_DUSK = new THREE.Color("#ffc29a");

/**
 * Ánh sáng: trời + mặt trời. Mặt trời đi theo khu camera đang nhìn để vùng đổ bóng luôn gọn và sắc nét.
 * Cuối trang chuyển dần sang hoàng hôn.
 */
function Lights({ shadows }: { shadows: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    if (sun.current) scene.add(sun.current.target);
  }, [scene]);

  useFrame(() => {
    const p = scrollStore.progress;
    getCameraPoseAt(p, pos.current, look.current);
    const dusk = THREE.MathUtils.smoothstep(p, 0.86, 1);
    if (sun.current) {
      sun.current.position.copy(look.current).add(new THREE.Vector3(8, 14, 7));
      sun.current.target.position.copy(look.current);
      sun.current.color.copy(SUN_DAY).lerp(SUN_DUSK, dusk);
      sun.current.intensity = THREE.MathUtils.lerp(2.6, 2.0, dusk);
      // chặng cuối nhìn rộng cả 4 đảo: nới vùng bóng
      const cam = sun.current.shadow.camera;
      const half = p > 0.9 ? 30 : 11;
      if (cam.right !== half) {
        cam.left = -half;
        cam.right = half;
        cam.top = half;
        cam.bottom = -half;
        cam.updateProjectionMatrix();
      }
    }
    if (hemi.current) hemi.current.color.copy(HEMI_DAY).lerp(HEMI_DUSK, dusk);
  });

  return (
    <>
      <hemisphereLight ref={hemi} color={HEMI_DAY} groundColor="#6a9f4a" intensity={1.25} />
      <ambientLight intensity={0.25} />
      <directionalLight
        ref={sun}
        intensity={2.6}
        color={SUN_DAY}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={4}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
    </>
  );
}

export interface LandingCanvasProps {
  onReady?: () => void;
}

export default function LandingCanvas({ onReady }: LandingCanvasProps) {
  const [quality, setQuality] = useState<QualityTier>(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches ? "medium" : "high",
  );
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const shadows = quality === "high";

  return (
    <div className="landing-3d__canvas-wrap" aria-hidden="true">
      <Canvas
        shadows={shadows ? ("percentage" as const) : false}
        camera={{ fov: 42, near: 0.1, far: 400, position: [0, 4.2, 12.5] }}
        dpr={quality === "high" ? [1, 2] : quality === "medium" ? [1, 1.5] : 1}
        gl={{ antialias: quality !== "low", powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.05 }}
        frameloop={hidden ? "never" : "always"}
        onCreated={() => onReady?.()}
      >
        <fog attach="fog" args={["#cfe9f7", 38, 130]} />
        <SkyDome />
        <Clouds count={quality === "low" ? 8 : 16} />
        <Lights shadows={shadows} />

        <IslandHome />
        <IslandAtom />
        <IslandDurian />
        <IslandMirror />

        <CameraRig />
        <QualityMonitor onQualityChange={setQuality} />
      </Canvas>
    </div>
  );
}
