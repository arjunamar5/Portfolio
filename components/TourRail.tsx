"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CHAPTERS = [
  { id: "home", label: "Intro" },
  { id: "about", label: "About" },
  { id: "approach", label: "What I do" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "stack", label: "Skills" },
  { id: "contact", label: "Contact" },
];

/**
 * Chapter rail for the "tour": one tick per section down the right edge,
 * the current chapter lit, labels on hover, click to jump. Desktop only.
 */
export function TourRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id));
    const pick = () => {
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    return () => window.removeEventListener("scroll", pick);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    const lenis = (window as any).__lenis;
    if (el && lenis) lenis.scrollTo(el, { offset: id === "home" ? 0 : -20, duration: 1.4 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav aria-label="Chapters" className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-[55] flex-col items-end gap-3">
      <div className="font-mono text-[10px] text-faint tabular-nums mb-1">
        <span className="text-bone">{String(active + 1).padStart(2, "0")}</span> / {String(CHAPTERS.length).padStart(2, "0")}
      </div>
      {CHAPTERS.map((c, i) => {
        const on = i === active;
        return (
          <button key={c.id} onClick={() => go(c.id)} aria-label={`Go to ${c.label}`} className="group relative flex items-center justify-end h-3">
            <span
              className={`absolute right-9 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                on ? "opacity-0 group-hover:opacity-100 text-accent-soft" : "opacity-0 group-hover:opacity-100 text-dim translate-x-1 group-hover:translate-x-0"
              }`}
            >
              {c.label}
            </span>
            <motion.span
              animate={{ width: on ? 28 : 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={`block h-[2px] rounded-full ${on ? "bg-gradient-to-r from-accent to-neon shadow-[0_0_8px_rgba(34,211,238,0.7)]" : "bg-faint/60 group-hover:bg-bone/70"}`}
            />
          </button>
        );
      })}
    </nav>
  );
}
