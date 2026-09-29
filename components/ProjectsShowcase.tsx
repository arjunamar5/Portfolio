"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { MriVisual } from "./MriVisual";
import { CourtVisual, StudyVisual, CompassVisual } from "./ProjectVisuals";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { CountUp } from "./CountUp";

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

/** "300+" → count-up 300 with "+" suffix; non-numeric values render as-is. */
function MetricValue({ value }: { value: string }) {
  const m = value.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return <>{value}</>;
  return <CountUp value={parseFloat(m[2])} prefix={m[1]} suffix={m[3]} />;
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

function FeaturedBlock({ project, index }: { project: ProjectCaseStudy; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const imageFirst = index % 2 === 0;
  const chips = project.chips ?? project.techStack.flatMap((t) => t.items).slice(0, 9);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const watermarkX = useTransform(scrollYProgress, [0, 1], imageFirst ? [60, -60] : [-60, 60]);
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <div
      ref={ref}
      id={project.id}
      className="relative scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center py-16 sm:py-24 border-b border-line last:border-b-0"
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
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className={`relative ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
      >
        {/* Oversized outlined name drifting behind the copy. */}
        <motion.span
          aria-hidden
          style={{ x: watermarkX, WebkitTextStroke: `1px ${project.accent}26` }}
          className="pointer-events-none select-none absolute -top-10 left-0 text-[7rem] sm:text-[10rem] font-semibold leading-none tracking-tighter text-transparent whitespace-nowrap"
        >
          {project.shortTitle.split(" ")[0]}
        </motion.span>

        <motion.div variants={item} className="relative flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: project.accent }}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="w-5 h-px" style={{ background: project.accent }} />
          <span>{project.sceneLabel}</span>
          <span className="ml-1 text-faint tracking-wider normal-case font-sans text-[10px] border border-line rounded-full px-2 py-0.5">
            {project.confidentialityTag}
          </span>
        </motion.div>

        <motion.h3 variants={item} className="relative text-3xl sm:text-5xl font-semibold text-bone tracking-tight mb-4">
          {project.shortTitle}
        </motion.h3>
        <motion.p variants={item} className="relative text-bone/80 text-base sm:text-lg mb-4 leading-relaxed">
          {project.tagline}
        </motion.p>
        <motion.p variants={item} className="relative text-sm text-dim leading-relaxed mb-6">
          {project.description}
        </motion.p>

        <motion.div variants={item} className="relative flex flex-wrap gap-2 mb-8">
          {chips.map((t) => (
            <span
              key={t}
              className="text-xs text-dim border border-line-strong rounded-full px-3 py-1.5 bg-void/40 hover:text-bone transition-colors"
            >
              {t}
            </span>
          ))}
        </motion.div>

        <motion.dl variants={item} className="relative grid grid-cols-3 gap-4 sm:gap-6 border-t border-line pt-5">
          {project.impactMetrics.slice(0, 3).map((m, mi) => (
            <div key={m.label} className="relative">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + mi * 0.12, ease: EASE }}
                className="absolute -top-[21px] left-0 w-9 h-[2px] origin-left"
                style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }}
              />
              <dd className="text-2xl sm:text-4xl font-semibold text-bone tracking-tight leading-none">
                <MetricValue value={m.value} />
              </dd>
              <dt className="text-[11px] sm:text-xs text-faint mt-2 leading-snug">{m.label}</dt>
            </div>
          ))}
        </motion.dl>
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
            <FeaturedBlock key={project.id} project={project} index={i} />
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
            More projects
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {compact.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
