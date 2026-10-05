"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Rocket, MapPin, BookOpen, Monitor, Server, Brain, Cloud, FileText, Search, Sparkles, MessageSquare, Layers, LucideIcon } from "lucide-react";
import { SiPython, SiReact, SiNodedotjs, SiNextdotjs, SiTypescript, SiDocker, SiPostgresql, SiOllama, SiPytorch, SiMongodb, SiTailwindcss, SiSupabase, SiFlask, SiGit } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { CountUp } from "./CountUp";

const EASE = [0.16, 1, 0.3, 1] as const;
const { education, location } = PORTFOLIO_DATA.personal;
const cgpa = parseFloat(education.detail.replace("CGPA: ", ""));
const LIVE_IDS = ["project-3-cue-court-coffee", "project-2-perfect-study-space", "project-7-alpenglow-global"];
const LIVE = LIVE_IDS.map((id) => PORTFOLIO_DATA.projects.find((p) => p.id === id)).filter((p): p is (typeof PORTFOLIO_DATA.projects)[number] => Boolean(p));

type Logo = { I: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; c: string; n: string };
const ROW_A: Logo[] = [
  { I: SiPython, c: "#FFD43B", n: "Python" },
  { I: SiReact, c: "#61DAFB", n: "React" },
  { I: SiNodedotjs, c: "#5FA04E", n: "Node.js" },
  { I: SiNextdotjs, c: "#F2F4F8", n: "Next.js" },
  { I: SiTypescript, c: "#3178C6", n: "TypeScript" },
  { I: SiTailwindcss, c: "#38BDF8", n: "Tailwind" },
  { I: SiFlask, c: "#F2F4F8", n: "Flask" },
];
const ROW_B: Logo[] = [
  { I: FaAws, c: "#FF9900", n: "AWS" },
  { I: SiDocker, c: "#2496ED", n: "Docker" },
  { I: SiPostgresql, c: "#699ECA", n: "PostgreSQL" },
  { I: SiMongodb, c: "#47A248", n: "MongoDB" },
  { I: SiSupabase, c: "#3ECF8E", n: "Supabase" },
  { I: SiOllama, c: "#F2F4F8", n: "Ollama" },
  { I: SiPytorch, c: "#EE4C2C", n: "PyTorch" },
  { I: SiGit, c: "#F05032", n: "Git" },
];

/** Bento tile: fades up on scroll, lifts on hover, and a soft spotlight follows the pointer. */
function Tile({ className = "", i, children, glow = "#3B82F6" }: { className?: string; i: number; children: React.ReactNode; glow?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden rounded-[26px] border border-white/[0.08] p-6 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/[0.16] ${className}`}
      style={{ background: `radial-gradient(120% 90% at 100% 0%, ${glow}22, transparent 55%), #0A0F1C` }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), ${glow}24, transparent 60%)` }}
      />
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-faint">{children}</div>;
}

/** The three things I build with; the diagram shows where they overlap. */
const REALMS: { label: string; I: LucideIcon; c: string; line: string; tools: string[]; at: { x: number; y: number }; tag: React.CSSProperties; drift: [number, number] }[] = [
  { label: "Full-stack", I: Layers, c: "#38BDF8", line: "Apps people use every day", tools: ["React", "Next.js", "Node.js", "SQL"], at: { x: 50, y: 35 }, tag: { left: "50%", top: "0%", transform: "translate(-50%,-30%)" }, drift: [0, -6] },
  { label: "Cloud", I: Cloud, c: "#FB923C", line: "Shipped, scaled, always on", tools: ["AWS", "Docker"], at: { x: 34, y: 63 }, tag: { left: "2%", bottom: "0%", transform: "translateY(30%)" }, drift: [-6, 4] },
  { label: "AI", I: Brain, c: "#C084FC", line: "Intelligence built in", tools: ["LLMs", "RAG", "Ollama", "PyTorch"], at: { x: 66, y: 63 }, tag: { right: "2%", bottom: "0%", transform: "translateY(30%)" }, drift: [6, 4] },
];

function useRealmCycle() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((v) => (v + 1) % REALMS.length), 2600);
    return () => clearInterval(id);
  }, [held]);
  const focus = (i: number | null) => {
    setHeld(i !== null);
    if (i !== null) setActive(i);
  };
  return { active, focus };
}

/** Three glowing circles drifting over each other; the bright overlap in the middle is "me". */
function Realms({ active, focus }: { active: number; focus: (i: number | null) => void }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]" onMouseLeave={() => focus(null)}>
      {REALMS.map((r, i) => {
        const on = i === active;
        return (
          <motion.div
            key={r.label}
            onMouseEnter={() => focus(i)}
            className="absolute w-[62%] aspect-square rounded-full cursor-default mix-blend-screen"
            style={{
              left: `${r.at.x}%`,
              top: `${r.at.y}%`,
              x: "-50%",
              y: "-50%",
              background: `radial-gradient(circle at 50% 50%, ${r.c}5c, ${r.c}26 55%, ${r.c}0d 70%)`,
              border: `1px solid ${r.c}${on ? "cc" : "55"}`,
              boxShadow: on ? `0 0 50px -6px ${r.c}, inset 0 0 40px ${r.c}40` : "none",
            }}
            animate={{ translateX: [0, r.drift[0], 0], translateY: [0, r.drift[1], 0], scale: on ? 1.06 : 1, opacity: on ? 1 : 0.6 }}
            transition={{
              translateX: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
              translateY: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.6, ease: EASE },
              opacity: { duration: 0.6 },
            }}
          />
        );
      })}

      {/* labels on the outside of each circle */}
      {REALMS.map((r, i) => {
        const on = i === active;
        return (
          <button
            key={r.label}
            onMouseEnter={() => focus(i)}
            onFocus={() => focus(i)}
            onBlur={() => focus(null)}
            className="absolute z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold backdrop-blur transition-all duration-500"
            style={{ ...r.tag, color: on ? "#fff" : r.c, borderColor: `${r.c}${on ? "cc" : "55"}`, background: on ? `${r.c}40` : "rgba(7,10,18,0.7)" }}
          >
            <r.I className="w-3.5 h-3.5" /> {r.label}
          </button>
        );
      })}

      {/* the overlap */}
      <div className="absolute z-10 left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className="relative flex w-3.5 h-3.5">
          <span className="absolute inline-flex w-full h-full rounded-full bg-white opacity-60 animate-ping" />
          <span className="relative inline-flex w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_18px_4px_rgba(255,255,255,0.8)]" />
        </span>
        <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90">me</span>
      </div>
    </div>
  );
}

function RealmsIntro() {
  const { active, focus } = useRealmCycle();
  const r = REALMS[active];
  return (
    <div className="relative h-full grid sm:grid-cols-[1fr_minmax(0,300px)] items-center gap-8">
      <div className="h-full flex flex-col">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">Where I work</span>
        <h2 className="mt-3 font-grotesk text-[2.3rem] sm:text-[2.9rem] font-bold leading-[1] tracking-[-0.04em]">
          {REALMS.map((x, i) => (
            <span
              key={x.label}
              onMouseEnter={() => focus(i)}
              onMouseLeave={() => focus(null)}
              className="block w-fit cursor-default transition-all duration-500"
              style={{ color: i === active ? x.c : "rgba(242,244,248,0.28)", textShadow: i === active ? `0 0 30px ${x.c}66` : "none" }}
            >
              {i === REALMS.length - 1 ? `& ${x.label}.` : `${x.label},`}
            </span>
          ))}
        </h2>
        <p className="mt-3 text-[15px] text-white/70">I build right where they meet.</p>
        <div className="relative mt-4 min-h-[62px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={r.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>
              <div className="text-[13px] font-medium" style={{ color: r.c }}>
                {r.line}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.tools.map((t) => (
                  <span key={t} className="rounded-full border px-2.5 py-0.5 text-[11.5px] text-white/90" style={{ borderColor: `${r.c}55`, background: `${r.c}14` }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[12.5px] text-white">
            <MapPin className="w-3.5 h-3.5" /> {location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[12.5px] text-white">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            Building something new
          </span>
        </div>
      </div>
      <Realms active={active} focus={focus} />
    </div>
  );
}

function Gauge({ value, max = 10 }: { value: number; max?: number }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const arc = 0.75; // three-quarter dial
  return (
    <svg viewBox="0 0 140 140" className="w-[148px] h-[148px] -rotate-[225deg]" aria-hidden>
      <defs>
        <linearGradient id="about-gauge" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(148,163,199,0.14)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * arc} ${c}`} />
      <motion.circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="url(#about-gauge)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${c}` }}
        whileInView={{ strokeDasharray: `${c * arc * (value / max)} ${c}` }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
        style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.55))" }}
      />
    </svg>
  );
}

/** The layers of a product I build end to end; a pulse travels down through them. */
const LAYERS: { I: LucideIcon; t: string; d: string; c: string }[] = [
  { I: Monitor, t: "Interface", d: "React · Next.js", c: "#38BDF8" },
  { I: Server, t: "APIs & data", d: "Node · Flask · SQL", c: "#34D399" },
  { I: Brain, t: "AI layer", d: "LLMs · RAG · Vision", c: "#C084FC" },
  { I: Cloud, t: "Cloud", d: "AWS · Docker", c: "#FB923C" },
];

function StackLayers() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setOn((v) => (v + 1) % LAYERS.length), 1100);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative mt-4 space-y-1.5">
      {LAYERS.map(({ I, t, d, c }, k) => {
        const lit = k === on;
        return (
          <div
            key={t}
            className="flex items-center gap-2.5 rounded-xl border px-3 py-[7px] transition-all duration-500"
            style={{
              borderColor: lit ? `${c}88` : "rgba(255,255,255,0.07)",
              background: lit ? `${c}1a` : "rgba(255,255,255,0.02)",
              boxShadow: lit ? `0 0 22px -6px ${c}` : "none",
              transform: `translateX(${k * 6}px)`,
            }}
          >
            <I className="w-4 h-4 shrink-0 transition-colors duration-500" style={{ color: lit ? c : "#5C6780" }} />
            <span className={`text-[13px] font-medium transition-colors duration-500 ${lit ? "text-bone" : "text-dim"}`}>{t}</span>
            <span className="ml-auto text-[10.5px] text-faint whitespace-nowrap">{d}</span>
          </div>
        );
      })}
    </div>
  );
}

/** A tiny RAG pipeline: a question travels from documents to a grounded answer. */
function RagFlow() {
  const steps: { I: LucideIcon; t: string }[] = [
    { I: FileText, t: "Docs" },
    { I: Search, t: "Retrieve" },
    { I: Sparkles, t: "LLM" },
    { I: MessageSquare, t: "Answer" },
  ];
  return (
    <div className="relative mt-5 flex items-center">
      <div className="absolute left-5 right-5 top-5 h-px bg-gradient-to-r from-fuchsia-400/40 via-violet-400/40 to-neon/40" />
      <span className="rag-dot absolute top-5 -mt-[4px] w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_12px_3px_rgba(232,121,249,0.7)]" />
      {steps.map(({ I, t }, k) => (
        <div key={t} className="relative flex-1 flex flex-col items-center gap-1.5">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center border bg-[#0A0F1C]"
            style={{ borderColor: k === 3 ? "rgba(34,211,238,0.6)" : "rgba(192,132,252,0.4)", boxShadow: k === 3 ? "0 0 18px -4px rgba(34,211,238,0.8)" : "none" }}
          >
            <I className="w-[18px] h-[18px]" style={{ color: k === 3 ? "#67E8F9" : "#D8B4FE" }} />
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">{t}</span>
        </div>
      ))}
    </div>
  );
}

function LogoRow({ items, reverse = false }: { items: Logo[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className={`flex w-max gap-2.5 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`} style={{ animationDuration: reverse ? "34s" : "28s" }}>
        {[...items, ...items].map(({ I, c, n }, k) => (
          <span key={k} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[13px] text-bone/90">
            <I className="w-4 h-4" style={{ color: c }} /> {n}
          </span>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute left-[15%] top-[30%] w-[620px] h-[520px] rounded-full bg-accent/[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute right-[5%] bottom-[10%] w-[560px] h-[460px] rounded-full bg-fuchsia-500/[0.07] blur-[140px]" />

      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:auto-rows-[minmax(150px,auto)]">
          {/* Intro */}
          <Tile i={0} glow="#6366F1" className="md:col-span-7 md:row-span-2 min-h-[320px] !p-7 sm:!p-8">
            <div className="about-mesh pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <RealmsIntro />
          </Tile>

          {/* Education */}
          <Tile i={1} glow="#22D3EE" className="md:col-span-5 md:row-span-2">
            <div className="h-full flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-neon/10 border border-neon/30">
                    <GraduationCap className="w-5 h-5 text-neon" />
                  </span>
                  <div className="mt-4 font-grotesk text-[1.45rem] font-bold leading-tight text-bone">Amrita Vishwa Vidyapeetham</div>
                  <div className="mt-1.5 text-sm text-dim">B.Tech · Computer Science &amp; Engineering</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-neon">Graduated 2026</div>
                </div>
                <div className="relative shrink-0 -mr-2 -mt-1">
                  <Gauge value={cgpa} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-grotesk text-[2.1rem] font-bold leading-none text-bone">
                      <CountUp value={cgpa} decimals={2} duration={1.6} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mt-1">CGPA</span>
                  </div>
                </div>
              </div>
              {/* 2022 → 2026 timeline */}
              <div className="mt-auto pt-5">
                <div className="relative h-1.5 rounded-full bg-white/[0.07]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
                    className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-neon to-indigo-400"
                  />
                  {[0, 25, 50, 75, 100].map((x) => (
                    <span key={x} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0A0F1C] border-2 border-neon" style={{ left: `${x}%` }} />
                  ))}
                </div>
                <div className="mt-2.5 flex justify-between font-mono text-[10.5px] text-faint">
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                  <span>2025</span>
                  <span className="text-neon">2026</span>
                </div>
              </div>
            </div>
          </Tile>

          {/* End to end */}
          <Tile i={2} glow="#38BDF8" className="md:col-span-4 md:row-span-2">
            <Label>End to end</Label>
            <div className="mt-2 font-grotesk text-[1.55rem] font-bold leading-tight text-bone">Every layer of the product</div>
            <StackLayers />
          </Tile>

          {/* Research */}
          <Tile i={3} glow="#F472B6" className="md:col-span-4 md:row-span-2 min-h-[260px]">
            <div className="absolute right-6 top-6 w-[132px] h-[120px]">
              {[-13, -5, 5].map((r, k) => (
                <div
                  key={k}
                  className="absolute inset-0 rounded-lg bg-[#F8FAFC] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] p-3 origin-bottom-left transition-transform duration-500"
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
            <div className="relative h-full flex flex-col justify-end">
              <BookOpen className="w-5 h-5 text-pink-300 mb-3" />
              <div className="font-grotesk text-[3.6rem] font-bold leading-none text-bone">
                <CountUp value={8} duration={1.4} />
              </div>
              <div className="mt-1.5 text-sm text-dim">Research papers · IEEE &amp; Springer</div>
            </div>
          </Tile>

          {/* Live products */}
          <Tile i={4} glow="#34D399" className="md:col-span-4 md:row-span-2">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-emerald-300" />
              <span className="font-grotesk text-[1.85rem] font-bold text-bone">
                <CountUp value={LIVE.length} duration={1.2} /> live products
              </span>
            </div>
            <div className="mt-1 text-sm text-dim">Used by real businesses, every day</div>
            <div className="mt-4 space-y-2">
              {LIVE.map((p, k) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-70 animate-ping" style={{ background: p.accent, animationDelay: `${k * 0.4}s` }} />
                    <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: p.accent }} />
                  </span>
                  <span className="text-[13.5px] text-bone">{p.shortTitle}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-emerald-300">live</span>
                </a>
              ))}
            </div>
          </Tile>

          {/* Focus */}
          <Tile i={5} glow="#A855F7" className="md:col-span-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label>Currently into</Label>
                <div className="mt-2 font-grotesk text-[2.1rem] font-bold leading-none bg-gradient-to-r from-fuchsia-300 via-violet-300 to-neon bg-clip-text text-transparent">LLMs &amp; RAG</div>
                <div className="mt-2 text-[13px] text-dim">Private, grounded AI that runs locally</div>
              </div>
              <div className="relative w-16 h-16 shrink-0">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#22D3EE,#A855F7,#F472B6,#22D3EE)] blur-md opacity-80 animate-[spin_6s_linear_infinite]" />
                <div className="absolute inset-2.5 rounded-full bg-[#0A0F1C] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-fuchsia-300" />
                </div>
              </div>
            </div>
            <RagFlow />
          </Tile>

          {/* Toolkit */}
          <Tile i={6} glow="#38BDF8" className="md:col-span-6 !px-0 flex flex-col">
            <div className="px-6">
              <Label>Everyday toolkit</Label>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-2.5 pt-5">
              <LogoRow items={ROW_A} />
              <LogoRow items={ROW_B} reverse />
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
