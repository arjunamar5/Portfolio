"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { ProjectVisual } from "../ProjectsShowcase";
import { ResidenceMini, ParkMini, CloudMini } from "../MiniVisuals";
import { CaseStudyModal } from "../CaseStudyModal";
import { Scaled } from "./Scaled";
import { ALL, FEATURED_IDS, kindOf, numericMetrics, wins, blurb } from "./projectData";

const EASE = [0.16, 1, 0.3, 1] as const;
const MINI: Record<string, React.ComponentType<{ accent: string }>> = {
  "residence-hub": ResidenceMini,
  "quickpark-iot": ParkMini,
  "cloud-aws": CloudMini,
};

function Preview({ p, onOpen }: { p: ProjectCaseStudy; onOpen: () => void }) {
  const Mini = MINI[p.visualType];
  const nums = numericMetrics(p).slice(0, 3);
  return (
    <div className="relative rounded-[30px] p-px" style={{ background: `linear-gradient(150deg, ${p.accent}88, rgba(148,163,199,0.08) 40%, ${p.accent}33)` }}>
      <div className="relative overflow-hidden rounded-[29px] bg-[#0A0F1C]" style={{ background: `radial-gradient(90% 60% at 70% 0%, ${p.accent}2e, transparent 60%), #0A0F1C` }}>
        <div className="px-7 pt-7">
          {FEATURED_IDS.includes(p.id) ? (
            <Scaled width={640}>
              <ProjectVisual project={p} />
            </Scaled>
          ) : (
            <div className="h-[270px] rounded-2xl overflow-hidden border border-line">{Mini && <Mini accent={p.accent} />}</div>
          )}
        </div>
        <div className="p-7 pt-6">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ color: p.accent }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} /> {kindOf(p)} · {p.sceneLabel}
          </div>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3 className="font-grotesk text-[2rem] font-bold leading-none tracking-[-0.03em] text-bone">{p.shortTitle}</h3>
            <button onClick={onOpen} className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:rotate-45" style={{ background: p.accent }} aria-label="Open case study">
              <ArrowUpRight className="w-5 h-5 text-void" />
            </button>
          </div>
          <p className="mt-3 text-[14.5px] leading-relaxed text-dim line-clamp-2">{blurb(p)}</p>
          {nums.length > 0 ? (
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {nums.map((m) => (
                <div key={m.label} className="rounded-xl border border-line bg-void/50 px-3 py-2.5">
                  <div className="font-grotesk text-2xl font-bold" style={{ color: p.accent }}>
                    {m.value}
                  </div>
                  <div className="text-[11px] text-faint">{m.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {wins(p).map((w) => (
                <span key={w} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-void/50 px-3 py-1.5 text-[12.5px] text-bone/90">
                  <Check className="w-3.5 h-3.5" style={{ color: p.accent }} strokeWidth={3} /> {w}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsIndex({ initial = 0 }: { initial?: number }) {
  const [active, setActive] = useState(initial);
  const [open, setOpen] = useState<ProjectCaseStudy | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const p = ALL[active];

  return (
    <section className="relative pt-28 sm:pt-32 pb-28">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">03</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">Projects</span>
        </div>
        <h2 className="mt-4 font-grotesk font-bold text-4xl sm:text-6xl leading-[1.02] tracking-[-0.03em] text-bone">Selected work.</h2>

        <div className="mt-12 grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-14 items-start">
          <ol className="border-t border-line">
            {ALL.map((q, i) => {
              const on = i === active;
              return (
                <li key={q.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => (on ? setOpen(q) : setActive(i))}
                    className="group relative w-full grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-line py-5 pl-4 pr-3 text-left transition-colors duration-300"
                    style={on ? { background: `linear-gradient(90deg, ${q.accent}1a, transparent 75%)` } : undefined}
                  >
                    {on && <motion.span layoutId="index-bar" className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: q.accent, boxShadow: `0 0 16px ${q.accent}` }} />}
                    <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className={`block font-grotesk text-[1.6rem] sm:text-[1.9rem] font-bold leading-tight tracking-[-0.025em] transition-colors duration-300 ${on ? "text-bone" : "text-faint group-hover:text-dim"}`}>
                        {q.shortTitle}
                      </span>
                      <span className={`block text-[12.5px] transition-colors ${on ? "text-dim" : "text-faint/70"}`}>{q.sceneLabel}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span
                        className="hidden sm:inline rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em]"
                        style={on ? { color: q.accent, borderColor: `${q.accent}66` } : { color: "#5C6780", borderColor: "rgba(148,163,199,0.16)" }}
                      >
                        {kindOf(q)}
                      </span>
                      <ArrowUpRight className={`w-5 h-5 transition-all duration-300 ${on ? "rotate-45" : "text-faint"}`} style={on ? { color: q.accent } : undefined} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.div key={p.id} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
                <Preview p={p} onOpen={() => setOpen(p)} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <CaseStudyModal project={open} onClose={close} />
    </section>
  );
}
