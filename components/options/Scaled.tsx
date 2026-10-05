"use client";

import React, { useEffect, useRef, useState } from "react";

/** Renders a child at a fixed design width and scales it to fit the container (keeps templates proportional in small tiles). */
export function Scaled({ width = 640, children, className = "" }: { width?: number; children: React.ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const [h, setH] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = box.current;
    const kid = inner.current;
    if (!el || !kid) return;
    const update = () => {
      const scale = el.clientWidth / width;
      setK(scale);
      setH(kid.offsetHeight * scale);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    ro.observe(kid);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={box} className={`relative w-full ${className}`} style={{ height: h }}>
      <div ref={inner} className="absolute left-0 top-0 origin-top-left" style={{ width, transform: `scale(${k})` }}>
        {children}
      </div>
    </div>
  );
}
