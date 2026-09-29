"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup, useInView } from "framer-motion";
import {
  AlertTriangle, Code2, Rocket, Play, CheckCircle2, FileSpreadsheet, MessageCircle, BarChart3, Activity, ArrowRight, ArrowDown, LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

type Seg = string | { k: string } | { t: string; c: "kw" | "fn" | "str" | "com" | "num" };
type AppKind = "sync" | "chat" | "insights" | "status";
type Case = { tab: string; icon: LucideIcon; problem: Seg[]; code: Seg[][]; app: AppKind; url: string };

const SYNTAX: Record<string, string> = { kw: "#C084FC", fn: "#60A5FA", str: "#34D399", com: "#5C6780", num: "#FBBF24" };

// Everyday problems — generic on purpose. Keywords ({ k }) fly from the sentence into the code.
const CASES: Case[] = [
  {
    tab: "Manual work",
    icon: FileSpreadsheet,
    problem: ["We copy ", { k: "spreadsheets" }, " into our system by hand every ", { k: "day" }, "."],
    code: [
      [{ t: "// automate the boring part", c: "com" }],
      [{ t: "every", c: "fn" }, "(", { k: "day" }, ", ", { t: "async", c: "kw" }, " () => {"],
      ["  ", { t: "const", c: "kw" }, " rows = ", { t: "await", c: "kw" }, " ", { t: "read", c: "fn" }, "(", { k: "spreadsheets" }, ");"],
      ["  ", { t: "await", c: "kw" }, " db.", { t: "upsert", c: "fn" }, "(rows);"],
      ["});"],
    ],
    app: "sync",
    url: "ops.yourteam.app",
  },
  {
    tab: "Phone-only bookings",
    icon: MessageCircle,
    problem: ["Customers have to ", { k: "call" }, " us just to ", { k: "book" }, " a slot."],
    code: [
      [{ t: "// let customers book themselves", c: "com" }],
      ["bot.", { t: "on", c: "fn" }, "(", { k: "book" }, ", ", { t: "async", c: "kw" }, " (msg) => {"],
      ["  ", { t: "const", c: "kw" }, " slot = ", { t: "await", c: "kw" }, " ", { t: "findFreeSlot", c: "fn" }, "(msg);"],
      ["  ", { t: "return", c: "kw" }, " ", { t: "confirm", c: "fn" }, "(slot); ", { t: "// no ", c: "com" }, { k: "call" }],
      ["});"],
    ],
    app: "chat",
    url: "chat.yourbusiness.app",
  },
  {
    tab: "Guesswork",
    icon: BarChart3,
    problem: ["We can't see which ", { k: "products" }, " actually ", { k: "sell" }, "."],
    code: [
      [{ t: "// turn raw orders into answers", c: "com" }],
      [{ t: "const", c: "kw" }, " trend = ", { t: "analyze", c: "fn" }, "(orders)"],
      ["  .", { t: "groupBy", c: "fn" }, "(", { k: "products" }, ")"],
      ["  .", { t: "rankBy", c: "fn" }, "(", { k: "sell" }, ", ", { t: "\"30d\"", c: "str" }, ");"],
      [{ t: "render", c: "fn" }, "(<", { t: "Dashboard", c: "kw" }, " data={trend} />);"],
    ],
    app: "insights",
    url: "insights.yourstore.app",
  },
  {
    tab: "Crashes at scale",
    icon: Activity,
    problem: ["Our site ", { k: "crashes" }, " whenever ", { k: "traffic" }, " spikes."],
    code: [
      [{ t: "// scale with demand, heal on failure", c: "com" }],
      [{ t: "deploy", c: "fn" }, "(app, {"],
      ["  autoscale: { on: ", { k: "traffic" }, ", max: ", { t: "10", c: "num" }, " },"],
      ["  health: ", { t: "\"/status\"", c: "str" }, ", ", { t: "// no ", c: "com" }, { k: "crashes" }],
      ["});"],
    ],
    app: "status",
    url: "status.yoursite.app",
  },
];

const segText = (s: Seg) => (typeof s === "string" ? s : "k" in s ? s.k : s.t);
const problemLength = (c: Case) => c.problem.reduce((n, s) => n + segText(s).length, 0);
/** Index of the code line where each keyword lands. */
const landLine = (c: Case, k: string) => c.code.findIndex((line) => line.some((s) => typeof s !== "string" && "k" in s && s.k === k));

function KeywordChip({ id, text, glow }: { id: string; text: string; glow?: boolean }) {
  return (
    <motion.span
      layoutId={id}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="inline-block rounded-md px-1.5 mx-0.5 font-mono"
      style={{
        color: "#F2F4F8",
        background: glow ? "linear-gradient(135deg, rgba(249,115,22,0.35), rgba(236,72,153,0.3))" : "rgba(34,211,238,0.18)",
        boxShadow: glow ? "0 0 18px rgba(249,115,22,0.45), inset 0 0 0 1px rgba(251,146,60,0.6)" : "0 0 14px rgba(34,211,238,0.35), inset 0 0 0 1px rgba(34,211,238,0.55)",
      }}
    >
      {text}
    </motion.span>
  );
}

/* ---------------- the "working software" that pops out ---------------- */

function AppView({ kind }: { kind: AppKind }) {
  if (kind === "sync")
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-bone">Daily sync</span>
          <span className="text-[10px] rounded-full px-2 py-0.5 bg-emerald-400/15 text-emerald-300">Automated</span>
        </div>
        {["Sales.xlsx", "Stock.xlsx", "Leads.csv"].map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.15 }}
            className="flex items-center justify-between rounded-lg border border-line bg-void/50 px-3 py-2 text-xs"
          >
            <span className="text-dim">{f} → database</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </motion.div>
        ))}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span className="text-faint">Manual steps</span>
          <span className="font-semibold text-emerald-300">0</span>
        </div>
      </div>
    );
  if (kind === "chat")
    return (
      <div className="p-4 space-y-2.5 text-xs">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-accent/25 border border-accent/40 px-3 py-2 text-bone">
          Can I book a slot at 7 PM?
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-fit max-w-[85%] rounded-2xl rounded-tl-md bg-panel-2 border border-line px-3 py-2 text-bone/90">
          Booked ✓ 7:00 PM today. See you then!
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center gap-1.5 pt-2 text-[11px] text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" /> No phone call needed
        </motion.div>
      </div>
    );
  if (kind === "insights") {
    const bars = [42, 68, 35, 92, 55];
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-bone">Best sellers · 30 days</span>
          <span className="text-[10px] rounded-full px-2 py-0.5 bg-accent/15 text-accent-soft">Live</span>
        </div>
        <div className="flex items-end gap-2 h-28">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              {i === 3 && (
                <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-[9px] text-amber-300 whitespace-nowrap">
                  Top seller
                </motion.span>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                className="w-full rounded-t-md"
                style={{ background: i === 3 ? "linear-gradient(180deg,#FBBF24,#F97316)" : "linear-gradient(180deg,#60A5FA,#3B82F6)", opacity: i === 3 ? 1 : 0.55 }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5 font-mono text-[9px] text-faint">
          {["A", "B", "C", "D", "E"].map((l) => (
            <span key={l} className="flex-1 text-center">
              {l}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All systems operational
      </div>
      <div>
        <div className="text-[10px] text-faint mb-1.5">Instances (auto-scaling)</div>
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.18, type: "spring", stiffness: 300, damping: 18 }}
              className="h-7 flex-1 rounded-md border border-accent/40 bg-accent/15"
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-line bg-void/50 px-3 py-2 text-xs">
        <span className="text-dim">Traffic spike ×5</span>
        <span className="text-emerald-300">0 downtime</span>
      </div>
    </div>
  );
}

/* ---------------- the section ---------------- */

type State = { c: number; phase: 0 | 1 | 2 | 3 | 4; chars: number; lines: number };

export function ProblemCompiler() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const [s, setS] = useState<State>({ c: 0, phase: 0, chars: 0, lines: 0 });
  const reduce = useRef(false);
  const cs = CASES[s.c];
  const len = problemLength(cs);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // One small state machine drives the whole story: type → highlight → code → build → app → next.
  useEffect(() => {
    if (!inView) return;
    if (reduce.current && s.phase < 4) {
      setS({ ...s, phase: 4, chars: len, lines: cs.code.length });
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    if (s.phase === 0) t = s.chars < len ? setTimeout(() => setS({ ...s, chars: s.chars + 1 }), 32) : setTimeout(() => setS({ ...s, phase: 1 }), 250);
    else if (s.phase === 1) t = setTimeout(() => setS({ ...s, phase: 2 }), 900);
    else if (s.phase === 2) t = s.lines < cs.code.length ? setTimeout(() => setS({ ...s, lines: s.lines + 1 }), 520) : setTimeout(() => setS({ ...s, phase: 3 }), 350);
    else if (s.phase === 3) t = setTimeout(() => setS({ ...s, phase: 4 }), 1400);
    else t = setTimeout(() => setS({ c: (s.c + 1) % CASES.length, phase: 0, chars: 0, lines: 0 }), reduce.current ? 6000 : 3800);
    return () => clearTimeout(t);
  }, [s, inView, len, cs.code.length]);

  const pick = (i: number) => setS({ c: i, phase: 0, chars: 0, lines: 0 });

  // Problem sentence, typed out; keywords become glowing chips, then leave for the code.
  let budget = s.chars;
  const problem = cs.problem.map((seg, i) => {
    const txt = segText(seg);
    const shown = txt.slice(0, Math.max(0, budget));
    budget -= txt.length;
    if (!shown) return null;
    if (typeof seg !== "string" && "k" in seg) {
      const flown = s.phase >= 2 && s.lines > landLine(cs, seg.k);
      if (s.phase >= 1 && !flown) return <KeywordChip key={i} id={`kw-${s.c}-${seg.k}`} text={shown} glow />;
      return (
        <span key={i} className={flown ? "text-orange-200/40 underline decoration-dotted decoration-orange-400/50 underline-offset-[6px]" : ""}>
          {shown}
        </span>
      );
    }
    return <span key={i}>{shown}</span>;
  });

  const building = s.phase === 3;
  const deployed = s.phase === 4;

  const connector = (on: boolean, vertical = false) => (
    <div className={`flex items-center justify-center ${vertical ? "py-2 lg:hidden" : "hidden lg:flex"}`}>
      <div className={`relative ${vertical ? "h-8 w-px" : "w-10 h-px"} bg-line-strong overflow-hidden`}>
        {on && (
          <motion.span
            initial={vertical ? { top: "-20%" } : { left: "-20%" }}
            animate={vertical ? { top: "110%" } : { left: "110%" }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            className="absolute w-2 h-2 -mt-[3.5px] -ml-[3.5px] rounded-full bg-neon shadow-[0_0_10px_3px_rgba(34,211,238,0.6)]"
            style={vertical ? { left: "50%" } : { top: "50%" }}
          />
        )}
      </div>
      {vertical ? <ArrowDown className="absolute w-3.5 h-3.5 text-faint mt-9" /> : <ArrowRight className="w-3.5 h-3.5 text-faint -ml-1" />}
    </div>
  );

  const Label = ({ n, text, icon: Icon, color, on }: { n: string; text: string; icon: LucideIcon; color: string; on: boolean }) => (
    <div className="flex items-center gap-2 mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] transition-colors duration-500" style={{ color: on ? color : "#5C6780" }}>
      <Icon className="w-3.5 h-3.5" />
      <span className="opacity-60">{n}</span> {text}
    </div>
  );

  return (
    <section id="approach" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="aurora-blob w-[560px] h-[420px] -top-20 left-[10%] bg-orange-500/10" />
      <div className="aurora-blob w-[560px] h-[420px] bottom-0 right-[5%] bg-cyan-400/10" style={{ animationDelay: "-7s" }} />

      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <SectionHeading
          index="02"
          eyebrow="What I do"
          title="I turn real-world problems into working software."
          accentFrom={5}
          lede="Pick a problem — watch it turn into code, then into a working product."
        />

        {/* Problem picker */}
        <div className="mt-10 flex flex-wrap gap-2">
          {CASES.map((c, i) => (
            <button
              key={c.tab}
              onClick={() => pick(i)}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${s.c === i ? "text-bone" : "text-dim hover:text-bone"}`}
            >
              {s.c === i && (
                <motion.span
                  layoutId="compiler-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full border border-orange-400/40 bg-gradient-to-r from-orange-500/15 to-pink-500/10"
                />
              )}
              <c.icon className="relative w-4 h-4" />
              <span className="relative">{c.tab}</span>
            </button>
          ))}
        </div>

        <LayoutGroup id="compiler">
          <div ref={ref} className="mt-6 grid grid-cols-1 lg:grid-cols-[0.95fr_auto_1.25fr_auto_0.95fr] items-stretch">
            {/* 01 · The problem */}
            <div>
              <Label n="01" text="The problem" icon={AlertTriangle} color="#FB923C" on={s.phase <= 1} />
              <div className="relative min-h-[170px] lg:h-[250px] rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/[0.08] to-transparent p-5 pb-12 overflow-hidden">
                <span className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-orange-500/10 blur-2xl" />
                <p className="relative text-xl sm:text-2xl leading-[1.5] text-bone/90 font-medium">
                  <span className="text-orange-300/80 text-3xl leading-none mr-1">“</span>
                  {problem}
                  {s.phase === 0 && <span className="caret inline-block w-[2px] h-[1em] -mb-[3px] ml-0.5 bg-orange-300" />}
                </p>
                <div className="absolute left-5 bottom-4 text-[11px] text-faint">— a real team, every day</div>
                {/* Closes the loop once the app is live */}
                <AnimatePresence>
                  {deployed && (
                    <motion.div
                      key={`solved-${s.c}`}
                      initial={{ opacity: 0, scale: 1.8, rotate: -4 }}
                      animate={{ opacity: 1, scale: 1, rotate: -10 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 18 }}
                      className="absolute right-4 bottom-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-emerald-400/70 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 bg-emerald-400/10 shadow-[0_0_24px_-4px_rgba(52,211,153,0.6)]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {connector(s.phase === 2)}
            {connector(s.phase === 2, true)}

            {/* 02 · The code */}
            <div>
              <Label n="02" text="The code" icon={Code2} color="#60A5FA" on={s.phase >= 2 && s.phase <= 3} />
              <div className="relative h-[250px] rounded-2xl border border-accent/25 bg-[#05080f] overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-line">
                  <span className="w-2 h-2 rounded-full bg-bone/15" />
                  <span className="w-2 h-2 rounded-full bg-bone/15" />
                  <span className="w-2 h-2 rounded-full bg-bone/15" />
                  <span className="ml-2 font-mono text-[11px] text-dim">solution.ts</span>
                </div>
                <div className="flex-1 px-4 py-3 font-mono text-[11px] sm:text-[12.5px] leading-[1.9]">
                  {cs.code.map((line, li) => (
                    <div key={`${s.c}-${li}`} className="flex whitespace-pre">
                      <span className="w-6 shrink-0 text-faint/40 select-none">{li + 1}</span>
                      <AnimatePresence>
                        {li < s.lines && (
                          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="text-bone/85">
                            {line.map((seg, si) =>
                              typeof seg === "string" ? (
                                <span key={si}>{seg}</span>
                              ) : "k" in seg ? (
                                <KeywordChip key={si} id={`kw-${s.c}-${seg.k}`} text={seg.k} />
                              ) : (
                                <span key={si} style={{ color: SYNTAX[seg.c] }}>
                                  {seg.t}
                                </span>
                              )
                            )}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                {/* Run / build bar */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-t border-line text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-colors ${
                      building || deployed ? "bg-emerald-400/15 text-emerald-300" : "bg-panel-2 text-faint"
                    }`}
                  >
                    <Play className="w-3 h-3" /> Run
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
                    <motion.div
                      key={`${s.c}-${building}`}
                      initial={{ width: deployed ? "100%" : "0%" }}
                      animate={{ width: building || deployed ? "100%" : "0%" }}
                      transition={{ duration: building ? 1.3 : 0.2, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-accent to-emerald-400"
                    />
                  </div>
                  <span className={`font-mono ${deployed ? "text-emerald-300" : "text-faint"}`}>{deployed ? "deployed ✓" : building ? "building…" : "idle"}</span>
                </div>
              </div>
            </div>

            {connector(s.phase >= 3)}
            {connector(s.phase >= 3, true)}

            {/* 03 · Working software */}
            <div>
              <Label n="03" text="Working software" icon={Rocket} color="#34D399" on={deployed} />
              <div
                className="relative h-[250px] rounded-2xl border overflow-hidden transition-shadow duration-700"
                style={{
                  borderColor: deployed ? "rgba(52,211,153,0.45)" : "rgba(148,163,199,0.14)",
                  boxShadow: deployed ? "0 0 0 1px rgba(52,211,153,0.2), 0 24px 60px -24px rgba(52,211,153,0.6)" : "none",
                  background: "#0A0F1C",
                }}
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-line">
                  <span className="w-2 h-2 rounded-full bg-bone/15" />
                  <span className="w-2 h-2 rounded-full bg-bone/15" />
                  <span className="ml-1 flex-1 rounded bg-panel-2 px-2 py-0.5 font-mono text-[10px] text-faint truncate">{cs.url}</span>
                </div>
                <AnimatePresence mode="wait">
                  {deployed ? (
                    <motion.div
                      key={`app-${s.c}`}
                      initial={{ opacity: 0, scale: 0.92, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <AppView kind={cs.app} />
                    </motion.div>
                  ) : (
                    <motion.div key={`wait-${s.c}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-2.5">
                      {[70, 90, 55, 80].map((w, i) => (
                        <div key={i} className="h-3 rounded-full bg-line animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
                      ))}
                      <div className="pt-6 text-center text-[11px] text-faint">{building ? "Deploying…" : "Waiting for a build"}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
