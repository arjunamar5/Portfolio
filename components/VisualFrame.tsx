"use client";

import React from "react";

/**
 * Shared "app window" shell for the illustrative project templates: traffic
 * lights, a mono title, and an "Illustrative" badge (these are animated
 * representations, not live product screens). `overlay` renders outside the
 * clipped window so floating chips can break its edges.
 */
export function VisualFrame({
  title,
  accent,
  children,
  overlay,
  frameRef,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  frameRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={frameRef} className="relative animate-float-slow">
      <div
        className="pointer-events-none absolute -inset-6 opacity-[0.18] blur-2xl"
        style={{ background: `radial-gradient(50% 50% at 50% 40%, ${accent}, transparent 70%)` }}
      />
      <div
        className="relative rounded-2xl bg-panel overflow-hidden border border-line-strong"
        style={{ boxShadow: `0 0 0 1px ${accent}33, 0 24px 60px -24px ${accent}55` }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-panel-2/60">
          <span className="w-2.5 h-2.5 rounded-full bg-bone/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-bone/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-bone/15" />
          <span className="ml-2 font-mono text-[11px] tracking-[0.12em] uppercase text-dim truncate">{title}</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-faint border border-line rounded px-1.5 py-0.5">
            Illustrative
          </span>
        </div>
        {children}
      </div>
      {overlay}
    </div>
  );
}

export function TypingDots({ color = "#93A0B8" }: { color?: string }) {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ background: color, animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}
