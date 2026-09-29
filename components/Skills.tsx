"use client";

import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Code2, LayoutTemplate, Server, Database, Sparkles, Cloud, GitBranch, LucideIcon } from "lucide-react";
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
import { PORTFOLIO_DATA, TECH_STACK, TechEntry, SkillCategory } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./SpotlightCard";

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Languages: Code2,
  Frontend: LayoutTemplate,
  Backend: Server,
  Database: Database,
  "AI-ML & GenAI": Sparkles,
  "Cloud Technologies": Cloud,
  "Version Control": GitBranch,
};

// Bento spans on the 3-column grid; the AI/GenAI card is the wide, highlighted one.
const CATEGORY_SPAN: Record<string, string> = {
  "AI-ML & GenAI": "lg:col-span-2",
  "Cloud Technologies": "lg:col-span-2",
};

function CategoryCard({ group, i }: { group: SkillCategory; i: number }) {
  const Icon = CATEGORY_ICON[group.title] ?? Code2;
  const featured = group.title === "AI-ML & GenAI";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
      className={CATEGORY_SPAN[group.title] ?? ""}
    >
      <SpotlightCard className={`card rounded-2xl p-6 h-full ${featured ? "conic-border" : ""}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center">
            <Icon className="w-[18px] h-[18px] text-accent-soft" />
          </div>
          <div>
            <div className="text-sm font-medium text-bone">{group.title}</div>
            <div className="text-[11px] text-faint">{group.skills.length} tools</div>
          </div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }}
          className="flex flex-wrap gap-2"
        >
          {group.skills.map((s) => (
            <motion.span
              key={s.name}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 6 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 22 } },
              }}
              whileHover={{ y: -2 }}
              className="text-xs text-dim border border-line bg-panel-2/40 rounded-lg px-2.5 py-1.5 hover:text-bone hover:border-accent/50 hover:bg-accent/10 transition-colors cursor-default"
            >
              {s.name}
            </motion.span>
          ))}
        </motion.div>
      </SpotlightCard>
    </motion.div>
  );
}

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
        <SectionHeading index="05" eyebrow="Skills" title="Technologies I work with." accentFrom={1} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {PORTFOLIO_DATA.skills.map((group, i) => (
            <CategoryCard key={group.title} group={group} i={i} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Row items={rowA} range={["2%", "-14%"]} />
        <Row items={rowB} range={["-6%", "-22%"]} reverse />
      </div>
    </section>
  );
}
