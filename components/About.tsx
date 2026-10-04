"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GraduationCap, Layers, Sparkles, Wrench, Rocket, Award, Move, LucideIcon } from "lucide-react";
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
  pos: React.CSSProperties; // desktop position around the room
  /** The object in the room this fact belongs to (scene ANCHOR order). */
  anchor: number;
};

const { education, leadership } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

// Scene anchors: 0 diploma · 1 laptop · 2 trophy · 3 AI orb · 4 wall screen · 5 server rack
const THOUGHTS: Thought[] = [
  { side: "l", anchor: 0, pos: { top: "8%", left: "2%" }, icon: GraduationCap, color: "#60A5FA", title: "CS Graduate", sub: `Amrita · CGPA ${cgpa}` },
  { side: "l", anchor: 2, pos: { top: "44%", left: "0%" }, icon: Award, color: "#22D3EE", title: `${leadership.role}, CSI`, sub: "ASEB Chapter" },
  { side: "l", anchor: 1, pos: { top: "78%", left: "3%" }, icon: Wrench, color: "#34D399", title: "Everyday toolkit", chips: ["Python", "React", "Node", "AWS", "Ollama"] },
  { side: "r", anchor: 4, pos: { top: "8%", right: "2%" }, icon: Layers, color: "#38BDF8", title: "Full-stack + AI/ML", sub: "Hands-on across both" },
  { side: "r", anchor: 3, pos: { top: "44%", right: "0%" }, icon: Sparkles, color: "#E879F9", title: "LLMs & RAG", sub: "My focus area" },
  { side: "r", anchor: 5, pos: { top: "76%", right: "3%" }, icon: Rocket, color: "#FB923C", title: "Ships real products", sub: "Used by businesses daily" },
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
      onFocus={() => onHover(i)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      className="outline-none"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        className="relative inline-flex items-center gap-3 rounded-2xl border bg-panel/80 backdrop-blur-md pl-2.5 pr-4 py-2.5 transition-all duration-300 cursor-default"
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
  const endRefs = useRef<(SVGCircleElement | null)[]>([]);
  const focusRef = useRef<number | null>(null);
  const starts = useRef<{ x: number; y: number }[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);

  // Connector start points: the inner edge of each pill, relative to the stage.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setDesktop(window.innerWidth >= 1024);
    const s = stage.getBoundingClientRect();
    starts.current = pillRefs.current.map((el, i) => {
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

  // The scene reports where each object sits on screen; redraw every connector to it (no re-render).
  const onAnchors = useCallback((pts: { x: number; y: number }[]) => {
    const stage = stageRef.current;
    const fig = figureRef.current;
    if (!stage || !fig) return;
    const s = stage.getBoundingClientRect();
    const f = fig.getBoundingClientRect();
    starts.current.forEach((a, i) => {
      const p = pathRefs.current[i];
      const pt = pts[THOUGHTS[i].anchor];
      if (!p || !a || !pt) return;
      const x2 = f.left - s.left + pt.x;
      const y2 = f.top - s.top + pt.y;
      const mx = (a.x + x2) / 2;
      p.setAttribute("d", `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${y2}, ${x2} ${y2}`);
      dotRefs.current[i]?.setAttribute("cx", String(a.x));
      dotRefs.current[i]?.setAttribute("cy", String(a.y));
      endRefs.current[i]?.setAttribute("cx", String(x2));
      endRefs.current[i]?.setAttribute("cy", String(y2));
    });
  }, []);

  const hover = (i: number | null) => {
    setHovered(i);
    focusRef.current = i === null ? null : THOUGHTS[i].anchor;
  };

  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-20 sm:pb-24 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-accent/[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute left-[30%] top-[45%] w-[420px] h-[420px] rounded-full bg-fuchsia-500/[0.07] blur-[120px]" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10">
        <SectionHeading index="01" eyebrow="About" title="Building software that scales." accentFrom={3} />

        <div ref={stageRef} className="relative mt-8 lg:mt-4 lg:h-[640px]">
          {desktop && (
            <svg className="pointer-events-none absolute inset-0 w-full h-full z-[5]" aria-hidden>
              {THOUGHTS.map((t, i) => (
                <g key={i} style={{ opacity: hovered === null || hovered === i ? 1 : 0.25, transition: "opacity 0.3s" }}>
                  <path
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={hovered === i ? 1.8 : 1}
                    strokeOpacity={hovered === i ? 0.95 : 0.5}
                    className="marching"
                    style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
                  />
                  <circle
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    r={3}
                    fill={t.color}
                    style={{ filter: `drop-shadow(0 0 6px ${t.color})` }}
                  />
                  <circle
                    ref={(el) => {
                      endRefs.current[i] = el;
                    }}
                    r={hovered === i ? 6 : 4}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={1.5}
                    className={hovered === i ? "animate-ping origin-center [transform-box:fill-box]" : ""}
                    style={{ filter: `drop-shadow(0 0 6px ${t.color})` }}
                  />
                </g>
              ))}
            </svg>
          )}

          {/* The room, centred */}
          <div
            ref={figureRef}
            className="relative mx-auto w-full max-w-[460px] aspect-square lg:absolute lg:max-w-none lg:w-[520px] xl:w-[600px] lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute inset-0"
            >
              <ProgrammerScene onAnchors={onAnchors} focusRef={focusRef} />
            </motion.div>
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 inline-flex items-center gap-1.5 rounded-full border border-line bg-void/70 backdrop-blur px-3 py-1 text-[11px] text-faint">
              <Move className="w-3.5 h-3.5" /> Drag to look around
            </div>
          </div>

          {/* Facts placed around the room (desktop) */}
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

          {/* Phones & tablets: compact grid under the room; tapping a fact lights its object */}
          <div className="lg:hidden mt-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 justify-items-center">
            {THOUGHTS.map((t, i) => (
              <div key={t.title} onClick={() => hover(hovered === i ? null : i)}>
                <Pill t={t} i={i} hovered={hovered === i} onHover={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
