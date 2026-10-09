"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.65, 0, 0.35, 1] as const;

/** A handwritten "Arjun" that writes itself left to right, then gets a flourish underneath. */
export function Signature({ font = "font-hand font-semibold", size = "text-[4.5rem] sm:text-[6rem]", lh = "leading-[1.1]", text = "Arjun", underline = true }: { font?: string; size?: string; lh?: string; text?: string; underline?: boolean } = {}) {
  // Watch the container: the clipped text itself never counts as "in view".
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className="relative inline-block select-none" aria-label={`${text}, handwritten signature`}>
      <motion.span
        aria-hidden
        className="block -rotate-[4deg] [filter:drop-shadow(0_0_18px_rgba(139,92,246,0.35))]"
        initial={{ clipPath: "inset(-30% 100% -30% -5%)" }}
        animate={inView ? { clipPath: "inset(-30% -5% -30% -5%)" } : undefined}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <span className={`block whitespace-nowrap ${font} ${lh} ${size} px-3 bg-[linear-gradient(90deg,#00C6FF_0%,#3B82F6_28%,#8B5CF6_55%,#EC4899_80%,#FF6B6B_100%)] bg-clip-text text-transparent`}>
          {text}
        </span>
      </motion.span>
      {/* flourish */}
      {underline && (
      <svg viewBox="0 0 260 40" className="absolute left-[4%] -bottom-4 sm:-bottom-5 w-[95%] h-8 overflow-visible -rotate-[4deg]" aria-hidden>
        <defs>
          <linearGradient id="sig-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="58%" stopColor="#8B5CF6" />
            <stop offset="82%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
        </defs>
        <motion.path
          d="M4 26 C 60 34, 120 30, 170 20 S 245 6, 256 16"
          fill="none"
          stroke="url(#sig-grad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        />
      </svg>
      )}
    </div>
  );
}
