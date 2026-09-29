"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { AlertTriangle, Wrench, TrendingUp, Check, X, ArrowUpRight } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { CountUp } from "./CountUp";

const EASE = [0.16, 1, 0.3, 1] as const;
const TAB_MS = 8000;

const TABS = [
  { key: "problem", label: "Problem", icon: AlertTriangle },
  { key: "solution", label: "Solution", icon: Wrench },
  { key: "impact", label: "Impact", icon: TrendingUp },
] as const;

/** "300+" → count-up 300 with "+" suffix; non-numeric values render as-is. */
function MetricValue({ value }: { value: string }) {
  const m = value.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return <>{value}</>;
  return <CountUp value={parseFloat(m[2])} prefix={m[1]} suffix={m[3]} />;
}

/**
 * Split-flap board: each row flips (in 3D) between how things were before
 * and what the product changed. Auto-flips until the visitor takes over.
 */
function FlipBoard({ rows, accent }: { rows: NonNullable<ProjectCaseStudy["impact"]>["rows"]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [after, setAfter] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!inView || manual) return;
    const first = setTimeout(() => setAfter(true), 900);
    const id = setInterval(() => setAfter((v) => !v), 3600);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [inView, manual]);

  const pick = (v: boolean) => {
    setManual(true);
    setAfter(v);
  };

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">What changed</span>
        <div role="tablist" aria-label="Before or after" className="relative flex rounded-full border border-line bg-void/60 p-0.5 text-[11px]">
          {[
            { v: false, label: "Before" },
            { v: true, label: "After" },
          ].map((o) => (
            <button
              key={o.label}
              role="tab"
              aria-selected={after === o.v}
              onClick={() => pick(o.v)}
              className="relative px-3 py-1 rounded-full"
            >
              {after === o.v && (
                <motion.span
                  layoutId={`flip-knob-${accent}`}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: o.v ? `${accent}33` : "rgba(248,113,113,0.16)" }}
                />
              )}
              <span className={`relative ${after === o.v ? "text-bone" : "text-faint"}`}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 [perspective:700px]">
        {rows.map((r, i) => (
          <div key={r.area} className="grid grid-cols-[88px_1fr] sm:grid-cols-[104px_1fr] items-stretch gap-2">
            <div className="flex items-center font-mono text-[10px] uppercase tracking-wider text-faint">{r.area}</div>
            <div className="relative h-9 [transform-style:preserve-3d]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={after ? "a" : "b"}
                  initial={{ rotateX: -90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: 90, opacity: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                  style={{
                    transformOrigin: "50% 50%",
                    background: after ? `${accent}14` : "rgba(248,113,113,0.06)",
                    borderColor: after ? `${accent}55` : "rgba(248,113,113,0.2)",
                  }}
                  className="absolute inset-0 rounded-lg border flex items-center gap-2 px-2.5 text-[12px] sm:text-[13px] [backface-visibility:hidden]"
                >
                  {after ? (
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                  ) : (
                    <X className="w-3.5 h-3.5 shrink-0 text-red-400/80" />
                  )}
                  <span className={`truncate ${after ? "text-bone" : "text-dim line-through decoration-red-400/50"}`}>
                    {after ? r.after : r.before}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Before → after bar for a single relative metric (e.g. +50% enquiries). */
function GrowthBar({ growth, accent }: { growth: NonNullable<NonNullable<ProjectCaseStudy["impact"]>["growth"]>; accent: string }) {
  const max = Math.max(growth.before, growth.after);
  const pct = Math.round(((growth.after - growth.before) / growth.before) * 100);
  return (
    <div className="mt-4 rounded-xl border border-line bg-void/40 p-3">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] text-dim">{growth.label}</span>
        <span className="text-sm font-semibold" style={{ color: accent }}>
          +<CountUp value={pct} />%
        </span>
      </div>
      {[
        { label: "Before", v: growth.before, color: "rgba(148,163,199,0.35)" },
        { label: "After", v: growth.after, color: accent },
      ].map((b, i) => (
        <div key={b.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
          <span className="w-10 text-[10px] text-faint">{b.label}</span>
          <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(b.v / max) * 100}%` }}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.35, ease: EASE }}
              className="h-full rounded-full"
              style={{ background: b.color, boxShadow: i ? `0 0 12px ${accent}` : "none" }}
            />
          </div>
        </div>
      ))}
      <div className="text-[10px] text-faint mt-1.5">{growth.note}</div>
    </div>
  );
}

/**
 * Interactive "case file" for a featured project: Problem → Solution →
 * Impact tabs that auto-advance while on screen (paused on hover, stopped
 * once the visitor picks a tab).
 */
export function CaseFile({ project, onOpenCase }: { project: ProjectCaseStudy; onOpenCase?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const [tab, setTab] = useState(0);
  const [manual, setManual] = useState(false);
  const [hover, setHover] = useState(false);
  const chips = project.chips ?? project.techStack.flatMap((t) => t.items).slice(0, 9);
  const running = inView && !manual && !hover;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setTab((t) => (t + 1) % TABS.length), TAB_MS);
    return () => clearTimeout(id);
  }, [running, tab]);

  const choose = (i: number) => {
    setManual(true);
    setTab(i);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative rounded-2xl border border-line-strong bg-panel/70 backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }} />

      {/* Tabs */}
      <div role="tablist" aria-label={`${project.shortTitle} case file`} className="grid grid-cols-3 border-b border-line">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === i}
            onClick={() => choose(i)}
            className={`relative flex items-center justify-center gap-1.5 py-3 text-xs sm:text-[13px] transition-colors ${
              tab === i ? "text-bone" : "text-faint hover:text-dim"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" style={{ color: tab === i ? project.accent : undefined }} />
            <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
            {t.label}
            {tab === i && (
              <>
                <motion.span
                  layoutId={`case-tab-${project.id}`}
                  className="absolute inset-x-3 bottom-0 h-[2px] rounded-full"
                  style={{ background: `${project.accent}40` }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
                <motion.span
                  key={`${tab}-${running}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: running ? 1 : 0 }}
                  transition={{ duration: running ? TAB_MS / 1000 : 0.2, ease: "linear" }}
                  className="absolute inset-x-3 bottom-0 h-[2px] rounded-full origin-left"
                  style={{ background: project.accent }}
                />
              </>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative p-5 sm:p-6 sm:min-h-[380px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {tab === 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-300/80 mb-3">What was broken</div>
                <p className="text-[15px] sm:text-base text-bone/90 leading-relaxed">{project.problemStatement}</p>
                <button
                  onClick={() => choose(1)}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs transition-colors hover:text-bone"
                  style={{ color: project.accent }}
                >
                  See how it was solved →
                </button>
                {project.impact && (
                  <button
                    onClick={() => choose(2)}
                    className="group mt-6 w-full text-left rounded-xl border p-4 transition-colors hover:bg-panel-2/40"
                    style={{ borderColor: `${project.accent}40`, background: `${project.accent}0a` }}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: project.accent }}>
                      <TrendingUp className="w-3.5 h-3.5" /> The result
                    </div>
                    <div className="text-sm text-bone leading-snug">{project.impact.headline}</div>
                    <div className="text-[11px] text-faint mt-2 group-hover:text-dim transition-colors">See the before → after →</div>
                  </button>
                )}
              </div>
            )}
            {tab === 1 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: project.accent }}>
                  What I built
                </div>
                <p className="text-sm text-dim leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((c, i) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.03, type: "spring", stiffness: 400, damping: 24 }}
                      className="text-[11px] text-dim rounded-md px-2 py-1 border border-line bg-void/50"
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            {tab === 2 && project.impact && (
              <div>
                <p className="text-[15px] sm:text-base font-medium text-bone leading-snug mb-4">{project.impact.headline}</p>
                <FlipBoard rows={project.impact.rows} accent={project.accent} />
                {project.impact.growth && <GrowthBar growth={project.impact.growth} accent={project.accent} />}
                <div className={`mt-4 flex-wrap gap-2 ${project.impact.growth ? "hidden" : "flex"}`}>
                  {project.impactMetrics.slice(0, 3).map((m) => (
                    <span key={m.label} className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-void/50 px-2.5 py-1.5">
                      <span className="text-sm font-semibold" style={{ color: project.accent }}>
                        <MetricValue value={m.value} />
                      </span>
                      <span className="text-[10.5px] text-faint">{m.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {onOpenCase && (
        <button
          onClick={onOpenCase}
          className="group w-full flex items-center justify-between border-t border-line px-5 sm:px-6 py-3 text-xs text-dim hover:text-bone hover:bg-panel-2/40 transition-colors"
        >
          <span>Open the full case study — architecture, challenges & stack</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: project.accent }} />
        </button>
      )}
    </div>
  );
}
