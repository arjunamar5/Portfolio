"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { BookOpen } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./SpotlightCard";
import { CountUp } from "./CountUp";

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
    <section id="research" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-20 w-[480px] h-[480px] rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        <div className="mb-14 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
          <SectionHeading
            index="04"
            eyebrow="Research"
            title="Publications."
            lede={PORTFOLIO_DATA.personal.researchNote}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <SpotlightCard className="conic-border card rounded-2xl px-7 py-5 flex items-center gap-5">
              <div className="text-6xl font-semibold leading-none text-gradient">
                <CountUp value={8} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-bone">
                  <BookOpen className="w-4 h-4 text-accent-soft" />
                  Papers
                </div>
                <div className="text-xs text-faint mt-1 leading-snug">
                  Scopus-indexed
                  <br />
                  IEEE &amp; Springer
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        <div ref={listRef} className="relative">
          {/* Static spine — connects every tile even before it's scrolled into focus. */}
          <div className="absolute left-[6px] top-2.5 bottom-2.5 w-px bg-line" />
          {/* Animated overlay — fills in as you scroll through the list, softly glowing. */}
          <motion.div
            style={{ scaleY: spineScale, boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
            className="absolute left-[6px] top-2.5 bottom-2.5 w-px bg-gradient-to-b from-accent to-neon origin-top"
          />

          <div className="space-y-4">
            {papers.map((paper, i) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className="relative grid grid-cols-[24px_1fr] gap-x-5 sm:gap-x-6 items-center"
              >
                <Node progress={scrollYProgress} threshold={i / (papers.length - 1)} />

                <SpotlightCard className="card rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-line-strong hover:translate-x-1 transition-all duration-300">
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
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
