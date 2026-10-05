"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const Bust = dynamic(() => import("../ProgrammerScene"), { ssr: false });
const EASE = [0.16, 1, 0.3, 1] as const;
const { title, education, leadership } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

function Line({ kicker, big, small, align = "left", accent = "#FDE68A", delay = 0 }: { kicker: string; big: string; small: string; align?: "left" | "right"; accent?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={align === "right" ? "text-right" : ""}
    >
      <div className="font-mono text-[10.5px] uppercase tracking-[0.28em]" style={{ color: accent }}>
        {kicker}
      </div>
      <div className="mt-1 font-grotesk text-[1.9rem] font-bold leading-[0.95] tracking-[-0.03em] text-white uppercase">{big}</div>
      <div className="mt-1.5 text-[13.5px] leading-snug text-white/70 max-w-[230px] inline-block">{small}</div>
    </motion.div>
  );
}

/** About as a magazine cover: a giant masthead behind the 3D portrait, cover lines around him. */
export function AboutMagazine() {
  return (
    <section className="relative py-28 sm:py-32">
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>

        <div className="relative mt-10 h-[760px] rounded-[34px] overflow-hidden border border-white/10 shadow-[0_50px_120px_-40px_rgba(168,85,247,0.55)]">
          {/* cover art */}
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_42%,#6d28d9_0%,#3b1d7a_35%,#130b33_70%,#0a0820_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_80%_85%,rgba(34,211,238,0.35),transparent_70%),radial-gradient(35%_30%_at_12%_80%,rgba(251,146,60,0.30),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay bg-[repeating-radial-gradient(circle_at_30%_20%,#fff_0_1px,transparent_1px_3px)]" />

          {/* masthead, behind him */}
          <div className="absolute inset-x-0 top-[58px] text-center select-none">
            <div className="font-grotesk font-bold leading-[0.8] tracking-[-0.07em] text-[clamp(7rem,21vw,19rem)] bg-gradient-to-b from-white via-[#f5d0fe] to-[#c4b5fd]/60 bg-clip-text text-transparent">ARJUN</div>
          </div>
          <div className="absolute left-8 top-7 font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">Issue 01 · 2026</div>
          <div className="absolute right-8 top-7 font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">The builder issue</div>

          {/* the portrait, in front of the masthead */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[640px]">
            <Bust variant="portrait" />
          </div>

          {/* cover lines */}
          <div className="absolute left-10 top-[330px] space-y-9">
            <Line kicker="Graduate" big="CS @ Amrita" small={`B.Tech Computer Science · CGPA ${cgpa}`} delay={0.05} />
            <Line kicker="Leadership" big={leadership.role} small="Computer Society of India, ASEB Chapter" accent="#67E8F9" delay={0.15} />
          </div>
          <div className="absolute right-10 top-[300px] space-y-9 text-right">
            <Line kicker="Inside" big="3 live products" small="Platforms real businesses run on, every day" align="right" accent="#86EFAC" delay={0.1} />
            <Line kicker="Exclusive" big="LLMs & RAG" small="Why he builds private, local AI" align="right" accent="#F0ABFC" delay={0.2} />
          </div>

          {/* sticker */}
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            whileInView={{ scale: 1, rotate: -12 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.3 }}
            className="absolute right-[27%] top-[250px] w-28 h-28 rounded-full bg-[#FDE047] text-[#1a1033] flex flex-col items-center justify-center text-center shadow-[0_14px_30px_-8px_rgba(0,0,0,0.6)]"
          >
            <span className="font-grotesk text-[2rem] font-bold leading-none">8</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] leading-tight mt-1">research
              <br />
              papers</span>
          </motion.div>

          {/* footer strip */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-7 pt-20 bg-gradient-to-t from-[#0a0820] via-[#0a0820]/70 to-transparent">
            <div>
              <div className="font-grotesk text-[2.2rem] font-bold leading-none text-white">Arjun R Amarnath</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">{title}</div>
            </div>
            <div className="flex items-end gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 text-right leading-relaxed">
                Python · React · Node
                <br />
                AWS · Ollama
              </span>
              <span className="h-12 w-28 rounded-sm bg-white p-1.5">
                <span className="block h-full w-full bg-[repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_3px,#000_3px_4px,transparent_4px_7px,#000_7px_10px,transparent_10px_12px)]" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
