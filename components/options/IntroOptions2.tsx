"use client";

import React from "react";
import { Check, Loader2, Sparkles, FileText, GitBranch, CircleDot } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { Shell, Chips } from "./IntroOptions";

const cgpa = PORTFOLIO_DATA.personal.education.detail.replace("CGPA: ", "");
const C = { kw: "#C084FC", key: "#7DD3FC", str: "#86EFAC", num: "#FCD34D", com: "#64748B", pun: "#94A3B8", fn: "#60A5FA" };

/* 1 — a code editor with about-me.ts open */
function Editor() {
  const L: React.ReactNode[] = [
    <><span style={{ color: C.kw }}>const</span> <span style={{ color: C.fn }}>arjun</span> <span style={{ color: C.pun }}>=</span> {"{"}</>,
    <>  <span style={{ color: C.key }}>role</span>: <span style={{ color: C.str }}>&quot;Full-stack &amp; AI/ML developer&quot;</span>,</>,
    <>  <span style={{ color: C.key }}>studied</span>: <span style={{ color: C.str }}>&quot;B.Tech CSE @ Amrita&quot;</span>,</>,
    <>  <span style={{ color: C.key }}>cgpa</span>: <span style={{ color: C.num }}>{cgpa}</span>,</>,
    <>  <span style={{ color: C.key }}>focus</span>: [<span style={{ color: C.str }}>&quot;LLMs&quot;</span>, <span style={{ color: C.str }}>&quot;RAG&quot;</span>, <span style={{ color: C.str }}>&quot;Cloud&quot;</span>],</>,
    <>  <span style={{ color: C.key }}>liveProducts</span>: <span style={{ color: C.num }}>3</span>, <span style={{ color: C.com }}>{"// used every day"}</span></>,
    <>  <span style={{ color: C.key }}>status</span>: <span style={{ color: C.str }}>&quot;building something new&quot;</span>,</>,
    <>{"};"}</>,
  ];
  return (
    <Shell label="Idea 1 · Code editor">
      <div className="-mx-2 -mt-2 rounded-xl border border-white/10 bg-[#0b1020]/80 backdrop-blur overflow-hidden">
        <div className="flex items-center border-b border-white/10 bg-white/[0.03]">
          <span className="px-3 py-2 flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="px-3 py-2 font-mono text-[11.5px] text-white/90 border-x border-white/10 bg-[#0b1020] border-t-2 border-t-accent">about-me.ts</span>
          <span className="px-3 py-2 font-mono text-[11.5px] text-white/40">skills.json</span>
        </div>
        <div className="py-3 font-mono text-[14px] leading-[1.75]">
          {L.map((l, i) => (
            <div key={i} className={`flex pr-4 ${i === 5 ? "bg-white/[0.04]" : ""}`}>
              <span className="w-10 shrink-0 text-right pr-4 text-white/25 select-none">{i + 1}</span>
              <span className="whitespace-pre text-white/90">
                {l}
                {i === 6 && <span className="inline-block w-[2px] h-[1.1em] -mb-[3px] ml-0.5 bg-neon animate-pulse" />}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 px-3 py-1.5 border-t border-white/10 bg-accent/80 font-mono text-[10.5px] text-white">
          <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> main</span>
          <span>TypeScript</span>
          <span className="ml-auto">✓ 0 problems</span>
        </div>
      </div>
      <Chips />
    </Shell>
  );
}

/* 2 — an API request about him */
function Api() {
  const k = (s: string) => <span style={{ color: C.key }}>&quot;{s}&quot;</span>;
  const v = (s: string) => <span style={{ color: C.str }}>&quot;{s}&quot;</span>;
  return (
    <Shell label="Idea 2 · API response">
      <div className="-mx-2 -mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1020]/80 backdrop-blur p-1.5">
        <span className="rounded-md bg-emerald-400/15 px-2.5 py-1 font-mono text-[12px] font-bold text-emerald-300">GET</span>
        <span className="font-mono text-[13.5px] text-white/90">/api/me</span>
        <span className="ml-auto rounded-md bg-accent px-3 py-1 text-[12px] font-semibold text-white">Send</span>
      </div>
      <div className="mt-3 flex items-center gap-3 font-mono text-[11.5px]">
        <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-emerald-300">200 OK</span>
        <span className="text-white/50">38 ms</span>
        <span className="text-white/50">application/json</span>
      </div>
      <pre className="mt-2 font-mono text-[14px] leading-[1.7] text-white/80">
        {"{"}
        {"\n  "}{k("role")}: {v("Full-stack & AI/ML developer")},
        {"\n  "}{k("does")}: {v("full-stack products with AI inside")},
        {"\n  "}{k("loves")}: [{v("LLMs")}, {v("RAG")}, {v("cloud")}],
        {"\n  "}{k("shipped")}: <span style={{ color: C.num }}>3</span>,
        {"\n  "}{k("based_in")}: {v("Coimbatore, IN")},
        {"\n  "}{k("status")}: {v("building something new")}
        {"\n}"}
      </pre>
      <Chips />
    </Shell>
  );
}

/* 3 — career as a git history */
const COMMITS = [
  { h: "a3f9c21", m: "ship: 3 products live in production", tag: "HEAD", c: "#34D399" },
  { h: "7be0d14", m: "feat: LLM + RAG assistants that run locally", c: "#C084FC" },
  { h: "52c8e97", m: "feat: deploy to the cloud (AWS, Docker)", c: "#FB923C" },
  { h: "19d4a6b", m: "docs: 8 research papers published", c: "#F472B6" },
  { h: "0c1e2f3", m: `init: B.Tech CSE @ Amrita · CGPA ${cgpa}`, c: "#60A5FA" },
];
function GitLog() {
  return (
    <Shell label="Idea 3 · Git history">
      <div className="font-mono text-[12.5px] text-white/60">
        <span className="text-emerald-400">❯</span> git log --graph --oneline
      </div>
      <div className="relative mt-4">
        <span className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-400 via-violet-400 to-sky-400" />
        <div className="space-y-3.5">
          {COMMITS.map((x) => (
            <div key={x.h} className="relative flex items-center gap-3">
              <span className="relative z-10 w-4 h-4 rounded-full border-2 bg-[#0b1020]" style={{ borderColor: x.c, boxShadow: `0 0 10px ${x.c}88` }} />
              <span className="font-mono text-[12.5px] text-amber-300/90">{x.h}</span>
              {x.tag && <span className="whitespace-nowrap rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10.5px] text-emerald-300">{x.tag}</span>}
              <span className="font-mono text-[13.5px] text-white/90 truncate">{x.m}</span>
            </div>
          ))}
        </div>
      </div>
      <Chips />
    </Shell>
  );
}

/* 4 — ask an AI assistant about him (RAG, with sources) */
function Chat() {
  return (
    <Shell label="Idea 4 · Ask my AI">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
        <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" /> arjun-gpt · grounded with RAG
      </div>
      <div className="mt-4 space-y-3">
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-white/10 px-4 py-2.5 text-[15px] text-white">Who is Arjun, in one line?</div>
        <div className="flex gap-2.5">
          <span className="mt-1 w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </span>
          <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-fuchsia-300/25 bg-fuchsia-400/10 px-4 py-3 text-[15px] leading-relaxed text-white/95">
            A CS graduate who builds full-stack products with <span className="text-fuchsia-200 font-semibold">AI inside</span>, and has <span className="text-emerald-300 font-semibold">3 of them live</span> with real businesses.
            <span className="inline-block w-2 h-4 -mb-0.5 ml-1 bg-fuchsia-200 animate-pulse" />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["resume.pdf", "projects.md", "papers/"].map((s, i) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[10.5px] text-white/70">
                  <FileText className="w-3 h-3" /> [{i + 1}] {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Chips />
    </Shell>
  );
}

/* 5 — career as a CI pipeline run */
const JOBS = [
  { n: "setup", d: `B.Tech CSE · Amrita · CGPA ${cgpa}`, t: "4y" },
  { n: "build", d: "Full-stack apps · React, Node, SQL", t: "∞" },
  { n: "add-ai", d: "LLMs, RAG & computer vision", t: "ongoing" },
  { n: "test", d: "8 research papers · IEEE & Springer", t: "8/8" },
  { n: "deploy", d: "3 products live with real businesses", t: "prod" },
];
function Pipeline() {
  return (
    <Shell label="Idea 5 · CI pipeline">
      <div className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center">
          <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
        </span>
        <span className="font-grotesk text-lg font-semibold text-white">arjun / career</span>
        <span className="font-mono text-[11px] text-white/50">run #2026 · main</span>
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1020]/70 backdrop-blur divide-y divide-white/[0.06]">
        {JOBS.map((j) => (
          <div key={j.n} className="flex items-center gap-3 px-3.5 py-2">
            <span className="w-5 h-5 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-300" strokeWidth={3} />
            </span>
            <span className="w-16 font-mono text-[12.5px] text-white">{j.n}</span>
            <span className="text-[13px] text-white/70 truncate">{j.d}</span>
            <span className="ml-auto font-mono text-[11px] text-white/40">{j.t}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 px-3.5 py-2">
          <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
            <CircleDot className="w-3 h-3 text-amber-300 animate-pulse" />
          </span>
          <span className="w-16 font-mono text-[12.5px] text-amber-200">next</span>
          <span className="text-[13px] text-amber-100/80">Building something new…</span>
          <span className="ml-auto font-mono text-[11px] text-amber-300/80">running</span>
        </div>
      </div>
      <div className="mt-auto pt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] text-white">Coimbatore, India</span>
      </div>
    </Shell>
  );
}

export function IntroOptions2() {
  return (
    <section className="relative py-20">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-x-8 gap-y-12">
        <Editor />
        <Api />
        <GitLog />
        <Chat />
        <Pipeline />
      </div>
    </section>
  );
}
