"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { GraduationCap, Award, Sparkles, Rocket } from "lucide-react";
import { SiPython, SiReact, SiNodedotjs, SiOllama } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const Bust = dynamic(() => import("../ProgrammerScene"), { ssr: false });
const EASE = [0.16, 1, 0.3, 1] as const;
const { name, title, education, leadership } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

const TOOLS = [
  { n: "Python", I: SiPython, c: "#FFD43B" },
  { n: "React", I: SiReact, c: "#61DAFB" },
  { n: "Node.js", I: SiNodedotjs, c: "#5FA04E" },
  { n: "AWS", I: FaAws, c: "#FF9900" },
  { n: "Ollama", I: SiOllama, c: "#F2F4F8" },
];

const FACTS = [
  { I: GraduationCap, c: "#60A5FA", t: "Amrita Vishwa Vidyapeetham", d: `B.Tech CSE · 2022–2026 · CGPA ${cgpa}` },
  { I: Award, c: "#22D3EE", t: `${leadership.role}, CSI`, d: "ASEB Chapter · events & coding contests" },
  { I: Sparkles, c: "#E879F9", t: "Focus: LLMs & RAG", d: "Private, local AI with Ollama" },
  { I: Rocket, c: "#FB923C", t: "Ships real products", d: "3 live platforms used every day" },
];

/** A collectible-style developer ID: tilts toward the pointer, with a holographic foil that slides as it moves. */
function HoloCard({ start = { x: 0.68, y: 0.32 } }: { start?: { x: number; y: number } }) {
  const px = useMotionValue(start.x);
  const py = useMotionValue(start.y);
  const sx = useSpring(px, { stiffness: 140, damping: 18 });
  const sy = useSpring(py, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(sx, (v) => (v - 0.5) * 18);
  const rotateX = useTransform(sy, (v) => (0.5 - v) * 14);
  const foilPos = useTransform(sx, (v) => `${v * 100}% ${50 + (v - 0.5) * 30}%`);
  const glare = useTransform([sx, sy] as never, ([x, y]: number[]) => `radial-gradient(60% 50% at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.28), transparent 60%)`);

  return (
    <div
      className="[perspective:1300px] w-full max-w-[420px] mx-auto"
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => (px.set(start.x), py.set(start.y))}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        {/* glow behind the card */}
        <div className="absolute -inset-10 rounded-[60px] bg-[conic-gradient(from_200deg,#22D3EE55,#E879F955,#FBBF2440,#22D3EE55)] blur-3xl opacity-60" />
        <div className="relative rounded-[30px] p-[1.5px] bg-[conic-gradient(from_210deg,#22D3EE,#818CF8,#E879F9,#FBBF24,#22D3EE)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
          <div className="relative overflow-hidden rounded-[28.5px] bg-[linear-gradient(160deg,#121c38,#0a0f1f_55%,#140c26)] p-5">
            {/* header */}
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-neon flex items-center justify-center font-grotesk text-[13px] font-bold text-white">AA</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim">Developer ID</span>
              <span className="ml-auto rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fuchsia-200">★ Holo</span>
            </div>

            {/* portrait */}
            <div className="relative mt-4 h-[290px] rounded-2xl overflow-hidden border border-white/10 bg-[radial-gradient(80%_70%_at_50%_30%,rgba(129,140,248,0.45),transparent_65%),linear-gradient(180deg,#1b2350,#0c1027)]">
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-0">
                <Bust variant="portrait" />
              </div>
              {["top-2 left-2 border-l-2 border-t-2", "top-2 right-2 border-r-2 border-t-2", "bottom-2 left-2 border-l-2 border-b-2", "bottom-2 right-2 border-r-2 border-b-2"].map((c) => (
                <span key={c} className={`absolute w-4 h-4 border-white/50 ${c}`} />
              ))}
              <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-void/70 backdrop-blur px-2.5 py-1 text-[10.5px] text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Building
              </span>
            </div>

            {/* name */}
            <div className="mt-4">
              <div className="font-grotesk text-[1.65rem] font-bold leading-none tracking-[-0.02em] text-bone">{name}</div>
              <div className="mt-1.5 text-[13px] text-dim">{title}</div>
            </div>

            {/* stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                [cgpa, "CGPA"],
                ["3", "Live products"],
                ["8", "Research papers"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-center">
                  <div className="font-grotesk text-xl font-bold text-bone">{v}</div>
                  <div className="text-[10px] text-faint">{l}</div>
                </div>
              ))}
            </div>

            {/* abilities */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Full-stack", "AI / ML", "LLMs & RAG"].map((a) => (
                <span key={a} className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[11px] text-bone/85">
                  {a}
                </span>
              ))}
            </div>

            {/* footer */}
            <div className="mt-4 flex items-end justify-between">
              <span className="h-8 w-32 opacity-60 bg-[repeating-linear-gradient(90deg,#E6E9F0_0_2px,transparent_2px_4px,#E6E9F0_4px_5px,transparent_5px_8px)]" />
              <span className="font-hand text-3xl text-bone/80 -rotate-6">Arjun</span>
            </div>

            {/* holographic foil + glare */}
            <motion.div
              className="pointer-events-none absolute inset-0 mix-blend-color-dodge opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 22%, rgba(255,119,255,0.55) 38%, rgba(119,255,255,0.55) 50%, rgba(255,255,140,0.45) 62%, transparent 78%)",
                backgroundSize: "260% 260%",
                backgroundPosition: foilPos,
              }}
            />
            <motion.div className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ backgroundImage: glare }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AboutHoloCard() {
  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      <div className="pointer-events-none absolute left-[18%] top-[40%] w-[620px] h-[520px] rounded-full bg-fuchsia-500/[0.10] blur-[140px]" />
      <div className="pointer-events-none absolute right-[5%] top-[10%] w-[620px] h-[520px] rounded-full bg-accent/[0.10] blur-[140px]" />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>

        <div className="mt-10 grid lg:grid-cols-[440px_1fr] gap-14 lg:gap-20 items-center">
          <HoloCard />

          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-mono text-xs uppercase tracking-[0.25em] text-accent-soft"
            >
              Hi, I&apos;m Arjun
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
              className="mt-4 font-grotesk text-[2.1rem] sm:text-[2.9rem] font-bold leading-[1.05] tracking-[-0.03em] text-bone text-balance"
            >
              I build full-stack products with{" "}
              <span className="bg-gradient-to-r from-fuchsia-300 via-accent-soft to-neon bg-clip-text text-transparent">AI inside</span>, and ship them to real businesses.
            </motion.h2>

            <div className="mt-9 grid sm:grid-cols-2 gap-3">
              {FACTS.map(({ I, c, t, d }, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-panel/50 p-4 hover:border-line-strong transition-colors"
                >
                  <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `${c}1f`, border: `1px solid ${c}55` }}>
                    <I className="w-[18px] h-[18px]" style={{ color: c }} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-bone">{t}</span>
                    <span className="block text-[13px] text-dim mt-0.5">{d}</span>
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint mr-2">Everyday toolkit</span>
              {TOOLS.map(({ n, I, c }) => (
                <span key={n} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void/60 px-3 py-1.5 text-[12.5px] text-bone/90">
                  <I className="w-3.5 h-3.5" style={{ color: c }} /> {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
