"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;

function Node({ progress, threshold }: { progress: MotionValue<number>; threshold: number }) {
  const lit = useTransform(progress, [threshold - 0.06, threshold + 0.02], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.4, 1]);
  const glow = useTransform(lit, (v) => `0 0 ${v * 14}px ${v * 3}px rgba(59,130,246,${v * 0.45})`);

  return (
    <span className="relative z-10 w-3.5 h-3.5 shrink-0 flex items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-line-strong bg-void" />
      <motion.span
        style={{ scale, boxShadow: glow, opacity: lit }}
        className="absolute inset-[3px] rounded-full bg-accent"
      />
    </span>
  );
}

export function Research() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const papers = PORTFOLIO_DATA.research;

  return (
    <section id="research" className="relative py-28 sm:py-36 border-t border-line">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <span className="eyebrow !text-faint">Research</span>
          <h2 className="font-semibold text-3xl sm:text-4xl leading-tight tracking-tight text-bone mt-3">
            Publications.
          </h2>
          <p className="text-dim mt-3 max-w-lg">{PORTFOLIO_DATA.personal.researchNote}</p>
        </motion.div>

        <div ref={listRef} className="relative">
          {/* Static spine — connects every tile even before it's scrolled into focus. */}
          <div className="absolute left-[6px] top-2.5 bottom-2.5 w-px bg-line" />
          {/* Animated overlay — fills in as you scroll through the list, softly glowing. */}
          <motion.div
            style={{ scaleY: spineScale, boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
            className="absolute left-[6px] top-2.5 bottom-2.5 w-px bg-accent origin-top"
          />

          <div className="space-y-4">
            {papers.map((paper, i) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="relative grid grid-cols-[24px_1fr] gap-x-5 sm:gap-x-6 items-center"
              >
                <Node progress={scrollYProgress} threshold={i / (papers.length - 1)} />

                <div className="card rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-line-strong transition-colors duration-300">
                  <div className="min-w-0">
                    {paper.conference && <div className="text-xs text-faint mb-1">{paper.conference}</div>}
                    <div className="text-sm sm:text-base font-medium text-bone leading-snug">{paper.title}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {paper.technologies.map((t) => (
                      <span key={t} className="text-xs text-faint border border-line rounded-full px-2.5 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
