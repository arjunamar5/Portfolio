"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { PORTFOLIO_DATA, ExperienceItem } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./SpotlightCard";

const EASE = [0.16, 1, 0.3, 1] as const;

function Role({ item }: { item: ExperienceItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative grid grid-cols-[28px_1fr] sm:grid-cols-[44px_1fr] gap-x-4 sm:gap-x-6"
    >
      {/* Node on the spine */}
      <div className="relative flex justify-center pt-7">
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.2 }}
          className="relative z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-void border border-accent/50 flex items-center justify-center shadow-glow-sm"
        >
          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-soft" />
        </motion.span>
      </div>

      <SpotlightCard className="card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-bone tracking-tight">{item.company}</h3>
            <div className="text-sm text-accent-soft mt-1">{item.role}</div>
          </div>
          <span className="font-mono text-[11px] text-dim border border-line rounded-full px-3 py-1 bg-panel-2/60">
            {item.period}
          </span>
        </div>

        <p className="text-dim mt-4 leading-relaxed">{item.summary}</p>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
          className="mt-5 space-y-3"
        >
          {item.highlights.map((h) => (
            <motion.li
              key={h}
              variants={{
                hidden: { opacity: 0, x: -14 },
                show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="flex gap-3 text-sm sm:text-[15px] text-bone/85 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 mt-[3px] text-neon shrink-0" />
              <span>{h}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {item.metrics.map((m, mi) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.3 + mi * 0.1, ease: EASE }}
              className="rounded-xl border border-line bg-panel-2/50 px-2.5 sm:px-3 py-3 min-w-0"
            >
              <div className="text-[13px] sm:text-xl font-semibold text-gradient leading-tight break-words">{m.value}</div>
              <div className="text-[11px] text-faint mt-0.5 leading-snug">{m.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {item.techStack.map((t) => (
            <span key={t} className="text-xs text-faint border border-line rounded-full px-2.5 py-1 hover:text-bone hover:border-line-strong transition-colors">
              {t}
            </span>
          ))}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const dotTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative py-28 sm:py-36 border-t border-line">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="Where I've shipped."
          accentFrom={2}
          lede="Freelance full-stack engagements — production platforms that real businesses run on every day."
        />

        <div ref={listRef} className="relative mt-14">
          {/* Spine: static track + scroll-drawn gradient + travelling glow dot. */}
          <div className="absolute left-[14px] sm:left-[22px] top-0 bottom-0 w-px bg-line" />
          <motion.div
            style={{ scaleY: progress }}
            className="absolute left-[14px] sm:left-[22px] top-0 bottom-0 w-px origin-top bg-gradient-to-b from-accent via-neon to-accent shadow-[0_0_10px_rgba(34,211,238,0.6)]"
          />
          <motion.span
            style={{ top: dotTop }}
            className="absolute left-[14px] sm:left-[22px] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-neon shadow-[0_0_14px_4px_rgba(34,211,238,0.55)]"
          />

          <div className="space-y-10">
            {PORTFOLIO_DATA.experience.map((item) => (
              <Role key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
