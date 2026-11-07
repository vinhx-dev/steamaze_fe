import * as THREE from "three";

/**
 * Bảng màu + vật liệu dùng chung. Tạo MỘT lần, mọi mesh dùng lại.
 * Dùng MeshStandardMaterial bề mặt mịn (không flatShading) để nhân vật và đồ vật trông như đồ chơi bóng mịn.
 */
export const PALETTE = {
  // Chú chuột
  fur: "#f0ad62",
  furShade: "#e09a52",
  belly: "#fde7c8",
  innerEar: "#f6a5ad",
  nose: "#e96b7a",
  eye: "#1a1512",
  cheek: "#ff9aa6",
  hat: "#8a6a3a",
  hatBand: "#5a3824",
  backpack: "#7a5230",
  // Bạn bè chuột
  furGrey: "#c3c8cc",
  furBrown: "#b97a57",
  furWhite: "#f4f2ee",
  furCaramel: "#d9853b",
  // Thiên nhiên
  grass: "#7cc243",
  grassDark: "#5ea94a",
  dirt: "#c98f55",
  dirtDark: "#8a5a32",
  path: "#e2bd85",
  rock: "#9c9488",
  rockDark: "#7a7368",
  trunk: "#7a4c24",
  leaf: "#5fae3a",
  leafLight: "#8fcf4f",
  leafDark: "#3f8a2a",
  flowerA: "#ffffff",
  flowerB: "#ffd34d",
  flowerC: "#ff8fb1",
  // Đồ vật
  wood: "#9a6533",
  woodDark: "#5a3824",
  gold: "#f5c542",
  ruby: "#d93829",
  red: "#e2532f",
  white: "#ffffff",
  black: "#15181c",
  // Môn học
  chem: "#2e9a3c",
  phys: "#e3792c",
  optic: "#3d7be0",
  // Đền + gương + laser
  roof: "#2bb0a0",
  pillar: "#c0392b",
  stoneTile: "#d9d2c3",
  mirror: "#d8f0ff",
  laser: "#4aa3ff",
  robot: "#9aa5ad",
  // Sầu riêng
  durian: "#9cc444",
  durianDark: "#6f9a2e",
} as const;

const cache = new Map<string, THREE.MeshStandardMaterial>();

/** Lấy vật liệu mịn theo màu (dùng chung, không tạo trùng) */
export function mat(color: string, opts: { rough?: number; metal?: number; emissive?: string; emissiveIntensity?: number } = {}) {
  const key = `${color}|${opts.rough ?? 0.7}|${opts.metal ?? 0}|${opts.emissive ?? ""}|${opts.emissiveIntensity ?? 0}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.rough ?? 0.7,
      metalness: opts.metal ?? 0,
      emissive: opts.emissive ?? "#000000",
      emissiveIntensity: opts.emissiveIntensity ?? 0,
    });
    cache.set(key, m);
  }
  return m;
}

// Vật liệu đặc biệt
export const glowMaterial = (color: string) =>
  new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 1 });

export const blobShadowMaterial = new THREE.MeshBasicMaterial({
  color: "#000000",
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
});

export const mirrorMaterial = new THREE.MeshStandardMaterial({
  color: PALETTE.mirror,
  roughness: 0.08,
  metalness: 0.9,
  emissive: "#9fd4ff",
  emissiveIntensity: 0.25,
});

export const waterMaterial = new THREE.MeshStandardMaterial({
  color: "#5cc0ee",
  roughness: 0.25,
  metalness: 0.1,
  transparent: true,
  opacity: 0.9,
});

/** Bật đổ bóng + nhận bóng cho cả nhóm mesh (gọi một lần sau khi dựng) */
export function enableShadows(root: THREE.Object3D, cast = true, receive = true) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && m.material !== blobShadowMaterial) {
      m.castShadow = cast;
      m.receiveShadow = receive;
    }
  });
}
