"use client";

import React from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { ParticleField } from "./ParticleField";
import { SectionHeading } from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const { bioLong, focusAreas } = PORTFOLIO_DATA.personal;

  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 border-t border-line overflow-hidden">
      <ParticleField className="absolute inset-0 pointer-events-none opacity-55 [mask-image:radial-gradient(ellipse_60%_75%_at_50%_50%,black,transparent_92%)]" />

      <div className="relative z-10 max-w-[1180px] mx-auto px-6 sm:px-10">
        <SectionHeading index="01" eyebrow="About" title="Building software that scales." accentFrom={3} />

        <div className="mt-10 max-w-3xl space-y-8">
          <div className="space-y-5">
            {bioLong.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                className="text-base sm:text-xl text-dim leading-relaxed"
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {focusAreas.map((area) => (
              <motion.span
                key={area}
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
                }}
                whileHover={{ y: -3 }}
                className="px-3.5 py-1.5 rounded-full border border-line bg-panel/50 text-xs text-dim hover:text-bone hover:border-accent/50 hover:shadow-glow-sm transition-colors cursor-default"
              >
                {area}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
