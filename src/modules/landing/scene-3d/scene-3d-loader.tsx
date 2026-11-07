"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const LandingCanvas = dynamic(() => import("./canvas/landing-canvas"), { ssr: false });

/**
 * Hiện ảnh poster ngay, tải cảnh 3D ngầm; cảnh dựng xong thì poster mờ dần.
 */
export function Scene3DLoader() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <LandingCanvas onReady={() => setReady(true)} />
      <div className={`landing-3d__poster${ready ? " is-hidden" : ""}`} aria-hidden="true" />
    </>
  );
}
