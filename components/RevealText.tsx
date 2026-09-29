"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Word-by-word masked reveal: each word slides up out of its own clipping
 * box, staggered, the first time the text scrolls into view. Words from
 * `accentFrom` onward get the animated accent gradient.
 */
export function RevealText({
  text,
  as = "h2",
  className = "",
  delay = 0,
  accentFrom,
  play,
}: {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  accentFrom?: number;
  /** When provided, plays on this flag instead of on scroll-into-view. */
  play?: boolean;
}) {
  const MotionTag = motion[as];
  const words = text.split(" ");
  const trigger =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 } }
      : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <MotionTag
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      aria-label={text}
      className={className}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={`inline-block will-change-transform ${
                accentFrom !== undefined && i >= accentFrom ? "text-gradient" : ""
              }`}
              variants={{
                hidden: { y: "115%", rotate: 3 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.85, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </MotionTag>
  );
}
