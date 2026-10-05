"use client";

import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { GraduationCap, Award, Rocket, BookOpen, Sparkles, Hand } from "lucide-react";
import { SiPython, SiReact, SiNodedotjs, SiOllama } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;
const { name, title, education, leadership } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

const POINTS = [
  { I: GraduationCap, c: "#60A5FA", t: "CS graduate, Amrita", d: `B.Tech · 2022–2026 · CGPA ${cgpa}` },
  { I: Award, c: "#FBBF24", t: `${leadership.role}, CSI`, d: "ASEB Chapter · events & coding contests" },
  { I: Rocket, c: "#34D399", t: "3 live products", d: "Platforms businesses run on every day" },
  { I: BookOpen, c: "#F472B6", t: "8 research papers", d: "Published with IEEE & Springer" },
  { I: Sparkles, c: "#C084FC", t: "Focus: LLMs & RAG", d: "Private, grounded AI" },
];

const ANCHOR_X = 210; // where the lanyard hangs from (px within the stage)
const REST_Y = 250; // badge top, at rest

/** A conference badge on a lanyard: drag it around, it swings back. */
function Lanyard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const rotate = useTransform(sx, [-220, 220], [22, -22]);
  const strap = useTransform([sx, sy] as never, ([bx, by]: number[]) => {
    const ex = ANCHOR_X + bx;
    const ey = REST_Y + by;
    return `M ${ANCHOR_X - 34} -10 Q ${ANCHOR_X + bx * 0.4 - 20} ${ey * 0.55}, ${ex} ${ey} M ${ANCHOR_X + 34} -10 Q ${ANCHOR_X + bx * 0.4 + 20} ${ey * 0.55}, ${ex} ${ey}`;
  });

  return (
    <div className="relative h-[720px] w-[420px] mx-auto">
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden>
        <defs>
          <linearGradient id="strap-g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <motion.path d={strap} fill="none" stroke="url(#strap-g)" strokeWidth="16" strokeLinecap="round" />
        <motion.path d={strap} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="2 10" />
      </svg>

      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.6}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
        style={{ x, y, rotate, left: ANCHOR_X - 150, top: REST_Y, transformOrigin: "50% 0%" }}
        whileTap={{ cursor: "grabbing" }}
        className="absolute w-[300px] cursor-grab touch-none"
      >
        {/* clip */}
        <div className="mx-auto -mb-2 w-12 h-6 rounded-md bg-gradient-to-b from-slate-200 to-slate-400 shadow-md" />
        <div className="relative rounded-[22px] bg-[#F7F8FB] text-[#0B1020] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="mx-auto mt-3 w-16 h-3 rounded-full bg-slate-300" />
          <div className="mt-3 mx-4 rounded-2xl bg-[linear-gradient(120deg,#2563EB,#7C3AED_55%,#DB2777)] px-4 py-3 text-white">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span>Builder</span>
              <span>2026</span>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <span className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-grotesk text-2xl font-bold">AA</span>
              <span className="rounded-full bg-white/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">All access</span>
            </div>
          </div>
          <div className="px-5 pt-4 pb-5">
            <div className="font-grotesk text-[1.6rem] font-bold leading-none tracking-[-0.02em]">{name}</div>
            <div className="mt-1.5 text-[13px] text-slate-500">{title}</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                [cgpa, "CGPA"],
                ["3", "Live apps"],
                ["8", "Papers"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-slate-100 py-2">
                  <div className="font-grotesk text-lg font-bold">{v}</div>
                  <div className="text-[10px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="grid grid-cols-6 gap-[3px]">
                {Array.from({ length: 36 }, (_, i) => (
                  <span key={i} className="w-[7px] h-[7px] rounded-[1px]" style={{ background: (i * 7 + (i % 5)) % 3 ? "#0B1020" : "transparent" }} />
                ))}
              </div>
              <div className="text-right">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">President</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">CSI · ASEB</div>
                <div className="font-hand text-2xl text-slate-700 -rotate-6 mt-1">Arjun</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-void/70 px-3 py-1 text-[11px] text-faint">
        <Hand className="w-3.5 h-3.5" /> Grab the badge
      </div>
    </div>
  );
}

export function AboutBadge() {
  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      <div className="pointer-events-none absolute left-[10%] top-[30%] w-[520px] h-[520px] rounded-full bg-violet-600/[0.14] blur-[140px]" />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>
        <div className="mt-2 grid lg:grid-cols-[440px_1fr] gap-10 lg:gap-16 items-center">
          <Lanyard />
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-grotesk text-[2.6rem] sm:text-[3.6rem] font-bold leading-[0.98] tracking-[-0.04em] text-bone"
            >
              Hi, I&apos;m Arjun.
              <span className="block mt-2 text-[1.6rem] sm:text-[2rem] font-medium tracking-[-0.02em] text-dim">
                I build products with <span className="text-fuchsia-300">AI inside</span> and ship them to real businesses.
              </span>
            </motion.h2>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {POINTS.map(({ I, c, t, d }, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  className="group flex items-center gap-4 py-4"
                >
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${c}1f`, border: `1px solid ${c}55` }}>
                    <I className="w-[18px] h-[18px]" style={{ color: c }} />
                  </span>
                  <span className="font-grotesk text-lg font-semibold text-bone">{t}</span>
                  <span className="ml-auto text-sm text-faint text-right">{d}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                [SiPython, "#FFD43B", "Python"],
                [SiReact, "#61DAFB", "React"],
                [SiNodedotjs, "#5FA04E", "Node.js"],
                [FaAws, "#FF9900", "AWS"],
                [SiOllama, "#F2F4F8", "Ollama"],
              ].map(([I, c, n]) => {
                const Icon = I as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
                return (
                  <span key={n as string} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void/60 px-3 py-1.5 text-[12.5px] text-bone/90">
                    <Icon className="w-3.5 h-3.5" style={{ color: c as string }} /> {n as string}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
