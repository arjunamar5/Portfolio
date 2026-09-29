"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  FileSpreadsheet, PhoneCall, Clock, Bug, Mail, StickyNote, HelpCircle, AlertTriangle, Play, CheckCircle2, Code2, ChevronsDown, LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Progress of `p` through the window [a, b], 0 → 1. */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Pt = { x: number; y: number };
type Layout = { P: Pt; C: Pt; S: Pt; rx: number; ry: number };

// Stage positions in % — side by side on wide screens, stacked on phones.
const WIDE: Layout = { P: { x: 14, y: 52 }, C: { x: 50, y: 52 }, S: { x: 86, y: 52 }, rx: 9.5, ry: 30 };
const TALL: Layout = { P: { x: 50, y: 13 }, C: { x: 50, y: 45 }, S: { x: 50, y: 81 }, rx: 34, ry: 6.5 };

// The mess: everyday friction, drawn as icons instead of words.
const MESS: { icon: LucideIcon; c: string; o: [number, number]; r: number }[] = [
  { icon: FileSpreadsheet, c: "#FB923C", o: [-0.75, -0.8], r: -14 },
  { icon: PhoneCall, c: "#F87171", o: [0.65, -0.6], r: 12 },
  { icon: AlertTriangle, c: "#FBBF24", o: [-0.05, -0.2], r: -8 },
  { icon: Bug, c: "#F43F5E", o: [0.85, 0.15], r: 18 },
  { icon: Mail, c: "#FB923C", o: [-0.9, 0.3], r: 10 },
  { icon: StickyNote, c: "#FCD34D", o: [0.3, 0.72], r: -16 },
  { icon: Clock, c: "#F97316", o: [-0.4, 0.92], r: 8 },
  { icon: HelpCircle, c: "#F87171", o: [0.15, -1], r: -6 },
];

// Abstract code: coloured token bars, one row per line (widths in %).
const TOKEN: Record<string, string> = { kw: "#C084FC", fn: "#60A5FA", str: "#34D399", num: "#FBBF24", pl: "#94A3B8", com: "#3B4A6B" };
const CODE: [string, number][][] = [
  [["com", 52]],
  [["kw", 14], ["fn", 24], ["pl", 16]],
  [["ind", 6], ["kw", 12], ["pl", 14], ["fn", 28]],
  [["ind", 6], ["fn", 18], ["str", 26]],
  [["ind", 6], ["kw", 14], ["num", 8], ["pl", 18]],
  [["fn", 20], ["pl", 10]],
];

const BARS = [38, 52, 34, 66, 58, 82, 96];

function MessItem({ p, i, L }: { p: MotionValue<number>; i: number; L: Layout }) {
  const m = MESS[i];
  const sx = L.P.x + m.o[0] * L.rx;
  const sy = L.P.y + m.o[1] * L.ry;
  const t = (v: number) => seg(v, 0.1 + i * 0.028, 0.4 + i * 0.028);
  const wide = L === WIDE;
  // Funnel: travel along the main axis first, then converge on the compiler.
  const left = useTransform(p, (v) => `${lerp(sx, L.C.x, wide ? smooth(t(v)) : Math.pow(t(v), 2.2))}%`);
  const top = useTransform(p, (v) => `${lerp(sy, L.C.y, wide ? Math.pow(t(v), 2.2) : smooth(t(v)))}%`);
  const scale = useTransform(p, (v) => 1 - t(v) * 0.6);
  const rotate = useTransform(p, (v) => m.r * (1 - t(v)) + t(v) * 160 * (i % 2 ? 1 : -1));
  const opacity = useTransform(p, (v) => 1 - seg(t(v), 0.82, 1));
  return (
    <motion.div className="absolute z-0" style={{ left, top, scale, rotate, opacity, x: "-50%", y: "-50%" }}>
      <div
        className="mess-wobble w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border backdrop-blur-sm"
        style={{
          borderColor: `${m.c}66`,
          background: `linear-gradient(145deg, ${m.c}2e, ${m.c}0d)`,
          boxShadow: `0 10px 26px -12px ${m.c}`,
          animationDelay: `${-i * 0.37}s`,
          animationDuration: `${2.4 + (i % 3) * 0.5}s`,
        }}
      >
        <m.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: m.c }} />
      </div>
    </motion.div>
  );
}

function CodeRow({ p, k, row }: { p: MotionValue<number>; k: number; row: [string, number][] }) {
  const reveal = useTransform(p, (v) => seg(v, 0.2 + k * 0.05, 0.27 + k * 0.05));
  const opacity = useTransform(reveal, (r) => (r > 0 ? 1 : 0.25));
  return (
    <div className="flex items-center gap-2.5">
      <motion.span style={{ opacity }} className="w-3 shrink-0 font-mono text-[9px] leading-none text-faint/60 text-right">
        {k + 1}
      </motion.span>
      <motion.div style={{ scaleX: reveal }} className="flex-1 flex items-center gap-1.5 origin-left">
        {row.map(([c, w], j) => (
          <span
            key={j}
            className="h-[7px] sm:h-2 rounded-full"
            style={{ width: `${w}%`, background: c === "ind" ? "transparent" : TOKEN[c], opacity: 0.88 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Packet({ p, k, L }: { p: MotionValue<number>; k: number; L: Layout }) {
  const t = (v: number) => seg(v, 0.6 + k * 0.035, 0.7 + k * 0.035);
  const left = useTransform(p, (v) => `${lerp(L.C.x, L.S.x, t(v))}%`);
  const top = useTransform(p, (v) => `${lerp(L.C.y, L.S.y, t(v))}%`);
  const opacity = useTransform(p, (v) => (t(v) > 0.02 && t(v) < 0.98 ? 1 : 0));
  return (
    <motion.span
      className="absolute z-[5] w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-emerald-300 shadow-[0_0_14px_4px_rgba(52,211,153,0.6)]"
      style={{ left, top, opacity }}
    />
  );
}

function Bar({ s, i, h }: { s: MotionValue<number>; i: number; h: number }) {
  const scaleY = useTransform(s, (v) => smooth(seg(v, 0.1 + i * 0.05, 0.38 + i * 0.05)));
  return (
    <motion.span
      className="flex-1 rounded-t-[4px] origin-bottom"
      style={{
        height: `${h}%`,
        scaleY,
        background: i === BARS.length - 1 ? "linear-gradient(180deg,#34D399,#059669)" : "linear-gradient(180deg,#60A5FA,#3B82F6)",
        opacity: i === BARS.length - 1 ? 1 : 0.55 + i * 0.05,
      }}
    />
  );
}

function Row({ s, i }: { s: MotionValue<number>; i: number }) {
  const r = useTransform(s, (v) => seg(v, 0.5 + i * 0.12, 0.66 + i * 0.12));
  const x = useTransform(r, (v) => (1 - v) * -14);
  return (
    <motion.div style={{ opacity: r, x }} className="flex items-center gap-2 rounded-lg border border-line bg-void/50 px-2.5 py-1.5">
      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
      <span className="h-1.5 rounded-full bg-bone/25" style={{ width: `${62 - i * 14}%` }} />
      <span className="ml-auto h-1.5 w-6 rounded-full bg-emerald-400/40" />
    </motion.div>
  );
}

function Stage({ p, L }: { p: MotionValue<number>; L: Layout }) {
  const wide = L === WIDE;

  // Problem zone calms down as the mess leaves it.
  const messOpacity = useTransform(p, (v) => 1 - seg(v, 0.08, 0.34));
  const zoneBorder = useTransform(p, (v) => `rgba(251,146,60,${0.35 - seg(v, 0.1, 0.45) * 0.25})`);
  // Compiler lights up while it works.
  const heat = useTransform(p, (v) => seg(v, 0.1, 0.3) * (1 - seg(v, 0.72, 0.9) * 0.6));
  const coreGlow = useTransform(heat, (g) => `0 0 0 1px rgba(96,165,250,${0.2 + g * 0.5}), 0 30px 80px -20px rgba(59,130,246,${g * 0.75})`);
  const ringOpacity = useTransform(heat, (g) => g);
  const build = useTransform(p, (v) => seg(v, 0.5, 0.64));
  const built = useTransform(p, (v) => seg(v, 0.63, 0.67));
  // The product assembles on the other side.
  const s = useTransform(p, (v) => seg(v, 0.64, 0.92));
  const dashed = useTransform(s, (v) => 1 - v);
  const appGlow = useTransform(s, (v) => `0 0 0 1px rgba(52,211,153,${v * 0.45}), 0 30px 80px -24px rgba(52,211,153,${v * 0.7})`);
  const live = useTransform(s, (v) => smooth(seg(v, 0.86, 1)));
  const head = useTransform(s, (v) => seg(v, 0, 0.2));
  // A line that fills with scroll progress — the path from problem to product.
  const fill = useTransform(p, (v) => seg(v, 0.08, 0.9));
  const hint = useTransform(p, (v) => 1 - seg(v, 0, 0.06));

  const zoneStyle: React.CSSProperties = wide
    ? { left: `${L.P.x - L.rx - 5}%`, top: `${L.P.y - L.ry - 10}%`, width: `${(L.rx + 5) * 2}%`, height: `${(L.ry + 10) * 2}%` }
    : { left: `${L.P.x - L.rx - 7}%`, top: `${L.P.y - L.ry - 6.5}%`, width: `${(L.rx + 7) * 2}%`, height: `${(L.ry + 6.5) * 2}%` };
  const at = (pt: Pt) => ({ left: `${pt.x}%`, top: `${pt.y}%`, x: "-50%", y: "-50%" });

  return (
    <>
      {/* The path */}
      {wide ? (
        <div className="absolute h-px bg-line-strong" style={{ left: `${L.P.x}%`, right: `${100 - L.S.x}%`, top: `${L.C.y}%` }}>
          <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-gradient-to-r from-orange-400 via-accent to-emerald-400" />
        </div>
      ) : (
        <div className="absolute w-px bg-line-strong" style={{ top: `${L.P.y}%`, bottom: `${100 - L.S.y}%`, left: `${L.C.x}%` }}>
          <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gradient-to-b from-orange-400 via-accent to-emerald-400" />
        </div>
      )}

      {/* 01 · Problem zone */}
      <motion.div className="absolute rounded-3xl border border-dashed" style={{ ...zoneStyle, borderColor: zoneBorder }}>
        <span className="absolute -top-2.5 left-4 px-1.5 bg-void font-mono text-[10px] uppercase tracking-[0.22em] text-orange-300/90">01 · Problem</span>
        <motion.svg
          style={{ opacity: messOpacity }}
          viewBox="0 0 200 200"
          preserveAspectRatio="none"
          className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)]"
          aria-hidden
        >
          <path
            d="M20 60 C 60 10, 90 120, 130 40 S 190 90, 150 140 S 60 190, 70 120 S 170 30, 180 170 S 30 150, 40 100 S 120 70, 100 180"
            fill="none"
            stroke="rgba(248,113,113,0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>
      </motion.div>

      {MESS.map((_, i) => (
        <MessItem key={i} p={p} i={i} L={L} />
      ))}

      {/* 02 · The compiler */}
      <motion.div
        className={`absolute z-10 rounded-2xl bg-[#05080f] border border-accent/30 flex flex-col ${
          wide ? "w-[28%] max-w-[360px] h-[52%] min-h-[220px] max-h-[300px]" : "w-[82%] h-[32%]"
        }`}
        style={{ ...at(L.C), boxShadow: coreGlow }}
      >
        <motion.span style={{ opacity: ringOpacity }} className="compiler-ring pointer-events-none absolute -inset-px rounded-2xl" />
        <div className="relative flex items-center gap-2 px-3.5 py-2 border-b border-line">
          <span className="w-2 h-2 rounded-full bg-bone/15" />
          <span className="w-2 h-2 rounded-full bg-bone/15" />
          <span className="w-2 h-2 rounded-full bg-bone/15" />
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-soft">
            <Code2 className="w-3.5 h-3.5" /> 02 · Code
          </span>
        </div>
        <div className="relative flex-1 min-h-0 flex flex-col justify-evenly px-3.5 py-1.5">
          {(wide ? CODE : CODE.slice(0, 4)).map((row, k) => (
            <CodeRow key={k} p={p} k={k} row={row} />
          ))}
        </div>
        <div className="relative flex items-center gap-2.5 px-3.5 py-2 border-t border-line">
          <Play className="w-3.5 h-3.5 text-emerald-300" />
          <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
            <motion.div style={{ scaleX: build }} className="h-full origin-left bg-gradient-to-r from-accent to-emerald-400" />
          </div>
          <motion.span style={{ opacity: built, scale: built }}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </motion.span>
        </div>
      </motion.div>

      {[0, 1, 2].map((k) => (
        <Packet key={k} p={p} k={k} L={L} />
      ))}

      {/* 03 · Working software */}
      <motion.div
        className={`absolute z-10 rounded-2xl bg-[#0A0F1C] flex flex-col overflow-hidden ${
          wide ? "w-[26%] max-w-[330px] h-[56%] min-h-[240px] max-h-[320px]" : "w-[82%] h-[36%]"
        }`}
        style={{ ...at(L.S), boxShadow: appGlow }}
      >
        <motion.span style={{ opacity: dashed }} className="pointer-events-none absolute inset-0 rounded-2xl border border-dashed border-line-strong" />
        <div className="flex items-center gap-2 px-3 py-2 border-b border-line">
          <span className="w-2 h-2 rounded-full bg-bone/15" />
          <span className="w-2 h-2 rounded-full bg-bone/15" />
          <span className="ml-1 h-3.5 flex-1 rounded bg-panel-2" />
          <motion.span
            style={{ opacity: live, scale: live }}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-emerald-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
          </motion.span>
        </div>
        <div className="flex-1 min-h-0 flex flex-col gap-2 p-3">
          <motion.div style={{ opacity: head }} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-neon" />
            <span className="h-2 w-20 rounded-full bg-bone/40" />
            <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300/80">03 · Software</span>
          </motion.div>
          <div className="flex-1 min-h-[32px] flex items-end gap-1.5 border-b border-line">
            {BARS.map((h, i) => (
              <Bar key={i} s={s} i={i} h={h} />
            ))}
          </div>
          {wide && (
            <div className="flex flex-col gap-1.5">
              {[0, 1, 2].map((i) => (
                <Row key={i} s={s} i={i} />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Scroll cue — fades once the story starts */}
      <motion.div style={{ opacity: hint, x: "-50%" }} className="absolute left-1/2 -bottom-1 text-faint">
        <ChevronsDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </>
  );
}

export function ProblemCompiler() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <section id="approach" className="relative border-t border-line">
      {/* Tall track; the stage stays pinned while you scroll through the story. */}
      <div ref={track} className="relative h-[300vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col">
          <div className="aurora-blob w-[560px] h-[420px] -top-20 left-[5%] bg-orange-500/10" />
          <div className="aurora-blob w-[560px] h-[420px] bottom-0 right-[5%] bg-emerald-400/10" style={{ animationDelay: "-7s" }} />

          <div className="relative flex-1 min-h-0 w-full max-w-[1240px] mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-6 sm:pb-8 flex flex-col">
            <SectionHeading index="02" eyebrow="What I do" title="I turn real-world problems into working software." accentFrom={5} />
            <div className="relative flex-1 min-h-0 mt-5 sm:mt-8">
              <Stage key={wide ? "w" : "t"} p={scrollYProgress} L={wide ? WIDE : TALL} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
