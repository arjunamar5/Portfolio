"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, FileText, ArrowUpRight, Copy, Check, MapPin } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { SpotlightCard } from "./SpotlightCard";
import { Magnetic } from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact({ onOpenResume }: { onOpenResume: () => void }) {
  const { email, linkedin, location } = PORTFOLIO_DATA.personal;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const links = [
    { label: "LinkedIn", value: "linkedin.com/in/arjun-r-amarnath", href: linkedin, icon: FaLinkedinIn },
  ];

  return (
    <section id="contact" className="relative py-28 sm:py-40 border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dot-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_35%,black,transparent)]" />
      <div className="aurora-blob w-[560px] h-[420px] top-0 left-1/2 -ml-[280px] bg-accent/15" />
      <div className="aurora-blob w-[360px] h-[300px] bottom-0 left-[15%] bg-neon/10" style={{ animationDelay: "-8s" }} />

      <div className="relative max-w-[720px] mx-auto px-6 sm:px-10 text-center">
        <div className="mb-12">
          <SectionHeading
            index="07"
            eyebrow="Contact"
            title="Let's work together."
            accentFrom={2}
            align="center"
            lede="Open to full-time roles and freelance projects. The fastest way to reach me is email."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <Magnetic strength={0.25}>
            <a
              href={`mailto:${email}`}
              className="btn-shine inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-accent text-white font-medium hover:bg-accent-soft hover:shadow-glow transition-all"
            >
              <Mail className="w-4 h-4" />
              Say hello
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              onClick={copyEmail}
              className="relative inline-flex items-center gap-2.5 px-5 py-4 rounded-2xl glass text-sm text-dim hover:text-bone hover:border-accent/40 transition-colors"
              aria-label="Copy email address"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span key="ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Copy className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="font-mono text-xs">{copied ? "Copied to clipboard" : email}</span>
            </button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {links.map((link) => (
            <motion.a
              key={link.label}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <SpotlightCard className="group glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-accent/40 transition-colors duration-300 h-full">
                <div className="w-11 h-11 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <link.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-semibold text-bone group-hover:text-accent-soft transition-colors">{link.label}</div>
                  <div className="text-xs text-faint truncate">{link.value}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </SpotlightCard>
            </motion.a>
          ))}

          <motion.button
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            onClick={onOpenResume}
            className="block text-left"
          >
            <SpotlightCard className="group glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-accent/40 transition-colors duration-300 h-full">
              <div className="w-11 h-11 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-bone group-hover:text-accent-soft transition-colors">Resume</div>
                <div className="text-xs text-faint">View / Download PDF</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </SpotlightCard>
          </motion.button>
        </motion.div>

        <p className="text-xs text-faint mt-10 inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </p>
      </div>
    </section>
  );
}
