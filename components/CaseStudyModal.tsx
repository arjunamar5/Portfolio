"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Wrench, Workflow, Lightbulb, Layers } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Architecture string "A -> B -> C" as an animated pipeline a packet travels through. */
function Pipeline({ steps, accent }: { steps: string[]; accent: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1100);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <ol className="relative space-y-2">
      <span className="absolute left-[11px] top-3 bottom-3 w-px bg-line" />
      {steps.map((s, i) => {
        const on = i === active;
        const passed = i < active;
        return (
          <li key={s + i} className="relative flex items-center gap-3">
            <span
              className="relative z-10 w-[23px] h-[23px] shrink-0 rounded-full border flex items-center justify-center font-mono text-[9px] transition-all duration-500"
              style={{
                borderColor: on || passed ? accent : "rgba(148,163,199,0.25)",
                background: on ? accent : "#0A0E19",
                color: on ? "#070A12" : passed ? accent : "#5C6780",
                boxShadow: on ? `0 0 16px ${accent}` : "none",
              }}
            >
              {i + 1}
            </span>
            <span
              className="flex-1 rounded-lg border px-3 py-2 text-[12.5px] transition-all duration-500"
              style={{
                borderColor: on ? `${accent}88` : "rgba(148,163,199,0.12)",
                background: on ? `${accent}14` : "rgba(13,18,32,0.6)",
                color: on ? "#F2F4F8" : "#93A0B8",
                transform: on ? "translateX(4px)" : "none",
              }}
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Block({ icon: Icon, title, accent, children }: { icon: React.ElementType; title: string; accent: string; children: React.ReactNode }) {
  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
      className="space-y-3"
    >
      <h4 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: accent }}>
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h4>
      {children}
    </motion.section>
  );
}

/** Full case study for any project: problem, what was built, how it works, challenges, stack. */
export function CaseStudyModal({ project, onClose }: { project: ProjectCaseStudy | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!project) return;
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
  }, [project, onClose]);

  if (!mounted) return null;

  const steps = project?.architectureOverview
    ?.replace(/\.$/, "")
    .split("->")
    .map((s) => s.trim())
    .filter(Boolean);

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] bg-void/80 backdrop-blur-xl flex justify-end"
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.shortTitle} case study`}
            className="relative h-full w-full max-w-2xl bg-panel border-l border-line-strong flex flex-col"
            style={{ boxShadow: `-40px 0 120px -40px ${project.accent}55` }}
          >
            <div className="relative px-6 sm:px-8 pt-7 pb-6 border-b border-line shrink-0">
              <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: project.accent }}>
                    Case study · {project.sceneLabel}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-bone tracking-tight mt-2">{project.shortTitle}</h3>
                  <p className="text-sm text-dim mt-2 leading-relaxed">{project.tagline}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close case study"
                  className="w-9 h-9 shrink-0 rounded-full border border-line-strong flex items-center justify-center text-bone hover:rotate-90 hover:border-accent transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <motion.div
              data-lenis-prevent
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-7 space-y-8"
            >
              {project.problemStatement && (
                <Block icon={AlertTriangle} title="The problem" accent={project.accent}>
                  <p className="text-[15px] text-bone/90 leading-relaxed">{project.problemStatement}</p>
                </Block>
              )}

              <Block icon={Wrench} title="What I built" accent={project.accent}>
                <p className="text-sm text-dim leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {project.keyFeatures.map((f) => (
                    <div key={f.title} className="rounded-xl border border-line bg-void/40 p-3">
                      <div className="text-[13px] font-medium text-bone">{f.title}</div>
                      <div className="text-xs text-faint mt-1 leading-relaxed">{f.description}</div>
                    </div>
                  ))}
                </div>
              </Block>

              {steps && steps.length > 1 && (
                <Block icon={Workflow} title="How it works" accent={project.accent}>
                  <Pipeline steps={steps} accent={project.accent} />
                </Block>
              )}

              {project.challengesAndSolutions && project.challengesAndSolutions.length > 0 && (
                <Block icon={Lightbulb} title="Challenges → solutions" accent={project.accent}>
                  <div className="space-y-2.5">
                    {project.challengesAndSolutions.map((c) => (
                      <div key={c.challenge} className="grid grid-cols-1 sm:grid-cols-2 rounded-xl border border-line overflow-hidden">
                        <div className="p-3 bg-red-500/[0.04] text-xs text-dim leading-relaxed border-b sm:border-b-0 sm:border-r border-line">
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-red-300/80 mb-1">Challenge</span>
                          {c.challenge}
                        </div>
                        <div className="p-3 text-xs text-bone/85 leading-relaxed" style={{ background: `${project.accent}0d` }}>
                          <span className="block font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: project.accent }}>
                            Solution
                          </span>
                          {c.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </Block>
              )}

              {project.techStack.length > 0 && (
                <Block icon={Layers} title="Stack" accent={project.accent}>
                  <div className="space-y-2">
                    {project.techStack.map((g) => (
                      <div key={g.category} className="flex flex-wrap items-center gap-1.5">
                        <span className="w-28 shrink-0 text-[11px] text-faint">{g.category}</span>
                        {g.items.map((it) => (
                          <span key={it} className="text-[11px] text-dim rounded-md px-2 py-1 border border-line bg-void/50">
                            {it}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </Block>
              )}
            </motion.div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
