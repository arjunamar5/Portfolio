"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";

interface NavbarProps {
  onOpenResume: () => void;
}

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "stack", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ onOpenResume }: NavbarProps) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Tuck the bar away while scrolling down, bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !open);
  });

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -32, duration: 1.1 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 sm:top-6 left-0 right-0 z-[60] flex justify-center px-4"
    >
      <nav
        className={`glass rounded-full flex items-center gap-1 px-2 py-2 transition-[background-color,box-shadow] duration-500 ${
          scrolled ? "!bg-panel/85 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(59,130,246,0.12)]" : "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
        }`}
      >
        <button
          onClick={() => go("home")}
          className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-medium text-bone hover:bg-panel-2 transition-colors shrink-0"
          aria-label="Back to top"
        >
          <span className="text-gradient font-semibold">AA</span>
        </button>

        <div className="hidden lg:flex items-center gap-0.5 mx-1">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="relative px-3.5 py-1.5 rounded-full text-sm transition-colors"
            >
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 bg-panel-2 rounded-full"
                />
              )}
              <span className={`relative z-10 ${active === link.id ? "text-bone" : "text-dim hover:text-bone"}`}>
                {link.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onOpenResume}
          className="btn-shine hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bone text-void text-sm font-medium hover:bg-accent-soft transition-colors ml-1"
        >
          <FileText className="w-3.5 h-3.5" />
          Resume
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-bone hover:bg-panel-2 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[calc(100%+8px)] left-4 right-4 glass !bg-panel/95 rounded-2xl p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
          >
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                  active === link.id ? "text-bone bg-panel-2" : "text-dim hover:text-bone"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onOpenResume();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-accent-soft hover:text-bone transition-colors flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
