"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GraduationCap, Layers, Sparkles, Wrench, Rocket, Award, LucideIcon } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

// three.js only loads in the browser, and only for this section.
const ProgrammerScene = dynamic(() => import("./ProgrammerScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_65%)] animate-pulse" />,
});

type Thought = {
  icon: LucideIcon;
  title: string;
  sub?: string;
  chips?: string[];
  color: string;
  side: "l" | "r";
  pos: React.CSSProperties; // desktop position around the figure (an arc)
};

const { education, leadership } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

const THOUGHTS: Thought[] = [
  { side: "l", pos: { top: "6%", left: "5%" }, icon: GraduationCap, color: "#60A5FA", title: "CS Graduate", sub: `Amrita · CGPA ${cgpa}` },
  { side: "l", pos: { top: "43%", left: "0%" }, icon: Layers, color: "#38BDF8", title: "Full-stack + AI/ML", sub: "Hands-on across both" },
  { side: "l", pos: { top: "80%", left: "5%" }, icon: Award, color: "#22D3EE", title: `${leadership.role}, CSI`, sub: "ASEB Chapter" },
  { side: "r", pos: { top: "6%", right: "5%" }, icon: Sparkles, color: "#E879F9", title: "LLMs & RAG", sub: "My focus area" },
  { side: "r", pos: { top: "43%", right: "0%" }, icon: Rocket, color: "#FB923C", title: "Ships real products", sub: "Used by businesses daily" },
  { side: "r", pos: { top: "80%", right: "5%" }, icon: Wrench, color: "#34D399", title: "Everyday toolkit", chips: ["Python", "React", "Node", "AWS", "Ollama"] },
];

function Pill({ t, i, hovered, onHover }: { t: Thought; i: number; hovered: boolean; onHover: (i: number | null) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, x: t.side === "l" ? 60 : -60 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: 0.25 + (i % 3) * 0.12, ease: EASE }}
      onMouseEnter={() => onHover(i)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        className="relative inline-flex items-center gap-3 rounded-2xl border bg-panel/80 backdrop-blur-md pl-2.5 pr-4 py-2.5 transition-all duration-300"
        style={{
          borderColor: hovered ? `${t.color}bb` : `${t.color}33`,
          boxShadow: hovered ? `0 0 0 1px ${t.color}55, 0 16px 44px -14px ${t.color}` : `0 12px 32px -20px ${t.color}aa`,
        }}
      >
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}10)`, border: `1px solid ${t.color}55` }}
        >
          <t.icon className="w-4 h-4" style={{ color: t.color }} />
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-semibold text-bone leading-tight whitespace-nowrap">{t.title}</span>
          {t.sub && <span className="block text-[11.5px] text-dim mt-0.5 whitespace-nowrap">{t.sub}</span>}
          {t.chips && (
            <span className="flex flex-wrap gap-1 mt-1.5 max-w-[200px]">
              {t.chips.map((c) => (
                <span key={c} className="text-[10px] text-bone/85 rounded px-1.5 py-0.5 border border-line bg-void/60">
                  {c}
                </span>
              ))}
            </span>
          )}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lookRef = useRef<number | null>(null);
  const anchors = useRef<{ x: number; y: number }[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);

  // Connector start points: the inner edge of each pill, relative to the stage.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setDesktop(window.innerWidth >= 1024);
    const s = stage.getBoundingClientRect();
    anchors.current = pillRefs.current.map((el, i) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: (THOUGHTS[i].side === "l" ? r.right + 4 : r.left - 4) - s.left, y: r.top + r.height / 2 - s.top };
    });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    const late = setTimeout(measure, 1500); // after entrance animations settle
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(late);
    };
  }, [measure]);

  // The 3D scene reports its head position; redraw every connector to it (no re-render).
  const onHead = useCallback((hx: number, hy: number) => {
    const stage = stageRef.current;
    const fig = figureRef.current;
    if (!stage || !fig) return;
    const s = stage.getBoundingClientRect();
    const f = fig.getBoundingClientRect();
    const x2 = f.left - s.left + hx;
    const y2 = f.top - s.top + hy;
    anchors.current.forEach((a, i) => {
      const p = pathRefs.current[i];
      if (!p || !a) return;
      const mx = (a.x + x2) / 2;
      p.setAttribute("d", `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${y2}, ${x2} ${y2}`);
      dotRefs.current[i]?.setAttribute("cx", String(a.x));
      dotRefs.current[i]?.setAttribute("cy", String(a.y));
    });
  }, []);

  const hover = (i: number | null) => {
    setHovered(i);
    lookRef.current = i === null ? null : THOUGHTS[i].side === "l" ? -1 : 1;
  };

  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-20 sm:pb-24 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-accent/[0.08] blur-[140px]" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10">
        <SectionHeading index="01" eyebrow="About" title="Building software that scales." accentFrom={3} />

        <div ref={stageRef} className="relative mt-8 lg:mt-4 lg:h-[600px]">
          {desktop && (
            <svg className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden>
              <defs>
                <linearGradient id="thought-grad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {THOUGHTS.map((t, i) => (
                <g key={i}>
                  <path
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    fill="none"
                    stroke={hovered === i ? t.color : "url(#thought-grad)"}
                    strokeWidth={hovered === i ? 1.8 : 1}
                    strokeOpacity={hovered === null || hovered === i ? 0.7 : 0.18}
                    className="marching"
                    style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                  />
                  <circle
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    r={hovered === i ? 4 : 3}
                    fill={t.color}
                    style={{ filter: `drop-shadow(0 0 6px ${t.color})` }}
                  />
                </g>
              ))}
            </svg>
          )}

          {/* The figure, centred */}
          <div
            ref={figureRef}
            className="relative mx-auto w-full max-w-[420px] aspect-square lg:absolute lg:max-w-none lg:w-[460px] xl:w-[540px] lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute inset-0"
            >
              <ProgrammerScene onHead={onHead} lookRef={lookRef} />
            </motion.div>
          </div>

          {/* Thoughts arced around him (desktop) */}
          {THOUGHTS.map((t, i) => (
            <div
              key={t.title}
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              className="hidden lg:block absolute z-10"
              style={t.pos}
            >
              <Pill t={t} i={i} hovered={hovered === i} onHover={hover} />
            </div>
          ))}

          {/* Phones & tablets: compact grid under the figure */}
          <div className="lg:hidden mt-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 justify-items-center">
            {THOUGHTS.map((t, i) => (
              <Pill key={t.title} t={t} i={i} hovered={false} onHover={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
