"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { DashboardPreview } from "./DashboardPreview";
import { MriVisual } from "./MriVisual";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

// Explicit order: the resume's flagship AI project first, then the two client platforms.
const FEATURED_ORDER = ["project-1-brain-tumor-detection", "project-3-cue-court-coffee", "project-2-perfect-study-space"];

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
  const imageFirst = index % 2 === 0;
  const tags = project.techStack.flatMap((t) => t.items).slice(0, 9);
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 sm:py-20 border-b border-line last:border-b-0">
      <motion.div
        initial={{ opacity: 0, x: imageFirst ? -60 : 60, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        className={imageFirst ? "lg:order-1" : "lg:order-2"}
      >
        <VisualStage>
          {project.visualType === "mri-viewer" ? (
            <MriVisual />
          ) : (
            <DashboardPreview title={project.shortTitle} accent={project.accent} images={project.images} />
          )}
        </VisualStage>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className={`relative ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
      >
        <motion.div variants={item} className="flex items-center gap-3 mb-3">
          <span className="text-5xl sm:text-6xl font-semibold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(148,163,199,0.3)] select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 text-xs" style={{ color: project.accent }}>
              <span className="w-6 h-px" style={{ background: project.accent }} />
              {project.sceneLabel}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-faint">{project.confidentialityTag}</span>
          </div>
        </motion.div>

        <motion.h3 variants={item} className="text-2xl sm:text-4xl font-semibold text-bone tracking-tight mb-3">
          {project.shortTitle}
        </motion.h3>
        <motion.p variants={item} className="text-bone/80 mb-4 leading-relaxed">
          {project.tagline}
        </motion.p>
        <motion.p variants={item} className="text-sm text-dim leading-relaxed mb-6">
          {project.description}
        </motion.p>

        <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-6">
          {project.impactMetrics.slice(0, 3).map((m) => (
            <div key={m.label} className="rounded-xl border border-line bg-panel/60 px-3 py-3 hover:border-line-strong transition-colors">
              <div className="text-base sm:text-lg font-semibold leading-tight" style={{ color: project.accent }}>
                {m.value}
              </div>
              <div className="text-[11px] text-faint mt-0.5 leading-snug">{m.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
          {project.keyFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-2.5 text-sm text-bone/85">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.accent, boxShadow: `0 0 8px ${project.accent}` }} />
              <span>{f.title}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-xs text-faint border border-line rounded-full px-2.5 py-1 hover:text-bone hover:border-line-strong transition-colors">
              {t}
            </span>
          ))}
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

  return (
    <section id="work" className="relative pt-28 sm:pt-36 pb-28 sm:pb-36 border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <SectionHeading
          index="03"
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
