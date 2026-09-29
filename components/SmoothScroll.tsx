"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose for components that need to hook scroll (e.g. anchor nav)
    (window as any).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);

  // reducedMotion="user": Framer skips transform/layout animation for visitors who ask for less motion.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
