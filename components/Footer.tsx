"use client";

import React from "react";
import { Mail } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const { email, linkedin, github } = PORTFOLIO_DATA.personal;

  const goTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-void border-t border-line py-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8 pb-14 sm:pb-20">
        <Wordmark text="Arjun R Amarnath" />
      </div>
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 flex justify-center">
        <div className="flex items-center gap-2">
          {[
            { href: `mailto:${email}`, icon: Mail, label: "Email" },
            { href: linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
            { href: github, icon: FaGithub, label: "GitHub" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={s.label}
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-dim hover:text-bone hover:border-accent/50 hover:shadow-glow-sm hover:-translate-y-0.5 transition-all duration-300"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
          <button onClick={goTop} className="ml-3 text-xs text-dim hover:text-bone transition-colors link-underline">
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
