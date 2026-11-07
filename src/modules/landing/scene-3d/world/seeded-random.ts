/**
 * Hàm sinh số ngẫu nhiên có seed (Mulberry32)
 * Đảm bảo các cây cối, địa hình, mây sinh ra nhất quán giữa các lần render.
 */
export function createSeededRandom(seed = 123456789) {
  let s = seed;
  return function random() {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

