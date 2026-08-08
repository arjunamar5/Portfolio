"use client";

import React from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio-data";
import { DashboardPreview } from "./DashboardPreview";
import { ProjectCard } from "./ProjectCard";

const EASE = [0.16, 1, 0.3, 1] as const;

// Explicit order: CueCourtOS first (image-left), Perfect Study Space second (image-right).
const FEATURED_ORDER = ["project-3-cue-court-coffee", "project-2-perfect-study-space"];

function FeaturedBlock({ project, index }: { project: ProjectCaseStudy; index: number }) {
  const imageFirst = index % 2 === 0;
  const tags = project.techStack.flatMap((t) => t.items).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center py-14 sm:py-16 border-b border-line last:border-b-0"
    >
      <div className={imageFirst ? "lg:order-1" : "lg:order-2"}>
        <DashboardPreview title={project.shortTitle} accent={project.accent} />
      </div>

      <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-6 h-px" style={{ background: project.accent }} />
          <span className="text-xs" style={{ color: project.accent }}>
            {project.sceneLabel}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-semibold text-bone tracking-tight mb-2">
          {project.shortTitle}
        </h3>
        <p className="text-dim mb-4">{project.tagline}</p>
        <p className="text-sm text-dim leading-relaxed mb-6">{project.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
          {project.keyFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-2.5 text-sm text-bone/85">
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: project.accent }} />
              <span>{f.title}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-xs text-faint border border-line rounded-full px-2.5 py-1">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsShowcase() {
  const projects = PORTFOLIO_DATA.projects;
  const featured = FEATURED_ORDER.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is ProjectCaseStudy => Boolean(p)
  );
  const compact = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="relative py-28 sm:py-36 border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-4"
        >
          <span className="eyebrow !text-faint">Projects</span>
          <h2 className="font-semibold text-3xl sm:text-4xl leading-tight tracking-tight text-bone mt-3">
            Selected work.
          </h2>
        </motion.div>

        <div>
          {featured.map((project, i) => (
            <FeaturedBlock key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="pt-16 sm:pt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {compact.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
