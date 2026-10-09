"use client";

import React from "react";
import { motion } from "framer-motion";

const CHROME =
  "linear-gradient(180deg,#ffffff 0%,#eef1f7 18%,#b7bfcd 40%,#3a4153 49%,#1d2230 51%,#c9d1de 56%,#ffffff 66%,#98a2b6 84%,#e9edf4 100%)";

/** The name in polished liquid chrome: a light glint slides across, with a faint reflection below. */
export function Wordmark({ text }: { text: string }) {
  const upper = text.toUpperCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      aria-label={text}
      className="relative w-full text-center whitespace-nowrap uppercase leading-[1.05] tracking-[-0.02em] text-[clamp(1.2rem,5.4vw,4.6rem)] select-none [font-family:'Unbounded_Variable',sans-serif] font-extrabold"
    >
      {/* depth */}
      <span aria-hidden className="absolute inset-0 translate-y-[0.07em] text-[#05070c] [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]">
        {upper}
      </span>
      <span aria-hidden className="relative bg-clip-text text-transparent" style={{ backgroundImage: CHROME }}>
        {upper}
      </span>
      {/* travelling glint */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.95) 50%,transparent 60%)", backgroundSize: "250% 100%", backgroundRepeat: "no-repeat" }}
        animate={{ backgroundPosition: ["130% 0", "-30% 0"] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
      >
        {upper}
      </motion.span>
      {/* reflection */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-full -mt-[0.08em] block scale-y-[-1] opacity-[0.16] bg-clip-text text-transparent [mask-image:linear-gradient(to_top,#000,transparent_65%)]"
        style={{ backgroundImage: CHROME }}
      >
        {upper}
      </span>
    </motion.div>
  );
}
