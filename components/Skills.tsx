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

const TOOL_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "React.js": SiReact, "Next.js": SiNextdotjs, HTML: SiHtml5, CSS: SiCss, "Tailwind CSS": SiTailwindcss, "Framer Motion": SiFramer,
  "Node.js": SiNodedotjs, "Express.js": SiExpress, Flask: SiFlask, Supabase: SiSupabase,
  MySQL: SiMysql, MongoDB: SiMongodb, PostgreSQL: SiPostgresql,
  PyTorch: SiPytorch, OpenCV: SiOpencv, YOLO: SiYolo, Ollama: SiOllama,
  Docker: SiDocker, Git: SiGit, GitHub: SiGithub,
  Java: SiOpenjdk, Python: SiPython, JavaScript: SiJavascript, TypeScript: SiTypescript,
  "AWS EC2": FaAws, S3: FaAws, "API Gateway": FaAws, CloudWatch: FaAws, SNS: FaAws,
};

type Group = { group: string; label: string; icon: LucideIcon; color: string };

// The web stack, top (what users see) to bottom (where it runs).
const LAYERS: Group[] = [
  { group: "Frontend", label: "Frontend", icon: Layout, color: "#38BDF8" },
  { group: "Backend", label: "Backend & APIs", icon: Server, color: "#34D399" },
  { group: "Database", label: "Databases", icon: Database, color: "#FBBF24" },
  { group: "Cloud Technologies", label: "Cloud & DevOps", icon: Cloud, color: "#FB923C" },
];

const SIDE: Group[] = [
  { group: "AI-ML & GenAI", label: "AI · ML & GenAI", icon: Sparkles, color: "#E879F9" },
  { group: "Languages", label: "Languages", icon: Code2, color: "#A5B4FC" },
  { group: "Version Control", label: "Version Control", icon: GitBranch, color: "#F472B6" },
];

function Chip({ name, color }: { name: string; color: string }) {
  const Icon = TOOL_ICON[name];
  return (
    <span
      className="group/chip inline-flex items-center gap-1.5 rounded-lg border border-line bg-void/50 px-2.5 py-1.5 text-[12.5px] text-dim transition-colors hover:text-bone"
      style={{ ["--chip" as any]: color }}
    >
      {Icon && <Icon className="w-3.5 h-3.5 transition-colors group-hover/chip:text-[color:var(--chip)]" />}
      {name}
    </span>
  );
}

function Header({ g }: { g: Group }) {
  return (
    <div className="flex items-center gap-2.5 w-44 shrink-0">
      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${g.color}1a`, border: `1px solid ${g.color}40` }}>
        <g.icon className="w-4 h-4" style={{ color: g.color }} />
      </span>
      <span className="text-sm font-medium text-bone">{g.label}</span>
    </div>
  );
}

export function Skills() {
  const tools = Object.fromEntries(PORTFOLIO_DATA.skills.map((g) => [g.title, g.skills.map((s) => s.name)]));

  return (
    <section id="stack" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 sm:px-10">
        <SectionHeading index="05" eyebrow="Skills" title="What I work with." accentFrom={2} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-5">
          {/* The web stack, layer by layer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl border border-line bg-panel/60 p-5 sm:p-6"
          >
            <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint mb-5">The web stack · layer by layer</div>
            <div className="relative">
              {/* Flow line down the layers */}
              <span className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-[#38BDF8] via-[#34D399] to-[#FB923C] opacity-40" />
              <motion.span
                animate={{ top: ["4%", "92%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
                className="absolute left-[13.5px] w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_10px_3px_rgba(56,189,248,0.6)]"
              />
              <div className="space-y-3">
                {LAYERS.map((g, i) => (
                  <motion.div
                    key={g.group}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                    className="relative flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-line bg-void/40 p-3 hover:border-line-strong transition-colors"
                  >
                    <Header g={g} />
                    <div className="flex flex-wrap gap-1.5 pl-[42px] sm:pl-0">
                      {(tools[g.group] ?? []).map((t) => (
                        <Chip key={t} name={t} color={g.color} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI, languages, version control */}
          <div className="grid grid-cols-1 gap-5">
            {SIDE.map((g, i) => (
              <motion.div
                key={g.group}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
                className="rounded-2xl border border-line bg-panel/60 p-5"
              >
                <Header g={g} />
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(tools[g.group] ?? []).map((t) => (
                    <Chip key={t} name={t} color={g.color} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
