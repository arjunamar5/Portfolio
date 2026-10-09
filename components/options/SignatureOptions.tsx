"use client";

import React from "react";
import "@fontsource/great-vibes";
import "@fontsource/pacifico";
import "@fontsource/mr-dafoe";
import "@fontsource/homemade-apple";
import "@fontsource/sacramento";
import "@fontsource/satisfy";
import { Signature } from "../Signature";

// Earlier comparison of all seven styles.
export const STYLES: { n: string; label: string; font: string; size?: string; lh?: string }[] = [
  { n: "1", label: "Current (Caveat)", font: "font-hand font-semibold" },
  { n: "2", label: "Elegant script (Great Vibes)", font: "[font-family:'Great_Vibes',cursive]", size: "text-[5rem] sm:text-[6.5rem]", lh: "leading-[1.3]" },
  { n: "3", label: "Pen signature (Mr Dafoe)", font: "[font-family:'Mr_Dafoe',cursive]", size: "text-[5rem] sm:text-[6.5rem]", lh: "leading-[1.3]" },
  { n: "4", label: "Thin & airy (Sacramento)", font: "[font-family:'Sacramento',cursive]", size: "text-[5.5rem] sm:text-[7rem]", lh: "leading-[1.3]" },
  { n: "5", label: "Bold & round (Pacifico)", font: "[font-family:'Pacifico',cursive]", size: "text-[3.6rem] sm:text-[4.6rem]", lh: "leading-[1.5]" },
  { n: "6", label: "Real handwriting (Homemade Apple)", font: "[font-family:'Homemade_Apple',cursive]", size: "text-[3rem] sm:text-[3.8rem]", lh: "leading-[1.7]" },
  { n: "7", label: "Casual script (Satisfy)", font: "[font-family:'Satisfy',cursive]", size: "text-[4.2rem] sm:text-[5.4rem]", lh: "leading-[1.4]" },
];

const FULL: { label: string; font: string; size: string; lh: string }[] = [
  { label: "4 · Thin & airy (Sacramento)", font: "[font-family:'Sacramento',cursive]", size: "text-[2.5rem] sm:text-[5rem]", lh: "leading-[1.3]" },
  { label: "7 · Casual script (Satisfy)", font: "[font-family:'Satisfy',cursive]", size: "text-[2.3rem] sm:text-[4rem]", lh: "leading-[1.4]" },
];

export function SignatureOptions() {
  return (
    <section className="py-16 bg-void">
      <div className="max-w-[1100px] mx-auto px-6 space-y-6">
        {FULL.map((s) => (
          <div key={s.label} className="rounded-3xl border border-line bg-[#070a12] p-6 flex flex-col items-center">
            <div className="self-start font-mono text-[11px] uppercase tracking-[0.18em] text-accent-soft">{s.label} · full name, no underline</div>
            <div className="flex items-center justify-center py-10 min-h-[200px]">
              <Signature font={s.font} size={s.size} lh={s.lh} text="Arjun R Amarnath" underline={false} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
