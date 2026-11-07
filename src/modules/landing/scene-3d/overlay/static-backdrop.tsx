"use client";

import type { CSSProperties } from "react";
import { CAMERA_STOPS } from "../data/stops";

/**
 * Nền tĩnh khi bỏ qua hoạt cảnh / máy không chạy 3D:
 * mỗi chặng một ảnh chụp sẵn từ cảnh 3D (bản máy tính + bản điện thoại khung dọc), chuyển mờ dần theo chặng đang xem.
 */
export function StaticBackdrop({ active }: { active: number }) {
  return (
    <div className="static-backdrop" aria-hidden="true">
      {CAMERA_STOPS.map((stop, i) => (
        <div
          key={stop.id}
          className={`static-backdrop__layer${i === active ? " is-active" : ""}`}
          style={
            {
              "--bg-pc": `url("/images/landing/static/pc-${i}.webp")`,
              "--bg-mb": `url("/images/landing/static/mb-${i}.webp")`,
            } as CSSProperties
          }
        />
      ))}
      <div className="static-backdrop__vignette" />
    </div>
  );
}
