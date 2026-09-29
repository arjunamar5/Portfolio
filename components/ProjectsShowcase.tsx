"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Briefcase, ArrowUpRight, ArrowRight, Check, GraduationCap, TrendingUp } from "lucide-react";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { MriVisual } from "./MriVisual";
import { CourtVisual, StudyVisual, CompassVisual } from "./ProjectVisuals";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { CountUp } from "./CountUp";
import { CaseStudyModal } from "./CaseStudyModal";

const EASE = [0.16, 1, 0.3, 1] as const;

// Live client work first, then the academic flagship.
const LIVE = ["project-3-cue-court-coffee", "project-2-perfect-study-space", "project-7-alpenglow-global"];
const ACADEMIC = ["project-1-brain-tumor-detection"];

/** Illustrative animated template for each featured project. */
function ProjectVisual({ project }: { project: ProjectCaseStudy }) {
  switch (project.visualType) {
    case "mri-viewer":
      return <MriVisual />;
    case "court-booking":
      return <CourtVisual accent={project.accent} />;
    case "study-saas":
      return <StudyVisual accent={project.accent} />;
    case "travel-concierge":
      return <CompassVisual accent={project.accent} />;
    default:
      return null;
  }
}

function GroupLabel({ live, title, note }: { live?: boolean; title: string; note: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex items-center gap-4 pt-16 sm:pt-20"
    >
      <span className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-panel/70 px-4 py-2">
        {live ? (
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
          </span>
        ) : (
          <GraduationCap className="w-4 h-4 text-accent-soft" />
        )}
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">{title}</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" />
      <span className="hidden sm:inline text-xs text-faint">{note}</span>
    </motion.div>
  );
}

/** Gentle 3D tilt that follows the pointer while hovering the template. */
function TiltStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 20 });
  const sry = useSpring(ry, { stiffness: 150, damping: 20 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => (rx.set(0), ry.set(0))} className="[perspective:1400px]">
      <motion.div style={{ rotateX: srx, rotateY: sry }}>{children}</motion.div>
    </div>
  );
}

/** "300+" → count-up 300 with "+" suffix. */
function Metric({ value }: { value: string }) {
  const m = value.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return <>{value}</>;
  return <CountUp value={parseFloat(m[2])} prefix={m[1]} suffix={m[3]} />;
}

function FeaturedBlock({ project, index, onOpenCase }: { project: ProjectCaseStudy; index: number; onOpenCase: () => void }) {
  const role = PORTFOLIO_DATA.experience.find((e) => e.projectId === project.id);
  const impact = project.impact;
  // Big numbers only when they are real numbers; otherwise the before → after lines say it better.
  const numeric = project.impactMetrics.filter((m) => /^\+?\d+(\.\d+)?[%+]?$/.test(m.value));
  const rows = (impact?.rows ?? []).slice(0, numeric.length ? 3 : 4);
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <div
      id={project.id}
      className="relative scroll-mt-24 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-10 lg:gap-16 items-center py-12 sm:py-16"
    >
      {/* What the app does */}
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.97 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative z-10"
      >
        <TiltStage>
          <ProjectVisual project={project} />
        </TiltStage>
      </motion.div>

      {/* What it changed */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={item} className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] text-bone"
            style={{ borderColor: `${project.accent}66`, background: `${project.accent}14` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }} />
            Case {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-dim">{project.sceneLabel}</span>
        </motion.div>

        <motion.h3 variants={item} className="font-grotesk text-[2rem] sm:text-[2.8rem] font-bold text-bone tracking-[-0.02em] leading-[1.02]">
          {project.shortTitle}
          <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] ml-2 align-baseline rotate-45" style={{ background: project.accent }} />
        </motion.h3>
        {role && (
          <motion.div variants={item} className="mt-3 inline-flex items-center gap-2 text-sm text-dim">
            <Briefcase className="w-4 h-4" style={{ color: project.accent }} />
            {role.role} <span className="text-faint">· {role.period}</span>
          </motion.div>
        )}

        {impact && (
          <>
            <motion.div variants={item} className="mt-7 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" /> The impact
            </motion.div>
            <motion.p variants={item} className="mt-2 font-grotesk text-xl sm:text-[1.6rem] font-medium text-bone leading-snug tracking-[-0.01em] text-balance">
              {impact.headline}
            </motion.p>

            {numeric.length > 0 && (
              <motion.div variants={item} className="mt-6 grid grid-cols-3 gap-3">
                {numeric.slice(0, 3).map((m) => (
                  <div key={m.label} className="rounded-xl border border-line bg-panel/60 px-3 py-3">
                    <div className="font-grotesk text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: project.accent }}>
                      <Metric value={m.value} />
                    </div>
                    <div className="text-[11px] text-faint mt-1 leading-snug">{m.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.ul variants={item} className="mt-6 space-y-2.5">
              {rows.map((r, i) => (
                <motion.li
                  key={r.area}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-xl border border-line bg-panel/40 px-3.5 py-2.5"
                >
                  <span className="min-w-0 sm:flex-1 text-[12px] sm:text-[12.5px] text-red-300/70 line-through decoration-red-400/50 sm:truncate">{r.before}</span>
                  <ArrowRight className="hidden sm:block w-3.5 h-3.5 shrink-0 text-faint" />
                  <span className="min-w-0 sm:flex-[1.3] flex items-center gap-1.5 text-[13px] text-bone">
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="sm:truncate">{r.after}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </>
        )}

        <motion.button
          variants={item}
          onClick={onOpenCase}
          className="group mt-7 inline-flex items-center gap-2 text-sm transition-colors hover:text-bone"
          style={{ color: project.accent }}
        >
          How I built it — open the case study
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export function ProjectsShowcase() {
  const projects = PORTFOLIO_DATA.projects;
  const pick = (ids: string[]) => ids.map((id) => projects.find((p) => p.id === id)).filter((p): p is ProjectCaseStudy => Boolean(p));
  const live = pick(LIVE);
  const academic = pick(ACADEMIC);
  const compact = projects.filter((p) => !p.featured);
  const [open, setOpen] = useState<ProjectCaseStudy | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="work" className="relative pt-28 sm:pt-36 pb-28 sm:pb-36 border-t border-line font-jakarta">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Selected work."
          accentFrom={1}
          lede="What each app does — and what changed for the people using it."
        />

        <GroupLabel live title="Live projects" note="Built for — and used by — real clients" />
        {live.map((project, i) => (
          <FeaturedBlock key={project.id} project={project} index={i} onOpenCase={() => setOpen(project)} />
        ))}

        <GroupLabel title="Academic project" note="Research-grade AI built at university" />
        {academic.map((project, i) => (
          <FeaturedBlock key={project.id} project={project} index={live.length + i} onOpenCase={() => setOpen(project)} />
        ))}

        <div className="pt-20 sm:pt-24">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="eyebrow !text-faint mb-6"
          >
            More projects · tap a card for the full story
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {compact.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onOpen={() => setOpen(project)} />
            ))}
          </div>
        </div>
      </div>
      <CaseStudyModal project={open} onClose={close} />
    </section>
  );
}
