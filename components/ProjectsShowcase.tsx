"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { MriVisual } from "./MriVisual";
import { CourtVisual, StudyVisual, CompassVisual } from "./ProjectVisuals";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { CaseFile } from "./CaseFile";
import { CaseStudyModal } from "./CaseStudyModal";

const EASE = [0.16, 1, 0.3, 1] as const;

// Explicit order: the resume's flagship AI project first, then the client platforms.
const FEATURED_ORDER = [
  "project-1-brain-tumor-detection",
  "project-3-cue-court-coffee",
  "project-7-alpenglow-global",
  "project-2-perfect-study-space",
];

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

/** Parallax + hover tilt around a project visual. */
function VisualStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 20 });
  const sry = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => (rx.set(0), ry.set(0))} className="[perspective:1400px]">
      <motion.div style={{ y, rotateX: srx, rotateY: sry }}>{children}</motion.div>
    </div>
  );
}

function FeaturedBlock({ project, index, onOpenCase }: { project: ProjectCaseStudy; index: number; onOpenCase: () => void }) {
  const imageFirst = index % 2 === 0;
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <div
      id={project.id}
      className="relative scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 sm:py-24 border-b border-line last:border-b-0"
    >
      <motion.div
        initial={{ opacity: 0, x: imageFirst ? -60 : 60, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        className={`relative z-10 ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
      >
        <VisualStage>
          <ProjectVisual project={project} />
        </VisualStage>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className={`relative ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
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
        <motion.p variants={item} className="text-bone/75 text-base sm:text-lg mt-4 mb-7 leading-relaxed">
          {project.tagline}
        </motion.p>

        <motion.div variants={item}>
          <CaseFile project={project} onOpenCase={project.architectureOverview ? onOpenCase : undefined} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ProjectsShowcase() {
  const projects = PORTFOLIO_DATA.projects;
  const featured = FEATURED_ORDER.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is ProjectCaseStudy => Boolean(p)
  );
  const compact = projects.filter((p) => !p.featured);
  const [open, setOpen] = useState<ProjectCaseStudy | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="work" className="relative pt-28 sm:pt-36 pb-28 sm:pb-36 border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <SectionHeading
          index="04"
          eyebrow="Projects"
          title="Selected work."
          accentFrom={1}
          lede="From explainable medical AI to production platforms running real businesses."
        />

        <div className="mt-4">
          {featured.map((project, i) => (
            <FeaturedBlock key={project.id} project={project} index={i} onOpenCase={() => setOpen(project)} />
          ))}
        </div>

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
