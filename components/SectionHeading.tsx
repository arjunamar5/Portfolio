"use client";

import React from "react";
import { motion } from "framer-motion";
import { RevealText } from "./RevealText";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared section header: numbered eyebrow with a drawn rule, revealed title, optional lede. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  accentFrom,
  lede,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  accentFrom?: number;
  lede?: React.ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center flex flex-col items-center" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex items-center gap-3"
      >
        <span className="font-mono text-[11px] text-accent-soft">{index}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="h-px w-10 bg-gradient-to-r from-accent to-neon origin-left"
        />
        <span className="eyebrow !text-faint">{eyebrow}</span>
      </motion.div>
      <RevealText
        text={title}
        accentFrom={accentFrom}
        className="font-semibold text-3xl sm:text-5xl leading-[1.08] tracking-tight text-bone mt-4 text-balance"
      />
      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className={`text-dim mt-4 max-w-xl leading-relaxed ${centered ? "mx-auto" : ""}`}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
