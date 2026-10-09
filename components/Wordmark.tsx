"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CHROME =
  "linear-gradient(180deg,#ffffff 0%,#eef1f7 18%,#b7bfcd 40%,#3a4153 49%,#1d2230 51%,#c9d1de 56%,#ffffff 66%,#98a2b6 84%,#e9edf4 100%)";
const EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER = 0.06;
const FLY = 1.1;

// Deterministic pseudo-random so server and client render the same scatter.
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Six triangular shards around a slightly off-centre point, oversized so glyph overhangs are never cut. */
function shards(i: number) {
  const cx = 38 + rnd(i) * 24, cy = 35 + rnd(i + 0.5) * 30;
  const tm = 35 + rnd(i + 0.7) * 30, bm = 35 + rnd(i + 0.9) * 30;
  const c = `${cx}% ${cy}%`;
  return [
    `-30% -30%, ${tm}% -30%, ${c}`,
    `${tm}% -30%, 130% -30%, ${c}`,
    `130% -30%, 130% 130%, ${c}`,
    `130% 130%, ${bm}% 130%, ${c}`,
    `${bm}% 130%, -30% 130%, ${c}`,
    `-30% 130%, -30% -30%, ${c}`,
  ].map((p) => `polygon(${p})`);
}

function Letter({ ch, i, go }: { ch: string; i: number; go: boolean }) {
  if (ch === " ") return <span className="inline-block">&nbsp;</span>;
  const delay = i * STAGGER;
  return (
    <span className="relative inline-block">
      {/* reserves the glyph's space */}
      <span className="text-transparent">{ch}</span>
      {shards(i).map((clip, k) => {
        const s = i * 10 + k;
        const dir = rnd(s + 0.3) > 0.5 ? 1 : -1;
        return (
          <motion.span
            key={k}
            aria-hidden
            className="absolute inset-0 bg-clip-text text-transparent"
            style={{ backgroundImage: CHROME, clipPath: clip }}
            initial={{
              x: `${dir * (0.4 + rnd(s + 0.1) * 1.2)}em`,
              y: `${(rnd(s + 0.2) - 0.5) * 2.2}em`,
              rotate: (rnd(s + 0.4) - 0.5) * 220,
              scale: 0.5 + rnd(s + 0.6) * 0.4,
              opacity: 0,
            }}
            animate={go ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 } : undefined}
            transition={{ duration: FLY, delay: delay + rnd(s + 0.8) * 0.18, ease: EASE, opacity: { duration: 0.35, delay: delay + rnd(s + 0.8) * 0.18 } }}
          >
            {ch}
          </motion.span>
        );
      })}
      {/* once locked, a solid letter covers the seams between shards */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-clip-text text-transparent"
        style={{ backgroundImage: CHROME }}
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : undefined}
        transition={{ duration: 0.25, delay: delay + 0.18 + FLY * 0.75 }}
      >
        {ch}
      </motion.span>
      {/* spark where the pieces meet */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[1.1em] h-[1.1em] -ml-[0.55em] -mt-[0.55em] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(190,215,255,0.45) 25%, transparent 62%)" }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={go ? { opacity: [0, 1, 0], scale: [0.3, 1.25, 1.6] } : undefined}
        transition={{ duration: 0.5, delay: delay + FLY * 0.62, ease: "easeOut" }}
      />
    </span>
  );
}

/** The name in liquid chrome. Each letter flies in as metal shards that click together with a spark,
 *  then a light glint sweeps across and a faint reflection settles below. */
export function Wordmark({ text }: { text: string }) {
  const upper = text.toUpperCase();
  const ref = useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, amount: 0.6 });
  const settled = (upper.length - 1) * STAGGER + FLY + 0.2;
  return (
    <div
      ref={ref}
      aria-label={text}
      className="relative w-full text-center whitespace-nowrap uppercase leading-[1.05] tracking-[-0.02em] text-[clamp(1.2rem,5.4vw,4.6rem)] select-none [font-family:'Unbounded_Variable',sans-serif] font-extrabold"
    >
      {/* depth + reflection appear once the letters have landed */}
      <motion.span
        aria-hidden
        className="absolute inset-0 translate-y-[0.07em] text-[#05070c] [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : undefined}
        transition={{ duration: 0.6, delay: settled - 0.4 }}
      >
        {upper}
      </motion.span>
      <span aria-hidden className="relative">
        {upper.split("").map((ch, i) => (
          <Letter key={i} ch={ch} i={i} go={go} />
        ))}
      </span>
      {/* travelling glint, first pass right as the name locks together */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-clip-text text-transparent"
        style={{ backgroundImage: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.95) 50%,transparent 60%)", backgroundSize: "250% 100%", backgroundRepeat: "no-repeat", backgroundPosition: "130% 0" }}
        animate={go ? { backgroundPosition: ["130% 0", "-30% 0"] } : undefined}
        transition={{ duration: 3.2, delay: settled - 0.3, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
      >
        {upper}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute left-0 right-0 top-full -mt-[0.08em] block scale-y-[-1] bg-clip-text text-transparent [mask-image:linear-gradient(to_top,#000,transparent_65%)]"
        style={{ backgroundImage: CHROME }}
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 0.16 } : undefined}
        transition={{ duration: 0.8, delay: settled - 0.2 }}
      >
        {upper}
      </motion.span>
    </div>
  );
}
