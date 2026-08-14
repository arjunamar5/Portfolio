"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Home, ParkingCircle, Cloud, LucideIcon } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";

const ICON_MAP: Record<ProjectCaseStudy["visualType"], LucideIcon> = {
  "mri-viewer": Brain,
  "study-saas": Home,
  "court-booking": Home,
  "residence-hub": Home,
  "quickpark-iot": ParkingCircle,
  "cloud-aws": Cloud,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectCard({ project, index }: { project: ProjectCaseStudy; index: number }) {
  const Icon = ICON_MAP[project.visualType];
  const words = project.shortTitle.split(/\s+/);
  const monogram =
    words.length > 1
      ? words.slice(0, 2).map((w) => w[0]).join("").toUpperCase()
      : project.shortTitle.slice(0, 2).toUpperCase();
  const tags = project.techStack.flatMap((t) => t.items).slice(0, 4);
  const thumb = project.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: EASE }}
      style={{ ["--accent" as any]: project.accent }}
      className="group card rounded-2xl overflow-hidden hover:border-line-strong hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={`${project.shortTitle} product screenshot`} className="w-full h-full object-cover object-top" />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(155deg, color-mix(in srgb, var(--accent) 32%, #0a0e19), #0a0e19 75%)" }}
            />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-bone/30" />
            <span className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-bone/20" />

            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-float-slow"
              style={{ animationDelay: `${(index % 3) * 0.6}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-void/70 border border-line-strong backdrop-blur flex items-center justify-center">
                {Icon && <Icon className="w-6 h-6" style={{ color: "var(--accent)" }} />}
              </div>
              <span className="text-xs text-faint tracking-wide">{monogram}</span>
            </div>
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-bone mb-2">{project.shortTitle}</h3>
        <p className="text-sm text-dim leading-relaxed mb-4 line-clamp-3">{project.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
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
