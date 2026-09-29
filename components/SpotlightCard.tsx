"use client";

import React, { useRef } from "react";

/**
 * Card whose surface and border light up around the cursor. The glow is
 * pure CSS (see `.spotlight` in globals.css) — this only feeds it the
 * pointer position, so there are no re-renders on mouse move.
 */
export function SpotlightCard({
  children,
  className = "",
  rgb = "59, 130, 246",
  as: Tag = "div",
  style,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  /** Glow colour as an "r, g, b" triplet. */
  rgb?: string;
  as?: "div" | "article" | "li";
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      {...rest}
      ref={ref as any}
      onMouseMove={onMove}
      className={`spotlight ${className}`}
      style={{ ["--spot" as any]: rgb, ...style }}
    >
      {children}
    </Tag>
  );
}

/** "#RRGGBB" → "r, g, b" for SpotlightCard's `rgb` prop. */
export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
