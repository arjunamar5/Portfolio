"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { GraduationCap, BookOpen, Award, Brain, Briefcase, Rocket, ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";
import { PORTFOLIO_DATA, JourneyStop } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;

const KIND: Record<JourneyStop["kind"], { icon: LucideIcon; color: string; label: string }> = {
  education: { icon: GraduationCap, color: "#60A5FA", label: "Education" },
  research: { icon: BookOpen, color: "#A78BFA", label: "Research" },
  leadership: { icon: Award, color: "#22D3EE", label: "Leadership" },
  project: { icon: Brain, color: "#4FBDB6", label: "Project" },
  work: { icon: Briefcase, color: "#FB923C", label: "Client work" },
  next: { icon: Rocket, color: "#34D399", label: "Next" },
};

// Where the "traveller" sits in the viewport (fraction of width); stops light up as they reach it.
const travellerAt = (w: number) => (w < 640 ? 0.5 : 0.3);
const cardWidthAt = (w: number) => (w < 640 ? Math.round(w * 0.78) : 360);

function scrollToId(id: string, offset = -40) {
  const el = document.getElementById(id);
  const lenis = (window as any).__lenis;
  if (el && lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el?.scrollIntoView({ behavior: "smooth" });
}

function StopCard({ stop, active, current }: { stop: JourneyStop; active: boolean; current: boolean }) {
  const k = KIND[stop.kind];
  const exp = stop.experienceId ? PORTFOLIO_DATA.experience.find((e) => e.id === stop.experienceId) : undefined;
  const projectId = stop.projectId ?? exp?.projectId;
  const project = projectId ? PORTFOLIO_DATA.projects.find((p) => p.id === projectId) : undefined;

  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.4, scale: current ? 1 : 0.96, y: active ? 0 : 8 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative rounded-2xl border bg-panel/80 backdrop-blur-sm p-5 overflow-hidden"
      style={{
        borderColor: current ? `${k.color}88` : "rgba(148,163,199,0.14)",
        boxShadow: current ? `0 0 0 1px ${k.color}33, 0 24px 60px -24px ${k.color}66` : "0 12px 30px -18px rgba(0,0,0,0.7)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, ${k.color}, transparent)` }} />
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: k.color }}>
          <k.icon className="w-3.5 h-3.5" />
          {k.label}
        </span>
        <span className="font-mono text-[10.5px] text-dim border border-line rounded-full px-2.5 py-0.5 bg-void/50 whitespace-nowrap">{stop.date}</span>
      </div>
      <h3 className="text-[17px] font-semibold text-bone leading-snug">{stop.title}</h3>
      <div className="text-xs text-faint mt-1">{stop.place}</div>

      {exp ? (
        <ul className="mt-3 space-y-2">
          {exp.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-[12.5px] text-bone/80 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 mt-[3px] shrink-0" style={{ color: k.color }} />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : (
        stop.text && <p className="text-[13px] text-dim leading-relaxed mt-3">{stop.text}</p>
      )}

      {project && (
        <button
          onClick={() => scrollToId(project.id)}
          className="group mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-bone"
          style={{ color: k.color }}
        >
          See {project.shortTitle}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      )}
      {stop.kind === "next" && (
        <button
          onClick={() => scrollToId("contact", 0)}
          className="btn-shine mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-void"
          style={{ background: k.color }}
        >
          Let&apos;s talk <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}

/**
 * The professional tour: a pinned section where vertical scroll drives the
 * visitor sideways along a road of milestones. A traveller dot stays put at
 * ~30% of the viewport; every stop it passes lights up.
 */
export function Journey() {
  const stops = PORTFOLIO_DATA.journey;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dist, setDist] = useState(0);
  const [vh, setVh] = useState(900);
  const [active, setActive] = useState(0);
  const [geo, setGeo] = useState({ trav: 0.3, cardW: 360, padL: 252, padR: 900 });
  const centers = useRef<number[]>([]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // Distance lives in a motion value so the transform never reads a stale closure.
  const distMV = useMotionValue(0);
  const x = useTransform([scrollYProgress, distMV], ([v, d]: number[]) => -v * d);

  // Measure how far the track has to travel, and where each stop sits on it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const w = window.innerWidth;
      const trav = travellerAt(w);
      const cardW = cardWidthAt(w);
      // First stop starts under the traveller; the last one finishes there.
      const padL = Math.max(16, trav * w - cardW / 2);
      const padR = Math.max(16, w - trav * w - cardW / 2);
      track.style.paddingLeft = `${padL}px`;
      track.style.paddingRight = `${padR}px`;
      setGeo({ trav, cardW, padL, padR });
      setVh(window.innerHeight);
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      setDist(d);
      distMV.set(d);
      centers.current = nodeRefs.current.map((n) => (n ? n.offsetLeft + n.offsetWidth / 2 : 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distMV]);

  useMotionValueEvent(x, "change", (v) => {
    const traveller = window.innerWidth * travellerAt(window.innerWidth);
    let idx = 0;
    centers.current.forEach((c, i) => {
      if (c + v <= traveller + 40) idx = i;
    });
    setActive(idx);
  });

  const current = stops[active];
  const year = current.date.match(/\d{4}/)?.[0] ?? "";

  return (
    <section ref={sectionRef} id="journey" className="relative border-t border-line" style={{ height: dist + vh }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

        {/* Giant year behind the road */}
        <div className="pointer-events-none absolute right-[4vw] bottom-[4vh] select-none">
          <AnimatePresence mode="wait">
            {year && (
            <motion.span
              key={year}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="block text-[22vw] sm:text-[13vw] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(148,163,199,0.12)]"
            >
              {year}
            </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Header */}
        <div className="absolute inset-x-0 top-[8%] sm:top-[9%] z-10 pointer-events-none">
          <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent-soft">02</span>
              <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
              <span className="eyebrow !text-faint">Journey</span>
            </div>
            <h2 className="font-semibold text-3xl sm:text-5xl leading-[1.08] tracking-tight text-bone mt-3">
              The road <span className="text-gradient">so far.</span>
            </h2>
            <div className="flex items-center gap-3 mt-3 font-mono text-[11px] text-faint">
              <span className="text-bone tabular-nums">
                {String(active + 1).padStart(2, "0")} <span className="text-faint">/ {String(stops.length).padStart(2, "0")}</span>
              </span>
              <span className="h-px w-6 bg-line-strong" />
              <span className="inline-flex items-center gap-1.5">
                Scroll to travel <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Road: dim ahead, lit behind the traveller */}
        <div className="absolute inset-x-0 top-[34%] sm:top-[57%] h-px bg-line" />
        <div
          className="absolute left-0 top-[34%] sm:top-[57%] h-[2px] -mt-px bg-gradient-to-r from-transparent via-accent to-neon shadow-[0_0_14px_rgba(34,211,238,0.6)]"
          style={{ width: `${geo.trav * 100}%` }}
        />
        <div
          className="absolute top-[34%] sm:top-[57%] -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: `${geo.trav * 100}%` }}
        >
          <span className="absolute inset-0 -m-3 rounded-full bg-neon/20 animate-ping" />
          <span className="relative block w-3.5 h-3.5 rounded-full bg-neon shadow-[0_0_18px_4px_rgba(34,211,238,0.6)]" />
        </div>

        {/* Track */}
        <motion.div ref={trackRef} style={{ x }} className="absolute inset-y-0 left-0 flex items-stretch gap-6 sm:gap-10 will-change-transform">
          {stops.map((stop, i) => {
            const k = KIND[stop.kind];
            const on = i <= active;
            // Tall client-work cards always hang below the road so they never reach the header.
            const above = stop.kind !== "work" && i % 2 === 0;
            return (
              <div
                key={stop.id}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                style={{ width: geo.cardW }}
                className="relative shrink-0 h-full"
              >
                {/* Node on the road */}
                <div className="absolute left-1/2 top-[34%] sm:top-[57%] -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.span
                    animate={{ scale: on ? 1 : 0.7, backgroundColor: on ? k.color : "#0A0E19" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="block w-4 h-4 rounded-full border-2"
                    style={{ borderColor: k.color, boxShadow: on ? `0 0 16px ${k.color}` : "none" }}
                  />
                </div>
                {/* Stem */}
                <div
                  className={`absolute left-1/2 w-px ${
                    above ? "sm:top-auto sm:bottom-[43%] sm:h-8" : "sm:top-[57%] sm:h-8"
                  } top-[34%] h-6`}
                  style={{ background: `linear-gradient(${above ? "to top" : "to bottom"}, ${k.color}, transparent)` }}
                />
                {/* Card: below the road on phones; alternating above/below on larger screens */}
                <div
                  className={`absolute inset-x-0 top-[calc(34%+28px)] ${
                    above ? "sm:top-auto sm:bottom-[calc(43%+36px)]" : "sm:top-[calc(57%+36px)]"
                  }`}
                >
                  <StopCard stop={stop} active={on} current={i === active} />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
