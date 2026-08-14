"use client";

import React from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { ParticleField } from "./ParticleField";

const EASE = [0.16, 1, 0.3, 1] as const;

const FOCUS_AREAS = ["Full-Stack Development", "Artificial Intelligence", "Cloud Computing", "IoT"];

export function About() {
  const { bioLong, education } = PORTFOLIO_DATA.personal;

  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 border-t border-line overflow-hidden">
      <ParticleField className="absolute inset-0 pointer-events-none opacity-55 [mask-image:radial-gradient(ellipse_60%_75%_at_50%_50%,black,transparent_92%)]" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:col-span-4"
          >
            <span className="eyebrow !text-faint">About</span>
            <h2 className="font-semibold text-3xl sm:text-4xl leading-tight tracking-tight text-bone mt-3">
              Building software that scales.
            </h2>

            <div className="mt-8 pt-6 border-t border-line">
              <div className="text-sm font-medium text-bone">{education.institution}</div>
              <div className="text-xs text-faint mt-1">{education.degree}</div>
              <div className="text-xs text-faint">{education.period} · {education.detail}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="space-y-4">
              {bioLong.split("\n\n").map((para, i) => (
                <p key={i} className="text-base sm:text-lg text-dim leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {FOCUS_AREAS.map((area) => (
                <span
                  key={area}
                  className="px-3.5 py-1.5 rounded-full border border-line text-xs text-dim"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
