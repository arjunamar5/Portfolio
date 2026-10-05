"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, SkipBack, SkipForward, Pause, Hammer } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;
const { location } = PORTFOLIO_DATA.personal;

/** Same footprint as the About intro tile (7 of 12 columns, two rows). */
function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft">{label}</div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 relative overflow-hidden rounded-[26px] border border-white/[0.08] p-7 h-[316px]" style={{ background: "radial-gradient(120% 90% at 100% 0%, #6366F122, transparent 55%), #0A0F1C" }}>
          {children}
        </div>
        <div className="col-span-5 rounded-[26px] border border-dashed border-white/10 flex items-center justify-center text-[12px] text-faint">Education tile (unchanged)</div>
      </div>
    </div>
  );
}

/* A — a small terminal that types itself out */
const CMDS: { cmd: string; out: React.ReactNode }[] = [
  { cmd: "whoami", out: <>CS grad · ships full-stack products <span className="text-fuchsia-300">with AI inside</span></> },
  { cmd: "cat focus.txt", out: <span className="text-neon">LLMs · RAG · Cloud</span> },
  { cmd: "ls shipped/", out: <span className="text-emerald-300">CueCourtOS · PerfectStudySpace · AlpenGlow</span> },
];

export function MiniTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLine(CMDS.length);
      return;
    }
    if (line >= CMDS.length) return;
    const full = CMDS[line].cmd.length;
    const t = chars < full ? setTimeout(() => setChars(chars + 1), 55) : setTimeout(() => (setLine(line + 1), setChars(0)), 520);
    return () => clearTimeout(t);
  }, [inView, line, chars]);

  return (
    <div ref={ref} className="h-full flex flex-col">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2.5 font-mono text-[11px] text-white/40">arjun@portfolio ~</span>
      </div>
      <div className="mt-5 space-y-3 font-mono text-[13.5px] leading-relaxed">
        {CMDS.map((c, i) =>
          i > line ? null : (
            <div key={c.cmd}>
              <div className="text-white/90">
                <span className="text-emerald-400">❯</span> {i < line ? c.cmd : c.cmd.slice(0, chars)}
                {i === line && <span className="inline-block w-[7px] h-[15px] -mb-[2px] ml-0.5 bg-neon animate-pulse" />}
              </div>
              {i < line && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className="pl-4 text-white/65">
                  {c.out}
                </motion.div>
              )}
            </div>
          )
        )}
        {line >= CMDS.length && (
          <div className="text-white/90">
            <span className="text-emerald-400">❯</span> <span className="inline-block w-[7px] h-[15px] -mb-[2px] bg-neon animate-pulse" />
          </div>
        )}
      </div>
      <div className="mt-auto flex items-center gap-1.5 text-[11.5px] text-white/45">
        <MapPin className="w-3.5 h-3.5" /> {location}
      </div>
    </div>
  );
}

/* B — "Now building", styled like a music player */
export function NowBuilding() {
  return (
    <div className="h-full flex flex-col">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/50">Now building</div>
      <div className="mt-auto flex items-center gap-4">
        <div className="relative w-[88px] h-[88px] shrink-0 rounded-2xl bg-[conic-gradient(from_200deg,#22D3EE,#818CF8,#E879F9,#22D3EE)] p-[2px]">
          <div className="w-full h-full rounded-[14px] bg-[#0c1124] flex items-center justify-center">
            <Hammer className="w-8 h-8 text-white/90" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-grotesk text-[1.45rem] font-bold leading-tight text-white">AI-powered apps</div>
          <div className="mt-0.5 text-[13px] text-white/60">Arjun · full-stack + cloud + AI</div>
          <div className="mt-2 flex items-end gap-[3px] h-4">
            {[0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8].map((h, i) => (
              <span key={i} className="eq-bar w-[3px] rounded-full bg-emerald-400" style={{ height: `${h * 100}%`, animationDelay: `${-i * 0.18}s` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div initial={{ width: "0%" }} whileInView={{ width: "68%" }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} className="h-full rounded-full bg-gradient-to-r from-neon via-accent-soft to-fuchsia-300" />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10.5px] text-white/40">
          <span>2022</span>
          <span>now</span>
        </div>
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className="text-[12px] text-white/50">
          Up next: <span className="text-white/80">LLMs &amp; RAG</span>
        </span>
        <span className="flex items-center gap-3 text-white/70">
          <SkipBack className="w-4 h-4" />
          <span className="w-9 h-9 rounded-full bg-white text-[#0A0F1C] flex items-center justify-center">
            <Pause className="w-4 h-4 fill-current" />
          </span>
          <SkipForward className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

/* C — one neat line, with marker highlights that sweep in */
function Mark({ children, c, d }: { children: React.ReactNode; c: string; d: number }) {
  return (
    <span className="relative inline-block">
      <motion.span
        aria-hidden
        className="absolute left-[-3px] right-[-3px] bottom-[0.14em] h-[0.5em] rounded-[4px] origin-left"
        style={{ background: c }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: d, ease: EASE }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

export function MarkedLine() {
  return (
    <div className="h-full flex flex-col">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/50">In short</div>
      <p className="mt-5 font-grotesk text-[1.55rem] font-semibold leading-[1.45] tracking-[-0.015em] text-white/90">
        I build <Mark c="rgba(56,189,248,0.4)" d={0.2}>full-stack</Mark> products, run them on the <Mark c="rgba(251,146,60,0.4)" d={0.5}>cloud</Mark>, and give them{" "}
        <Mark c="rgba(232,121,249,0.45)" d={0.8}>AI</Mark> to think with.
      </p>
      <p className="mt-3 text-[13.5px] text-white/55">Three of them are live with real businesses today.</p>
      <div className="mt-auto flex items-center gap-1.5 text-[11.5px] text-white/45">
        <MapPin className="w-3.5 h-3.5" /> {location}
      </div>
    </div>
  );
}

export function IntroSmall() {
  return (
    <section className="relative py-20">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 space-y-12">
        <Tile label="Option A · Mini terminal (types itself out)">
          <MiniTerminal />
        </Tile>
        <Tile label="Option B · Now building">
          <NowBuilding />
        </Tile>
        <Tile label="Option C · One neat line">
          <MarkedLine />
        </Tile>
      </div>
    </section>
  );
}
