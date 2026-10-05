"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, Sparkles, Workflow, Cloud, Ear, PenTool, Code2, Rocket, MessageCircle, Settings2, Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

function Tile({ className = "", accent, children, i }: { className?: string; accent: string; children: React.ReactNode; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
      className={`group relative rounded-[28px] p-px ${className}`}
      style={{ background: `linear-gradient(140deg, ${accent}70, rgba(148,163,199,0.08) 38%, rgba(148,163,199,0.06) 70%, ${accent}40)` }}
    >
      <div
        className="relative h-full overflow-hidden rounded-[27px] p-6 sm:p-7"
        style={{ background: `radial-gradient(90% 70% at 100% 0%, ${accent}26, transparent 60%), radial-gradient(70% 60% at 0% 100%, ${accent}12, transparent 60%), #0A0F1C` }}
      >
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.35]" />
        {children}
      </div>
    </motion.div>
  );
}

function Head({ n, label, title, accent, Icon }: { n: string; label: string; title: string; accent: string; Icon: React.ElementType }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}66)`, boxShadow: `0 10px 26px -10px ${accent}` }}>
          <Icon className="w-[18px] h-[18px] text-white" />
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: accent }}>
          {n} · {label}
        </span>
      </div>
      <h3 className="mt-4 font-grotesk text-[1.6rem] sm:text-[1.85rem] font-bold leading-[1.08] tracking-[-0.02em] text-bone text-balance">{title}</h3>
    </div>
  );
}

function WebVisual() {
  return (
    <div className="absolute left-7 right-[-40px] bottom-[-30px] h-[58%] rounded-2xl border border-line-strong bg-[#070b16] shadow-[0_30px_80px_-20px_rgba(59,130,246,0.55)] overflow-hidden [transform:perspective(1200px)_rotateX(8deg)_rotateY(-10deg)] origin-bottom-left transition-transform duration-700 group-hover:[transform:perspective(1200px)_rotateX(4deg)_rotateY(-4deg)]">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line">
        <span className="w-2 h-2 rounded-full bg-red-400/70" />
        <span className="w-2 h-2 rounded-full bg-amber-300/70" />
        <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
        <span className="ml-3 h-3.5 w-40 rounded bg-panel-2" />
      </div>
      <div className="flex h-full">
        <div className="w-14 border-r border-line flex flex-col items-center gap-3 pt-4">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-neon" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`w-5 h-5 rounded-md ${i === 0 ? "bg-accent/30" : "bg-panel-2"}`} />
          ))}
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Bookings", "128", "#60A5FA"],
              ["Revenue", "₹42k", "#34D399"],
              ["Members", "312", "#C084FC"],
            ].map(([l, v, c]) => (
              <div key={l} className="rounded-xl border border-line bg-panel/70 p-3">
                <div className="text-[10px] text-faint">{l}</div>
                <div className="font-grotesk text-xl font-bold" style={{ color: c }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-line bg-panel/70 p-3">
            <svg viewBox="0 0 300 70" className="w-full h-20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bento-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 58 C 30 50, 50 55, 75 42 S 120 40, 150 30 S 200 26, 230 18 S 270 10, 300 6 L 300 70 L 0 70 Z" fill="url(#bento-area)" />
              <path d="M0 58 C 30 50, 50 55, 75 42 S 120 40, 150 30 S 200 26, 230 18 S 270 10, 300 6" fill="none" stroke="#60A5FA" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiVisual() {
  return (
    <div className="relative mt-6 space-y-2.5 max-w-[440px] ml-auto">
      <div className="ml-auto w-fit rounded-2xl rounded-tr-md bg-panel-2 border border-line px-3.5 py-2 text-[13px] text-bone/90">Which court is free at 7 PM?</div>
      <div className="flex items-end gap-2">
        <span className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </span>
        <div className="rounded-2xl rounded-bl-md bg-gradient-to-br from-fuchsia-500/25 to-violet-500/20 border border-fuchsia-400/30 px-3.5 py-2 text-[13px] text-bone">
          Court 2 is free at 7 PM. Want me to book it?
        </div>
      </div>
      <div className="flex gap-2 pl-9">
        <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2.5 py-1 text-[10.5px] text-fuchsia-200">Grounded with RAG</span>
        <span className="rounded-full border border-line bg-void/60 px-2.5 py-1 text-[10.5px] text-dim">Runs locally</span>
      </div>
    </div>
  );
}

function FlowVisual() {
  const node = "w-11 h-11 rounded-2xl flex items-center justify-center border";
  return (
    <div className="relative mt-7 flex items-center justify-between">
      <span className={`${node} border-emerald-400/40 bg-emerald-400/10`}>
        <MessageCircle className="w-5 h-5 text-emerald-300" />
      </span>
      <span className="flex-1 mx-1.5 h-px border-t border-dashed border-emerald-400/40" />
      <span className={`${node} border-emerald-400/40 bg-emerald-400/10`}>
        <Settings2 className="w-5 h-5 text-emerald-300 animate-[spin_6s_linear_infinite]" />
      </span>
      <span className="flex-1 mx-1.5 h-px border-t border-dashed border-emerald-400/40" />
      <span className={`${node} border-emerald-400 bg-emerald-400 shadow-[0_0_24px_-4px_rgba(52,211,153,0.9)]`}>
        <Check className="w-5 h-5 text-void" strokeWidth={3} />
      </span>
    </div>
  );
}

function CloudVisual() {
  return (
    <div className="relative mt-6 space-y-2">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl border border-orange-400/25 bg-orange-400/[0.06] px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          <span className="h-1.5 rounded-full bg-bone/25" style={{ width: `${58 - i * 12}%` }} />
          <span className="ml-auto font-mono text-[10px] text-orange-200/80">{["api", "web", "worker"][i]}</span>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  { Icon: Ear, t: "Listen", d: "Understand the real problem" },
  { Icon: PenTool, t: "Design", d: "Plan the simplest fix" },
  { Icon: Code2, t: "Build", d: "Clean, tested code" },
  { Icon: Rocket, t: "Ship", d: "Deploy, measure, improve" },
];

export function WhatIDoBento() {
  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      <div className="aurora-blob w-[560px] h-[420px] -top-24 left-[8%] bg-accent/15" />
      <div className="aurora-blob w-[560px] h-[420px] bottom-0 right-[4%] bg-fuchsia-500/10" style={{ animationDelay: "-8s" }} />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">02</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">What I do</span>
        </div>
        <h2 className="mt-4 font-grotesk font-bold text-4xl sm:text-6xl leading-[1.02] tracking-[-0.03em] text-bone max-w-[900px]">
          I turn real-world problems into{" "}
          <span className="bg-gradient-to-r from-neon via-accent-soft to-emerald-300 bg-clip-text text-transparent">working software.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[260px_260px] gap-4">
          <Tile i={0} accent="#3B82F6" className="md:col-span-2 lg:row-span-2 min-h-[420px]">
            <Head n="01" label="Web platforms" title="Full-stack apps, from database to dashboard." accent="#3B82F6" Icon={Globe2} />
            <WebVisual />
          </Tile>
          <Tile i={1} accent="#D946EF" className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr] gap-4 h-full">
              <Head n="02" label="AI & LLMs" title="AI that answers real questions." accent="#D946EF" Icon={Sparkles} />
              <AiVisual />
            </div>
          </Tile>
          <Tile i={2} accent="#10B981">
            <Head n="03" label="Automation" title="Busywork, automated." accent="#10B981" Icon={Workflow} />
            <FlowVisual />
          </Tile>
          <Tile i={3} accent="#F97316">
            <Head n="04" label="Cloud" title="Shipped & scalable." accent="#F97316" Icon={Cloud} />
            <CloudVisual />
          </Tile>
        </div>

        {/* How I work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mt-4 rounded-[28px] border border-line bg-panel/50 px-6 sm:px-10 py-7"
        >
          <div className="absolute left-[12.5%] right-[12.5%] top-[52px] h-px bg-gradient-to-r from-accent via-fuchsia-400 to-emerald-400 opacity-60 hidden md:block" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map(({ Icon, t, d }, i) => (
              <div key={t} className="flex flex-col items-center text-center">
                <span className="relative w-12 h-12 rounded-full border border-line-strong bg-void flex items-center justify-center shadow-[0_0_0_6px_rgba(7,10,18,1)]">
                  <Icon className="w-5 h-5 text-bone" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-[10px] font-mono text-white flex items-center justify-center">{i + 1}</span>
                </span>
                <span className="mt-3 font-grotesk text-lg font-semibold text-bone">{t}</span>
                <span className="text-[13px] text-dim">{d}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
