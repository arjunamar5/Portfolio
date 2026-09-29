"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { VisualFrame } from "./VisualFrame";

const EASE = [0.16, 1, 0.3, 1] as const;
const STEP_MS = 1900;

const STEPS = [
  { title: "Classify", tech: "CNN · EfficientNet" },
  { title: "Localize", tech: "YOLO" },
  { title: "Segment", tech: "U-Net" },
  { title: "Explain", tech: "Grad-CAM" },
  { title: "Assist", tech: "RAG · Ollama" },
];

// Lesion position in the SVG's 400×320 viewBox.
const LX = 262;
const LY = 118;

const ASSIST_TEXT = "Context retrieved from the local knowledge base — generating a natural-language clinical summary…";

/**
 * Illustrative walk-through of the Brain Tumor AI pipeline: an MRI-style
 * axial slice is scanned, then each stage (classify → localize → segment →
 * explain → assist) layers its overlay onto the image while the pipeline
 * list tracks the active step. Loops only while on screen.
 */
export function MriVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(-1);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStep((s) => (s < 0 ? 0 : s));
    const id = setInterval(() => setStep((s) => (s >= STEPS.length + 1 ? 0 : s + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (step !== 4) {
      if (step < 4) setTyped(0);
      return;
    }
    const id = setInterval(() => setTyped((n) => Math.min(ASSIST_TEXT.length, n + 2)), 22);
    return () => clearInterval(id);
  }, [step]);

  const active = Math.min(step, STEPS.length - 1);

  return (
    <VisualFrame frameRef={ref} title="Brain Tumor AI · Inference" accent="#4FBDB6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_170px]">
        {/* Scan viewport */}
        <div className="relative bg-[#05070d] aspect-[5/4] overflow-hidden">
          <svg viewBox="0 0 400 320" className="absolute inset-0 w-full h-full" aria-hidden>
            <defs>
              <radialGradient id="mri-fill" cx="50%" cy="48%" r="55%">
                <stop offset="0%" stopColor="#a4adbf" stopOpacity="0.55" />
                <stop offset="65%" stopColor="#5b6477" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2a3142" stopOpacity="0.7" />
              </radialGradient>
              <radialGradient id="mri-heat">
                <stop offset="0%" stopColor="#ff2d20" stopOpacity="0.9" />
                <stop offset="28%" stopColor="#ff8a00" stopOpacity="0.75" />
                <stop offset="52%" stopColor="#ffd000" stopOpacity="0.5" />
                <stop offset="78%" stopColor="#22d3ee" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </radialGradient>
              <filter id="mri-wobble">
                <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
                <feDisplacementMap in="SourceGraphic" scale="12" />
              </filter>
              <filter id="mri-gyri">
                <feTurbulence type="turbulence" baseFrequency="0.055" numOctaves="3" seed="9" />
                <feDisplacementMap in="SourceGraphic" scale="24" />
              </filter>
              <filter id="mri-soft">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* Skull + tissue */}
            <ellipse cx="200" cy="160" rx="152" ry="130" fill="none" stroke="#c9d1e0" strokeOpacity="0.4" strokeWidth="7" filter="url(#mri-wobble)" />
            <ellipse cx="200" cy="160" rx="138" ry="116" fill="url(#mri-fill)" filter="url(#mri-wobble)" />
            <g filter="url(#mri-gyri)" stroke="#0b0f18" strokeOpacity="0.55" fill="none" strokeWidth="3">
              <ellipse cx="200" cy="160" rx="122" ry="101" />
              <ellipse cx="200" cy="160" rx="102" ry="84" />
              <ellipse cx="200" cy="160" rx="80" ry="64" />
              <ellipse cx="200" cy="160" rx="58" ry="45" />
            </g>
            <path d="M200 46 C 196 100, 204 220, 200 276" stroke="#0b0f18" strokeOpacity="0.7" strokeWidth="4" fill="none" />
            <path d="M186 128 q-22 32 -6 64" stroke="#0b0f18" strokeOpacity="0.8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M214 128 q22 32 6 64" stroke="#0b0f18" strokeOpacity="0.8" strokeWidth="9" strokeLinecap="round" fill="none" />
            {/* Lesion */}
            <ellipse cx={LX} cy={LY} rx="24" ry="20" fill="#eef2f8" fillOpacity="0.6" filter="url(#mri-wobble)" />
            <ellipse cx={LX} cy={LY} rx="30" ry="26" fill="#eef2f8" fillOpacity="0.15" filter="url(#mri-soft)" />

            {/* Explain: Grad-CAM heatmap */}
            <motion.circle
              cx={LX}
              cy={LY}
              r="66"
              fill="url(#mri-heat)"
              style={{ transformOrigin: `${LX}px ${LY}px` }}
              initial={false}
              animate={{ opacity: step >= 3 ? [0.75, 1, 0.75] : 0, scale: step >= 3 ? 1 : 0.6 }}
              transition={{
                opacity: step >= 3 ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 },
                scale: { duration: 0.8, ease: EASE },
              }}
            />

            {/* Segment: U-Net contour */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.path
                  key="seg"
                  d={`M${LX - 26} ${LY - 4} C ${LX - 24} ${LY - 24}, ${LX + 6} ${LY - 28}, ${LX + 22} ${LY - 16} S ${LX + 32} ${LY + 14}, ${LX + 12} ${LY + 22} S ${LX - 22} ${LY + 22}, ${LX - 26} ${LY - 4} Z`}
                  fill="rgba(34,211,238,0.14)"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="marching"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ transformOrigin: `${LX}px ${LY}px` }}
                />
              )}
            </AnimatePresence>

            {/* Localize: YOLO box */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.g key="box" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.path
                    d={`M${LX - 40} ${LY - 38} H ${LX + 40} V ${LY + 36} H ${LX - 40} Z`}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  />
                  <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <rect x={LX - 40} y={LY - 56} width="84" height="17" rx="3" fill="#3b82f6" />
                    <text x={LX - 34} y={LY - 44} fontSize="10" fill="#fff" fontFamily="ui-monospace, monospace">
                      lesion · roi
                    </text>
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* Scan sweep */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/5">
            <div className="scan-line h-full w-full bg-gradient-to-b from-transparent via-neon/25 to-transparent border-b border-neon/60" />
          </div>

          {/* Classify verdict */}
          <AnimatePresence>
            {step >= 0 && (
              <motion.div
                key="verdict"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
                className="absolute top-3 left-3 glass rounded-lg px-2.5 py-1.5 text-[11px] text-bone flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#f87171]" />
                Abnormality detected
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-3 right-3 font-mono text-[10px] text-faint">AXIAL · T1</div>

          {/* Assist: local RAG answer */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                key="assist"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute left-3 right-3 bottom-8 glass rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-neon mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                  RAG assistant · local
                </div>
                <div className="text-[11px] sm:text-xs text-bone/90 leading-snug min-h-[2.6em]">
                  {ASSIST_TEXT.slice(0, typed)}
                  <span className="caret inline-block w-[5px] h-[1em] -mb-[2px] ml-0.5 bg-neon" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pipeline */}
        <ol className="flex sm:flex-col gap-1 p-3 border-t sm:border-t-0 sm:border-l border-line overflow-x-auto">
          {STEPS.map((s, i) => {
            const isActive = i === active;
            const done = step > i;
            return (
              <li
                key={s.title}
                className={`relative shrink-0 sm:shrink rounded-lg px-3 py-2 transition-colors duration-500 ${
                  isActive ? "bg-accent/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-mono transition-colors duration-500 ${
                      isActive
                        ? "border-accent bg-accent text-white shadow-glow-sm"
                        : done
                        ? "border-neon/60 text-neon"
                        : "border-line-strong text-faint"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-xs font-medium transition-colors duration-500 ${isActive || done ? "text-bone" : "text-faint"}`}>
                    {s.title}
                  </span>
                </div>
                <div className="text-[10px] text-faint mt-0.5 pl-6 whitespace-nowrap">{s.tech}</div>
                {isActive && (
                  <motion.span
                    key={step}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    className="absolute left-3 right-3 bottom-0.5 h-px bg-gradient-to-r from-accent to-neon origin-left"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </VisualFrame>
  );
}
