"use client";

import type { FC } from "react";
import "./brand-logo.scss";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "responsive";
}

// Chữ STEAMaze đúng định dạng (STEAM viết hoa, aze viết thường), xếp thẳng hàng
const LOGO_LETTERS = ["S", "T", "E", "A", "M", "a", "z", "e"];

export const BrandLogo: FC<BrandLogoProps> = ({
  className = "",
  size = "responsive",
}) => {
  return (
    <span
      className={`brand-logo brand-logo--${size} ${className}`.trim()}
      aria-label="STEAMaze"
      role="img"
    >
      <span className="brand-logo__wrapper" aria-hidden="true">
        {LOGO_LETTERS.map((char, index) => (
          <span key={index} className={`brand-logo__letter brand-logo__letter--${index >= 5 ? "lower" : "upper"}`}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
};
