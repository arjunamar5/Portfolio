"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layout, Server, Database, Cloud, Sparkles, Code2, GitBranch, LucideIcon } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiHtml5, SiCss, SiTailwindcss, SiFramer, SiNodedotjs, SiExpress, SiFlask, SiSupabase,
  SiMysql, SiMongodb, SiPostgresql, SiPytorch, SiOpencv, SiYolo, SiOllama, SiDocker, SiGit, SiGithub,
  SiOpenjdk, SiPython, SiJavascript, SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;
const WHITE = "#F2F4F8";

// Each tool in its own brand colour; tools without a logo get a monogram tile.
const TOOL: Record<string, { icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; mono?: string }> = {
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss, color: "#2965F1" },
  "React.js": { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: WHITE },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#38BDF8" },
  "Framer Motion": { icon: SiFramer, color: "#0099FF" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  "Express.js": { icon: SiExpress, color: WHITE },
  Flask: { icon: SiFlask, color: WHITE },
  Supabase: { icon: SiSupabase, color: "#3ECF8E" },
  MySQL: { icon: SiMysql, color: "#5B9BD5" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  PostgreSQL: { icon: SiPostgresql, color: "#699ECA" },
  YOLO: { icon: SiYolo, color: "#22D3EE" },
  OpenCV: { icon: SiOpencv, color: "#8B7CF6" },
  LLMs: { color: "#E879F9", mono: "LLM" },
  RAG: { color: "#C084FC", mono: "RAG" },
  Ollama: { icon: SiOllama, color: WHITE },
  PyTorch: { icon: SiPytorch, color: "#EE4C2C" },
  CNN: { color: "#F472B6", mono: "CNN" },
  EfficientNet: { color: "#FB7185", mono: "EN" },
  "U-Net": { color: "#A78BFA", mono: "U" },
  "Grad-CAM": { color: "#F97316", mono: "GC" },
  "AWS EC2": { icon: FaAws, color: "#FF9900" },
  S3: { icon: FaAws, color: "#FF9900" },
  "API Gateway": { icon: FaAws, color: "#FF9900" },
  CloudWatch: { icon: FaAws, color: "#FF9900" },
  SNS: { icon: FaAws, color: "#FF9900" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  Java: { icon: SiOpenjdk, color: "#F89820" },
  Python: { icon: SiPython, color: "#FFD43B" },
  SQL: { color: "#60A5FA", mono: "SQL" },
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Git: { icon: SiGit, color: "#F05032" },
  GitHub: { icon: SiGithub, color: WHITE },
};

type Domain = { group: string; title: string; sub: string; icon: LucideIcon; from: string; to: string; span: string; net?: boolean };

const DOMAINS: Domain[] = [
  { group: "Frontend", title: "Frontend", sub: "Interfaces people enjoy", icon: Layout, from: "#38BDF8", to: "#6366F1", span: "sm:col-span-2" },
  { group: "AI-ML & GenAI", title: "AI · ML & GenAI", sub: "Vision models, LLMs & RAG", icon: Sparkles, from: "#E879F9", to: "#8B5CF6", span: "sm:col-span-2 lg:row-span-2", net: true },
  { group: "Backend", title: "Backend & APIs", sub: "Logic & integrations", icon: Server, from: "#34D399", to: "#059669", span: "" },
  { group: "Languages", title: "Languages", sub: "What I write in", icon: Code2, from: "#A5B4FC", to: "#3B82F6", span: "" },
  { group: "Cloud Technologies", title: "Cloud & DevOps", sub: "Ship it, keep it up", icon: Cloud, from: "#FB923C", to: "#F43F5E", span: "sm:col-span-2" },
  { group: "Database", title: "Databases", sub: "Data that stays put", icon: Database, from: "#FBBF24", to: "#F97316", span: "" },
  { group: "Version Control", title: "Version Control", sub: "Change, safely", icon: GitBranch, from: "#F472B6", to: "#F43F5E", span: "" },
];

function Tile({ name, i }: { name: string; i: number }) {
  const t = TOOL[name] ?? { color: "#93A0B8", mono: name.slice(0, 3) };
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12, scale: 0.8 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 22, delay: i * 0.03 } },
      }}
      whileHover={{ y: -5, scale: 1.06 }}
      className="group/tile flex flex-col items-center gap-1.5 w-[62px] sm:w-[68px]"
      style={{ ["--glow" as any]: `${t.color}99` }}
    >
      <span
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border transition-shadow duration-300 group-hover/tile:shadow-[0_0_26px_-2px_var(--glow)]"
        style={{ background: `linear-gradient(145deg, ${t.color}26, ${t.color}08)`, borderColor: `${t.color}45` }}
      >
        {t.icon ? (
          <t.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: t.color }} />
        ) : (
          <span className="font-mono text-[12px] sm:text-[13px] font-bold tracking-tight" style={{ color: t.color }}>
            {t.mono}
          </span>
        )}
      </span>
      <span className="text-[10.5px] sm:text-[11px] text-dim group-hover/tile:text-bone transition-colors text-center leading-tight">{name}</span>
    </motion.div>
  );
}

/** A small live network: signals hop layer to layer (fills the tall AI card on desktop). */
const LAYERS = [
  [30, 60, 90],
  [18, 42, 66, 90].map((y) => y - 6),
  [22, 50, 78].map((y) => y + 2),
  [60],
];
const COLS_X = [24, 140, 256, 356];

function NeuralNet({ from, to }: { from: string; to: string }) {
  const edges: { x1: number; y1: number; x2: number; y2: number; k: number }[] = [];
  let k = 0;
  for (let l = 0; l < LAYERS.length - 1; l++)
    for (const y1 of LAYERS[l]) for (const y2 of LAYERS[l + 1]) edges.push({ x1: COLS_X[l], y1, x2: COLS_X[l + 1], y2, k: k++ });
  return (
    <div className="relative hidden lg:flex flex-1 items-end mt-6 min-h-[120px]">
      <svg viewBox="0 0 420 120" className="w-full h-auto max-h-[180px]" aria-hidden>
        <defs>
          <linearGradient id="nn-grad" x1="0" x2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {edges.map((e) => (
          <g key={e.k}>
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="url(#nn-grad)" strokeOpacity="0.16" strokeWidth="1" />
            {e.k % 3 === 0 && (
              <line
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="url(#nn-grad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                pathLength={100}
                className="nn-pulse"
                style={{ animationDelay: `${(e.k * 0.37) % 3}s` }}
              />
            )}
          </g>
        ))}
        {LAYERS.map((ys, l) =>
          ys.map((y, j) => (
            <circle
              key={`${l}-${j}`}
              cx={COLS_X[l]}
              cy={y}
              r={l === LAYERS.length - 1 ? 7 : 5}
              fill="#0A0F1C"
              stroke={l === LAYERS.length - 1 ? to : from}
              strokeWidth="1.6"
              className="nn-node"
              style={{ animationDelay: `${(l * 0.6 + j * 0.25) % 3}s` }}
            />
          ))
        )}
        <text x={COLS_X[3] + 14} y={64} fill={to} fontSize="10" fontFamily="ui-monospace, monospace" opacity="0.8">
          output
        </text>
      </svg>
    </div>
  );
}

function DomainCard({ d, tools, i }: { d: Domain; tools: string[]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: EASE }}
      className={`group relative rounded-3xl p-px ${d.span}`}
      style={{ background: `linear-gradient(135deg, ${d.from}66, rgba(148,163,199,0.08) 40%, rgba(148,163,199,0.08) 60%, ${d.to}55)` }}
    >
      <div
        className="relative h-full flex flex-col overflow-hidden rounded-[23px] p-5 sm:p-6"
        style={{
          background: `radial-gradient(120% 90% at 0% 0%, ${d.from}24, transparent 55%), radial-gradient(90% 80% at 100% 100%, ${d.to}1c, transparent 60%), #0A0F1C`,
        }}
      >
        {/* A soft sheen sweeps across on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
        {/* Oversized domain icon as a watermark */}
        <d.icon
          className="pointer-events-none absolute -right-6 -bottom-6 w-40 h-40 opacity-[0.06] -rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110"
          style={{ color: d.from }}
        />
        <div className="relative flex items-center gap-3 mb-5">
          <span
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${d.from}, ${d.to})`, boxShadow: `0 10px 30px -8px ${d.from}aa` }}
          >
            <d.icon className="w-5 h-5 text-white" />
          </span>
          <div className="min-w-0">
            <div className="text-base font-semibold text-bone">{d.title}</div>
            <div className="text-xs text-dim">{d.sub}</div>
          </div>
          <span
            className="ml-auto font-mono text-[11px] rounded-full px-2 py-0.5 border"
            style={{ color: d.from, borderColor: `${d.from}55`, background: `${d.from}14` }}
          >
            {String(tools.length).padStart(2, "0")}
          </span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative flex flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-3"
        >
          {tools.map((t, k) => (
            <Tile key={t} name={t} i={k} />
          ))}
        </motion.div>
        {d.net && <NeuralNet from={d.from} to={d.to} />}
      </div>
    </motion.div>
  );
}

export function Skills() {
  const tools = Object.fromEntries(PORTFOLIO_DATA.skills.map((g) => [g.title, g.skills.map((s) => s.name)]));

  return (
    <section id="stack" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="aurora-blob w-[520px] h-[420px] top-24 -left-40 bg-fuchsia-500/15" />
      <div className="aurora-blob w-[520px] h-[420px] bottom-0 -right-40 bg-cyan-400/15" style={{ animationDelay: "-9s" }} />

      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <SectionHeading index="05" eyebrow="Skills" title="What I work with." accentFrom={2} />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOMAINS.map((d, i) => (
            <DomainCard key={d.group} d={d} tools={tools[d.group] ?? []} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
