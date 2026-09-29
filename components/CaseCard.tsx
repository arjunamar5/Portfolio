"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Wrench, TrendingUp, Check, LucideIcon } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { CountUp } from "./CountUp";

const EASE = [0.16, 1, 0.3, 1] as const;
const RED = "#F87171";
const GREEN = "#34D399";

/** "300+" → count-up 300 with "+" suffix; non-numeric values render as-is. */
function MetricValue({ value }: { value: string }) {
  const m = value.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return <>{value}</>;
  return <CountUp value={parseFloat(m[2])} prefix={m[1]} suffix={m[3]} />;
}

function Stage({
  n,
  label,
  color,
  icon: Icon,
  children,
}: {
  n: string;
  label: string;
  color: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative"
    >
      {/* Node on the spine */}
      <span
        className="absolute -left-[30px] sm:-left-[34px] top-0.5 w-[18px] h-[18px] rounded-full border-2 bg-panel flex items-center justify-center"
        style={{ borderColor: color, boxShadow: `0 0 14px ${color}88` }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      </span>
      <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] mb-3" style={{ color }}>
        <Icon className="w-3.5 h-3.5" />
        <span className="opacity-60">{n}</span>
        {label}
      </div>
      {children}
    </motion.div>
  );
}

/**
 * One frame telling the whole story of a project, top to bottom:
 * the problem, the product that solved it (its animated template),
 * and what changed afterwards.
 */
export function CaseCard({ project, children }: { project: ProjectCaseStudy; children: React.ReactNode }) {
  const accent = project.accent;
  const impact = project.impact;

  return (
    <div
      className="relative rounded-[28px] border bg-panel/60 backdrop-blur-sm overflow-hidden"
      style={{ borderColor: `${accent}40`, boxShadow: `0 50px 120px -60px ${accent}aa` }}
    >
      <div className="pointer-events-none absolute -top-32 -right-24 w-80 h-80 rounded-full blur-[90px] opacity-30" style={{ background: accent }} />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      <div className="relative pl-12 sm:pl-[60px] pr-4 sm:pr-7 py-6 sm:py-8 space-y-8">
        {/* The spine: problem (red) → solution (accent) → impact (green), with a pulse travelling down it */}
        <div
          className="absolute left-[26px] sm:left-[34px] top-10 bottom-10 w-px"
          style={{ background: `linear-gradient(to bottom, ${RED}, ${accent} 45%, ${GREEN})` }}
        />
        <motion.span
          animate={{ top: ["6%", "92%"] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          className="absolute left-[23.5px] sm:left-[31.5px] w-[6px] h-[6px] rounded-full bg-white"
          style={{ boxShadow: `0 0 12px 3px ${accent}` }}
        />

        <Stage n="01" label="Problem" color={RED} icon={AlertTriangle}>
          <p className="text-sm sm:text-[15px] text-bone/85 leading-relaxed">{project.problemStatement}</p>
        </Stage>

        <Stage n="02" label="Solution — what I built" color={accent} icon={Wrench}>
          <div className="pb-6">{children}</div>
        </Stage>

        {impact && (
          <Stage n="03" label="Impact" color={GREEN} icon={TrendingUp}>
            <p className="text-[15px] sm:text-base font-medium text-bone leading-snug">{impact.headline}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {impact.rows.map((r, i) => (
                <motion.div
                  key={r.area}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="rounded-xl border bg-void/50 px-3 py-2.5"
                  style={{ borderColor: `${accent}26` }}
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{r.area}</div>
                  <div className="text-[11px] text-red-300/70 line-through decoration-red-400/50 mt-1 truncate">{r.before}</div>
                  <div className="flex items-center gap-1.5 text-[12.5px] text-bone mt-0.5">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: GREEN }} />
                    <span className="truncate">{r.after}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {impact.growth ? (
              <div className="mt-4 rounded-xl border border-line bg-void/40 p-3">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[11px] text-dim">{impact.growth.label}</span>
                  <span className="text-sm font-semibold" style={{ color: GREEN }}>
                    +<CountUp value={Math.round(((impact.growth.after - impact.growth.before) / impact.growth.before) * 100)} />%
                  </span>
                </div>
                {[
                  { label: "Before", v: impact.growth.before, color: "rgba(148,163,199,0.35)" },
                  { label: "After", v: impact.growth.after, color: GREEN },
                ].map((b, i) => (
                  <div key={b.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
                    <span className="w-10 text-[10px] text-faint">{b.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(b.v / Math.max(impact.growth!.before, impact.growth!.after)) * 100}%` }}
                        viewport={{ once: true, amount: 1 }}
                        transition={{ duration: 1.2, delay: 0.2 + i * 0.35, ease: EASE }}
                        className="h-full rounded-full"
                        style={{ background: b.color, boxShadow: i ? `0 0 12px ${GREEN}` : "none" }}
                      />
                    </div>
                  </div>
                ))}
                <div className="text-[10px] text-faint mt-1.5">{impact.growth.note}</div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.impactMetrics.slice(0, 3).map((m) => (
                  <span key={m.label} className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-void/50 px-2.5 py-1.5">
                    <span className="text-sm font-semibold" style={{ color: GREEN }}>
                      <MetricValue value={m.value} />
                    </span>
                    <span className="text-[10.5px] text-faint">{m.label}</span>
                  </span>
                ))}
              </div>
            )}
          </Stage>
        )}
      </div>
    </div>
  );
}
