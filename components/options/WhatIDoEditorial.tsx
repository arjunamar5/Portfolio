"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Bot, LineChart, BellRing, ServerCog } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROWS = [
  { from: "Paper registers", to: "Live dashboards", Icon: LayoutDashboard, c: "#60A5FA" },
  { from: "Bookings by phone call", to: "A WhatsApp booking bot", Icon: Bot, c: "#34D399" },
  { from: "Spreadsheet guesswork", to: "Real-time analytics", Icon: LineChart, c: "#C084FC" },
  { from: "Manual follow-ups", to: "Automatic reminders", Icon: BellRing, c: "#F472B6" },
  { from: "Crashes at peak traffic", to: "Auto-scaling cloud", Icon: ServerCog, c: "#FB923C" },
];

const WORDS = ["Design", "Build", "Automate", "Deploy", "Scale"];

export function WhatIDoEditorial({ highlight = 1 }: { highlight?: number }) {
  return (
    <section className="relative pt-28 sm:pt-32 pb-0 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-[-10%] w-[900px] h-[700px] rounded-full bg-accent/[0.10] blur-[140px]" />
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">02</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">What I do</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-6 font-grotesk font-bold tracking-[-0.045em] leading-[0.92]"
        >
          <span className="block text-[clamp(2rem,5vw,4.4rem)] text-bone/80 font-medium tracking-[-0.03em]">I turn</span>
          <span
            className="block text-[clamp(2.6rem,7vw,6.4rem)] text-transparent"
            style={{ WebkitTextStroke: "1.6px #FDBA74" }}
          >
            real-world problems
          </span>
          <span className="block text-[clamp(2.6rem,7vw,6.4rem)]">
            <span className="text-[clamp(2rem,5vw,4.4rem)] text-bone/80 font-medium tracking-[-0.03em] align-middle mr-4">into</span>
            <span className="bg-gradient-to-r from-neon via-accent-soft to-emerald-300 bg-clip-text text-transparent">working software.</span>
          </span>
        </motion.h2>

        {/* What that looks like */}
        <div className="mt-16 border-t border-line">
          {ROWS.map((r, i) => {
            const on = i === highlight;
            return (
              <motion.div
                key={r.from}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="group relative grid grid-cols-[48px_1fr] md:grid-cols-[72px_1fr_64px_1fr_56px] items-center gap-y-1 border-b border-line py-5 md:py-6 px-2 md:px-4 transition-colors duration-300 hover:bg-white/[0.02]"
                style={on ? { background: `linear-gradient(90deg, ${r.c}14, transparent 70%)` } : undefined}
              >
                {on && <span className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: r.c, boxShadow: `0 0 18px ${r.c}` }} />}
                <span className="font-mono text-sm text-faint">0{i + 1}</span>
                <span className={`font-grotesk text-xl md:text-[1.7rem] tracking-[-0.01em] line-through decoration-1 ${on ? "text-bone/50 decoration-orange-400/70" : "text-faint decoration-faint/60"}`}>{r.from}</span>
                <ArrowRight className={`hidden md:block w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 ${on ? "" : "text-faint"}`} style={on ? { color: r.c } : undefined} />
                <span className="col-start-2 md:col-start-auto font-grotesk text-xl md:text-[1.7rem] font-semibold tracking-[-0.01em]" style={{ color: on ? r.c : "#E6E9F0" }}>
                  {r.to}
                </span>
                <span
                  className="hidden md:flex w-11 h-11 rounded-xl items-center justify-center justify-self-end border transition-all duration-300"
                  style={{ borderColor: on ? `${r.c}88` : "rgba(148,163,199,0.18)", background: on ? `${r.c}22` : "transparent" }}
                >
                  <r.Icon className="w-5 h-5" style={{ color: on ? r.c : "#5C6780" }} />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-20 py-6 border-y border-line overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-10" style={{ animationDuration: "28s" }}>
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-10 shrink-0">
              {WORDS.concat(WORDS).map((w, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-10">
                  <span
                    className="font-grotesk font-bold text-6xl sm:text-7xl tracking-[-0.03em] text-transparent"
                    style={{ WebkitTextStroke: i % 2 ? "1.2px rgba(148,163,199,0.45)" : "1.2px #60A5FA" }}
                  >
                    {w}
                  </span>
                  <span className="text-3xl text-accent-soft">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
