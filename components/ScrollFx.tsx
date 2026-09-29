"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

/** Thin gradient bar across the top of the viewport tracking page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[70] bg-gradient-to-r from-accent via-neon to-accent-soft shadow-[0_0_12px_rgba(34,211,238,0.6)]"
    />
  );
}

/** Floating back-to-top button with a circular progress ring. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const dash = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => scrollY.on("change", (v) => setVisible(v > 700)), [scrollY]);

  const goTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={goTop}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[65] w-12 h-12 rounded-full glass flex items-center justify-center text-bone hover:text-accent-soft transition-colors"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(148,163,199,0.15)" strokeWidth="1.5" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="url(#btt-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength: dash }}
            />
            <defs>
              <linearGradient id="btt-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="w-4 h-4 relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * Desktop-only pointer layer: a large soft glow that trails the cursor
 * behind the content, plus a small ring that eases after it and swells
 * over anything clickable. Native cursor stays — this only decorates it.
 */
export function CursorFx() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [shown, setShown] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 500, damping: 36, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 500, damping: 36, mass: 0.5 });
  const glowX = useSpring(x, { stiffness: 80, damping: 22 });
  const glowY = useSpring(y, { stiffness: 80, damping: 22 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
      const t = e.target as HTMLElement | null;
      setHovering(Boolean(t?.closest("a, button, [role='button'], input, textarea")));
    };
    const onLeave = () => setShown(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY, opacity: shown ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-0 -ml-[300px] -mt-[300px] w-[600px] h-[600px] rounded-full transition-opacity duration-500"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.09),transparent_60%)]" />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed top-0 left-0 z-[99]"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.9 : 1,
            opacity: shown ? 1 : 0,
            backgroundColor: hovering ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0)",
            borderColor: hovering ? "rgba(96,165,250,0.7)" : "rgba(242,244,248,0.35)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="-ml-4 -mt-4 w-8 h-8 rounded-full border"
        />
      </motion.div>
    </>
  );
}
