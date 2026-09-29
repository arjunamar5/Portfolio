"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Bot, CheckCircle2, BellRing, UserPlus, Globe, Receipt, Sparkles } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { VisualFrame, TypingDots } from "./VisualFrame";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Monotonic tick while the visual is on screen (pauses, never resets, off screen). */
function useTicker(stepMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setTick((t) => t + 1), stepMs);
    return () => clearInterval(id);
  }, [inView, stepMs]);
  return { ref, tick };
}

/** Text that types itself out once, on mount. Remount (via key) to replay. */
function Typed({ text, charMs = 24, caret }: { text: string; charMs?: number; caret?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), charMs);
    return () => clearInterval(id);
  }, [text, charMs]);
  return (
    <>
      {text.slice(0, n)}
      {caret && n < text.length && (
        <span className="inline-block w-[5px] h-[1em] -mb-[2px] ml-0.5 animate-pulse" style={{ background: caret }} />
      )}
    </>
  );
}

const pop = {
  initial: { opacity: 0, y: 10, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.5, ease: EASE },
};

/* ------------------------------------------------------------------ */
/* CueCourtOS — WhatsApp booking → real-time court block → auto bill   */
/* ------------------------------------------------------------------ */

const TIMES = ["5 PM", "6 PM", "7 PM", "8 PM", "9 PM"];
const COURTS = ["Court 1", "Court 2", "Court 3"];
const BOOKED: Record<string, string> = {
  "0-0": "Member",
  "1-0": "Member",
  "1-2": "Walk-in",
  "2-0": "WhatsApp",
  "3-1": "Member",
  "3-2": "WhatsApp",
  "4-0": "Walk-in",
};
const TARGET = "2-1"; // 7 PM · Court 2

export function CourtVisual({ accent }: { accent: string }) {
  const { ref, tick } = useTicker(1700);
  const step = tick % 6; // 0 typing · 1 request · 2 blocking · 3 booked+bill · 4 CueBot · 5 hold
  const cycle = Math.floor(tick / 6);

  const cell = (r: number, c: number) => {
    const key = `${r}-${c}`;
    if (key === TARGET) {
      if (step >= 3)
        return (
          <motion.div
            key={`t-booked-${cycle}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="h-full rounded-md flex items-center justify-center font-medium text-bone"
            style={{ background: `${accent}55`, border: `1px solid ${accent}`, boxShadow: `0 0 16px ${accent}66` }}
          >
            WhatsApp ✓
          </motion.div>
        );
      if (step === 2)
        return (
          <div className="h-full rounded-md flex items-center justify-center text-amber-200 border border-amber-400/70 bg-amber-400/15 animate-pulse">
            Blocking…
          </div>
        );
    }
    const label = BOOKED[key];
    if (label)
      return (
        <div
          className="h-full rounded-md flex items-center justify-center"
          style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: `${accent}` }}
        >
          {label}
        </div>
      );
    return <div className="h-full rounded-md border border-dashed border-line-strong flex items-center justify-center text-faint">Open</div>;
  };

  return (
    <div ref={ref}>
      <VisualFrame
        title="CueCourtOS · Venue console"
        accent={accent}
        overlay={
          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                key={`cuebot-${cycle}`}
                {...pop}
                className="absolute -bottom-6 left-4 sm:left-8 z-10 glass !bg-panel/90 rounded-2xl px-4 py-3 max-w-[300px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)]"
                style={{ borderColor: `${accent}66` }}
              >
                <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase mb-1" style={{ color: accent }}>
                  <Bot className="w-3.5 h-3.5" /> CueBot · analytics
                </div>
                <div className="text-[11px] text-faint">&ldquo;Busiest slots this week?&rdquo;</div>
                <div className="text-xs text-bone mt-0.5">
                  <Typed text="Evenings, 6–9 PM — Courts 1 & 2 are nearly full." charMs={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1.35fr_1fr]">
          {/* Booking grid */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-medium text-bone">Day view</div>
                <div className="text-[10px] text-faint">Today · evening session</div>
              </div>
              <div className="flex items-center gap-2.5 text-[9px] text-faint">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm" style={{ background: `${accent}88` }} /> Booked
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-amber-400/70" /> Blocking
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm border border-dashed border-line-strong" /> Open
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[36px_repeat(3,1fr)] gap-1.5 text-[10px]">
              <span />
              {COURTS.map((c) => (
                <span key={c} className="text-center text-dim pb-0.5">
                  {c}
                </span>
              ))}
              {TIMES.map((t, r) => (
                <React.Fragment key={t}>
                  <span className="text-faint flex items-center">{t}</span>
                  {COURTS.map((_, c) => (
                    <div key={c} className="h-9 sm:h-10">
                      {cell(r, c)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* WhatsApp + auto bill */}
          <div className="border-t sm:border-t-0 sm:border-l border-line p-3 flex flex-col gap-2.5 min-h-[250px]">
            <div className="rounded-xl border border-line bg-void/40 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] text-dim mb-2">
                <SiWhatsapp className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp bookings
              </div>
              <div className="space-y-1.5 text-[11px] leading-snug min-h-[74px]">
                <AnimatePresence mode="popLayout">
                  {step === 0 ? (
                    <motion.div key={`dots-${cycle}`} {...pop} className="w-fit rounded-lg rounded-tl-sm bg-panel-2 px-2.5">
                      <TypingDots />
                    </motion.div>
                  ) : (
                    <motion.div key={`req-${cycle}`} {...pop} className="w-fit max-w-[90%] rounded-lg rounded-tl-sm bg-panel-2 px-2.5 py-1.5 text-bone/90">
                      Court 2 at 7 PM today?
                    </motion.div>
                  )}
                  {step >= 3 && (
                    <motion.div
                      key={`ok-${cycle}`}
                      {...pop}
                      className="ml-auto w-fit max-w-[92%] rounded-lg rounded-tr-sm bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1.5 text-emerald-50"
                    >
                      Booked ✓ Court 2 · 7–8 PM. Your bill will arrive here.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  key={`bill-${cycle}`}
                  {...pop}
                  transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                  className="rounded-xl border bg-void/40 p-2.5 text-[10px]"
                  style={{ borderColor: `${accent}55` }}
                >
                  <div className="flex items-center gap-1.5 text-dim mb-1.5">
                    <Receipt className="w-3.5 h-3.5" style={{ color: accent }} /> Auto bill · Court 2
                  </div>
                  {["Court 2 · 1 hr", "Add-on · racket rental", "Café · 2 × cold coffee"].map((line, i) => (
                    <motion.div
                      key={line}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.12 }}
                      className="flex justify-between text-bone/85 py-0.5"
                    >
                      <span>{line}</span>
                      <span className="text-faint">✓</span>
                    </motion.div>
                  ))}
                  <div className="mt-1.5 pt-1.5 border-t border-line flex items-center gap-1 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> Membership pricing applied
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </VisualFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Perfect Study Space — branches, live seat map, automated activity   */
/* ------------------------------------------------------------------ */

const BRANCHES = [
  { name: "All branches", checkedIn: 118, free: 34, due: 12, seed: 7 },
  { name: "Branch 1", checkedIn: 46, free: 10, due: 4, seed: 3 },
  { name: "Branch 2", checkedIn: 39, free: 13, due: 5, seed: 11 },
  { name: "Branch 3", checkedIn: 33, free: 11, due: 3, seed: 5 },
];

const EVENTS = [
  { icon: CheckCircle2, text: "Attendance marked · Seat B4", color: "#34D399" },
  { icon: BellRing, text: "Fee reminder sent on WhatsApp", color: "#FBBF24" },
  { icon: UserPlus, text: "New registration · Seat A2 allocated", color: "#60A5FA" },
  { icon: Globe, text: "Website enquiry → staff CRM", color: "#22D3EE" },
];

const SEATS = 40;

/** Deterministic seat states per branch: 0 free · 1 occupied · 2 reserved. */
function seatStates(seed: number, occupancy: number) {
  let x = seed;
  return Array.from({ length: SEATS }, () => {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    return r < occupancy ? 1 : r < occupancy + 0.08 ? 2 : 0;
  });
}

export function StudyVisual({ accent }: { accent: string }) {
  const { ref, tick } = useTicker(1500);
  const bi = Math.floor(tick / 4) % BRANCHES.length;
  const branch = BRANCHES[bi];
  const seats = seatStates(branch.seed, branch.checkedIn / (branch.checkedIn + branch.free) - 0.05);
  const feed = [tick, tick - 1, tick - 2].filter((t) => t >= 0);

  const kpis = [
    { label: "Checked in today", value: branch.checkedIn },
    { label: "Seats free", value: branch.free },
    { label: "Fees due", value: branch.due },
  ];

  return (
    <div ref={ref}>
      <VisualFrame title="Perfect Study Space · Admin" accent={accent}>
        <div className="p-4 space-y-3">
          {/* Branch switcher */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
            {BRANCHES.map((b, i) => (
              <span key={b.name} className="relative shrink-0 px-3 py-1.5 rounded-full text-[11px]">
                {i === bi && (
                  <motion.span
                    layoutId="pss-branch"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: `${accent}22`, border: `1px solid ${accent}66` }}
                  />
                )}
                <span className={`relative ${i === bi ? "text-bone" : "text-faint"}`}>{b.name}</span>
              </span>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-line bg-void/40 px-3 py-2.5 overflow-hidden">
                <div className="h-6 relative">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${k.label}-${bi}`}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="text-lg font-semibold text-bone leading-6 tabular-nums"
                    >
                      {k.value}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="text-[10px] text-faint mt-0.5 truncate">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-3">
            {/* Seat map */}
            <div className="rounded-xl border border-line bg-void/40 p-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5 text-[10px] text-dim">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} /> Live seat map
                </span>
                <span className="flex items-center gap-2 text-[9px] text-faint">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-[3px]" style={{ background: accent }} /> In
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-[3px] border border-amber-400/80" /> Reserved
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {seats.map((s, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      backgroundColor: s === 1 ? accent : "rgba(148,163,199,0.08)",
                      borderColor: s === 2 ? "rgba(251,191,36,0.8)" : s === 1 ? accent : "rgba(148,163,199,0.18)",
                      opacity: s === 1 ? 0.9 : 1,
                    }}
                    transition={{ duration: 0.35, delay: (i % 8) * 0.03 + Math.floor(i / 8) * 0.05 }}
                    className="aspect-square rounded-[4px] border"
                  />
                ))}
              </div>
            </div>

            {/* Automation feed */}
            <div className="rounded-xl border border-line bg-void/40 p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-dim mb-2.5">
                <Sparkles className="w-3 h-3" style={{ color: accent }} /> Automations
              </div>
              <div className="space-y-1.5 min-h-[120px]">
                <AnimatePresence initial={false} mode="popLayout">
                  {feed.map((t) => {
                    const ev = EVENTS[t % EVENTS.length];
                    return (
                      <motion.div
                        key={t}
                        layout
                        initial={{ opacity: 0, y: -14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="flex items-center gap-2 rounded-lg bg-panel-2/70 px-2.5 py-2 text-[10.5px] text-bone/85"
                      >
                        <ev.icon className="w-3.5 h-3.5 shrink-0" style={{ color: ev.color }} />
                        <span className="truncate">{ev.text}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </VisualFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AlpenGlow Global — COMPASS AI trip planner                          */
/* ------------------------------------------------------------------ */

function Bali() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ag-bali-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b1d4a" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill="url(#ag-bali-sky)" />
      <circle cx="112" cy="56" r="15" fill="#fde68a" opacity="0.9" />
      <path d="M0 64 Q30 50 60 60 T120 56 T160 60 V100 H0Z" fill="#7c2d12" opacity="0.75" />
      <path d="M0 76 Q40 66 80 73 T160 70 V100 H0Z" fill="#431407" />
      {[
        [30, 1],
        [58, 1.35],
        [86, 1],
      ].map(([x, s]) => (
        <g key={x} transform={`translate(${x} 80) scale(${s})`} fill="#1c0a05">
          <path d="M-9 0 q0 -12 9 -15 q9 3 9 15 z" />
          <rect x="-1" y="-23" width="2" height="9" />
          <rect x="-12" y="0" width="24" height="3" />
        </g>
      ))}
    </svg>
  );
}

function Maldives() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ag-mal-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="ag-mal-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <rect width="160" height="48" fill="url(#ag-mal-sky)" />
      <rect y="48" width="160" height="52" fill="url(#ag-mal-sea)" />
      <path d="M110 48 q18 -10 40 0 z" fill="#166534" opacity="0.8" />
      <rect x="6" y="66" width="150" height="2" fill="#78350f" />
      {[16, 44, 72, 100, 128].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d={`M0 56 l10 -9 l10 9 z`} fill="#92400e" />
          <rect x="2" y="56" width="16" height="9" fill="#fde7c8" />
          <rect x="3" y="65" width="1.5" height="10" fill="#78350f" />
          <rect x="15.5" y="65" width="1.5" height="10" fill="#78350f" />
        </g>
      ))}
      <path d="M0 84 q20 -3 40 0 t40 0 t40 0 t40 0" stroke="#a5f3fc" strokeOpacity="0.5" fill="none" />
    </svg>
  );
}

function Santorini() {
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ag-san-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill="url(#ag-san-sky)" />
      <rect y="58" width="160" height="42" fill="#1d4ed8" />
      <path d="M0 58 q40 -6 80 2 v40 H0z" fill="#e7e5e4" />
      {[
        [8, 50, 18, 14],
        [30, 44, 16, 20],
        [50, 52, 20, 12],
        [22, 64, 22, 14],
        [48, 66, 18, 12],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#fafaf9" stroke="#d6d3d1" strokeWidth="0.5" />
      ))}
      <path d="M31 44 a7 7 0 0 1 14 0 z" fill="#1e40af" />
      <path d="M52 52 a8 8 0 0 1 16 0 z" fill="#1e40af" />
      <rect x="37.5" y="31" width="1" height="6" fill="#fafaf9" />
      <rect x="35.5" y="33" width="5" height="1" fill="#fafaf9" />
      <path d="M88 76 q20 -3 40 0 t40 0" stroke="#93c5fd" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}

const DESTINATIONS = [
  { name: "Bali", tag: "Culture & sunsets", Art: Bali },
  { name: "Maldives", tag: "Quiet beaches", Art: Maldives },
  { name: "Santorini", tag: "Island escape", Art: Santorini },
];

export function CompassVisual({ accent }: { accent: string }) {
  const { ref, tick } = useTicker(1600);
  const step = tick % 7; // 0 ask · 1 thinking · 2 reply · 3 cards · 4 itinerary · 5 lead · 6 hold
  const cycle = Math.floor(tick / 7);

  return (
    <div ref={ref}>
      <VisualFrame
        title="Compass — AI trip planner"
        accent={accent}
        overlay={
          <>
            <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  key={`itin-${cycle}`}
                  {...pop}
                  className="absolute -bottom-5 right-4 sm:-right-6 z-10 glass !bg-panel/90 rounded-xl px-3.5 py-2.5 text-xs text-bone flex items-center gap-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]"
                  style={{ borderColor: `${accent}66` }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                  Itinerary ready · 6 days
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {step >= 5 && (
                <motion.div
                  key={`lead-${cycle}`}
                  {...pop}
                  className="absolute -top-4 left-4 sm:top-auto sm:-bottom-5 sm:-left-6 z-10 glass !bg-panel/90 rounded-xl px-3.5 py-2.5 text-xs text-bone flex items-center gap-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-faint">LEAD</span>
                  routed to sales
                </motion.div>
              )}
            </AnimatePresence>
          </>
        }
      >
        <div className="relative p-4 pb-7 sm:p-5 sm:pb-8">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

          <div className="relative space-y-3">
            <div className="flex justify-end">
              <div key={`q-${cycle}`} className="rounded-2xl rounded-tr-md bg-panel-2 border border-line px-3.5 py-2 text-xs sm:text-[13px] text-bone max-w-[85%]">
                <Typed text="Somewhere warm, low crowds, October" charMs={32} caret={accent} />
              </div>
            </div>

            <div className="min-h-[46px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key={`think-${cycle}`} {...pop} className="w-fit rounded-2xl rounded-tl-md border px-3.5 py-1.5" style={{ borderColor: `${accent}80`, background: `${accent}0d` }}>
                    <TypingDots color={accent} />
                  </motion.div>
                )}
                {step >= 2 && (
                  <motion.div
                    key={`reply-${cycle}`}
                    {...pop}
                    className="w-fit max-w-[92%] rounded-2xl rounded-tl-md border px-3.5 py-2 text-xs sm:text-[13px] text-bone/90 leading-snug"
                    style={{ borderColor: `${accent}80`, background: `${accent}0d` }}
                  >
                    <Typed text="I'd start with Bali or the Maldives. Want a full 6-day itinerary for one of these?" charMs={16} caret={accent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
              {DESTINATIONS.map((d, i) => (
                <div key={d.name} className="relative">
                  {/* Placeholder reserves the card's space so nothing jumps when results land. */}
                  <div aria-hidden className="rounded-xl border border-dashed border-line">
                    <div className="aspect-[16/10]" />
                    <div className="h-[34px] sm:h-[42px]" />
                  </div>
                <AnimatePresence>
                  {step >= 3 && (
                    <motion.div
                      key={`${d.name}-${cycle}`}
                      initial={{ opacity: 0, y: 18, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                      className="absolute inset-0 rounded-xl overflow-hidden border bg-void transition-shadow duration-500"
                      style={{
                        borderColor: step >= 4 && i === 0 ? accent : "rgba(148,163,199,0.18)",
                        boxShadow: step >= 4 && i === 0 ? `0 0 0 1px ${accent}, 0 0 24px ${accent}55` : "none",
                      }}
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <motion.div
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.6, delay: i * 0.12, ease: EASE }}
                          className="w-full h-full"
                        >
                          <d.Art />
                        </motion.div>
                      </div>
                      <div className="h-[34px] sm:h-[42px] px-2 sm:px-2.5 flex flex-col justify-center">
                        <div className="text-[11px] sm:text-xs text-bone">{d.name}</div>
                        <div className="text-[9px] sm:text-[10px] text-faint truncate">{d.tag}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </VisualFrame>
    </div>
  );
}
