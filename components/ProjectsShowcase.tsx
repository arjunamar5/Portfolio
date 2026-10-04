"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Briefcase, ArrowUpRight, GraduationCap } from "lucide-react";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { MriVisual } from "./MriVisual";
import { CourtVisual, StudyVisual, CompassVisual } from "./ProjectVisuals";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { ImpactCard } from "./ImpactCard";
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

function FeaturedBlock({ project, index, onOpenCase }: { project: ProjectCaseStudy; index: number; onOpenCase: () => void }) {
  const role = PORTFOLIO_DATA.experience.find((e) => e.projectId === project.id);
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

        <motion.div variants={item}>
          <ImpactCard project={project} />
        </motion.div>

        <motion.button
          variants={item}
          onClick={onOpenCase}
          className="group mt-6 inline-flex items-center gap-3 rounded-full border pl-5 pr-1.5 py-1.5 text-sm font-medium text-bone transition-all duration-300 hover:gap-4"
          style={{ borderColor: `${project.accent}55`, background: `${project.accent}10` }}
        >
          How I built it
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45"
            style={{ background: project.accent }}
          >
            <ArrowUpRight className="w-4 h-4 text-void" />
          </span>
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
