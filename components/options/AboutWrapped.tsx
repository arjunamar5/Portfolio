"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Star, Award, Rocket, BookOpen, Sparkles, LucideIcon } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;
const { title, education, location } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

type Card = { kicker: string; big: string; small: string; bg: string; ink: string; I: LucideIcon; rot: number; shape: "circle" | "rings" | "stripes" | "blob" | "dots" | "wave"; size?: string };

const CARDS: Card[] = [
  { kicker: "Studied", big: "Computer Science", small: "Amrita · 2022 – 26", bg: "linear-gradient(160deg,#7C3AED,#DB2777)", ink: "#fff", I: GraduationCap, rot: -7, shape: "circle", size: "text-[1.95rem]" },
  { kicker: "Scored", big: cgpa, small: "CGPA, B.Tech CSE", bg: "linear-gradient(160deg,#D9F99D,#4ADE80)", ink: "#0b1a0f", I: Star, rot: -3, shape: "rings", size: "text-[5.2rem]" },
  { kicker: "Led", big: "CSI", small: "as President · ASEB chapter", bg: "linear-gradient(160deg,#FB923C,#EF4444)", ink: "#fff", I: Award, rot: 2, shape: "stripes", size: "text-[5.2rem]" },
  { kicker: "Shipped", big: "3", small: "live products, used every day", bg: "linear-gradient(160deg,#2563EB,#06B6D4)", ink: "#fff", I: Rocket, rot: -2, shape: "blob", size: "text-[6.5rem]" },
  { kicker: "Published", big: "8", small: "research papers · IEEE & Springer", bg: "linear-gradient(160deg,#FDE047,#F59E0B)", ink: "#1f1300", I: BookOpen, rot: 4, shape: "dots", size: "text-[6.5rem]" },
  { kicker: "Obsessed with", big: "LLMs & RAG", small: "private, grounded AI", bg: "linear-gradient(160deg,#0EA5E9,#8B5CF6)", ink: "#fff", I: Sparkles, rot: 7, shape: "wave", size: "text-[2.5rem]" },
];

function Shape({ kind, ink }: { kind: Card["shape"]; ink: string }) {
  const s = { borderColor: ink, background: ink };
  switch (kind) {
    case "circle":
      return <span className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-25" style={{ background: ink }} />;
    case "rings":
      return (
        <>
          <span className="absolute -right-12 -top-12 w-48 h-48 rounded-full border-[14px] opacity-20" style={s} />
          <span className="absolute -right-2 -top-2 w-28 h-28 rounded-full border-[10px] opacity-20" style={s} />
        </>
      );
    case "stripes":
      return <span className="absolute inset-0 opacity-15" style={{ background: `repeating-linear-gradient(135deg, ${ink} 0 10px, transparent 10px 26px)` }} />;
    case "blob":
      return <span className="absolute -right-14 top-10 w-52 h-52 rounded-[42%_58%_63%_37%/40%_45%_55%_60%] opacity-25" style={{ background: ink }} />;
    case "dots":
      return <span className="absolute inset-0 opacity-25" style={{ backgroundImage: `radial-gradient(${ink} 2px, transparent 2.5px)`, backgroundSize: "18px 18px" }} />;
    default:
      return (
        <svg viewBox="0 0 200 60" className="absolute left-0 right-0 top-16 w-full opacity-30" preserveAspectRatio="none">
          {[0, 14, 28].map((o) => (
            <path key={o} d={`M0 ${30 + o / 3} C 40 ${0 + o}, 60 ${60 - o}, 100 ${30} S 160 ${0 + o}, 200 ${30}`} fill="none" stroke={ink} strokeWidth="3" />
          ))}
        </svg>
      );
  }
}

export function AboutWrapped() {
  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-grotesk font-bold text-5xl sm:text-7xl leading-[0.95] tracking-[-0.04em] text-bone">
            Arjun,{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-orange-300 to-lime-300 bg-clip-text text-transparent">wrapped.</span>
          </h2>
          <span className="text-sm text-faint">
            {title} · {location}
          </span>
        </div>

        <div className="mt-16 flex flex-wrap lg:flex-nowrap justify-center gap-y-6 lg:-space-x-5">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.kicker}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: i % 2 ? 18 : 0, rotate: c.rot }}
              whileHover={{ rotate: 0, y: -14, scale: 1.06, zIndex: 20 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.06 }}
              className="relative w-[200px] sm:w-[210px] h-[340px] rounded-[26px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] cursor-default"
              style={{ background: c.bg, color: c.ink, zIndex: i }}
            >
              <Shape kind={c.shape} ink={c.ink} />
              <div className="relative h-full flex flex-col p-5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] opacity-80">
                  <span>№ {String(i + 1).padStart(2, "0")}</span>
                  <c.I className="w-4 h-4" />
                </div>
                <div className="mt-auto">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-80">{c.kicker}</div>
                  <div className={`mt-1 font-grotesk font-bold leading-[0.92] tracking-[-0.04em] ${c.size ?? "text-[3rem]"}`}>{c.big}</div>
                  <div className="mt-2 text-[13px] leading-snug opacity-85">{c.small}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mt-14 text-center font-grotesk text-xl sm:text-2xl text-bone/80"
        >
          I build products with <span className="text-fuchsia-300">AI inside</span>, and ship them to <span className="text-lime-300">real businesses</span>.
        </motion.p>
      </div>
    </section>
  );
}
