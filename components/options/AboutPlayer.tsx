"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GraduationCap, Award, Rocket, BookOpen, MapPin, Sparkles, Layers, Server, Play } from "lucide-react";
import { SiPython, SiReact, SiNodedotjs, SiNextdotjs, SiDocker, SiPostgresql, SiOllama, SiPytorch, SiTypescript } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const Bust = dynamic(() => import("../ProgrammerScene"), { ssr: false });
const EASE = [0.16, 1, 0.3, 1] as const;
const { name, education, leadership, location } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

const PROFILE = [
  { I: MapPin, k: "Origin", v: location },
  { I: GraduationCap, k: "Class", v: `B.Tech CSE · CGPA ${cgpa}` },
  { I: Award, k: "Guild", v: `CSI ASEB · ${leadership.role}` },
  { I: Rocket, k: "Quests", v: "3 live client products" },
  { I: BookOpen, k: "Lore", v: "8 research papers" },
];

const LOADOUT = [
  { I: SiPython, c: "#FFD43B" },
  { I: SiReact, c: "#61DAFB" },
  { I: SiNodedotjs, c: "#5FA04E" },
  { I: SiNextdotjs, c: "#F2F4F8" },
  { I: SiTypescript, c: "#3178C6" },
  { I: FaAws, c: "#FF9900" },
  { I: SiDocker, c: "#2496ED" },
  { I: SiPostgresql, c: "#699ECA" },
  { I: SiOllama, c: "#F2F4F8" },
  { I: SiPytorch, c: "#EE4C2C" },
];

const ABILITIES = [
  { I: Sparkles, t: "LLMs & RAG", d: "Private, grounded AI", c: "#E879F9" },
  { I: Layers, t: "Full-stack", d: "Database to dashboard", c: "#60A5FA" },
  { I: Server, t: "Ships to prod", d: "Used daily by businesses", c: "#34D399" },
];

/** A HUD panel with clipped corners. */
function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-px [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] bg-gradient-to-br from-neon/60 via-white/10 to-fuchsia-400/50 ${className}`}>
      <div className="h-full [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] bg-[#0a1020]/90 backdrop-blur p-5">
        <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.3em] text-neon">
          <span className="w-1.5 h-1.5 bg-neon" /> {title}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/** About as a game's character-select screen. */
export function AboutPlayer() {
  return (
    <section className="relative py-28 sm:py-32">
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>

        <div className="relative mt-10 h-[780px] rounded-[30px] overflow-hidden border border-neon/20 bg-[#050913]">
          {/* stage lighting */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[520px] h-[620px] bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,rgba(125,211,252,0.22)_180deg,transparent_200deg)] blur-md" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[150px] w-[520px] h-[120px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(34,211,238,0.55),rgba(34,211,238,0.08)_60%,transparent)]" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[170px] w-[380px] h-[70px] rounded-[50%] border-2 border-neon/60 shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[150px] w-[460px] h-[100px] rounded-[50%] border border-neon/25" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_3px)]" />

          {/* top HUD */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-8 py-5 font-mono text-[11px] uppercase tracking-[0.3em]">
            <span className="text-neon">Player 01</span>
            <span className="text-white/70">Select your developer</span>
            <span className="flex items-center gap-2 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
            </span>
          </div>

          {/* the character */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[56px] w-[460px] h-[520px]">
            <Bust variant="portrait" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[64px] text-center">
            <div className="font-grotesk text-[2.6rem] font-bold leading-none tracking-[-0.03em] text-white [text-shadow:0_0_30px_rgba(34,211,238,0.45)]">{name.toUpperCase()}</div>
            <div className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-neon">
              Class · Full-Stack &amp; AI/ML
            </div>
          </div>

          {/* left: profile */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} className="absolute left-7 top-20 w-[300px]">
            <Panel title="Profile">
              <ul className="space-y-3.5">
                {PROFILE.map(({ I, k, v }) => (
                  <li key={k} className="flex items-center gap-3">
                    <span className="w-8 h-8 shrink-0 flex items-center justify-center border border-neon/30 bg-neon/10">
                      <I className="w-4 h-4 text-neon" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[9.5px] uppercase tracking-[0.25em] text-white/45">{k}</span>
                      <span className="block text-[13.5px] text-white truncate">{v}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>

          {/* right: loadout */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} className="absolute right-7 top-20 w-[300px]">
            <Panel title="Loadout">
              <div className="grid grid-cols-5 gap-2">
                {LOADOUT.map(({ I, c }, i) => (
                  <span key={i} className="aspect-square flex items-center justify-center border bg-white/[0.03]" style={{ borderColor: `${c}55`, boxShadow: `inset 0 0 14px ${c}22` }}>
                    <I className="w-5 h-5" style={{ color: c }} />
                  </span>
                ))}
              </div>
              <div className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.3em] text-fuchsia-300">Special abilities</div>
              <div className="mt-3 space-y-2">
                {ABILITIES.map(({ I, t, d, c }) => (
                  <div key={t} className="flex items-center gap-3 border px-3 py-2" style={{ borderColor: `${c}40`, background: `${c}10` }}>
                    <I className="w-4 h-4 shrink-0" style={{ color: c }} />
                    <span className="text-[13px] font-semibold text-white">{t}</span>
                    <span className="ml-auto text-[11px] text-white/55">{d}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </motion.div>

          {/* bottom CTA */}
          <div className="absolute right-7 bottom-7">
            <span className="inline-flex items-center gap-2.5 bg-neon px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.25em] text-[#041018] [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]">
              <Play className="w-4 h-4 fill-current" /> View résumé
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
