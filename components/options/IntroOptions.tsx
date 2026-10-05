"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;
const { location } = PORTFOLIO_DATA.personal;

/** Same shell as the About intro tile, so options can be judged in place. */
function Shell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft">{label}</div>
      <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] p-8 min-h-[330px]" style={{ background: "radial-gradient(120% 90% at 100% 0%, #6366F122, transparent 55%), #0A0F1C" }}>
        <div className="about-mesh pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay bg-[repeating-radial-gradient(circle_at_30%_20%,#fff_0_1px,transparent_1px_3px)]" />
        <div className="relative h-full min-h-[266px] flex flex-col">{children}</div>
      </div>
    </div>
  );
}

function Chips() {
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-6">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[12.5px] text-white">
        <MapPin className="w-3.5 h-3.5" /> {location}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[12.5px] text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Building something new
      </span>
    </div>
  );
}

/* A — a personal statement */
function Statement() {
  return (
    <Shell label="Option A · Personal statement">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">About me</span>
      <p className="mt-4 font-grotesk text-[1.9rem] sm:text-[2.35rem] font-bold leading-[1.1] tracking-[-0.03em] text-white">
        I love turning <span className="text-orange-300">messy, real-world problems</span> into{" "}
        <span className="bg-gradient-to-r from-neon via-accent-soft to-fuchsia-300 bg-clip-text text-transparent">software people actually use.</span>
      </p>
      <p className="mt-3 text-[14.5px] text-white/65">CS graduate · full-stack + AI/ML · 3 products live with real businesses</p>
      <Chips />
    </Shell>
  );
}

/* B — "I build ___" with a rotating object */
const THINGS = ["booking systems", "AI assistants", "live dashboards", "cloud platforms"];
function Rotating({ freeze }: { freeze?: number }) {
  const [i, setI] = useState(freeze ?? 0);
  useEffect(() => {
    if (freeze !== undefined) return;
    const id = setInterval(() => setI((v) => (v + 1) % THINGS.length), 2200);
    return () => clearInterval(id);
  }, [freeze]);
  return (
    <Shell label="Option B · I build ___">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">What I make</span>
      <p className="mt-4 font-grotesk text-[2.1rem] sm:text-[2.7rem] font-bold leading-[1.05] tracking-[-0.035em] text-white">
        I build
        <span className="relative block h-[1.15em] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={THINGS[i]}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="absolute left-0 whitespace-nowrap bg-gradient-to-r from-neon via-accent-soft to-fuchsia-300 bg-clip-text text-transparent"
            >
              {THINGS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-white/80">that real businesses run on.</span>
      </p>
      <p className="mt-3 text-[14.5px] text-white/65">From the database to the deployment, with AI inside.</p>
      <Chips />
    </Shell>
  );
}

/* C — a terminal answering "whoami" */
const LINES: { cmd: string; out: React.ReactNode }[] = [
  { cmd: "whoami", out: <>a CS grad who ships full-stack products <span className="text-fuchsia-300">with AI inside</span></> },
  { cmd: "cat focus.txt", out: <span className="text-neon">LLMs · RAG · Cloud</span> },
  { cmd: "ls shipped/", out: <span className="text-emerald-300">CueCourtOS&nbsp;&nbsp;PerfectStudySpace&nbsp;&nbsp;AlpenGlow</span> },
];
function Terminal() {
  return (
    <Shell label="Option C · whoami terminal">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-[11px] text-white/50">arjun@portfolio: ~</span>
      </div>
      <div className="mt-5 space-y-3.5 font-mono text-[15px] sm:text-[17px] leading-relaxed">
        {LINES.map((l) => (
          <div key={l.cmd}>
            <div className="text-white/90">
              <span className="text-emerald-400">❯</span> {l.cmd}
            </div>
            <div className="text-white/75 pl-5">{l.out}</div>
          </div>
        ))}
        <div className="text-white/90">
          <span className="text-emerald-400">❯</span> <span className="inline-block w-2.5 h-5 align-middle bg-neon animate-pulse" />
        </div>
      </div>
      <Chips />
    </Shell>
  );
}

/* D — three short beats */
function Beats() {
  const beats = [
    { a: "Curious", b: "by nature.", c: "#FDBA74" },
    { a: "Builder", b: "by habit.", c: "#67E8F9" },
    { a: "Into AI,", b: "deeply.", c: "#F0ABFC" },
  ];
  return (
    <Shell label="Option D · Three beats">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">In three lines</span>
      <div className="mt-4 font-grotesk text-[2.1rem] sm:text-[2.6rem] font-bold leading-[1.05] tracking-[-0.035em]">
        {beats.map((x) => (
          <div key={x.a}>
            <span style={{ color: x.c }}>{x.a}</span> <span className="text-white/80">{x.b}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[14.5px] text-white/65">A CS graduate building full-stack products with AI inside.</p>
      <Chips />
    </Shell>
  );
}

export function IntroOptions() {
  return (
    <section className="relative py-20">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-x-8 gap-y-12">
        <Statement />
        <Rotating freeze={1} />
        <Terminal />
        <Beats />
      </div>
    </section>
  );
}
