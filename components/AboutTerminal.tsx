"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, Folder } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const CMD = "neofetch";

// ASCII "A" mark, coloured with a gradient.
const LOGO = ["      /\\      ", "     /  \\     ", "    / /\\ \\    ", "   / ____ \\   ", "  /_/    \\_\\  "];

const INFO: [string, React.ReactNode][] = [
  ["role", "Full-stack + AI/ML dev"],
  ["focus", <span key="f" className="text-fuchsia-300">LLMs · RAG · Cloud</span>],
  ["stack", "React · Node · Python · AWS"],
  ["shipped", <span key="s" className="text-emerald-300">3 live products</span>],
  ["uptime", "coding since 2022"],
  ["location", "Coimbatore, IN"],
];
const SWATCHES = ["#F87171", "#FBBF24", "#34D399", "#22D3EE", "#60A5FA", "#A78BFA", "#F472B6", "#E2E8F0"];

function Prompt({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[12.5px] sm:text-[13px]">
      <span className="flex items-center">
        <span className="rounded-l-md bg-accent px-2 py-[3px] font-semibold text-white">arjun</span>
        <span className="flex items-center gap-1 bg-white/[0.08] px-2 py-[3px] text-white/75">
          <Folder className="w-3 h-3" /> ~/about
        </span>
        <span className="flex items-center gap-1 rounded-r-md bg-emerald-400/15 px-2 py-[3px] text-emerald-300">
          <GitBranch className="w-3 h-3" /> main
        </span>
      </span>
      <span className="text-emerald-400">❯</span>
      <span className="text-white">{children}</span>
    </div>
  );
}

function Cursor() {
  return <span className="inline-block w-[7px] h-[15px] -mb-[2px] bg-neon/90 animate-pulse" />;
}

/** A small terminal that runs `neofetch` about me when it scrolls into view. */
export function AboutTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0); // info rows revealed
  const total = INFO.length + 2; // header, rows, swatches

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(CMD.length);
      setShown(total);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    if (typed < CMD.length) t = setTimeout(() => setTyped(typed + 1), typed === 0 ? 450 : 85);
    else if (shown < total) t = setTimeout(() => setShown(shown + 1), shown === 0 ? 380 : 110);
    return () => clearTimeout(t);
  }, [inView, typed, shown, total]);

  const done = shown >= total;
  const row = (k: number) => (shown > k ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1");

  return (
    <div ref={ref} className="relative h-full flex flex-col rounded-2xl border border-white/10 bg-[#070b16]/85 backdrop-blur-md shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* title bar */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-white/[0.07] bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/45">arjun — zsh</span>
        <span className="ml-auto font-mono text-[10.5px] text-white/30">⌘1</span>
      </div>

      <div className="flex-1 flex flex-col gap-3 px-4 sm:px-5 py-4">
        <Prompt>
          {CMD.slice(0, typed)}
          {typed < CMD.length && <Cursor />}
        </Prompt>

        <div className="flex gap-5 sm:gap-7">
          {/* logo */}
          <motion.pre
            initial={false}
            animate={{ opacity: shown > 0 ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="hidden sm:block shrink-0 self-center font-mono text-[12.5px] leading-[1.25] font-bold bg-gradient-to-b from-neon via-accent-soft to-fuchsia-400 bg-clip-text text-transparent"
          >
            {LOGO.join("\n")}
          </motion.pre>

          {/* info */}
          <div className="min-w-0 font-mono text-[12.5px] sm:text-[13px] leading-[1.6]">
            <div className={`transition-all duration-300 ${row(0)}`}>
              <span className="text-neon font-semibold">arjun</span>
              <span className="text-white/40">@</span>
              <span className="text-fuchsia-300 font-semibold">portfolio</span>
            </div>
            <div className={`text-white/20 transition-all duration-300 ${row(0)}`}>─────────────────</div>
            {INFO.map(([k, v], i) => (
              <div key={k} className={`flex gap-2 transition-all duration-300 ${row(i + 1)}`}>
                <span className="w-[68px] shrink-0 text-neon">{k}</span>
                <span className="text-white/85 truncate">{v}</span>
              </div>
            ))}
            <div className={`mt-2 flex gap-1 transition-all duration-300 ${row(INFO.length + 1)}`}>
              {SWATCHES.map((c) => (
                <span key={c} className="w-4 h-2.5 rounded-[2px]" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-auto transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}>
          <Prompt>
            <Cursor />
          </Prompt>
        </div>
      </div>
    </div>
  );
}
