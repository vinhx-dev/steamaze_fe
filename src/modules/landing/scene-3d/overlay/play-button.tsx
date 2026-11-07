"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth";

export interface PlayButtonProps {
  readonly text?: string;
  readonly className?: string;
  readonly size?: "normal" | "large" | "compact";
  /** Hiện mũi tên sau chữ (nút "Chơi ngay" không dùng) */
  readonly arrow?: boolean;
}

/** Nút chơi: đã đăng nhập → /lessons, chưa → /login?next=/lessons */
export function PlayButton({ text = "Chơi ngay", className = "", size = "normal", arrow = true }: PlayButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  return (
    <button
      type="button"
      onClick={() => router.push(isAuthenticated ? "/lessons" : "/login?next=%2Flessons")}
      className={`btn-play btn-play--${size} ${className}`.trim()}
    >
      <span>{text}</span>
      {arrow && (
        <span className="btn-play__arrow" aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
