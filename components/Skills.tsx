"use client";

import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiFlask,
  SiPython,
  SiPytorch,
  SiOpencv,
  SiYolo,
  SiOllama,
  SiOpenjdk,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiDocker,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { TECH_STACK, TechEntry } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { StackMap } from "./StackMap";

const ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiFlask,
  SiPython,
  SiPytorch,
  SiOpencv,
  SiYolo,
  SiOllama,
  SiOpenjdk,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiDocker,
  SiGit,
  SiGithub,
  FaAws,
};

function TiltCard({ tech }: { tech: TechEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[tech.icon];
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="shrink-0 [perspective:600px]"
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry }}
        className="card rounded-2xl px-5 py-4 flex items-center gap-3.5 w-[210px] hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-xl bg-panel-2 flex items-center justify-center shrink-0">
          {Icon ? <Icon className="text-bone" size={19} /> : null}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-bone truncate">{tech.name}</div>
          <div className="text-xs text-faint">{tech.label}</div>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ items, range, reverse }: { items: TechEntry[]; range: [string, string]; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? [range[1], range[0]] : range);

  return (
    <div ref={ref} className="overflow-hidden edge-fade-x">
      <motion.div style={{ x }} className="flex gap-4 w-max py-1">
        {items.map((t, i) => (
          <TiltCard key={t.name + i} tech={t} />
        ))}
      </motion.div>
    </div>
  );
}

export function Skills() {
  const mid = Math.ceil(TECH_STACK.length / 2);
  const rowA = useMemo(() => [...TECH_STACK.slice(0, mid), ...TECH_STACK.slice(0, mid)], [mid]);
  const rowB = useMemo(() => [...TECH_STACK.slice(mid), ...TECH_STACK.slice(mid)], [mid]);

  return (
    <section id="stack" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 sm:px-10 mb-16">
        <SectionHeading
          index="05"
          eyebrow="Skills"
          title="How the pieces connect."
          accentFrom={3}
          lede="Not a list of logos — the stack as it actually works together: from a tap on the screen, through APIs, data and AI, to the cloud it runs on."
        />
        <div className="mt-12">
          <StackMap />
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 sm:px-10 mb-5">
        <span className="eyebrow !text-faint">The toolbox</span>
      </div>
      <div className="space-y-4">
        <Row items={rowA} range={["2%", "-14%"]} />
        <Row items={rowB} range={["-6%", "-22%"]} reverse />
      </div>
    </section>
  );
}
