import * as THREE from "three";

/** Vị trí các đảo nổi (mặt cỏ của mỗi đảo nằm ở đúng độ cao y này) */
export const ISLANDS = {
  home: new THREE.Vector3(0, 0, 0),
  atom: new THREE.Vector3(-19, 1.5, -15),
  durian: new THREE.Vector3(19, 2.5, -17),
  mirror: new THREE.Vector3(0, 4, -33),
} as const;

export type Framing = "side" | "center";

export interface CameraStop {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
  readonly progress: number;
  readonly position: THREE.Vector3;
  readonly lookAt: THREE.Vector3;
  /** side: chữ bên trái, cảnh lệch sang phải; center: chữ ở giữa */
  readonly framing: Framing;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const H = ISLANDS.home, A = ISLANDS.atom, D = ISLANDS.durian, M = ISLANDS.mirror;

const RAW: Omit<CameraStop, "progress">[] = [
  { id: "tong-quan", name: "Đảo phiêu lưu", subtitle: "Whisker chào bạn", position: v(0, 4.2, 12.5), lookAt: v(0, 1.6, 0), framing: "side" },
  { id: "hoa-hoc", name: "Con đường hoá học", subtitle: "Trò chơi 01", position: A.clone().add(v(7.5, 4.4, 8.5)), lookAt: A.clone().add(v(1.4, 1.1, -0.6)), framing: "side" },
  { id: "vat-ly", name: "Cơn mưa sầu riêng", subtitle: "Trò chơi 02", position: D.clone().add(v(0, 3.6, 12.5)), lookAt: D.clone().add(v(0, 3, 0)), framing: "side" },
  { id: "quang-hoc", name: "Cao thủ cân gương", subtitle: "Trò chơi 03", position: M.clone().add(v(0, 10.5, 9.5)), lookAt: M.clone().add(v(0, 0.5, -0.5)), framing: "side" },
  { id: "tu-do", name: "Tủ đồ", subtitle: "Nhận quà, mặc đồ", position: H.clone().add(v(7.2, 3.2, 7.6)), lookAt: H.clone().add(v(2.4, 1.1, 1.1)), framing: "side" },
  { id: "cong-dong", name: "Bạn bè & thầy cô", subtitle: "Học cùng nhau", position: H.clone().add(v(-8, 7, 10)), lookAt: H.clone().add(v(0, 0.6, 0)), framing: "side" },
  { id: "dich-den", name: "Đích đến", subtitle: "Sẵn sàng phiêu lưu", position: v(0, 15, 27), lookAt: v(0, 2, -15), framing: "center" },
];

export const CAMERA_STOPS: readonly CameraStop[] = RAW.map((s, i) => ({ ...s, progress: i / (RAW.length - 1) }));

const SEGMENTS = CAMERA_STOPS.length - 1;
const posCurve = new THREE.CatmullRomCurve3(CAMERA_STOPS.map((s) => s.position), false, "centripetal");
const lookCurve = new THREE.CatmullRomCurve3(CAMERA_STOPS.map((s) => s.lookAt), false, "centripetal");

/** Nội suy mượt có "chỗ dừng": camera đứng yên quanh mỗi chặng rồi mới bay tiếp */
export function dwell(p: number) {
  const u = Math.max(0, Math.min(1, p)) * SEGMENTS;
  const i = Math.min(Math.floor(u), SEGMENTS - 1);
  const f = u - i;
  const x = Math.max(0, Math.min(1, (f - 0.22) / 0.56));
  const eased = x * x * x * (x * (x * 6 - 15) + 10); // smootherstep
  return (i + eased) / SEGMENTS;
}

export function getCameraPoseAt(p: number, pos: THREE.Vector3, look: THREE.Vector3) {
  const t = dwell(p);
  posCurve.getPoint(t, pos);
  lookCurve.getPoint(t, look);
}

/** Mức "lệch khung" 0..1 tại tiến độ p (1 = chữ bên trái, cảnh lệch phải) */
export function framingAt(p: number) {
  const t = dwell(p) * SEGMENTS;
  const i = Math.min(Math.floor(t), SEGMENTS - 1);
  const f = t - i;
  const a = CAMERA_STOPS[i].framing === "side" ? 1 : 0;
  const b = CAMERA_STOPS[i + 1].framing === "side" ? 1 : 0;
  return a + (b - a) * f;
}

/** Khu có đang ở gần camera không (để bật hoạt cảnh / hiển thị) */
export function nearStop(p: number, index: number, range = 0.11) {
  return Math.abs(p - CAMERA_STOPS[index].progress) <= range;
}
