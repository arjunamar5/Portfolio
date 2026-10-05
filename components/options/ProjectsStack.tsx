"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { ProjectVisual } from "../ProjectsShowcase";
import { ProjectCard } from "../ProjectCard";
import { CaseStudyModal } from "../CaseStudyModal";
import { Scaled } from "./Scaled";
import { FEATURED, MORE, kindOf, roleOf, numericMetrics, wins, blurb, isLive } from "./projectData";

function StackCard({ p, i, total, onOpen }: { p: ProjectCaseStudy; i: number; total: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Earlier cards sink back a little as the next one lands on top.
  const scale = useTransform(scrollYProgress, [0, 1], [1, i === total - 1 ? 1 : 0.92]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, i === total - 1 ? 0 : 0.45]);
  const role = roleOf(p);
  const nums = numericMetrics(p).slice(0, 3);
  const tech = p.techStack.flatMap((t) => t.items).slice(0, 3);

  return (
    <div ref={ref} className="sticky h-[640px]" style={{ top: 96 + i * 26 }}>
      <motion.article
        style={{ scale, transformOrigin: "50% 0%" }}
        className="relative h-[580px] rounded-[34px] overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 90% at 88% 45%, ${p.accent}40, transparent 60%), radial-gradient(55% 70% at 0% 100%, ${p.accent}1c, transparent 60%), linear-gradient(180deg,#0C1222,#080C17)`,
          }}
        />
        <div className="absolute inset-0 rounded-[34px] border" style={{ borderColor: `${p.accent}44` }} />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

        <div className="relative h-full grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 p-8 sm:p-11 flex flex-col">
            <div className="flex items-center gap-4">
              <span className="font-grotesk font-bold text-[84px] leading-none tracking-[-0.05em] text-transparent" style={{ WebkitTextStroke: `1.5px ${p.accent}` }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bone" style={{ borderColor: `${p.accent}66`, background: `${p.accent}14` }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive(p) ? "bg-emerald-400 animate-pulse" : ""}`} style={isLive(p) ? undefined : { background: p.accent }} />
                  {kindOf(p)} project
                </span>
                <span className="text-sm text-dim">{p.sceneLabel}</span>
              </div>
            </div>

            <h3 className="mt-6 font-grotesk text-[2.6rem] sm:text-[3.3rem] font-bold leading-[0.98] tracking-[-0.035em] text-bone">{p.shortTitle}</h3>
            {role && (
              <div className="mt-2 text-sm text-faint">
                {role.role} · {role.period}
              </div>
            )}
            <p className="mt-4 text-[15px] leading-relaxed text-dim line-clamp-2 max-w-[460px]">{blurb(p)}</p>

            {nums.length > 0 ? (
              <div className="mt-6 flex gap-8">
                {nums.map((m) => (
                  <div key={m.label}>
                    <div className="font-grotesk text-[2.1rem] font-bold leading-none tracking-tight" style={{ color: p.accent }}>
                      {m.value}
                    </div>
                    <div className="mt-1 text-[11.5px] text-faint">{m.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mt-6 space-y-2.5">
                {wins(p).map((w) => (
                  <li key={w} className="flex items-center gap-2.5 text-[15px] text-bone/90">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${p.accent}2a` }}>
                      <Check className="w-3 h-3" style={{ color: p.accent }} strokeWidth={3} />
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
              <button onClick={onOpen} className="group inline-flex items-center gap-2 rounded-full pl-5 pr-1.5 py-1.5 text-sm font-semibold text-void transition-all hover:gap-3" style={{ background: p.accent }}>
                View case study
                <span className="w-8 h-8 rounded-full bg-void/90 flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" style={{ color: p.accent }} />
                </span>
              </button>
              {tech.map((t) => (
                <span key={t} className="rounded-full border border-line bg-void/50 px-3 py-1 text-xs text-dim">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute left-0 right-[-7%] top-1/2 -translate-y-1/2 rotate-[-3deg]">
              <Scaled width={660}>
                <ProjectVisual project={p} />
              </Scaled>
            </div>
          </div>
        </div>
        <motion.div className="pointer-events-none absolute inset-0 bg-[#04060c]" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}

export function ProjectsStack() {
  const [open, setOpen] = useState<ProjectCaseStudy | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section className="relative pt-28 sm:pt-32 pb-28">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">03</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">Projects</span>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-grotesk font-bold text-4xl sm:text-6xl leading-[1.02] tracking-[-0.03em] text-bone">Selected work.</h2>
          <span className="text-sm text-faint">3 live client projects · 1 academic</span>
        </div>

        <div className="relative mt-12">
          {FEATURED.map((p, i) => (
            <StackCard key={p.id} p={p} i={i} total={FEATURED.length} onOpen={() => setOpen(p)} />
          ))}
        </div>

        <div className="mt-16">
          <div className="eyebrow !text-faint mb-6">More projects</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MORE.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={() => setOpen(p)} />
            ))}
          </div>
        </div>
      </div>
      <CaseStudyModal project={open} onClose={close} />
    </section>
  );
}
