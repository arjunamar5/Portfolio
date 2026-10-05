"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Layers, Sparkles, Rocket, BookOpen, Award, LucideIcon } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { FEATURED, isLive } from "./projectData";

const EASE = [0.16, 1, 0.3, 1] as const;
const { education, leadership } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");
const LIVE = FEATURED.filter(isLive);

type Key = "grad" | "stack" | "ai" | "biz" | "research" | "csi";
const PILL: Record<Key, { label: string; I: LucideIcon; c: string }> = {
  grad: { label: "CS graduate", I: GraduationCap, c: "#60A5FA" },
  stack: { label: "full-stack products", I: Layers, c: "#38BDF8" },
  ai: { label: "AI inside", I: Sparkles, c: "#E879F9" },
  biz: { label: "real businesses", I: Rocket, c: "#34D399" },
  research: { label: "research", I: BookOpen, c: "#F472B6" },
  csi: { label: "the CSI chapter", I: Award, c: "#FBBF24" },
};

function Preview({ k }: { k: Key }) {
  const c = PILL[k].c;
  const shell = "w-[300px] rounded-2xl border bg-[#0B1222]/95 backdrop-blur p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] text-left";
  const style = { borderColor: `${c}55`, boxShadow: `0 30px 60px -20px rgba(0,0,0,0.9), 0 0 0 1px ${c}22` };
  if (k === "grad")
    return (
      <div className={shell} style={style}>
        <div className="text-[15px] font-semibold text-bone">Amrita Vishwa Vidyapeetham</div>
        <div className="text-[12.5px] text-dim">B.Tech Computer Science · 2022 – 2026</div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-grotesk text-4xl font-bold" style={{ color: c }}>
            {cgpa}
          </span>
          <span className="mb-1 text-xs text-faint">CGPA / 10</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${parseFloat(cgpa) * 10}%`, background: c }} />
        </div>
      </div>
    );
  if (k === "biz")
    return (
      <div className={shell} style={style}>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Live right now</div>
        <div className="mt-2 space-y-1.5">
          {LIVE.map((p) => (
            <div key={p.id} className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-bone">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.accent }} /> {p.shortTitle}
              <span className="ml-auto text-[10px] font-mono text-emerald-300">LIVE</span>
            </div>
          ))}
        </div>
      </div>
    );
  if (k === "research")
    return (
      <div className={shell} style={style}>
        <div className="flex items-end gap-2">
          <span className="font-grotesk text-4xl font-bold" style={{ color: c }}>
            8
          </span>
          <span className="mb-1 text-[13px] text-dim">papers, IEEE &amp; Springer</span>
        </div>
        <div className="mt-2 text-[12.5px] text-faint">Accepted or published at Scopus-indexed international conferences.</div>
      </div>
    );
  if (k === "csi")
    return (
      <div className={shell} style={style}>
        <div className="text-[15px] font-semibold text-bone">{leadership.role}, Computer Society of India</div>
        <div className="text-[12.5px] text-dim">ASEB Chapter · ran tech events &amp; coding contests</div>
      </div>
    );
  if (k === "ai")
    return (
      <div className={shell} style={style}>
        <div className="ml-auto w-fit rounded-xl rounded-tr-sm bg-white/[0.06] px-3 py-1.5 text-[12.5px] text-bone/90">Which court is free at 7?</div>
        <div className="mt-2 w-fit rounded-xl rounded-tl-sm px-3 py-1.5 text-[12.5px] text-bone" style={{ background: `${c}26` }}>
          Court 2. Want me to book it?
        </div>
        <div className="mt-2 text-[11px] text-faint">LLMs + RAG, running privately</div>
      </div>
    );
  return (
    <div className={shell} style={style}>
      <div className="grid grid-cols-3 gap-2">
        {["128", "₹42k", "312"].map((v, i) => (
          <div key={v} className="rounded-lg bg-white/[0.04] p-2">
            <div className="text-[9px] text-faint">{["Bookings", "Revenue", "Members"][i]}</div>
            <div className="font-grotesk font-bold" style={{ color: c }}>
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-faint">Database → API → dashboard</div>
    </div>
  );
}

function Pill({ k, active, setActive }: { k: Key; active: Key | null; setActive: (k: Key | null) => void }) {
  const { label, I, c } = PILL[k];
  const on = active === k;
  return (
    <span className="relative inline-block align-baseline" onMouseEnter={() => setActive(k)} onMouseLeave={() => setActive(null)}>
      <span
        className="inline-flex items-center gap-2 rounded-full border px-4 py-0.5 mx-1 cursor-default transition-all duration-300"
        style={{ borderColor: on ? c : `${c}55`, background: on ? `${c}26` : `${c}0f`, color: on ? "#fff" : c }}
      >
        <I className="w-[0.7em] h-[0.7em]" />
        {label}
      </span>
      <AnimatePresence>
        {on && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] z-30 font-sans text-base font-normal tracking-normal leading-normal"
          >
            <Preview k={k} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function AboutStatement({ initial = "research" as Key | null }: { initial?: Key | null }) {
  const [active, setActive] = useState<Key | null>(initial);
  const p = (k: Key) => <Pill k={k} active={active} setActive={setActive} />;
  return (
    <section className="relative py-28 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-accent/[0.08] blur-[140px]" />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>
        <div className="mt-10 font-grotesk text-[2rem] sm:text-[3.3rem] font-semibold leading-[1.45] tracking-[-0.03em] text-bone/90 max-w-[1120px]">
          I&apos;m Arjun, a {p("grad")} who builds {p("stack")} with {p("ai")}, ships them to {p("biz")}, publishes {p("research")} and leads {p("csi")}.
        </div>
        <div className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">Hover the highlighted words</div>
      </div>
    </section>
  );
}
