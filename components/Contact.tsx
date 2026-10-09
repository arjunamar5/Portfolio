"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Mail, FileText, MapPin } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;

type Key = {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  c: string; // accent / LED colour
};

const KEYS: Key[] = [
  { id: "email", label: "Email", hint: "write to me", icon: Mail, c: "#22D3EE" },
  { id: "linkedin", label: "LinkedIn", hint: "connect", icon: FaLinkedinIn, c: "#3B82F6" },
  { id: "github", label: "GitHub", hint: "@arjunamar5", icon: FaGithub, c: "#C084FC" },
  { id: "resume", label: "Résumé", hint: "view pdf", icon: FileText, c: "#34D399" },
];

/** One mechanical keycap: lifts on hover, sinks when pressed, glows in its colour. */
function Keycap({ k, pressed, onPress }: { k: Key; pressed: boolean; onPress: () => void }) {
  const [down, setDown] = useState(false);
  const isDown = down || pressed;
  const Icon = k.icon;
  return (
    <button
      onClick={onPress}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      aria-label={`${k.label}: ${k.hint}`}
      className="group relative w-full aspect-[1.3/1] sm:aspect-[1.05/1] outline-none [--lift:0px] hover:[--lift:-3px] focus-visible:[--lift:-3px]"
      style={{ ["--c" as string]: k.c } as React.CSSProperties}
    >
      {/* the light leaking out from under the key */}
      <span className="pointer-events-none absolute inset-x-3 -bottom-2 h-6 rounded-full blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" style={{ background: k.c }} />
      {/* the key's skirt (side) */}
      <span
        className="absolute inset-0 rounded-[22px] transition-transform duration-150"
        style={{
          background: "linear-gradient(180deg,#1a2133,#0c111d)",
          transform: `translateY(${isDown ? 3 : 7}px)`,
          boxShadow: "0 18px 30px -10px rgba(0,0,0,0.9)",
        }}
      />
      {/* the key top */}
      <span
        className="absolute inset-0 rounded-[22px] border flex flex-col justify-between p-4 sm:p-5 text-left transition-[transform,border-color,box-shadow] duration-150"
        style={{
          transform: `translateY(${isDown ? 4 : "var(--lift)"})`,
          background: "radial-gradient(120% 90% at 30% 0%, rgba(255,255,255,0.08), transparent 55%), linear-gradient(180deg,#232c42,#141a2a)",
          borderColor: isDown ? `${k.c}aa` : "rgba(255,255,255,0.10)",
          boxShadow: isDown ? `inset 0 0 26px ${k.c}33, 0 0 0 1px ${k.c}55` : "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -10px 22px rgba(0,0,0,0.35)",
        }}
      >
        <span className="flex items-start justify-between">
          <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: k.c, boxShadow: `0 0 8px 2px ${k.c}` }} />
        </span>
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 self-center transition-transform duration-300 group-hover:scale-110" style={{ color: k.c }} />
        <span>
          <span className="block font-grotesk text-[15px] sm:text-base font-semibold text-white leading-tight">{k.label}</span>
          <span className="block font-mono text-[10.5px] sm:text-[11px] text-white/45 mt-0.5 truncate">{k.hint}</span>
        </span>
      </span>
    </button>
  );
}

export function Contact({ onOpenResume }: { onOpenResume: () => void }) {
  const { email, linkedin, github, location } = PORTFOLIO_DATA.personal;
  const [pressed, setPressed] = useState<string | null>(null);

  const act = useCallback(
    (id: string) => {
      setPressed(id);
      setTimeout(() => setPressed(null), 160);
      if (id === "email") window.location.href = `mailto:${email}`;
      else if (id === "linkedin") window.open(linkedin, "_blank", "noopener,noreferrer");
      else if (id === "github") window.open(github, "_blank", "noopener,noreferrer");
      else onOpenResume();
    },
    [email, linkedin, github, onOpenResume]
  );


  return (
    <section id="contact" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dot-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
      <div className="aurora-blob w-[620px] h-[460px] top-0 left-1/2 -ml-[310px] bg-accent/15" />
      <div className="aurora-blob w-[420px] h-[320px] bottom-0 right-[10%] bg-fuchsia-500/10" style={{ animationDelay: "-8s" }} />

      <div className="relative max-w-[960px] mx-auto px-6 sm:px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} className="inline-flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">06</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">Contact</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-5 font-grotesk font-bold tracking-[-0.04em] leading-[0.98]"
        >
          <span className="block text-[1.5rem] sm:text-[2rem] font-medium tracking-[-0.02em] text-bone/60">Got an idea?</span>
          <span className="block text-[2.8rem] sm:text-[4.6rem] text-bone">
            Let&apos;s build it{" "}
            <span className="bg-gradient-to-r from-neon via-accent-soft to-fuchsia-300 bg-clip-text text-transparent">together.</span>
          </span>
        </motion.h2>

        {/* the keyboard */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 18 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-12 mx-auto max-w-[760px] [perspective:1200px]"
        >
          {/* RGB underglow */}
          <div className="kbd-glow pointer-events-none absolute -inset-3 rounded-[40px] blur-2xl opacity-70" />
          <div className="relative rounded-[32px] p-3 sm:p-4 border border-white/10 bg-[linear-gradient(180deg,#121826,#0a0e18)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-2">
              {KEYS.map((k) => (
                <Keycap key={k.id} k={k} pressed={pressed === k.id} onPress={() => act(k.id)} />
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-xs text-faint">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {location}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="inline-flex items-center gap-1.5 text-emerald-300/90">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </span>
        </div>
      </div>
    </section>
  );
}
