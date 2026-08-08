"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, FileText, ArrowUpRight } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact({ onOpenResume }: { onOpenResume: () => void }) {
  const { email, linkedin, location } = PORTFOLIO_DATA.personal;

  const links = [
    { label: "Email", value: email, href: `mailto:${email}`, icon: Mail },
    { label: "LinkedIn", value: "View profile", href: linkedin, icon: FaLinkedinIn },
  ];

  return (
    <section id="contact" className="relative py-28 sm:py-36 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dot-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_35%,black,transparent)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[420px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative max-w-[640px] mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <span className="eyebrow !text-accent">Contact</span>
          <h2 className="font-semibold text-3xl sm:text-4xl leading-tight tracking-tight mt-3">
            <span className="text-bone">Let&apos;s work</span> <span className="text-accent">together.</span>
          </h2>
          <p className="text-dim mt-3">
            Open to full-time roles and freelance projects. The fastest way to reach me is email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="space-y-4"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="group glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 border-accent/20 hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:shadow-glow-sm transition-all duration-300">
                <link.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-semibold text-bone group-hover:text-accent transition-colors duration-300">
                  {link.label}
                </div>
                <div className="text-xs text-faint truncate">{link.value}</div>
              </div>
              <span className="w-8 h-8 rounded-lg border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          ))}

          <button
            onClick={onOpenResume}
            className="group glass rounded-2xl p-4 sm:p-5 w-full flex items-center gap-4 border-accent/20 hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300 text-left"
          >
            <div className="w-11 h-11 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:shadow-glow-sm transition-all duration-300">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-bone group-hover:text-accent transition-colors duration-300">
                Resume
              </div>
              <div className="text-xs text-faint">View / Download</div>
            </div>
            <span className="w-8 h-8 rounded-lg border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </motion.div>

        <p className="text-xs text-faint mt-10">{location}</p>
      </div>
    </section>
  );
}
