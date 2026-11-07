"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { framingAt, getCameraPoseAt } from "../data/stops";
import { scrollStore } from "../store/scroll-store";

/**
 * Camera bay theo tiến độ cuộn (đọc từ scrollStore, không qua React state) + làm mượt.
 * Lệch khung hình để cảnh không bị chữ che: máy tính chữ bên trái → cảnh lệch phải; điện thoại chữ ở dưới → cảnh lệch lên.
 */
export function CameraRig() {
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const curLook = useRef(new THREE.Vector3());
  const parallax = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const ready = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      parallax.current.x = (e.clientX / window.innerWidth - 0.5) * 0.7;
      parallax.current.y = (0.5 - e.clientY / window.innerHeight) * 0.4;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const { camera, size } = state;
    const dt = Math.min(delta, 0.05);
    const p = scrollStore.progress;
    getCameraPoseAt(p, target.current, look.current);
    // Màn hình dọc (điện thoại): lùi camera + mở rộng góc nhìn để cảnh không bị cắt mép
    const cam = camera as THREE.PerspectiveCamera;
    const portrait = size.width / size.height < 0.9;
    if (portrait) target.current.sub(look.current).multiplyScalar(1.3).add(look.current);
    const fov = portrait ? 56 : 42;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    target.current.x += parallax.current.x;
    target.current.y += parallax.current.y;

    if (!ready.current) {
      camera.position.copy(target.current);
      curLook.current.copy(look.current);
      ready.current = true;
    }
    const k = 1 - Math.exp(-3.2 * dt);
    camera.position.lerp(target.current, k);
    curLook.current.lerp(look.current, k);
    camera.lookAt(curLook.current);

    // Lệch khung hình mượt theo chặng
    frame.current = THREE.MathUtils.lerp(frame.current, framingAt(p), k);
    const w = size.width;
    const h = size.height;
    if (w >= 900) cam.setViewOffset(w, h, -w * 0.17 * frame.current, 0, w, h);
    else cam.setViewOffset(w, h, 0, h * 0.2 * frame.current, w, h);
  });

  return null;
}
