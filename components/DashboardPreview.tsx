"use client";

import React from "react";

/**
 * Flat "dashboard preview" mockup used on featured project showcases —
 * browser chrome + skeleton UI (stat row, list, bar chart). An honest
 * abstraction, not a fabricated screenshot. Floats gently on an ambient
 * loop so the section feels alive while scrolling past it.
 */
export function DashboardPreview({
  title,
  accent,
  className = "",
}: {
  title: string;
  accent: string;
  className?: string;
}) {
  const bars = [40, 65, 50, 85, 70, 55, 90];

  return (
    <div className={`relative ${className}`} style={{ ["--accent" as any]: accent }}>
      <div
        className="pointer-events-none absolute -inset-6 opacity-[0.16] blur-2xl"
        style={{ background: "radial-gradient(50% 50% at 50% 30%, var(--accent), transparent 70%)" }}
      />

      <div className="relative rounded-2xl border border-line-strong bg-panel overflow-hidden animate-float-slow">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-2 text-xs text-faint truncate">{title} Dashboard Preview</span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg bg-panel-2 p-3 space-y-2">
                <div className="h-1.5 w-8 rounded-full bg-bone/15" />
                <div className="h-2.5 w-12 rounded-full bg-bone/25" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-panel-2/70 p-3 space-y-2.5">
              <div className="h-1.5 w-14 rounded-full bg-bone/15 mb-1" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-2 rounded-full bg-bone/10" style={{ width: `${85 - i * 12}%` }} />
              ))}
            </div>

            <div className="rounded-lg bg-panel-2/70 p-3 flex flex-col">
              <div className="h-1.5 w-14 rounded-full bg-bone/15 mb-3" />
              <div className="flex-1 flex items-end gap-1.5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%`, background: "color-mix(in srgb, var(--accent) 55%, transparent)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
