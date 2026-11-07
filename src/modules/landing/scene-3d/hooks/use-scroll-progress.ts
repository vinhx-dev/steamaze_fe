"use client";

import { useCallback, useEffect, useState } from "react";
import { CAMERA_STOPS } from "../data/stops";
import { scrollStore } from "../store/scroll-store";

const LAST = CAMERA_STOPS.length - 1;

/** Vị trí đỉnh của từng chặng chữ (.stage) trên trang */
function stageTops(): number[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".stages > .stage")).map(
    (el) => el.getBoundingClientRect().top + window.scrollY,
  );
}

/**
 * Tiến độ 0..1 tính theo VỊ TRÍ THẬT của các chặng (chân trang không làm lệch),
 * nên camera luôn dừng đúng lúc chữ của chặng đó nằm giữa màn hình.
 * Ghi vào scrollStore cho cảnh 3D; state React chỉ đổi khi sang chặng khác.
 */
export function useScrollProgress() {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let frame = 0;
    let tops = stageTops();
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let p = 1;
      if (tops.length > LAST) {
        p = 0;
        for (let i = 0; i < LAST; i++) {
          if (y >= tops[i + 1]) continue;
          p = (i + Math.max(0, (y - tops[i]) / (tops[i + 1] - tops[i]))) / LAST;
          break;
        }
        if (y >= tops[LAST]) p = 1;
      }
      scrollStore.set(p);
      setActiveStopIndex(Math.round(p * LAST));
      setPastHero(p > 0.08);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      tops = stageTops();
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToStop = useCallback((index: number) => {
    const top = stageTops()[index];
    if (top !== undefined) window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return { activeStopIndex, pastHero, scrollToStop };
}
