"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

export function Footer() {
  const goTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-void border-t border-line py-8">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-faint">
          © {new Date().getFullYear()} {PORTFOLIO_DATA.personal.name}
        </span>
        <button
          onClick={goTop}
          className="text-xs text-dim hover:text-bone transition-colors link-underline"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
