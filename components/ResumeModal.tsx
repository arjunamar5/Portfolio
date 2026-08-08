"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const handleDownload = () => {
    const resumeText = `
${PORTFOLIO_DATA.personal.name.toUpperCase()} — ${PORTFOLIO_DATA.personal.title}
${PORTFOLIO_DATA.personal.email}  |  ${PORTFOLIO_DATA.personal.location}
${PORTFOLIO_DATA.personal.linkedin}
=====================================================================

SUMMARY
${PORTFOLIO_DATA.personal.bioLong}

EXPERIENCE
---------------------------------------------------------------------
${PORTFOLIO_DATA.experience
  .map(
    (exp) =>
      `${exp.company} — ${exp.role} (${exp.period})\n` +
      exp.highlights.map((h) => `  • ${h}`).join("\n")
  )
  .join("\n\n")}

FEATURED PROJECTS
---------------------------------------------------------------------
${PORTFOLIO_DATA.projects.map((p) => `- ${p.shortTitle}: ${p.tagline}`).join("\n")}

PUBLICATIONS
---------------------------------------------------------------------
${PORTFOLIO_DATA.personal.researchNote}
${PORTFOLIO_DATA.research.map((r) => `- ${r.title}`).join("\n")}
`;

    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${PORTFOLIO_DATA.personal.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] bg-void/90 backdrop-blur-xl p-4 sm:p-8 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[85vh] flex flex-col border border-line bg-panel/95 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-line flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-bone">{PORTFOLIO_DATA.personal.name}</h3>
                <p className="text-xs text-faint mt-1">{PORTFOLIO_DATA.personal.title}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 border border-line-strong rounded-full flex items-center justify-center text-bone hover:border-accent hover:text-accent transition-colors shrink-0"
                aria-label="Close resume"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1 text-sm">
              <p className="text-dim leading-relaxed whitespace-pre-line">{PORTFOLIO_DATA.personal.bioLong}</p>

              <div className="space-y-2">
                <span className="text-xs font-medium text-bone uppercase tracking-wide">Education</span>
                <div className="flex justify-between items-baseline gap-4 flex-wrap">
                  <span className="text-sm text-bone">{PORTFOLIO_DATA.personal.education.institution}</span>
                  <span className="text-xs text-faint">{PORTFOLIO_DATA.personal.education.period}</span>
                </div>
                <div className="text-xs text-faint">
                  {PORTFOLIO_DATA.personal.education.degree} · {PORTFOLIO_DATA.personal.education.detail}
                </div>
              </div>

              <div className="space-y-5">
                <span className="text-xs font-medium text-bone uppercase tracking-wide">Experience</span>
                {PORTFOLIO_DATA.experience.map((exp) => (
                  <div key={exp.id} className="space-y-2 border-l border-line pl-4">
                    <div className="flex justify-between items-baseline gap-4 flex-wrap">
                      <span className="text-base font-medium text-bone">{exp.company}</span>
                      <span className="text-xs text-faint">{exp.period}</span>
                    </div>
                    <div className="text-xs text-faint">{exp.role}</div>
                    <ul className="space-y-1 text-dim text-xs leading-relaxed">
                      {exp.highlights.map((h, idx) => (
                        <li key={idx}>— {h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-bone uppercase tracking-wide">Core Stack</span>
                <div className="flex flex-wrap gap-2">
                  {PORTFOLIO_DATA.skills.flatMap((g) => g.skills.map((s) => s.name)).map((name) => (
                    <span key={name} className="text-xs text-dim border border-line rounded-full px-3 py-1">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-bone uppercase tracking-wide">Publications</span>
                <p className="text-xs text-faint">{PORTFOLIO_DATA.personal.researchNote}</p>
                <ul className="space-y-1 text-dim text-xs leading-relaxed">
                  {PORTFOLIO_DATA.research.map((r) => (
                    <li key={r.id}>— {r.title}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-line flex justify-between items-center shrink-0">
              <span className="text-xs text-faint">Text export</span>
              <button
                onClick={handleDownload}
                className="text-xs text-dim hover:text-bone transition-colors link-underline"
              >
                Download Resume
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
