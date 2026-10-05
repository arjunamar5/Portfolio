"use client";

import React, { useRef, useState } from "react";
import { ChevronsLeftRight, Lock, ArrowRight } from "lucide-react";
import {
  StickyReal, PhoneReal, SheetReal, NotebookReal, ReceiptReal, ClockReal,
  TasksApp, ChatApp, ChartApp, CalendarApp, InvoiceApp, RemindersApp,
} from "../ProblemFlip";

type Spot = { x: number; y: number; w: number; h: number; r?: number };
const place = (s: Spot): React.CSSProperties => ({
  left: `${s.x}%`,
  top: `${s.y}%`,
  width: `${s.w}%`,
  height: `${s.h}%`,
  transform: `translate(-50%,-50%) rotate(${s.r ?? 0}deg)`,
});

// The same six things, as they are in real life and as software.
const MESS: [React.FC, Spot][] = [
  [StickyReal, { x: 16, y: 30, w: 11, h: 21, r: -10 }],
  [SheetReal, { x: 42, y: 30, w: 22, h: 40, r: 4 }],
  [ClockReal, { x: 86, y: 26, w: 10, h: 19, r: -6 }],
  [PhoneReal, { x: 18, y: 72, w: 9, h: 36, r: 12 }],
  [NotebookReal, { x: 50, y: 74, w: 17, h: 34, r: -6 }],
  [ReceiptReal, { x: 72, y: 62, w: 8, h: 44, r: 9 }],
];
const APP: [React.FC, Spot][] = [
  [TasksApp, { x: 24, y: 36.5, w: 22, h: 35 }],
  [ChartApp, { x: 64, y: 36.5, w: 54, h: 35 }],
  [ChatApp, { x: 24, y: 75, w: 22, h: 34 }],
  [CalendarApp, { x: 45.75, y: 75, w: 17.5, h: 34 }],
  [InvoiceApp, { x: 64, y: 75, w: 17.5, h: 34 }],
  [RemindersApp, { x: 82.25, y: 75, w: 17.5, h: 34 }],
];

function Piece({ C, s }: { C: React.FC; s: Spot }) {
  return (
    <div className="absolute [container-type:size]" style={place(s)}>
      <C />
    </div>
  );
}

export function WhatIDoSlider({ initial = 50 }: { initial?: number }) {
  const [x, setX] = useState(initial);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setX(Math.max(3, Math.min(97, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent-soft">02</span>
              <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
              <span className="eyebrow !text-faint">What I do</span>
            </div>
            <h2 className="mt-4 font-grotesk font-bold text-4xl sm:text-6xl leading-[1.02] tracking-[-0.03em] text-bone max-w-[820px]">
              I turn <span className="text-orange-300">real-world problems</span> into{" "}
              <span className="bg-gradient-to-r from-neon via-accent-soft to-emerald-300 bg-clip-text text-transparent">working software.</span>
            </h2>
          </div>
          <div className="lg:ml-auto inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2 text-sm text-dim">
            <ChevronsLeftRight className="w-4 h-4 text-bone" /> Drag to transform
          </div>
        </div>

        <div
          ref={box}
          className="relative mt-10 h-[560px] rounded-[30px] overflow-hidden border border-line-strong select-none touch-pan-y cursor-ew-resize"
          onPointerDown={(e) => {
            drag.current = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            move(e.clientX);
          }}
          onPointerMove={(e) => drag.current && move(e.clientX)}
          onPointerUp={() => (drag.current = false)}
        >
          {/* AFTER — the software */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 70% 30%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(60% 50% at 30% 90%, rgba(52,211,153,0.16), transparent 60%), #070b16" }}>
            <div className="absolute inset-[5%] rounded-2xl border border-line-strong bg-[#060912]/90 shadow-[0_40px_120px_-30px_rgba(52,211,153,0.45)]">
              <div className="flex items-center gap-2 px-4 h-[9%] border-b border-line">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 h-[62%] w-56 rounded-md bg-void/70 border border-line flex items-center gap-1.5 px-2.5 font-mono text-[11px] text-dim">
                  <Lock className="w-3 h-3 text-emerald-300" /> yourbusiness.app
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-emerald-400/15 border border-emerald-400/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>
            </div>
            {APP.map(([C, s], i) => (
              <Piece key={i} C={C} s={s} />
            ))}
          </div>

          {/* BEFORE — the real world, clipped to the left of the handle */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - x}% 0 0)`,
              background:
                "radial-gradient(70% 60% at 30% 20%, rgba(255,214,170,0.12), transparent 60%), repeating-linear-gradient(100deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(135deg,#3a2718,#22160e 60%,#1a110b)",
            }}
          >
            {MESS.map(([C, s], i) => (
              <Piece key={i} C={C} s={s} />
            ))}
          </div>

          {/* Labels */}
          <span className="absolute top-5 left-5 rounded-full bg-orange-500/20 border border-orange-400/40 backdrop-blur px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-orange-200" style={{ opacity: x > 14 ? 1 : 0 }}>
            The real world
          </span>
          <span className="absolute bottom-5 right-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-emerald-200" style={{ opacity: x < 86 ? 1 : 0 }}>
            With software
          </span>

          {/* Handle */}
          <div className="absolute inset-y-0 w-0" style={{ left: `${x}%` }}>
            <div className="absolute inset-y-0 -left-px w-[2px] bg-gradient-to-b from-orange-300 via-white to-emerald-300 shadow-[0_0_18px_rgba(255,255,255,0.6)]" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white text-void flex items-center justify-center shadow-[0_0_0_6px_rgba(255,255,255,0.15),0_12px_30px_rgba(0,0,0,0.6)]">
              <ChevronsLeftRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ["Manual", "Automated"],
            ["Scattered", "One place"],
            ["Guesswork", "Live insight"],
          ].map(([a, b]) => (
            <div key={a} className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-panel/50 py-4 font-grotesk text-lg">
              <span className="text-orange-300/80 line-through decoration-orange-400/50">{a}</span>
              <ArrowRight className="w-4 h-4 text-faint" />
              <span className="text-emerald-300 font-semibold">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
