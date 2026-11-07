"use client";

import { useSyncExternalStore } from "react";
import { nearStop } from "../data/stops";
import { scrollStore } from "../store/scroll-store";

/**
 * true khi camera đang ở gần chặng index (hoặc gần một trong các chặng truyền vào).
 * Chỉ làm React vẽ lại khi giá trị true/false đổi, không phải mỗi lần cuộn.
 */
export function useNear(indexes: number | readonly number[], range = 0.13) {
  const list = typeof indexes === "number" ? [indexes] : indexes;
  return useSyncExternalStore(
    scrollStore.subscribe,
    () => list.some((i) => nearStop(scrollStore.progress, i, range)),
    () => list.includes(0),
  );
}
