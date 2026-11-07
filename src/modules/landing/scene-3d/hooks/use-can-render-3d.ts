"use client";

import { useCallback, useSyncExternalStore } from "react";

const SKIP_3D_KEY = "steamaze_skip_3d";

// Kết quả kiểm tra WebGL chỉ tính MỘT lần (trước đây mỗi lần render lại tạo một WebGL context mới -> rò bộ nhớ GPU)
let webglSupported: boolean | null = null;
function hasWebGL(): boolean {
  if (webglSupported !== null) return webglSupported;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglSupported = !!gl;
    // Giải phóng context thử ngay
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

function readSkipped(): boolean {
  try {
    return localStorage.getItem(SKIP_3D_KEY) === "true";
  } catch {
    return false;
  }
}

function readCanRender(): boolean {
  if (typeof window === "undefined") return false;
  if (readSkipped()) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  return hasWebGL();
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
    mql.removeEventListener("change", cb);
  };
}

export function useCanRender3D() {
  const canRender3D = useSyncExternalStore(subscribe, readCanRender, () => false);
  const userSkipped = useSyncExternalStore(subscribe, readSkipped, () => false);

  const toggleSkip3D = useCallback(() => {
    try {
      localStorage.setItem(SKIP_3D_KEY, String(!readSkipped()));
    } catch {
      // Không lưu được thì thôi, chỉ không nhớ lựa chọn
    }
    listeners.forEach((l) => l());
  }, []);

  return { canRender3D, userSkipped, toggleSkip3D };
}
