"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, Folder } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const CMD = "neofetch";

// ASCII "A" mark, coloured with a gradient.
const LOGO = ["      /\\      ", "     /  \\     ", "    / /\\ \\    ", "   / ____ \\   ", "  /_/    \\_\\  "];

const INFO: [string, string][] = [
  ["builds", "Websites · SaaS · AI stuff"],
  ["learning", "LLMs · RAG · Cloud"],
  ["likes", "Clean UI · Fast apps · Good coffee"],
  ["also into", "Music · Fitness · Travel"],
  ["usually", "Turning random ideas into real projects"],
  ["mindset", "Make it work · Make it better"],
];

function Cursor() {
  return <span className="inline-block w-[7px] h-[15px] -mb-[2px] bg-neon/90 animate-pulse" />;
}

/** A small terminal that runs `neofetch` about me when it scrolls into view. */
export function AboutTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0); // header + info rows revealed
  const total = INFO.length + 1;

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(CMD.length);
      setShown(total);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    if (typed < CMD.length) t = setTimeout(() => setTyped(typed + 1), typed === 0 ? 450 : 85);
    else if (shown < total) t = setTimeout(() => setShown(shown + 1), shown === 0 ? 380 : 120);
    return () => clearTimeout(t);
  }, [inView, typed, shown, total]);

  const done = shown >= total;
  const row = (k: number) => (shown > k ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1");

  return (
    <div ref={ref} className="relative h-full flex flex-col rounded-2xl border border-white/10 bg-[#070b16]/85 backdrop-blur-md shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* title bar */}
      <div className="relative flex items-center gap-2 px-3.5 py-2.5 border-b border-white/[0.07] bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/45">arjun — zsh</span>
      </div>

      <div className="flex-1 flex flex-col gap-4 px-4 sm:px-5 py-4">
        {/* prompt */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[12.5px] sm:text-[13px]">
          <span className="flex items-center">
            <span className="rounded-l-md bg-accent px-2 py-[3px] font-semibold text-white">arjun</span>
            <span className="hidden sm:flex items-center gap-1 bg-white/[0.08] px-2 py-[3px] text-white/75">
              <Folder className="w-3 h-3" /> ~/about
            </span>
            <span className="flex items-center gap-1 rounded-r-md bg-emerald-400/15 px-2 py-[3px] text-emerald-300">
              <GitBranch className="w-3 h-3" /> main
            </span>
          </span>
          <span className="text-emerald-400">❯</span>
          <span className="text-white">
            {CMD.slice(0, typed)}
            {typed < CMD.length && <Cursor />}
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          {/* logo */}
          <motion.pre
            initial={false}
            animate={{ opacity: shown > 0 ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="hidden sm:block shrink-0 font-mono text-[12.5px] leading-[1.25] font-bold bg-gradient-to-b from-neon via-accent-soft to-fuchsia-400 bg-clip-text text-transparent"
          >
            {LOGO.join("\n")}
          </motion.pre>

          {/* info */}
          <div className="min-w-0 font-mono text-[12.5px] sm:text-[13px] leading-[1.65]">
            <div className={`mb-1.5 transition-all duration-300 ${row(0)}`}>
              <span className="text-neon font-semibold">arjun</span>
              <span className="text-white/40">@</span>
              <span className="text-white font-semibold">portfolio</span>
            </div>
            {INFO.map(([k, v], i) => (
              <div key={k} className={`flex flex-col sm:flex-row sm:gap-3 mb-1.5 sm:mb-0 transition-all duration-300 ${row(i + 1)}`}>
                <span className="sm:w-[76px] shrink-0 text-[11px] sm:text-[13px] text-neon/90">{k}</span>
                <span className="text-white/85">
                  {v}
                  {done && i === INFO.length - 1 && (
                    <span className="ml-1.5">
                      <Cursor />
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
