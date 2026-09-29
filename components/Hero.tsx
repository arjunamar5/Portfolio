"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { Magnetic } from "./Magnetic";
import { CountUp } from "./CountUp";

const EASE = [0.16, 1, 0.3, 1] as const;

// Divider placement for the stats row: 2×2 on mobile, 1×4 from `sm`.
const STAT_CELL = ["", "pl-5 border-l border-line", "sm:pl-5 sm:border-l sm:border-line", "pl-5 border-l border-line"];

type Token = { t: string; c?: string };

// The hero code card, as tokens so it can be "typed" out character by character.
const CODE: Token[][] = [
  [{ t: "// developer.ts", c: "text-faint" }],
  [{ t: "const ", c: "text-accent-soft" }, { t: "developer", c: "text-bone" }, { t: " = {" }],
  [{ t: "  name: " }, { t: `'${PORTFOLIO_DATA.personal.name}'`, c: "text-emerald-300" }, { t: "," }],
  [{ t: "  role: " }, { t: "'Full-Stack & AI/ML'", c: "text-emerald-300" }, { t: "," }],
  [
    { t: "  stack: [" },
    { t: "'React'", c: "text-emerald-300" },
    { t: ", " },
    { t: "'Node'", c: "text-emerald-300" },
    { t: ", " },
    { t: "'Python'", c: "text-emerald-300" },
    { t: ", " },
    { t: "'AWS'", c: "text-emerald-300" },
    { t: "]," },
  ],
  [
    { t: "  genAI: [" },
    { t: "'LLMs'", c: "text-emerald-300" },
    { t: ", " },
    { t: "'RAG'", c: "text-emerald-300" },
    { t: ", " },
    { t: "'Ollama'", c: "text-emerald-300" },
    { t: "]," },
  ],
  [{ t: "  publications: " }, { t: "8", c: "text-amber-300" }, { t: "," }],
  [{ t: "  openToWork: " }, { t: "true", c: "text-neon" }, { t: "," }],
  [{ t: "};" }],
];
const TOTAL_CHARS = CODE.flat().reduce((n, tok) => n + tok.t.length, 0) + CODE.length;

function useTyped(active: boolean, delayMs: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(TOTAL_CHARS);
      return;
    }
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      id = setInterval(() => {
        setN((v) => {
          if (v >= TOTAL_CHARS) {
            clearInterval(id);
            return v;
          }
          return v + 2;
        });
      }, 16);
    }, delayMs);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [active, delayMs]);
  return n;
}

function CodeCard({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });
  const typed = useTyped(ready, 700);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  // Walk the tokens, spending the typed-character budget.
  let budget = typed;
  let caretPlaced = false;
  const lines = CODE.map((line, li) => {
    const parts = line.map((tok, ti) => {
      if (budget <= 0) return null;
      const shown = tok.t.slice(0, budget);
      budget -= tok.t.length;
      return (
        <span key={ti} className={tok.c}>
          {shown}
        </span>
      );
    });
    const lineDone = budget > 0;
    budget -= 1; // newline
    const caretHere = !caretPlaced && (!lineDone || li === CODE.length - 1);
    if (caretHere) caretPlaced = true;
    return (
      <div key={li} className="min-h-[1.6em] whitespace-pre">
        <span className="inline-block w-7 text-faint/50 select-none">{li + 1}</span>
        {parts}
        {caretHere && <span className="caret inline-block w-[7px] h-[1.05em] -mb-[2px] ml-px bg-accent-soft" />}
      </div>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 18 }}
      animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
      className="hidden lg:block relative [perspective:1400px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry }}
        className="relative preserve-3d"
      >
        <div className="conic-border relative rounded-2xl bg-panel/80 backdrop-blur-xl shadow-glow overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-auto text-[11px] text-faint font-mono">developer.ts</span>
          </div>
          <pre className="p-6 text-[13px] leading-relaxed font-mono overflow-hidden">
            <code>{lines}</code>
          </pre>
        </div>

        {/* Floating chips orbiting the card, lifted in 3D. */}
        {[
          { label: "RAG · Ollama", cls: "-top-5 -left-8", delay: 1.4, dur: 6 },
          { label: "8 papers · IEEE & Springer", cls: "-bottom-6 left-10", delay: 1.6, dur: 7 },
          { label: "AWS · Docker", cls: "top-16 -right-8", delay: 1.8, dur: 5.5 },
        ].map((chip) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={ready ? { opacity: 1, scale: 1, y: [0, -10, 0] } : {}}
            transition={{
              opacity: { duration: 0.5, delay: chip.delay },
              scale: { duration: 0.5, delay: chip.delay, ease: EASE },
              y: { duration: chip.dur, repeat: Infinity, ease: "easeInOut", delay: chip.delay },
            }}
            style={{ transform: "translateZ(40px)" }}
            className={`absolute ${chip.cls} glass rounded-full px-3.5 py-1.5 text-xs text-bone shadow-glow-sm flex items-center gap-2`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_8px_#22D3EE]" />
            {chip.label}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/** Types a title out, holds, deletes it, moves to the next. */
function Typewriter({ words, active }: { words: string[]; active: boolean }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const word = words[i];
    let delay = deleting ? 35 : 70;
    if (!deleting && text === word) delay = 1800;
    if (deleting && text === "") delay = 300;

    const id = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setI((v) => (v + 1) % words.length);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, i, words, active]);

  return (
    <span className="text-accent-soft font-medium">
      {text}
      <span className="caret inline-block w-[2px] h-[1em] -mb-[3px] ml-1 bg-neon" />
    </span>
  );
}

export function Hero({ onOpenResume, ready }: { onOpenResume: () => void; ready: boolean }) {
  const { name, typingTitles, bioShort, stats } = PORTFOLIO_DATA.personal;
  const [first, ...rest] = name.split(" ");
  const sectionRef = useRef<HTMLElement>(null);

  // Content drifts up and fades as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 220]);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    const lenis = (window as any).__lenis;
    if (el && lenis) lenis.scrollTo(el, { offset: -32, duration: 1.2 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18, filter: "blur(8px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 0.8, delay, ease: EASE },
  });

  const letters = (word: string, offset: number, cls = "") =>
    word.split("").map((ch, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: "60%", rotateX: -80, filter: "blur(10px)" }}
        animate={ready ? { opacity: 1, y: "0%", rotateX: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.9, delay: 0.15 + (offset + i) * 0.035, ease: EASE }}
        className={`inline-block origin-bottom ${cls}`}
      >
        {ch === " " ? " " : ch}
      </motion.span>
    ));

  return (
    <section ref={sectionRef} id="home" className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-28 pb-20">
      {/* Ambient background: drifting aurora + masked grid, parallaxed on scroll. */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent_80%)]" />
        <div className="aurora-blob w-[520px] h-[520px] -top-40 right-[5%] bg-accent/25" />
        <div
          className="aurora-blob w-[420px] h-[420px] top-[35%] -left-32 bg-neon/15"
          style={{ animationDelay: "-6s", animationDuration: "22s" }}
        />
        <div
          className="aurora-blob w-[360px] h-[360px] bottom-[-120px] right-[30%] bg-indigo-500/15"
          style={{ animationDelay: "-12s", animationDuration: "26s" }}
        />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative max-w-[1280px] w-full mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <motion.div {...show(0.05)} className="inline-flex items-center gap-2.5 rounded-full glass px-3.5 py-1.5 mb-7">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs text-dim">Open to full-time roles · {PORTFOLIO_DATA.personal.location}</span>
            </motion.div>

            <motion.p {...show(0.1)} className="text-xl sm:text-2xl text-dim mb-2">
              Hi, I&apos;m
            </motion.p>

            <h1
              aria-label={name}
              className="font-semibold text-[2.6rem] sm:text-6xl xl:text-7xl leading-[1.02] tracking-tight text-bone [perspective:800px]"
            >
              <span className="inline-block">{letters(first, 0)}</span>{" "}
              <span className="inline-block">{letters(rest.join(" "), first.length + 1, "text-gradient")}</span>
            </h1>

            <motion.div {...show(0.55)} className="h-8 sm:h-9 mt-4 mb-6 text-lg sm:text-2xl">
              <Typewriter words={typingTitles} active={ready} />
            </motion.div>

            <motion.p {...show(0.65)} className="text-base sm:text-lg text-dim max-w-xl leading-relaxed mb-10">
              {bioShort}
            </motion.p>

            <motion.div {...show(0.75)} className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <button
                  onClick={() => scrollTo("work")}
                  className="btn-shine group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-soft hover:shadow-glow transition-all"
                >
                  View Projects
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-line-strong text-bone text-sm font-medium hover:bg-panel-2 hover:border-accent/50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollTo("contact")}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-dim text-sm font-medium hover:text-bone transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </button>
              </Magnetic>
            </motion.div>

            <motion.dl
              {...show(0.9)}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-y-6 max-w-xl border-t border-line pt-6"
            >
              {stats.map((s, i) => (
                <div key={s.label} className={STAT_CELL[i] ?? ""}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl sm:text-3xl font-semibold text-bone tracking-tight">
                    <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} start={ready} />
                  </dd>
                  <dd className="text-[11px] text-faint mt-1 leading-snug">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <CodeCard ready={ready} />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        onClick={() => scrollTo("about")}
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-faint hover:text-bone transition-colors"
      >
        <span className="w-5 h-8 rounded-full border border-line-strong flex justify-center pt-1.5">
          <span className="scroll-cue w-1 h-1.5 rounded-full bg-accent-soft" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase">Scroll</span>
      </motion.button>
    </section>
  );
}
