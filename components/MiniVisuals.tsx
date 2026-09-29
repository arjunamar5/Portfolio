"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup, useInView } from "framer-motion";
import { Wrench, CheckCircle2, Car, Users, Activity } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Ticks while on screen so each mini-template only animates when visible. */
function useTick(ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [inView, ms]);
  return { ref, tick, inView };
}

function Shell({ accent, children, innerRef }: { accent: string; children: React.ReactNode; innerRef: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: `radial-gradient(120% 90% at 85% 0%, ${accent}33, transparent 60%), linear-gradient(180deg, #0B1020, #080B14)` }}
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      {children}
    </div>
  );
}

/* ---------------- Residence Hub: maintenance tickets moving across a board ---------------- */

const TICKETS = [
  { id: "t1", label: "Leak · B-204" },
  { id: "t2", label: "Lift · Tower A" },
  { id: "t3", label: "Power · C-11" },
  { id: "t4", label: "Gate pass · Visitor" },
];
const COLS = ["Open", "In progress", "Resolved"];

export function ResidenceMini({ accent }: { accent: string }) {
  const { ref, tick } = useTick(1500);
  // Each tick advances one ticket a column; resolved ones cycle back to "Open".
  const N = TICKETS.length;
  const col = (i: number) => (Math.floor((tick + i) / N) + i) % COLS.length;
  const movedIdx = (N - (tick % N)) % N; // the ticket that advanced on this tick
  const moved = TICKETS[movedIdx];
  const movedCol = col(movedIdx);

  return (
    <Shell accent={accent} innerRef={ref}>
      <LayoutGroup>
        <div className="relative grid grid-cols-3 gap-2 p-3 h-full">
          {COLS.map((c, ci) => (
            <div key={c} className="rounded-lg border border-line bg-void/50 p-1.5 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center justify-between px-0.5">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-faint truncate">{c}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: ci === 0 ? "#F87171" : ci === 1 ? "#FBBF24" : "#34D399" }}
                />
              </div>
              {TICKETS.filter((_, i) => col(i) === ci).map((t) => (
                <motion.div
                  key={t.id}
                  layoutId={`rh-${t.id}`}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="rounded-md border px-1.5 py-1 text-[9.5px] text-bone/85 truncate"
                  style={{
                    borderColor: ci === 2 ? "rgba(52,211,153,0.35)" : `${accent}40`,
                    background: ci === 2 ? "rgba(52,211,153,0.08)" : `${accent}12`,
                  }}
                >
                  {t.label}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={tick}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full glass !bg-panel/90 px-2.5 py-1 text-[9.5px] text-bone"
        >
          {movedCol === 2 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Wrench className="w-3 h-3" style={{ color: accent }} />}
          {moved.label.split(" · ")[0]} → {COLS[movedCol]}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

/* ---------------- QuickPark: live lot with IR slot lights and a barrier gate ---------------- */

const SLOTS = 10;

export function ParkMini({ accent }: { accent: string }) {
  const { ref, tick } = useTick(1300);
  // Deterministic occupancy that shifts one slot per tick.
  const occupied = Array.from({ length: SLOTS }, (_, i) => ((i * 7 + Math.floor((tick + i * 3) / 4)) % 3) !== 0);
  const free = occupied.filter((o) => !o).length;
  const gateOpen = tick % 4 === 1;

  return (
    <Shell accent={accent} innerRef={ref}>
      <div className="relative h-full p-3 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-faint">Level 1 · live</span>
          <span className="rounded-full px-2 py-0.5 text-[9.5px]" style={{ background: `${accent}22`, color: accent }}>
            {free} free
          </span>
        </div>
        <div className="flex-1 grid grid-rows-2 gap-2">
          {[0, 1].map((row) => (
            <div key={row} className="grid grid-cols-5 gap-1.5">
              {occupied.slice(row * 5, row * 5 + 5).map((o, i) => (
                <div key={i} className="relative rounded-md border border-dashed border-line-strong flex items-center justify-center">
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full transition-colors duration-500"
                    style={{ background: o ? "#F87171" : "#34D399", boxShadow: `0 0 6px ${o ? "#F87171" : "#34D399"}` }}
                  />
                  <AnimatePresence>
                    {o && (
                      <motion.span
                        initial={{ y: row ? 24 : -24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: row ? 24 : -24, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        <Car className="w-4 h-4 text-bone/70" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Entrance gate */}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative w-10 h-3">
            <span className="absolute left-0 bottom-0 w-1.5 h-3 rounded-sm bg-bone/40" />
            <motion.span
              animate={{ rotate: gateOpen ? -70 : 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="absolute left-1 bottom-2 h-[3px] w-9 rounded-full origin-left"
              style={{ background: `repeating-linear-gradient(90deg, #F87171 0 5px, #F2F4F8 5px 10px)` }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={gateOpen ? "open" : "closed"}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[9.5px] font-mono"
              style={{ color: gateOpen ? accent : "#93A0B8" }}
            >
              {gateOpen ? "Booking ID verified · gate open" : "ESP32 · awaiting booking ID"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------- ITConnect: requests through API Gateway into containers, watched by CloudWatch ---------------- */

const SERVICES = ["Auth", "Events", "Tickets", "Notify"];

export function CloudMini({ accent }: { accent: string }) {
  const { ref, tick, inView } = useTick(700);
  const target = tick % SERVICES.length;
  const spark = Array.from({ length: 16 }, (_, i) => 10 + Math.abs(Math.sin((i + tick) * 0.7)) * 16 + ((i + tick) % 5) * 2);

  return (
    <Shell accent={accent} innerRef={ref}>
      <div className="relative h-full p-3 flex items-center gap-2">
        {/* Users */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="w-8 h-8 rounded-lg border border-line-strong bg-void/60 flex items-center justify-center">
            <Users className="w-4 h-4 text-bone/70" />
          </span>
          <span className="font-mono text-[8px] text-faint">users</span>
        </div>

        {/* Wire + packet into the gateway */}
        <div className="relative flex-1 h-px bg-line-strong min-w-[14px]">
          {inView && (
            <motion.span
              key={tick}
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 0.6, ease: "linear" }}
              className="absolute -top-[3px] w-1.5 h-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            />
          )}
        </div>

        <div className="shrink-0 rounded-lg border px-2 py-1.5 text-center" style={{ borderColor: `${accent}66`, background: `${accent}14` }}>
          <div className="font-mono text-[8.5px] text-bone">API</div>
          <div className="font-mono text-[8.5px] text-bone">Gateway</div>
        </div>

        <div className="relative flex-1 h-px bg-line-strong min-w-[14px]" />

        {/* Containers */}
        <div className="shrink-0 grid grid-cols-2 gap-1.5 rounded-xl border border-dashed border-line-strong p-1.5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s}
              animate={{
                borderColor: i === target ? accent : "rgba(148,163,199,0.18)",
                backgroundColor: i === target ? `${accent}22` : "rgba(7,10,18,0.6)",
              }}
              transition={{ duration: 0.25 }}
              className="rounded-md border px-1.5 py-1 font-mono text-[8.5px] text-bone/85 flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              {s}
            </motion.div>
          ))}
          <div className="col-span-2 text-center font-mono text-[7.5px] text-faint">docker · EC2</div>
        </div>
      </div>

      {/* CloudWatch sparkline */}
      <div className="absolute left-3 right-3 top-2.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 font-mono text-[8.5px] text-faint">
          <Activity className="w-3 h-3" style={{ color: accent }} /> CloudWatch
        </span>
        <svg viewBox="0 0 80 30" className="w-20 h-5">
          <polyline
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            points={spark.map((v, i) => `${(i / (spark.length - 1)) * 80},${30 - v}`).join(" ")}
            style={{ transition: "all 0.6s" }}
          />
        </svg>
      </div>
      <div className="absolute left-3 bottom-2.5 inline-flex items-center gap-1 font-mono text-[8.5px] text-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> all services healthy
      </div>
    </Shell>
  );
}
