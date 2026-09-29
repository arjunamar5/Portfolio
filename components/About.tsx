"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { ParticleField } from "./ParticleField";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./SpotlightCard";
import { CountUp } from "./CountUp";

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const { bioLong, education, focusAreas, leadership } = PORTFOLIO_DATA.personal;
  const cgpa = parseFloat(education.detail.replace(/[^\d.]/g, ""));

  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 border-t border-line overflow-hidden">
      <ParticleField className="absolute inset-0 pointer-events-none opacity-55 [mask-image:radial-gradient(ellipse_60%_75%_at_50%_50%,black,transparent_92%)]" />

      <div className="relative z-10 max-w-[1180px] mx-auto px-6 sm:px-10">
        <SectionHeading index="01" eyebrow="About" title="Building software that scales." accentFrom={3} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-5">
              {bioLong.split("\n\n").map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                  className="text-base sm:text-lg text-dim leading-relaxed"
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

          <div className="lg:col-span-5 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <SpotlightCard className="card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-accent-soft" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="eyebrow !text-faint mb-1.5">Education</div>
                    <div className="text-base font-medium text-bone">{education.institution}</div>
                    <div className="text-sm text-dim mt-0.5">{education.degree}</div>
                    <div className="text-xs text-faint mt-1">{education.period}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-semibold text-gradient">
                      <CountUp value={cgpa} decimals={2} />
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-faint">CGPA</div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
            >
              <SpotlightCard className="card rounded-2xl p-6" rgb="34, 211, 238">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-neon" />
                  </div>
                  <div className="min-w-0">
                    <div className="eyebrow !text-faint mb-1.5">Leadership</div>
                    <div className="text-base font-medium text-bone">
                      {leadership.role} · {leadership.organization}
                    </div>
                    <p className="text-sm text-dim leading-relaxed mt-2">{leadership.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
