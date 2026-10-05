"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Home, ParkingCircle, Cloud, LucideIcon } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { ProjectVisual } from "../ProjectsShowcase";
import { CaseStudyModal } from "../CaseStudyModal";
import { Scaled } from "./Scaled";
import { FEATURED, MORE, kindOf, badgeOf, blurb, isLive } from "./projectData";

const EASE = [0.16, 1, 0.3, 1] as const;
const ICON: Record<string, LucideIcon> = { "residence-hub": Home, "quickpark-iot": ParkingCircle, "cloud-aws": Cloud };

function Tile({ p, big, i, onOpen, className = "" }: { p: ProjectCaseStudy; big?: boolean; i: number; onOpen: () => void; className?: string }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
      className={`group relative text-left rounded-[30px] p-px ${className}`}
      style={{ background: `linear-gradient(150deg, ${p.accent}80, rgba(148,163,199,0.07) 40%, rgba(148,163,199,0.06) 70%, ${p.accent}30)` }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[29px] ${big ? "min-h-[540px]" : "min-h-[500px]"}`}
        style={{ background: `radial-gradient(90% 70% at 100% 0%, ${p.accent}30, transparent 60%), radial-gradient(70% 60% at 0% 100%, ${p.accent}14, transparent 60%), #0A0F1C` }}
      >
        <div className="relative z-10 p-7 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone" style={{ borderColor: `${p.accent}66`, background: `${p.accent}14` }}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive(p) ? "bg-emerald-400 animate-pulse" : ""}`} style={isLive(p) ? undefined : { background: p.accent }} />
              {kindOf(p)}
            </span>
            <span className="w-10 h-10 rounded-full border border-line-strong bg-void/60 flex items-center justify-center transition-all duration-300 group-hover:rotate-45" style={{ color: p.accent }}>
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>
          <h3 className={`mt-4 font-grotesk font-bold leading-[1] tracking-[-0.03em] text-bone ${big ? "text-[2.4rem]" : "text-[1.9rem]"}`}>{p.shortTitle}</h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-dim line-clamp-2 max-w-[440px]">{blurb(p)}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold" style={{ color: p.accent, background: `${p.accent}18` }}>
            <TrendingUp className="w-3.5 h-3.5" /> {badgeOf(p)}
          </span>
        </div>
        <div className={`absolute left-7 ${big ? "right-[-12%] bottom-[-14%]" : "right-[-30%] top-[50%]"} transition-transform duration-700 ease-cinematic group-hover:-translate-y-3`}>
          <div className="[transform:perspective(1400px)_rotateX(10deg)_rotateY(-8deg)] origin-bottom-left">
            <Scaled width={640}>
              <ProjectVisual project={p} />
            </Scaled>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function ProjectsBento() {
  const [open, setOpen] = useState<ProjectCaseStudy | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const [court, study, alpen, brain] = FEATURED;

  return (
    <section className="relative pt-28 sm:pt-32 pb-28">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">03</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">Projects</span>
        </div>
        <h2 className="mt-4 font-grotesk font-bold text-4xl sm:text-6xl leading-[1.02] tracking-[-0.03em] text-bone">Selected work.</h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-4">
          <Tile p={court} big i={0} onOpen={() => setOpen(court)} className="md:col-span-3" />
          <Tile p={study} big i={1} onOpen={() => setOpen(study)} className="md:col-span-3" />
          <Tile p={alpen} i={2} onOpen={() => setOpen(alpen)} className="md:col-span-2" />
          <Tile p={brain} i={3} onOpen={() => setOpen(brain)} className="md:col-span-2" />

          {/* More projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
            className="md:col-span-2 rounded-[30px] border border-line bg-panel/50 p-7 sm:p-8 flex flex-col"
          >
            <div className="eyebrow !text-faint">More projects</div>
            <div className="mt-5 flex-1 flex flex-col divide-y divide-line">
              {MORE.map((q) => {
                const Icon = ICON[q.visualType] ?? Cloud;
                return (
                  <button key={q.id} onClick={() => setOpen(q)} className="group flex items-start gap-3.5 py-4 text-left first:pt-0">
                    <span className="mt-0.5 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `${q.accent}1f`, border: `1px solid ${q.accent}44` }}>
                      <Icon className="w-[18px] h-[18px]" style={{ color: q.accent }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-grotesk text-lg font-bold text-bone">
                        {q.shortTitle}
                        <ArrowUpRight className="w-4 h-4 text-faint transition-all group-hover:rotate-45" style={{ color: q.accent }} />
                      </span>
                      <span className="block text-[13px] leading-snug text-dim line-clamp-2">{blurb(q)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      <CaseStudyModal project={open} onClose={close} />
    </section>
  );
}
