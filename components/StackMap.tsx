"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { MousePointer2, CheckCircle2 } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiHtml5, SiCss, SiTailwindcss, SiFramer, SiNodedotjs, SiExpress, SiFlask, SiSupabase,
  SiMysql, SiMongodb, SiPostgresql, SiPytorch, SiOpencv, SiYolo, SiOllama, SiDocker, SiGit, SiGithub,
  SiOpenjdk, SiPython, SiJavascript, SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

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

type Key = "frontend" | "backend" | "database" | "ai" | "cloud" | "languages" | "git";

const DOMAINS: Record<Key, { title: string; sub: string; color: string; group: string; place: string; order: string }> = {
  frontend: { title: "Frontend", sub: "What people see and tap", color: "#38BDF8", group: "Frontend", place: "lg:col-start-1 lg:row-start-2", order: "order-1" },
  backend: { title: "Backend & APIs", sub: "Business rules and integrations", color: "#34D399", group: "Backend", place: "lg:col-start-2 lg:row-start-2", order: "order-3" },
  database: { title: "Databases", sub: "Where the data lives", color: "#FBBF24", group: "Database", place: "lg:col-start-3 lg:row-start-2", order: "order-7" },
  ai: { title: "AI · ML & GenAI", sub: "Vision models, LLMs and RAG", color: "#E879F9", group: "AI-ML & GenAI", place: "lg:col-start-2 lg:row-start-1", order: "order-5" },
  cloud: { title: "Cloud & DevOps", sub: "How it ships and stays up", color: "#FB923C", group: "Cloud Technologies", place: "lg:col-start-1 lg:col-span-3 lg:row-start-3", order: "order-9" },
  languages: { title: "Languages", sub: "What it's all written in", color: "#A5B4FC", group: "Languages", place: "lg:col-start-1 lg:row-start-1", order: "order-10" },
  git: { title: "Version Control", sub: "How it changes safely", color: "#F472B6", group: "Version Control", place: "lg:col-start-3 lg:row-start-1", order: "order-11" },
};

// One request's life, step by step — each step lights up the domain doing the work.
const LIFECYCLE: { key: Key; text: string }[] = [
  { key: "frontend", text: "A user taps “Book slot” — React sends the request." },
  { key: "backend", text: "Express validates it and applies the business rules." },
  { key: "database", text: "PostgreSQL checks availability and saves the booking." },
  { key: "ai", text: "AI adds the smart part — a prediction, a vision model or a RAG answer." },
  { key: "backend", text: "The API responds in milliseconds." },
  { key: "frontend", text: "The screen updates instantly — booking confirmed." },
  { key: "cloud", text: "All of it runs in Docker on AWS, watched by CloudWatch." },
];

/* ---------- themed mini-scenes ---------- */

function BrowserScene({ color, live }: { color: string; live: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-void/70 overflow-hidden">
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-line">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-bone/20" />
        ))}
        <span className="ml-2 flex-1 rounded bg-panel-2 px-2 py-0.5 font-mono text-[9px] text-faint truncate">yourapp.com/book</span>
      </div>
      <div className="relative p-3 h-[74px]">
        <div className="h-1.5 w-20 rounded-full bg-bone/15 mb-2" />
        <div className="h-1.5 w-28 rounded-full bg-bone/10 mb-3" />
        <motion.span
          animate={live ? { boxShadow: [`0 0 0 0 ${color}00`, `0 0 0 6px ${color}33`, `0 0 0 0 ${color}00`] } : {}}
          transition={{ duration: 3.2, repeat: Infinity, times: [0.55, 0.65, 0.8] }}
          className="inline-block rounded-md px-2.5 py-1 text-[10px] font-medium text-void"
          style={{ background: color }}
        >
          Book slot
        </motion.span>
        <motion.span
          animate={live ? { x: [70, 30, 30, 70], y: [30, 44, 44, 30], scale: [1, 1, 0.8, 1] } : {}}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.5, 0.6, 1], ease: "easeInOut" }}
          className="absolute left-3 top-3 text-bone"
        >
          <MousePointer2 className="w-3.5 h-3.5 fill-bone" />
        </motion.span>
      </div>
    </div>
  );
}

function TerminalScene({ color, live }: { color: string; live: boolean }) {
  const lines = ["$ POST /api/bookings", "→ validate · apply rules", "✓ 201 Created · 38 ms"];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setN((v) => (v + 1) % (lines.length + 2)), 800);
    return () => clearInterval(id);
  }, [live, lines.length]);
  return (
    <div className="rounded-lg border border-line bg-[#05080f] p-2.5 h-[108px] font-mono text-[10px] leading-[1.7]">
      {lines.map((l, i) => (
        <div key={l} className="transition-opacity duration-300" style={{ opacity: i < n ? 1 : 0.12, color: i === 2 ? color : "#93A0B8" }}>
          {l}
        </div>
      ))}
      <span className="caret inline-block w-1.5 h-3 align-middle" style={{ background: color }} />
    </div>
  );
}

function TableScene({ color, live }: { color: string; live: boolean }) {
  const rows = [
    ["#1024", "Court 2", "7 PM"],
    ["#1025", "Seat A2", "9 AM"],
    ["#1026", "Court 1", "8 PM"],
  ];
  return (
    <div className="relative rounded-lg border border-line bg-void/70 overflow-hidden h-[108px]">
      <div className="grid grid-cols-3 px-2.5 py-1.5 border-b border-line font-mono text-[9px] uppercase tracking-wider text-faint">
        <span>id</span>
        <span>resource</span>
        <span>slot</span>
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="grid grid-cols-3 px-2.5 py-1.5 font-mono text-[10px] text-dim border-b border-line/60 last:border-0">
          {r.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      ))}
      <motion.div
        animate={live ? { y: [26, 50, 74, 26] } : {}}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 h-6"
        style={{ background: `${color}1f`, borderTop: `1px solid ${color}66`, borderBottom: `1px solid ${color}66` }}
      />
    </div>
  );
}

function NeuralScene({ color, live }: { color: string; live: boolean }) {
  const layers = [[20, 50, 80], [12, 37, 63, 88], [30, 70]];
  const xs = [14, 50, 86];
  return (
    <div className="rounded-lg border border-line bg-void/70 h-[108px] p-1.5">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {layers.slice(0, -1).map((layer, li) =>
          layer.map((y1) =>
            layers[li + 1].map((y2) => (
              <line key={`${li}-${y1}-${y2}`} x1={xs[li]} y1={y1} x2={xs[li + 1]} y2={y2} stroke={color} strokeOpacity="0.18" strokeWidth="0.6" />
            ))
          )
        )}
        {layers.map((layer, li) =>
          layer.map((y, ni) => (
            <motion.circle
              key={`${li}-${y}`}
              cx={xs[li]}
              cy={y}
              r="4"
              fill={color}
              animate={live ? { opacity: [0.25, 1, 0.25] } : { opacity: 0.4 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: li * 0.35 + ni * 0.08 }}
            />
          ))
        )}
      </svg>
    </div>
  );
}

function CloudScene({ color, live }: { color: string; live: boolean }) {
  const services = ["EC2", "S3", "API Gateway", "CloudWatch", "SNS", "Docker"];
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {services.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5 rounded-lg border border-line bg-void/60 px-2 py-1.5">
          <motion.span
            animate={live ? { opacity: [1, 0.35, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: i === 5 ? "#38BDF8" : "#34D399", boxShadow: `0 0 6px ${i === 5 ? "#38BDF8" : "#34D399"}` }}
          />
          <span className="font-mono text-[10px] text-dim truncate">{s}</span>
        </div>
      ))}
      <div className="col-span-3 sm:col-span-6 font-mono text-[10px]" style={{ color }}>
        ● all systems healthy · containers running on AWS
      </div>
    </div>
  );
}

function CodeScene({ color }: { color: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#05080f] px-2.5 py-2 font-mono text-[10.5px] leading-relaxed h-[64px]">
      <div>
        <span style={{ color }}>const</span> <span className="text-bone">fix</span> = <span className="text-emerald-300">solve</span>(problem);
      </div>
      <div className="text-faint">{"// Java · Python · SQL · JS · TS"}</div>
    </div>
  );
}

function GitScene({ color, live }: { color: string; live: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-void/70 h-[64px] px-2">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <line x1="10" y1="38" x2="190" y2="38" stroke="rgba(148,163,199,0.35)" strokeWidth="1.5" />
        <path d="M60 38 C 75 38, 75 16, 95 16 L 120 16 C 140 16, 140 38, 155 38" fill="none" stroke={color} strokeOpacity="0.7" strokeWidth="1.5" />
        {[20, 60, 155].map((x) => (
          <circle key={x} cx={x} cy="38" r="4" fill="#0A0E19" stroke="rgba(148,163,199,0.6)" strokeWidth="1.5" />
        ))}
        {[95, 120].map((x) => (
          <circle key={x} cx={x} cy="16" r="4" fill="#0A0E19" stroke={color} strokeWidth="1.5" />
        ))}
        <motion.circle
          cx="185"
          cy="38"
          r="4.5"
          fill={color}
          animate={live ? { scale: [0.6, 1.2, 1], opacity: [0, 1, 1] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6 }}
          style={{ transformOrigin: "185px 38px" }}
        />
        <text x="10" y="56" fontSize="8" fill="rgba(148,163,199,0.7)" fontFamily="ui-monospace, monospace">
          main
        </text>
        <text x="92" y="8" fontSize="8" fill={color} fontFamily="ui-monospace, monospace">
          feature/booking
        </text>
      </svg>
    </div>
  );
}

function Scene({ k, color, live }: { k: Key; color: string; live: boolean }) {
  switch (k) {
    case "frontend":
      return <BrowserScene color={color} live={live} />;
    case "backend":
      return <TerminalScene color={color} live={live} />;
    case "database":
      return <TableScene color={color} live={live} />;
    case "ai":
      return <NeuralScene color={color} live={live} />;
    case "cloud":
      return <CloudScene color={color} live={live} />;
    case "languages":
      return <CodeScene color={color} />;
    case "git":
      return <GitScene color={color} live={live} />;
  }
}

/* ---------- connectors ---------- */

type Anchor = "l" | "r" | "t" | "b";
const LINKS: { from: Key; fa: Anchor; to: Key; ta: Anchor; color: string; back?: string; dashed?: boolean; faint?: boolean }[] = [
  { from: "frontend", fa: "r", to: "backend", ta: "l", color: "#38BDF8", back: "#34D399" },
  { from: "backend", fa: "r", to: "database", ta: "l", color: "#34D399", back: "#FBBF24" },
  { from: "backend", fa: "t", to: "ai", ta: "b", color: "#34D399", back: "#E879F9" },
  { from: "frontend", fa: "b", to: "cloud", ta: "t", color: "#FB923C", dashed: true },
  { from: "backend", fa: "b", to: "cloud", ta: "t", color: "#FB923C", dashed: true },
  { from: "database", fa: "b", to: "cloud", ta: "t", color: "#FB923C", dashed: true },
  { from: "languages", fa: "b", to: "frontend", ta: "t", color: "#A5B4FC", faint: true },
  { from: "git", fa: "b", to: "database", ta: "t", color: "#F472B6", faint: true },
];

function anchorPoint(r: DOMRect, base: DOMRect, a: Anchor, target?: DOMRect): [number, number] {
  const x = r.left - base.left;
  const y = r.top - base.top;
  // Vertical links into the wide cloud card drop straight down from the source.
  if (a === "t" && target && r.width > target.width * 1.6) return [target.left - base.left + target.width / 2, y];
  switch (a) {
    case "l":
      return [x, y + r.height / 2];
    case "r":
      return [x + r.width, y + r.height / 2];
    case "t":
      return [x + r.width / 2, y];
    case "b":
      return [x + r.width / 2, y + r.height];
  }
}

export function StackMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Partial<Record<Key, HTMLDivElement | null>>>({});
  const inView = useInView(wrapRef, { amount: 0.2 });
  const [paths, setPaths] = useState<{ d: string; link: (typeof LINKS)[number]; offset: number }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<Key | null>(null);

  const groups = Object.fromEntries(PORTFOLIO_DATA.skills.map((g) => [g.title, g.skills.map((s) => s.name)]));

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.innerWidth < 1024) {
      setPaths([]);
      return;
    }
    const base = wrap.getBoundingClientRect();
    setSize({ w: base.width, h: base.height });
    const out: typeof paths = [];
    LINKS.forEach((link) => {
      const a = nodeRefs.current[link.from]?.getBoundingClientRect();
      const b = nodeRefs.current[link.to]?.getBoundingClientRect();
      if (!a || !b) return;
      const [x1, y1] = anchorPoint(a, base, link.fa);
      const [x2, y2] = anchorPoint(b, base, link.ta, a);
      const horizontal = link.fa === "r" || link.fa === "l";
      const offsets = link.back ? [-7, 7] : [0];
      offsets.forEach((o) => {
        const d = horizontal
          ? `M ${x1} ${y1 + o} C ${(x1 + x2) / 2} ${y1 + o}, ${(x1 + x2) / 2} ${y2 + o}, ${x2} ${y2 + o}`
          : `M ${x1 + o} ${y1} C ${x1 + o} ${(y1 + y2) / 2}, ${x2 + o} ${(y1 + y2) / 2}, ${x2 + o} ${y2}`;
        out.push({ d, link, offset: o });
      });
    });
    setPaths(out);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!inView || hovered) return;
    const id = setInterval(() => setStep((s) => (s + 1) % LIFECYCLE.length), 2400);
    return () => clearInterval(id);
  }, [inView, hovered]);

  const focus: Key = hovered ?? LIFECYCLE[step].key;

  return (
    <div>
      {/* Lifecycle caption */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-line bg-panel/60 px-4 py-3">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {hovered ? "Exploring" : `Request lifecycle · ${step + 1}/${LIFECYCLE.length}`}
        </span>
        <div className="relative flex-1 min-h-[22px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={hovered ? `h-${hovered}` : step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="text-sm text-bone"
            >
              <span className="font-medium" style={{ color: DOMAINS[focus].color }}>
                {DOMAINS[focus].title}:
              </span>{" "}
              {hovered ? DOMAINS[hovered].sub + "." : LIFECYCLE[step].text}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {LIFECYCLE.map((l, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: i === step && !hovered ? 18 : 6, background: i === step && !hovered ? DOMAINS[l.key].color : "rgba(148,163,199,0.25)" }}
            />
          ))}
        </div>
      </div>

      <div ref={wrapRef} className="relative grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-x-16 lg:gap-y-14">
        {/* Connectors with travelling packets (desktop) */}
        {paths.length > 0 && (
          <svg className="pointer-events-none absolute inset-0 hidden lg:block" width={size.w} height={size.h} aria-hidden>
            {paths.map(({ d, link, offset }, i) => {
              const isBack = link.back && offset > 0;
              const col = isBack ? link.back! : link.color;
              const lit = focus === link.from || focus === link.to;
              return (
                <g key={i}>
                  <path
                    d={d}
                    fill="none"
                    stroke={col}
                    strokeOpacity={link.faint ? 0.18 : lit ? 0.55 : 0.2}
                    strokeWidth={lit ? 1.5 : 1}
                    strokeDasharray={link.dashed || link.faint ? "4 5" : undefined}
                    style={{ transition: "stroke-opacity 0.5s, stroke-width 0.5s" }}
                  />
                  {!link.faint && (
                    <circle r={lit ? 3.5 : 2.5} fill={col} style={{ filter: `drop-shadow(0 0 6px ${col})` }}>
                      <animateMotion
                        dur={link.dashed ? "3.6s" : "2.2s"}
                        repeatCount="indefinite"
                        begin={`${(i % 3) * 0.5}s`}
                        path={d}
                        keyPoints={isBack ? "1;0" : "0;1"}
                        keyTimes="0;1"
                        calcMode="linear"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {(Object.keys(DOMAINS) as Key[]).map((k, idx) => {
          const dmn = DOMAINS[k];
          const tools = groups[dmn.group] ?? [];
          const on = focus === k;
          return (
            <React.Fragment key={k}>
              <motion.div
                ref={(el) => {
                  nodeRefs.current[k] = el;
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: (idx % 3) * 0.08, ease: EASE }}
                onMouseEnter={() => setHovered(k)}
                onMouseLeave={() => setHovered(null)}
                className={`relative z-10 ${dmn.place} ${dmn.order} lg:order-none rounded-2xl border bg-panel/85 backdrop-blur-sm p-4 transition-all duration-500`}
                style={{
                  borderColor: on ? `${dmn.color}99` : "rgba(148,163,199,0.14)",
                  boxShadow: on ? `0 0 0 1px ${dmn.color}33, 0 20px 50px -20px ${dmn.color}88` : "0 12px 30px -18px rgba(0,0,0,0.7)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${dmn.color}, transparent)` }} />
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-sm font-semibold text-bone">{dmn.title}</div>
                    <div className="text-[11px] text-faint mt-0.5">{dmn.sub}</div>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-all duration-500"
                    style={{ background: dmn.color, boxShadow: on ? `0 0 12px ${dmn.color}` : "none", opacity: on ? 1 : 0.5 }}
                  />
                </div>
                <Scene k={k} color={dmn.color} live={inView} />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tools.map((t) => {
                    const Icon = TOOL_ICON[t];
                    return (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-[11px] text-dim rounded-md px-2 py-1 border border-line bg-void/50 hover:text-bone transition-colors"
                      >
                        {Icon && <Icon className="w-3 h-3" />}
                        {t}
                      </span>
                    );
                  })}
                </div>
                {on && !hovered && (
                  <motion.span
                    layoutId="stack-focus"
                    className="absolute -top-2.5 right-4 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-void"
                    style={{ background: dmn.color }}
                  >
                    <CheckCircle2 className="inline w-2.5 h-2.5 -mt-px mr-1" />
                    working
                  </motion.span>
                )}
              </motion.div>
              {/* Phone-only connector to the next step in the flow */}
              {["frontend", "backend", "ai", "database"].includes(k) && (
                <div className={`lg:hidden flex justify-center -my-1 ${k === "frontend" ? "order-2" : k === "backend" ? "order-4" : k === "ai" ? "order-6" : "order-8"}`}>
                  <span className="relative block w-px h-8 overflow-hidden" style={{ background: `${dmn.color}44` }}>
                    <motion.span
                      animate={{ y: [-8, 32] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: dmn.color, boxShadow: `0 0 6px ${dmn.color}` }}
                    />
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
