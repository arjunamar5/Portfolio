"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;

function CodeCard() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 8);
    rx.set(-py * 8);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      className="hidden lg:block [perspective:1400px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry }}
        className="relative rounded-2xl border border-line-strong bg-panel/80 backdrop-blur-xl shadow-glow overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-auto text-[11px] text-faint font-mono">developer.ts</span>
        </div>
        <pre className="p-6 text-[13px] leading-relaxed font-mono overflow-x-auto">
          <code>
            <span className="text-faint">// {PORTFOLIO_DATA.personal.title}</span>{"\n"}
            <span className="text-accent-soft">const</span> <span className="text-bone">developer</span> = {"{"}
            {"\n"}
            {"  "}name: <span className="text-emerald-300">&apos;{PORTFOLIO_DATA.personal.name}&apos;</span>,{"\n"}
            {"  "}focus: [<span className="text-emerald-300">&apos;Full-Stack&apos;</span>, <span className="text-emerald-300">&apos;AI&apos;</span>, <span className="text-emerald-300">&apos;Cloud&apos;</span>],{"\n"}
            {"  "}interest: <span className="text-emerald-300">&apos;Exploring new Tech&apos;</span>,{"\n"}
            {"  "}learning: <span className="text-neon">true</span>,{"\n"}
            {"}"};
          </code>
        </pre>
      </motion.div>
    </motion.div>
  );
}

export function Hero({ onOpenResume }: { onOpenResume: () => void }) {
  const titles = PORTFOLIO_DATA.personal.typingTitles;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % titles.length), 3200);
    return () => clearInterval(id);
  }, [titles.length]);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    const lenis = (window as any).__lenis;
    if (el && lenis) lenis.scrollTo(el, { offset: -32, duration: 1.2 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
      {/* Subtle static gradient — no motion that competes with the text. */}
      <div className="pointer-events-none absolute inset-0 bg-glow-accent" />
      <div className="pointer-events-none absolute -top-32 right-[8%] w-[420px] h-[420px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-[4%] w-[320px] h-[320px] rounded-full bg-neon/[0.05] blur-[100px]" />

      <div className="relative max-w-[1280px] w-full mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-xl sm:text-2xl text-dim mb-2"
            >
              Hi, I&apos;m
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="font-semibold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-bone"
            >
              {PORTFOLIO_DATA.personal.name.split(" ")[0]}{" "}
              <span className="text-accent">{PORTFOLIO_DATA.personal.name.split(" ").slice(1).join(" ")}</span>
            </motion.h1>

            <div className="h-8 sm:h-9 mt-3 mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="text-lg sm:text-xl text-accent-soft font-medium"
                >
                  {titles[idx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-dim max-w-xl leading-relaxed mb-10"
            >
              {PORTFOLIO_DATA.personal.bioShort}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => scrollTo("work")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-soft hover:shadow-glow transition-all"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-line-strong text-bone text-sm font-medium hover:bg-panel-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Resume
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-dim text-sm font-medium hover:text-bone transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact
              </button>
            </motion.div>
          </div>

          <CodeCard />
        </div>
      </div>
    </section>
  );
}
