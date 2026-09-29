"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Brain, Home, ParkingCircle, Cloud, Compass, ArrowUpRight, LucideIcon } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";
import { SpotlightCard, hexToRgb } from "./SpotlightCard";
import { ResidenceMini, ParkMini, CloudMini } from "./MiniVisuals";

/** Animated mini-template per project type (falls back to the icon tile). */
const MINI: Partial<Record<ProjectCaseStudy["visualType"], React.ComponentType<{ accent: string }>>> = {
  "residence-hub": ResidenceMini,
  "quickpark-iot": ParkMini,
  "cloud-aws": CloudMini,
};

const ICON_MAP: Record<ProjectCaseStudy["visualType"], LucideIcon> = {
  "mri-viewer": Brain,
  "study-saas": Home,
  "court-booking": Home,
  "travel-concierge": Compass,
  "residence-hub": Home,
  "quickpark-iot": ParkingCircle,
  "cloud-aws": Cloud,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectCard({ project, index, onOpen }: { project: ProjectCaseStudy; index: number; onOpen: () => void }) {
  const Icon = ICON_MAP[project.visualType];
  const words = project.shortTitle.split(/\s+/);
  const monogram =
    words.length > 1
      ? words.slice(0, 2).map((w) => w[0]).join("").toUpperCase()
      : project.shortTitle.slice(0, 2).toUpperCase();
  const tags = project.techStack.flatMap((t) => t.items).slice(0, 4);
  const thumb = project.images?.[0];
  const Mini = MINI[project.visualType];

  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: EASE }}
      onMouseMove={onMove}
      onMouseLeave={() => (rx.set(0), ry.set(0))}
      className="[perspective:1000px]"
    >
      <motion.div style={{ rotateX: srx, rotateY: sry, ["--accent" as any]: project.accent }} className="h-full">
        <SpotlightCard
          rgb={hexToRgb(project.accent)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${project.shortTitle} case study`}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen();
            }
          }}
          className="group card rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer hover:border-line-strong transition-colors duration-300"
        >
          <div className="relative h-48 overflow-hidden border-b border-line">
            {Mini ? (
              <Mini accent={project.accent} />
            ) : thumb ? (
              <img
                src={thumb}
                alt={`${project.shortTitle} product screenshot`}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-cinematic group-hover:scale-110"
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

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-float-slow"
                  style={{ animationDelay: `${(index % 3) * 0.6}s` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-void/70 border border-line-strong backdrop-blur flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_-4px_var(--accent)]">
                    {Icon && <Icon className="w-6 h-6" style={{ color: "var(--accent)" }} />}
                  </div>
                  <span className="text-xs text-faint tracking-wide">{monogram}</span>
                </div>
              </>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] mb-2" style={{ color: project.accent }}>
              {project.sceneLabel}
            </div>
            <h3 className="font-grotesk text-xl font-bold tracking-[-0.01em] text-bone mb-2.5">{project.shortTitle}</h3>
            <p className="text-[14px] leading-relaxed text-bone/70 mb-5 line-clamp-3">{project.summary ?? project.tagline}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((t) => (
                <span key={t} className="text-xs text-faint border border-line rounded-full px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>

            <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium transition-colors group-hover:text-bone" style={{ color: project.accent }}>
              Explore case study
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </SpotlightCard>
      </motion.div>
    </motion.div>
  );
}
