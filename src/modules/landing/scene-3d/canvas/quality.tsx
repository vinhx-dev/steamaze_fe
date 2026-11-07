"use client";

import { PerformanceMonitor } from "@react-three/drei";

export type QualityTier = "high" | "medium" | "low";

/** Tự hạ chất lượng khi máy không giữ được tốc độ khung hình (chỉ hạ, không nâng lại để tránh nhấp nháy) */
export function QualityMonitor({ onQualityChange }: { onQualityChange: (t: QualityTier) => void }) {
  return (
    <PerformanceMonitor
      flipflops={2}
      onDecline={({ factor }) => onQualityChange(factor < 0.35 ? "low" : "medium")}
      onFallback={() => onQualityChange("low")}
    />
  );
}
