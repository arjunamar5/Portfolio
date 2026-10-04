"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, X, TrendingUp } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { CountUp } from "./CountUp";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/** Re-types text through random glyphs whenever it changes (a quick "decode"). */
function Scramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState(text);
  const first = useRef(true);
  useEffect(() => {
    if (first.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      first.current = false;
      setOut(text);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 520;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      const shown = Math.floor(t * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (i < shown || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return <>{out}</>;
}

/** "300+" → count-up 300 with "+" suffix. */
function Metric({ value }: { value: string }) {
  const m = value.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return <>{value}</>;
  return <CountUp value={parseFloat(m[2])} prefix={m[1]} suffix={m[3]} />;
}

type Mode = "before" | "after";

/**
 * The right-hand side of a featured project: one card that flips between how things
 * worked before and what the software changed. Opens on "before", then switches itself
 * to "after" once it scrolls into view; visitors can flip it back and forth.
 */
export function ImpactCard({ project }: { project: ProjectCaseStudy }) {
  const impact = project.impact;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const [mode, setMode] = useState<Mode>("before");
  const touched = useRef(false);

  // Big numbers only when they are real numbers.
  const numeric = project.impactMetrics.filter((m) => /^\+?\d+(\.\d+)?[%+]?$/.test(m.value));
  const rows = (impact?.rows ?? []).slice(0, numeric.length ? 3 : 4);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => !touched.current && setMode("after"), 1300);
    return () => clearTimeout(t);
  }, [inView]);

  if (!impact) return null;
  const after = mode === "after";
  const pick = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };

  return (
    <div ref={ref} className="relative mt-7 rounded-[22px] p-px" style={{ ["--accent" as string]: project.accent } as React.CSSProperties}>
      {/* Slowly travelling light around the border */}
      <span className="impact-ring pointer-events-none absolute inset-0 rounded-[22px]" />
      <div
        className="relative overflow-hidden rounded-[21px] p-5 sm:p-6"
        style={{ background: `radial-gradient(120% 80% at 100% 0%, ${project.accent}1f, transparent 55%), #0A0F1C` }}
      >
        {/* Sweep that passes over the card whenever it flips */}
        <AnimatePresence>
          <motion.span
            key={mode}
            initial={{ top: "-30%", opacity: 0.9 }}
            animate={{ top: "120%", opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-x-0 h-24"
            style={{ background: `linear-gradient(180deg, transparent, ${after ? "rgba(52,211,153,0.16)" : "rgba(248,113,113,0.14)"}, transparent)` }}
          />
        </AnimatePresence>

        <div className="relative flex items-center gap-3">
          <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-emerald-300">
            <TrendingUp className="w-3.5 h-3.5" /> The impact
          </span>
          {/* Before / After switch */}
          <div className="ml-auto relative grid grid-cols-2 rounded-full border border-line bg-void/70 p-1 text-[11px] font-semibold">
            {(["before", "after"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => pick(m)}
                className={`relative z-10 px-3.5 py-1.5 rounded-full capitalize transition-colors duration-300 ${mode === m ? (m === "after" ? "text-emerald-200" : "text-red-200") : "text-faint hover:text-dim"}`}
                aria-pressed={mode === m}
              >
                {mode === m && (
                  <motion.span
                    layoutId={`impact-switch-${project.id}`}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className={`absolute inset-0 -z-10 rounded-full border ${m === "after" ? "bg-emerald-400/15 border-emerald-400/40" : "bg-red-400/15 border-red-400/40"}`}
                  />
                )}
                {m}
              </button>
            ))}
          </div>
        </div>

        <p className="relative mt-4 font-grotesk text-xl sm:text-[1.55rem] font-medium leading-snug tracking-[-0.01em] text-balance">
          <span className={`transition-colors duration-500 ${after ? "text-bone" : "text-bone/45"}`}>{impact.headline}</span>
        </p>

        {numeric.length > 0 && (
          <div className="relative mt-5 grid grid-cols-3 gap-2.5">
            {numeric.slice(0, 3).map((m) => (
              <div
                key={m.label}
                className="rounded-xl border px-3 py-2.5 transition-all duration-500"
                style={{
                  borderColor: after ? `${project.accent}55` : "rgba(148,163,199,0.14)",
                  background: after ? `${project.accent}12` : "rgba(7,10,18,0.5)",
                  boxShadow: after ? `0 12px 30px -18px ${project.accent}` : "none",
                }}
              >
                <div className="font-grotesk text-2xl sm:text-[1.75rem] font-bold tracking-tight transition-colors duration-500" style={{ color: after ? project.accent : "#3B4A6B" }}>
                  {after ? <Metric value={m.value} /> : "—"}
                </div>
                <div className="text-[11px] text-faint mt-0.5 leading-snug">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <ul className="relative mt-5 space-y-2">
          {rows.map((r, i) => (
            <li
              key={r.area}
              className="group grid grid-cols-[88px_1fr] sm:grid-cols-[104px_1fr] items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-500"
              style={{
                transitionDelay: `${i * 70}ms`,
                borderColor: after ? "rgba(52,211,153,0.22)" : "rgba(248,113,113,0.18)",
                background: after ? "rgba(52,211,153,0.05)" : "rgba(248,113,113,0.04)",
              }}
            >
              <span className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.16em] text-faint truncate">{r.area}</span>
              <span className="min-w-0 flex items-center gap-2">
                <span
                  className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-colors duration-500"
                  style={{ transitionDelay: `${i * 70}ms`, background: after ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.16)" }}
                >
                  {after ? <Check className="w-3 h-3 text-emerald-300" strokeWidth={3} /> : <X className="w-3 h-3 text-red-300" strokeWidth={3} />}
                </span>
                <span className={`sm:truncate text-[13px] leading-snug transition-colors duration-500 ${after ? "text-bone" : "text-red-200/60 line-through decoration-red-400/40"}`}>
                  <Scramble text={after ? r.after : r.before} delay={i * 70} />
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

