"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const GRAD = "linear-gradient(90deg,#00C6FF 0%,#3B82F6 28%,#8B5CF6 55%,#EC4899 80%,#FF6B6B 100%)";

/** A huge outlined name; the gradient fills it in left to right when it scrolls into view. */
export function Wordmark({ text }: { text: string }) {
  // Watch the container: the clipped fill itself never counts as "in view".
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div
      ref={ref}
      aria-label={text}
      className="relative w-full text-center whitespace-nowrap font-grotesk font-bold uppercase tracking-[-0.04em] leading-[1] text-[clamp(1.5rem,7.6vw,6rem)] select-none"
    >
      <span aria-hidden className="block text-transparent [-webkit-text-stroke:1.2px_rgba(148,163,199,0.35)]">
        {text}
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        initial={{ clipPath: "inset(-10% 100% -10% 0)" }}
        animate={inView ? { clipPath: "inset(-10% -2% -10% 0)" } : undefined}
        transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
      >
        <span className="block bg-clip-text text-transparent" style={{ backgroundImage: GRAD }}>
          {text}
        </span>
      </motion.span>
    </div>
  );
}
