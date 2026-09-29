"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, X } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const block = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-medium text-bone uppercase tracking-wider">{children}</span>
      <span className="flex-1 h-px bg-line" />
    </div>
  );
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { personal, experience, skills, research, projects } = PORTFOLIO_DATA;
  const flagship = projects.find((p) => p.visualType === "mri-viewer");

  // Lock page scroll (Lenis + native) and close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const lenis = (window as any).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] bg-void/85 backdrop-blur-xl p-4 sm:p-8 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.55, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${personal.name} resume`}
            className="w-full max-w-3xl max-h-[88vh] flex flex-col border border-line-strong bg-panel/95 rounded-2xl overflow-hidden shadow-[0_40px_120px_-30px_rgba(59,130,246,0.35)]"
          >
            <div className="relative p-6 border-b border-line flex items-start justify-between gap-4 shrink-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-bone">{personal.name}</h3>
                <p className="text-sm text-accent-soft mt-1">{personal.title}</p>
                <p className="text-xs text-faint mt-2">
                  {personal.location} · {personal.email} · linkedin.com/in/arjun-r-amarnath
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 border border-line-strong rounded-full flex items-center justify-center text-bone hover:border-accent hover:text-accent hover:rotate-90 transition-all duration-300 shrink-0"
                aria-label="Close resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <motion.div
              data-lenis-prevent
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              className="p-6 overflow-y-auto overscroll-contain space-y-8 flex-1 text-sm"
            >
              <motion.section variants={block}>
                <Heading>Summary</Heading>
                <p className="text-dim leading-relaxed">{personal.summary}</p>
              </motion.section>

              <motion.section variants={block}>
                <Heading>Education</Heading>
                <div className="flex justify-between items-baseline gap-4 flex-wrap">
                  <span className="text-sm font-medium text-bone">{personal.education.institution}</span>
                  <span className="text-xs text-faint">{personal.education.period}</span>
                </div>
                <div className="text-xs text-dim mt-1">
                  {personal.education.degree} · {personal.education.detail}
                </div>
              </motion.section>

              <motion.section variants={block}>
                <Heading>Technical Skills</Heading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {skills.map((g) => (
                    <div key={g.title} className="text-xs leading-relaxed">
                      <span className="text-bone font-medium">{g.title}: </span>
                      <span className="text-dim">{g.skills.map((s) => s.name).join(", ")}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={block} className="space-y-5">
                <Heading>Professional Experience</Heading>
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-2 border-l border-accent/40 pl-4">
                    <div className="flex justify-between items-baseline gap-4 flex-wrap">
                      <span className="text-base font-medium text-bone">
                        {exp.company} <span className="text-faint font-normal">| {exp.role}</span>
                      </span>
                      <span className="text-xs text-faint">{exp.period}</span>
                    </div>
                    <ul className="space-y-1.5 text-dim text-xs leading-relaxed">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="text-accent-soft">—</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.section>

              {flagship && (
                <motion.section variants={block}>
                  <Heading>Projects</Heading>
                  <div className="border-l border-accent/40 pl-4 space-y-1.5">
                    <div className="text-sm font-medium text-bone">{flagship.title}</div>
                    <p className="text-xs text-dim leading-relaxed">{flagship.description}</p>
                    <p className="text-xs text-faint">
                      {flagship.techStack.flatMap((t) => t.items).join(", ")}
                    </p>
                  </div>
                </motion.section>
              )}

              <motion.section variants={block}>
                <Heading>Publications</Heading>
                <p className="text-xs text-faint mb-2">{personal.researchNote}</p>
                <ol className="space-y-1 text-dim text-xs leading-relaxed list-decimal pl-4">
                  {research.map((r) => (
                    <li key={r.id}>{r.title}</li>
                  ))}
                </ol>
              </motion.section>

              <motion.section variants={block}>
                <Heading>Extra-Curricular</Heading>
                <div className="text-sm font-medium text-bone">
                  {personal.leadership.role} of {personal.leadership.organization}
                </div>
                <p className="text-xs text-dim leading-relaxed mt-1">{personal.leadership.description}</p>
              </motion.section>
            </motion.div>

            <div className="p-4 border-t border-line flex flex-wrap gap-3 justify-between items-center shrink-0">
              <span className="text-xs text-faint">PDF · 1 page</span>
              <div className="flex items-center gap-2">
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-line-strong text-xs text-bone hover:border-accent/60 hover:bg-panel-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open PDF
                </a>
                <a
                  href={personal.resumeUrl}
                  download="Arjun_R_Amarnath_Resume.pdf"
                  className="btn-shine inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-soft transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
