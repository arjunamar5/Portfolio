"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Rocket, MapPin, Sparkles } from "lucide-react";
import { SiPython, SiReact, SiNodedotjs, SiNextdotjs, SiTypescript, SiDocker, SiPostgresql, SiOllama, SiPytorch } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { FEATURED, isLive } from "./projectData";

const EASE = [0.16, 1, 0.3, 1] as const;
const { name, title, education, leadership, location } = PORTFOLIO_DATA.personal;
const cgpa = parseFloat(education.detail.replace("CGPA: ", ""));
const LIVE = FEATURED.filter(isLive);
const LOGOS = [
  { I: SiPython, c: "#FFD43B", n: "Python" },
  { I: SiReact, c: "#61DAFB", n: "React" },
  { I: SiNodedotjs, c: "#5FA04E", n: "Node.js" },
  { I: SiNextdotjs, c: "#F2F4F8", n: "Next.js" },
  { I: SiTypescript, c: "#3178C6", n: "TypeScript" },
  { I: FaAws, c: "#FF9900", n: "AWS" },
  { I: SiDocker, c: "#2496ED", n: "Docker" },
  { I: SiPostgresql, c: "#699ECA", n: "PostgreSQL" },
  { I: SiOllama, c: "#F2F4F8", n: "Ollama" },
  { I: SiPytorch, c: "#EE4C2C", n: "PyTorch" },
];

function Tile({ className = "", i, children, glow = "#3B82F6" }: { className?: string; i: number; children: React.ReactNode; glow?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
      className={`group relative overflow-hidden rounded-[26px] border border-white/[0.08] p-6 ${className}`}
      style={{ background: `radial-gradient(120% 90% at 100% 0%, ${glow}22, transparent 55%), #0A0F1C` }}
    >
      {children}
    </motion.div>
  );
}

function Gauge({ value, max = 10 }: { value: number; max?: number }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const arc = 0.75; // three-quarter dial
  return (
    <svg viewBox="0 0 140 140" className="w-[150px] h-[150px] -rotate-[225deg]">
      <defs>
        <linearGradient id="gauge-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(148,163,199,0.15)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * arc} ${c}`} />
      <motion.circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="url(#gauge-g)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${c}` }}
        whileInView={{ strokeDasharray: `${c * arc * (value / max)} ${c}` }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </svg>
  );
}

export function AboutBento() {
  return (
    <section className="relative py-28 sm:py-32">
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[150px] gap-4">
          {/* intro */}
          <Tile i={0} className="md:col-span-7 md:row-span-2 min-h-[300px] !p-8">
            <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_15%_20%,rgba(59,130,246,0.55),transparent_60%),radial-gradient(50%_60%_at_80%_80%,rgba(168,85,247,0.5),transparent_60%),radial-gradient(40%_50%_at_60%_10%,rgba(34,211,238,0.35),transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[repeating-radial-gradient(circle_at_30%_20%,#fff_0_1px,transparent_1px_3px)]" />
            <span className="pointer-events-none absolute -right-6 -bottom-16 font-grotesk font-bold text-[260px] leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)]">AA</span>
            <div className="relative h-full flex flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">Hi, I&apos;m</span>
              <h2 className="mt-3 font-grotesk text-[2.6rem] sm:text-[3.4rem] font-bold leading-[0.95] tracking-[-0.04em] text-white">{name}</h2>
              <p className="mt-3 text-lg text-white/80">{title}</p>
              <p className="mt-1 text-[15px] text-white/60 max-w-[460px]">I build products with AI inside, and ship them to real businesses.</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[12.5px] text-white">
                  <MapPin className="w-3.5 h-3.5" /> {location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[12.5px] text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Building
                </span>
              </div>
            </div>
          </Tile>

          {/* education */}
          <Tile i={1} glow="#22D3EE" className="md:col-span-5 md:row-span-2">
            <div className="h-full flex items-center justify-between gap-4">
              <div>
                <GraduationCap className="w-6 h-6 text-neon" />
                <div className="mt-4 font-grotesk text-[1.45rem] font-bold leading-tight text-bone">Amrita Vishwa Vidyapeetham</div>
                <div className="mt-1.5 text-sm text-dim">B.Tech · Computer Science</div>
                <div className="font-mono text-xs text-faint mt-1">2022 – 2026</div>
              </div>
              <div className="relative shrink-0">
                <Gauge value={cgpa} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-grotesk text-[2.1rem] font-bold leading-none text-bone">{cgpa}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mt-1">CGPA</span>
                </div>
              </div>
            </div>
          </Tile>

          {/* leadership */}
          <Tile i={2} glow="#F59E0B" className="md:col-span-4 md:row-span-2">
            <div className="h-full flex flex-col">
              <div className="relative w-20 h-[88px]">
                <svg viewBox="0 0 80 88" className="absolute inset-0 w-full h-full drop-shadow-[0_10px_24px_rgba(245,158,11,0.45)]">
                  <defs>
                    <linearGradient id="shield-g" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <path d="M40 2 L76 16 L76 44 C76 66 60 80 40 86 C20 80 4 66 4 44 L4 16 Z" fill="url(#shield-g)" />
                </svg>
                <Award className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#3b2600]" />
              </div>
              <div className="mt-auto">
                <div className="font-grotesk text-[1.9rem] font-bold leading-none text-bone">{leadership.role}</div>
                <div className="mt-2 text-sm text-dim">Computer Society of India · ASEB Chapter</div>
              </div>
            </div>
          </Tile>

          {/* research */}
          <Tile i={3} glow="#F472B6" className="md:col-span-4 md:row-span-2">
            <div className="absolute right-6 top-6 w-[130px] h-[120px]">
              {[-12, -4, 5].map((r, k) => (
                <div
                  key={k}
                  className="absolute inset-0 rounded-lg bg-[#F8FAFC] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] p-3 origin-bottom-left transition-transform duration-500 group-hover:rotate-0"
                  style={{ transform: `rotate(${r}deg) translateX(${k * 6}px)` }}
                >
                  <div className="h-1.5 w-3/4 rounded bg-slate-400" />
                  {[90, 70, 85, 60, 75].map((w, j) => (
                    <div key={j} className="mt-1.5 h-1 rounded bg-slate-300" style={{ width: `${w}%` }} />
                  ))}
                  {k === 2 && <div className="absolute right-2 bottom-2 rounded bg-pink-500 px-1.5 py-0.5 font-mono text-[8px] text-white">IEEE</div>}
                </div>
              ))}
            </div>
            <div className="h-full flex flex-col justify-end">
              <div className="font-grotesk text-[3.4rem] font-bold leading-none text-bone">8</div>
              <div className="mt-1 text-sm text-dim">Research papers · IEEE &amp; Springer</div>
            </div>
          </Tile>

          {/* products */}
          <Tile i={4} glow="#34D399" className="md:col-span-4 md:row-span-2">
            <div className="flex items-baseline gap-2">
              <Rocket className="w-5 h-5 text-emerald-300 self-center" />
              <span className="font-grotesk text-[1.9rem] font-bold text-bone">{LIVE.length} live products</span>
            </div>
            <div className="mt-1 text-sm text-dim">Used by real businesses, every day</div>
            <div className="mt-4 space-y-2">
              {LIVE.map((p, k) => (
                <div key={p.id} className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-70 animate-ping" style={{ background: p.accent, animationDelay: `${k * 0.4}s` }} />
                    <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: p.accent }} />
                  </span>
                  <span className="text-[13.5px] text-bone">{p.shortTitle}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-emerald-300">live</span>
                </div>
              ))}
            </div>
          </Tile>

          {/* focus */}
          <Tile i={5} glow="#A855F7" className="md:col-span-6">
            <div className="h-full flex items-center justify-between">
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-faint">Currently into</div>
                <div className="mt-2 font-grotesk text-[2.2rem] font-bold leading-none bg-gradient-to-r from-fuchsia-300 via-violet-300 to-neon bg-clip-text text-transparent">LLMs &amp; RAG</div>
              </div>
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#22D3EE,#A855F7,#F472B6,#22D3EE)] blur-md opacity-80 animate-[spin_6s_linear_infinite]" />
                <div className="absolute inset-3 rounded-full bg-[#0A0F1C] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-fuchsia-300" />
                </div>
              </div>
            </div>
          </Tile>

          {/* toolkit */}
          <Tile i={6} glow="#38BDF8" className="md:col-span-6 !px-0">
            <div className="px-6 font-mono text-[10.5px] uppercase tracking-[0.25em] text-faint">Everyday toolkit</div>
            <div className="mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
              <div className="flex w-max animate-marquee gap-3" style={{ animationDuration: "26s" }}>
                {[...LOGOS, ...LOGOS].map(({ I, c, n }, k) => (
                  <span key={k} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[13px] text-bone/90">
                    <I className="w-4 h-4" style={{ color: c }} /> {n}
                  </span>
                ))}
              </div>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
