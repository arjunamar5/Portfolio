"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GraduationCap, Layers, Sparkles, Wrench, Rocket, Lightbulb, Brain, Award, LucideIcon } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

// three.js only loads in the browser, and only for this section.
const ProgrammerScene = dynamic(() => import("./ProgrammerScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_65%)] animate-pulse" />,
});

type Thought = { icon: LucideIcon; title: string; body?: string; chips?: string[]; color: string; side: "l" | "r" };

const { education, leadership } = PORTFOLIO_DATA.personal;

// The About story, broken into thoughts around the figure (left column first, then right).
const THOUGHTS: Thought[] = [
  { side: "l", icon: GraduationCap, color: "#60A5FA", title: "Computer Science graduate", body: `${education.degree} · ${education.institution} · ${education.detail} · ${education.period}` },
  { side: "l", icon: Layers, color: "#38BDF8", title: "Full-stack + AI/ML", body: "Hands-on experience across full-stack development and AI/ML." },
  { side: "l", icon: Wrench, color: "#34D399", title: "My everyday toolkit", chips: ["Python", "React.js", "Node.js", "AWS", "Ollama"] },
  { side: "l", icon: Award, color: "#22D3EE", title: `${leadership.role} · CSI (ASEB Chapter)`, body: "Computer Society of India, at my university." },
  { side: "r", icon: Sparkles, color: "#E879F9", title: "LLM-powered apps & RAG", body: "A focus on LLM-powered applications and retrieval-augmented generation." },
  { side: "r", icon: Rocket, color: "#FB923C", title: "Shipped for real businesses", body: "Built and deployed production platforms that real businesses run on every day." },
  { side: "r", icon: Lightbulb, color: "#FBBF24", title: "What drives me", body: "Exploring how different technologies come together to solve meaningful problems." },
  { side: "r", icon: Brain, color: "#4FBDB6", title: "From booking engines to medical AI", body: "Multi-branch platforms → medical-imaging AI with explainable, locally-run GenAI." },
];

function ThoughtCard({ t, i, hovered, onHover }: { t: Thought; i: number; hovered: boolean; onHover: (i: number | null) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: t.side === "l" ? 40 : -40 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: 0.1 + (i % 4) * 0.12, ease: EASE }}
      onMouseEnter={() => onHover(i)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        className="relative rounded-2xl border bg-panel/75 backdrop-blur-md px-4 py-3.5 transition-all duration-300"
        style={{
          borderColor: hovered ? `${t.color}aa` : "rgba(148,163,199,0.16)",
          boxShadow: hovered ? `0 0 0 1px ${t.color}44, 0 18px 50px -18px ${t.color}aa` : "0 14px 36px -22px rgba(0,0,0,0.8)",
        }}
      >
        <div className="absolute inset-x-4 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${t.color}1f`, border: `1px solid ${t.color}44` }}>
            <t.icon className="w-3.5 h-3.5" style={{ color: t.color }} />
          </span>
          <span className="text-[13.5px] font-semibold text-bone leading-snug">{t.title}</span>
        </div>
        {t.body && <p className="text-[12.5px] text-dim leading-relaxed mt-2">{t.body}</p>}
        {t.chips && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {t.chips.map((c) => (
              <span key={c} className="text-[11px] text-bone/85 rounded-md px-2 py-0.5 border border-line bg-void/60">
                {c}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lookRef = useRef<number | null>(null);
  const anchors = useRef<{ x: number; y: number }[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);

  // Where each thought's connector starts (inner edge of the card, relative to the stage).
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setDesktop(window.innerWidth >= 1024);
    const s = stage.getBoundingClientRect();
    anchors.current = cardRefs.current.map((el, i) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: (THOUGHTS[i].side === "l" ? r.right + 6 : r.left - 6) - s.left, y: r.top + r.height / 2 - s.top };
    });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // The 3D scene reports its head position; draw every connector to it (imperatively, no re-render).
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
      const d = dotRefs.current[i];
      if (!p || !a) return;
      const mx = (a.x + x2) / 2;
      p.setAttribute("d", `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${y2}, ${x2} ${y2}`);
      d?.setAttribute("cx", String(a.x));
      d?.setAttribute("cy", String(a.y));
    });
  }, []);

  const hover = (i: number | null) => {
    setHovered(i);
    lookRef.current = i === null ? null : THOUGHTS[i].side === "l" ? -1 : 1;
  };

  const left = THOUGHTS.map((t, i) => ({ t, i })).filter(({ t }) => t.side === "l");
  const right = THOUGHTS.map((t, i) => ({ t, i })).filter(({ t }) => t.side === "r");

  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-accent/[0.07] blur-[140px]" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10">
        <SectionHeading index="01" eyebrow="About" title="Building software that scales." accentFrom={3} />

        <div ref={stageRef} className="relative mt-10 lg:mt-14 lg:grid lg:grid-cols-[1fr_minmax(380px,520px)_1fr] lg:gap-6 lg:items-center">
          {/* Connectors: each thought is wired to the figure's head (desktop) */}
          {desktop && (
            <svg className="pointer-events-none absolute inset-0 w-full h-full z-0" aria-hidden>
              <defs>
                <linearGradient id="thought-grad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
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
                    strokeOpacity={hovered === null || hovered === i ? 0.75 : 0.2}
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

          {/* Left thoughts */}
          <div className="relative z-10 hidden lg:flex flex-col gap-6 lg:order-1">
            {left.map(({ t, i }) => (
              <div key={t.title} ref={(el) => { cardRefs.current[i] = el; }}>
                <ThoughtCard t={t} i={i} hovered={hovered === i} onHover={hover} />
              </div>
            ))}
          </div>

          {/* The figure */}
          <motion.div
            ref={figureRef}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative z-10 mx-auto w-full max-w-[460px] lg:max-w-none aspect-square lg:order-2"
          >
            <ProgrammerScene onHead={onHead} lookRef={lookRef} />
          </motion.div>

          {/* Right thoughts */}
          <div className="relative z-10 hidden lg:flex flex-col gap-6 lg:order-3">
            {right.map(({ t, i }) => (
              <div key={t.title} ref={(el) => { cardRefs.current[i] = el; }}>
                <ThoughtCard t={t} i={i} hovered={hovered === i} onHover={hover} />
              </div>
            ))}
          </div>

          {/* Phones & tablets: thoughts stacked under the figure, threaded together */}
          <div className="relative lg:hidden mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <span className="sm:hidden absolute left-1/2 -top-6 h-6 w-px bg-gradient-to-b from-transparent to-accent/60" />
            {THOUGHTS.map((t, i) => (
              <ThoughtCard key={t.title} t={t} i={i} hovered={false} onHover={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
