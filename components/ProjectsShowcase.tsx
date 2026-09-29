"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowUpRight, GraduationCap } from "lucide-react";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { MriVisual } from "./MriVisual";
import { CourtVisual, StudyVisual, CompassVisual } from "./ProjectVisuals";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { CaseCard } from "./CaseCard";
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

function FeaturedBlock({ project, index, onOpenCase }: { project: ProjectCaseStudy; index: number; onOpenCase: () => void }) {
  const role = PORTFOLIO_DATA.experience.find((e) => e.projectId === project.id);
  const chips = project.chips ?? project.techStack.flatMap((t) => t.items).slice(0, 9);
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <div
      id={project.id}
      className="relative scroll-mt-24 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start py-12 sm:py-16"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="lg:sticky lg:top-28"
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
          <span className="text-xs text-faint">· {project.confidentialityTag}</span>
        </motion.div>

        <motion.h3 variants={item} className="text-3xl sm:text-[2.75rem] font-semibold text-bone tracking-tight leading-[1.05]">
          {project.shortTitle}
          <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] ml-2 align-baseline rotate-45" style={{ background: project.accent }} />
        </motion.h3>

        {role && (
          <motion.div variants={item} className="mt-3 inline-flex items-center gap-2 text-sm text-dim">
            <Briefcase className="w-4 h-4" style={{ color: project.accent }} />
            {role.role} <span className="text-faint">· {role.period}</span>
          </motion.div>
        )}

        <motion.p variants={item} className="text-bone/80 text-base sm:text-lg mt-4 leading-relaxed">
          {project.tagline}
        </motion.p>
        <motion.p variants={item} className="text-sm text-dim mt-4 leading-relaxed">
          {project.description}
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-1.5 mt-6">
          {chips.map((c) => (
            <span key={c} className="text-[11px] text-dim rounded-md px-2 py-1 border border-line bg-void/50">
              {c}
            </span>
          ))}
        </motion.div>

        {project.architectureOverview && (
          <motion.button
            variants={item}
            onClick={onOpenCase}
            className="group mt-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-bone transition-colors hover:bg-panel-2"
            style={{ borderColor: `${project.accent}66` }}
          >
            Open the full case study
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: project.accent }} />
          </motion.button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <CaseCard project={project}>
          <ProjectVisual project={project} />
        </CaseCard>
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
    <section id="work" className="relative pt-28 sm:pt-36 pb-28 sm:pb-36 border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Selected work."
          accentFrom={1}
          lede="Each one starts with a real problem. Here's what I built — and what changed because of it."
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
            More projects · tap a card to see what it solves
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
