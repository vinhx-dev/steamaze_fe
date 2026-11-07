"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

/**
 * Chữ trong cảnh 3D vẽ bằng canvas 2D với font Baloo 2 của trang (đủ dấu tiếng Việt, không tải font ngoài).
 */
function gameFontFamily() {
  if (typeof document === "undefined") return "sans-serif";
  const v = getComputedStyle(document.body).getPropertyValue("--font-game").trim();
  return v ? `${v}, "Baloo 2", system-ui, sans-serif` : `"Baloo 2", system-ui, sans-serif`;
}

let fontsReadyPromise: Promise<unknown> | null = null;
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    fontsReadyPromise ??= document.fonts?.ready ?? Promise.resolve();
    fontsReadyPromise.then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

export interface LabelStyle {
  color?: string;
  bg?: string;
  border?: string;
  size?: number; // cỡ chữ trên canvas (px)
  padX?: number;
  padY?: number;
  radius?: number;
  weight?: number;
}

const texCache = new Map<string, { tex: THREE.CanvasTexture; aspect: number }>();

function makeTexture(text: string, s: Required<LabelStyle>) {
  const key = JSON.stringify([text, s]);
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  const g = c.getContext("2d")!;
  const font = `${s.weight} ${s.size}px ${gameFontFamily()}`;
  g.font = font;
  const w = Math.ceil(g.measureText(text).width + s.padX * 2);
  const h = Math.ceil(s.size * 1.35 + s.padY * 2);
  c.width = w;
  c.height = h;
  g.font = font;
  if (s.bg !== "transparent") {
    g.fillStyle = s.bg;
    g.beginPath();
    g.roundRect(2, 2, w - 4, h - 4, s.radius);
    g.fill();
    if (s.border !== "transparent") {
      g.lineWidth = 4;
      g.strokeStyle = s.border;
      g.stroke();
    }
  }
  g.fillStyle = s.color;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2 + s.size * 0.06);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const out = { tex, aspect: w / h };
  texCache.set(key, out);
  return out;
}

export interface LabelProps extends LabelStyle {
  text: string;
  height?: number; // chiều cao trong thế giới 3D
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** true: luôn quay về phía camera */
  billboard?: boolean;
  opacity?: number;
}

export function Label({
  text,
  height = 0.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  billboard = false,
  opacity = 1,
  color = "#3b2214",
  bg = "#fff6e6",
  border = "#5a3824",
  size = 64,
  padX = 28,
  padY = 10,
  radius = 22,
  weight = 800,
}: LabelProps) {
  const ready = useFontsReady();
  const data = useMemo(
    () => (ready ? makeTexture(text, { color, bg, border, size, padX, padY, radius, weight }) : null),
    [ready, text, color, bg, border, size, padX, padY, radius, weight],
  );
  if (!data) return null;
  const w = height * data.aspect;
  if (billboard) {
    return (
      <sprite position={position} scale={[w, height, 1]}>
        <spriteMaterial map={data.tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
      </sprite>
    );
  }
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[w, height]} />
      <meshBasicMaterial map={data.tex} transparent opacity={opacity} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}
