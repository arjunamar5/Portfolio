"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const CURTAIN = [0.76, 0, 0.24, 1] as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const HOLD_MS = 1500;

/**
 * Short intro: monogram and name rise in while a hairline fills, then the
 * whole panel lifts away like a curtain. `onReveal` fires as the curtain
 * starts moving so the hero can animate in underneath it.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raf = requestAnimationFrame(() => (window as any).__lenis?.stop());
    const t = setTimeout(() => {
      setShow(false);
      (window as any).__lenis?.start();
      onReveal();
    }, reduce ? 150 : HOLD_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [onReveal]);

  const name = PORTFOLIO_DATA.personal.name;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: CURTAIN }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
          className="preloader fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center"
        >
          <div className="pointer-events-none absolute inset-0 bg-glow-accent" />
          <div className="relative flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: EASE }}
                className="text-5xl sm:text-6xl font-semibold tracking-tight text-gradient"
              >
                AA
              </motion.div>
            </div>
            <div className="overflow-hidden mt-3">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
                className="font-mono text-[11px] tracking-[0.3em] uppercase text-dim"
              >
                {name}
              </motion.div>
            </div>
            <div className="mt-6 w-40 h-px bg-line overflow-hidden rounded-full">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000 - 0.1, ease: [0.65, 0, 0.35, 1] }}
                className="h-full bg-gradient-to-r from-accent to-neon origin-left"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
