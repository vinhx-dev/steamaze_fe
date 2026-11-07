"use client";

import { PlayButton } from "./play-button";

export interface FixedCtaProps {
  visible: boolean;
  onToggleSkip3D: () => void;
  userSkipped: boolean;
}

export function FixedCta({ visible, onToggleSkip3D, userSkipped }: FixedCtaProps) {
  return (
    <aside className={`fixed-cta${visible ? " is-visible" : ""}`} aria-label="Hành động nhanh" aria-hidden={!visible}>
      <button type="button" onClick={onToggleSkip3D} className="fixed-cta__skip" tabIndex={visible ? 0 : -1}>
        {userSkipped ? "Bật hoạt cảnh 3D" : "Bỏ qua hoạt cảnh"}
      </button>
      <PlayButton size="compact" text="Chơi ngay" arrow={false} />
    </aside>
  );
}
