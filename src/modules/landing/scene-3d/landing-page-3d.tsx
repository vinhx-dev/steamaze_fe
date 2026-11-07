"use client";

import { useCanRender3D } from "./hooks/use-can-render-3d";
import { useScrollProgress } from "./hooks/use-scroll-progress";
import { Scene3DLoader } from "./scene-3d-loader";
import { OverlaySections } from "./overlay/overlay-sections";
import { ProgressTrail } from "./overlay/progress-trail";
import { FixedCta } from "./overlay/fixed-cta";
import { StaticBackdrop } from "./overlay/static-backdrop";
import "./landing-3d.scss";

export function LandingPage3D() {
  const { activeStopIndex, pastHero, scrollToStop } = useScrollProgress();
  const { canRender3D, userSkipped, toggleSkip3D } = useCanRender3D();

  return (
    <div className="landing-3d">
      {canRender3D ? <Scene3DLoader /> : <StaticBackdrop active={activeStopIndex} />}

      {/* Lớp phủ tối mờ giúp chữ trắng luôn đọc rõ trên cảnh (không dùng hộp chữ) */}
      <div className={`landing-3d__scrim${activeStopIndex === 6 ? " is-center" : ""}`} aria-hidden="true" />

      <OverlaySections activeStopIndex={activeStopIndex} onGoTo={scrollToStop} />
      <ProgressTrail activeIndex={activeStopIndex} onSelectStop={scrollToStop} />
      <FixedCta visible={pastHero && activeStopIndex < 6} onToggleSkip3D={toggleSkip3D} userSkipped={userSkipped} />
    </div>
  );
}
