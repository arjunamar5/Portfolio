"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import {
  PhoneMissed,
  Bell,
  Lock,
  Bot,
  CalendarDays,
  Receipt,
  TrendingUp,
  ListChecks,
  Check,
  LucideIcon,
} from "lucide-react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Progress of `v` through the window [a, b], 0 → 1. */
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Timeline (scroll progress 0 → 1):
   0.00 mess on a tilted desk · 0.10–0.34 untangle (desk turns to face you, objects snap to a plan)
   0.36–0.70 build (each object flips into its software twin) · 0.64–0.86 ship (app frame, deploy click, live) */
const STEPS = [
  { at: 0, label: "Problem" },
  { at: 0.1, label: "Untangle" },
  { at: 0.36, label: "Build" },
  { at: 0.66, label: "Ship" },
];

type Box = { x: number; y: number; w: number; h: number; r?: number };

/* ---------------- the real world (left) and its software twin (right) ---------------- */

const fs = (n: number) => ({ fontSize: `${n}cqmin` });

export function StickyReal() {
  return (
    <div
      className="absolute inset-0 rounded-[2px] shadow-[0_18px_30px_-14px_rgba(0,0,0,0.8)]"
      style={{ background: "linear-gradient(160deg,#FEF08A,#FACC15)" }}
    >
      <span className="absolute -top-[7%] left-1/2 -translate-x-1/2 w-[44%] h-[15%] bg-white/45 -rotate-[4deg]" />
      <div
        className="font-hand text-[#3b2f0a] leading-[1.02] px-[11%] pt-[16%]"
        style={fs(19)}
      >
        call back
        <br />3 customers!!
      </div>
      <div className="font-hand text-red-700 px-[11%] mt-[4%]" style={fs(15)}>
        order stock?
      </div>
      <span
        className="absolute right-0 bottom-0 w-[20%] h-[20%]"
        style={{
          background:
            "linear-gradient(to top left, rgba(0,0,0,0.28) 50%, transparent 50%)",
        }}
      />
    </div>
  );
}

export function PhoneReal() {
  return (
    <div className="absolute inset-0 rounded-[16cqmin] bg-[#0d1117] border-[2px] border-[#2a3242] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.85)]">
      <div className="absolute inset-[5%] rounded-[12cqmin] bg-gradient-to-b from-[#312e81] to-[#0f172a] flex flex-col items-center pt-[16%] gap-[4%] overflow-hidden">
        <span className="absolute top-[2.5%] left-1/2 -translate-x-1/2 w-[36%] h-[4%] rounded-full bg-black" />
        <span
          className="font-semibold text-white/90 leading-none"
          style={fs(24)}
        >
          9:41
        </span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[86%] rounded-[5cqmin] bg-white/10 px-[7%] py-[5%] flex items-center gap-[6%] text-white/85"
            style={fs(8.5)}
          >
            <PhoneMissed
              className="shrink-0 text-red-400"
              style={{ width: "11cqmin", height: "11cqmin" }}
            />
            Missed call
          </span>
        ))}
      </div>
    </div>
  );
}

export function SheetReal() {
  return (
    <div
      className="absolute inset-0 rounded-[2px] overflow-hidden shadow-[0_18px_30px_-14px_rgba(0,0,0,0.8)]"
      style={{
        background:
          "repeating-linear-gradient(90deg, transparent 0 calc(20% - 1px), #CBD5E1 calc(20% - 1px) 20%), repeating-linear-gradient(transparent 0 calc(12% - 1px), #CBD5E1 calc(12% - 1px) 12%), #F8FAFC",
      }}
    >
      <div className="h-[12%] bg-[#16A34A]" />
      {[
        ["1,240", 22, 26],
        ["980", 42, 38],
        ["2,115", 62, 50],
        ["#REF!", 22, 62],
        ["740", 82, 74],
      ].map(([t, x, y]) => (
        <span
          key={String(t)}
          className="absolute font-mono text-slate-500"
          style={{ left: `${x}%`, top: `${y}%`, ...fs(6.5) }}
        >
          {t}
        </span>
      ))}
      <span className="absolute left-[20%] top-[37%] w-[48%] h-[9%] bg-yellow-300/70 -rotate-2" />
      <span className="absolute right-[7%] top-[56%] w-[32%] h-[18%] rounded-[50%] border-2 border-red-500 -rotate-6" />
      <span
        className="absolute right-[10%] top-[76%] font-hand text-red-600 -rotate-6"
        style={fs(15)}
      >
        why??
      </span>
      <span className="absolute left-[7%] bottom-[5%] w-[30%] aspect-square rounded-full border-[3cqmin] border-[#92400e]/30" />
    </div>
  );
}

export function NotebookReal() {
  return (
    <div
      className="absolute inset-0 rounded-[2px] overflow-hidden shadow-[0_18px_30px_-14px_rgba(0,0,0,0.8)]"
      style={{
        background:
          "repeating-linear-gradient(transparent 0 calc(13% - 1px), #BFDBFE calc(13% - 1px) 13%), #FFFDF5",
      }}
    >
      <div className="absolute -top-[2%] inset-x-[8%] flex justify-between">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            className="w-[6%] aspect-square rounded-full bg-[#334155] ring-2 ring-[#94A3B8]"
          />
        ))}
      </div>
      <span className="absolute left-[14%] inset-y-0 w-px bg-red-300" />
      <div
        className="absolute left-[18%] top-[14%] font-hand text-[#1e3a8a] leading-[1.25]"
        style={fs(13)}
      >
        <div>5pm · Court 2</div>
        <div className="line-through decoration-red-500 decoration-2">
          6pm · Court 2
        </div>
        <div className="text-red-600">6pm · Court 2 ?!</div>
        <div>7pm · ???</div>
      </div>
    </div>
  );
}

const ZIGZAG = `polygon(0 0, 100% 0, ${Array.from({ length: 13 }, (_, i) => `${100 - i * 8.33}% ${i % 2 ? 100 : 96}%`).join(", ")})`;

export function ReceiptReal() {
  return (
    <div
      className="absolute inset-0 drop-shadow-[0_14px_14px_rgba(0,0,0,0.6)]"
      style={{
        clipPath: ZIGZAG,
        background:
          "linear-gradient(170deg,#FAFAF5 0 30%,#ECECE4 31% 55%,#F7F7F1 56%)",
      }}
    >
      <div className="px-[12%] pt-[10%] flex flex-col gap-[4%]">
        <span className="self-center h-[2.5cqmin] w-[50%] bg-slate-400 rounded-full mb-[4%]" />
        {[70, 55, 80, 60, 75, 50].map((w, i) => (
          <span key={i} className="flex justify-between">
            <span
              className="h-[2cqmin] bg-slate-400/70 rounded-full"
              style={{ width: `${w * 0.6}%` }}
            />
            <span className="h-[2cqmin] w-[18%] bg-slate-400/70 rounded-full" />
          </span>
        ))}
      </div>
      <div
        className="absolute left-[12%] bottom-[14%] font-hand text-red-600 leading-none -rotate-3"
        style={fs(20)}
      >
        total ₹??
      </div>
    </div>
  );
}

export function ClockReal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[80%] aspect-square drop-shadow-[0_14px_14px_rgba(0,0,0,0.6)]">
        <span className="absolute -top-[2%] left-[4%] w-[30%] aspect-square rounded-full bg-red-500 -rotate-12" />
        <span className="absolute -top-[2%] right-[4%] w-[30%] aspect-square rounded-full bg-red-500 rotate-12" />
        <span className="absolute bottom-0 left-[18%] w-[8%] h-[14%] bg-red-700 rotate-[25deg] rounded" />
        <span className="absolute bottom-0 right-[18%] w-[8%] h-[14%] bg-red-700 -rotate-[25deg] rounded" />
        <div className="absolute inset-[9%] rounded-full bg-[#FEF2F2] border-[4cqmin] border-red-500">
          <span className="absolute left-1/2 top-1/2 w-[4%] h-[34%] bg-slate-800 rounded-full origin-bottom -translate-x-1/2 -translate-y-full rotate-[40deg]" />
          <span className="absolute left-1/2 top-1/2 w-[4%] h-[26%] bg-slate-800 rounded-full origin-bottom -translate-x-1/2 -translate-y-full -rotate-[70deg]" />
          <span className="absolute left-1/2 top-1/2 w-[9%] aspect-square rounded-full bg-slate-800 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <span
        className="absolute right-[-4%] bottom-[-2%] font-hand text-red-500 rotate-12"
        style={fs(18)}
      >
        late!
      </span>
    </div>
  );
}

function AppCard({
  icon: Icon,
  title,
  accent,
  chip,
  children,
}: {
  icon: LucideIcon;
  title: string;
  accent: string;
  chip?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 rounded-[7cqmin] border flex flex-col overflow-hidden"
      style={{
        padding: "7cqmin",
        gap: "5cqmin",
        borderColor: `${accent}40`,
        background: `radial-gradient(120% 90% at 100% 0%, ${accent}22, transparent 55%), #0B1222`,
      }}
    >
      <div className="flex items-center" style={{ gap: "4cqmin" }}>
        <span
          className="rounded-[3cqmin] flex items-center justify-center shrink-0"
          style={{
            width: "13cqmin",
            height: "13cqmin",
            background: `${accent}26`,
          }}
        >
          <Icon style={{ width: "8cqmin", height: "8cqmin", color: accent }} />
        </span>
        <span className="font-semibold text-bone truncate" style={fs(9)}>
          {title}
        </span>
        {chip && (
          <span
            className="ml-auto rounded-full font-semibold"
            style={{
              ...fs(7),
              padding: "1cqmin 3.5cqmin",
              color: accent,
              background: `${accent}1f`,
            }}
          >
            {chip}
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
}

export function TasksApp() {
  return (
    <AppCard icon={ListChecks} title="Follow-ups" accent="#34D399">
      <div className="flex-1 flex flex-col justify-evenly">
        {[78, 60, 70].map((w, i) => (
          <div
            key={i}
            className="flex items-center rounded-[3cqmin] bg-void/60 border border-line"
            style={{ gap: "4cqmin", padding: "3cqmin 4cqmin" }}
          >
            <span
              className="rounded-full bg-emerald-400 flex items-center justify-center shrink-0"
              style={{ width: "8cqmin", height: "8cqmin" }}
            >
              <Check
                className="text-void"
                style={{ width: "6cqmin", height: "6cqmin" }}
                strokeWidth={3}
              />
            </span>
            <span
              className="rounded-full bg-bone/30"
              style={{ width: `${w}%`, height: "2.6cqmin" }}
            />
          </div>
        ))}
      </div>
    </AppCard>
  );
}

export function ChatApp() {
  return (
    <AppCard icon={Bot} title="Booking bot" accent="#60A5FA">
      <div
        className="flex-1 flex flex-col justify-center"
        style={{ gap: "4cqmin", ...fs(7.5) }}
      >
        <span
          className="self-start rounded-[4cqmin] bg-panel-2 border border-line text-bone/85"
          style={{ padding: "2.5cqmin 4cqmin" }}
        >
          Slot at 7?
        </span>
        <span
          className="self-end rounded-[4cqmin] bg-accent text-white"
          style={{ padding: "2.5cqmin 4cqmin" }}
        >
          Booked ✓ 7 PM
        </span>
        <span className="self-end text-emerald-300/90" style={fs(6)}>
          replied in 2s
        </span>
      </div>
    </AppCard>
  );
}

export function ChartApp() {
  return (
    <AppCard icon={TrendingUp} title="Revenue" accent="#34D399" chip="+24%">
      <svg
        viewBox="0 0 200 70"
        preserveAspectRatio="none"
        className="w-full flex-1"
      >
        <defs>
          <linearGradient id="flip-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 60 C 20 55, 30 58, 45 48 S 75 44, 90 40 S 120 30, 135 32 S 165 18, 200 8 L 200 70 L 0 70 Z"
          fill="url(#flip-area)"
        />
        <path
          d="M0 60 C 20 55, 30 58, 45 48 S 75 44, 90 40 S 120 30, 135 32 S 165 18, 200 8"
          fill="none"
          stroke="#34D399"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="200" cy="8" r="3" fill="#34D399" />
      </svg>
    </AppCard>
  );
}

export function CalendarApp() {
  const filled = [1, 2, 5, 7, 8, 10];
  return (
    <AppCard icon={CalendarDays} title="Bookings" accent="#818CF8">
      <div className="flex-1 grid grid-cols-3" style={{ gap: "2.5cqmin" }}>
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="rounded-[2cqmin] border"
            style={{
              borderColor: filled.includes(i)
                ? "transparent"
                : "rgba(148,163,199,0.18)",
              background:
                i === 4
                  ? "#34D399"
                  : filled.includes(i)
                    ? "rgba(129,140,248,0.55)"
                    : "transparent",
            }}
          />
        ))}
      </div>
    </AppCard>
  );
}

export function InvoiceApp() {
  return (
    <AppCard icon={Receipt} title="Invoice" accent="#FBBF24">
      <div className="relative flex-1 flex flex-col justify-evenly">
        {[64, 48, 56].map((w, i) => (
          <span key={i} className="flex justify-between">
            <span
              className="rounded-full bg-bone/25"
              style={{ width: `${w}%`, height: "2.6cqmin" }}
            />
            <span
              className="rounded-full bg-bone/40"
              style={{ width: "16%", height: "2.6cqmin" }}
            />
          </span>
        ))}
        <span className="border-t border-line" />
        <span className="flex justify-between">
          <span
            className="rounded-full bg-amber-300/70"
            style={{ width: "30%", height: "3.2cqmin" }}
          />
          <span
            className="rounded-full bg-amber-300"
            style={{ width: "22%", height: "3.2cqmin" }}
          />
        </span>
        <span
          className="absolute right-0 top-[18%] rotate-[-14deg] rounded-[2cqmin] border-2 border-emerald-400 text-emerald-300 font-bold tracking-[0.15em]"
          style={{ ...fs(8), padding: "1cqmin 3cqmin" }}
        >
          PAID
        </span>
      </div>
    </AppCard>
  );
}

export function RemindersApp() {
  return (
    <AppCard icon={Bell} title="Reminders" accent="#F472B6">
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ gap: "5cqmin" }}
      >
        <span
          className="relative rounded-full bg-emerald-400"
          style={{ width: "34cqmin", height: "18cqmin" }}
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow"
            style={{ right: "2.5cqmin", width: "13cqmin", height: "13cqmin" }}
          />
        </span>
        <span
          className="text-emerald-300 font-semibold uppercase tracking-[0.18em]"
          style={fs(7)}
        >
          Auto · on time
        </span>
      </div>
    </AppCard>
  );
}

/* ---------------- layout: where each object lies on the desk, and where it lands in the app ---------------- */

type Item = {
  id: string;
  mess: { wide: Box; tall: Box };
  slot: { wide: Box; tall: Box };
  Real: React.FC;
  App: React.FC;
};

const ITEMS: Item[] = [
  {
    id: "tasks",
    Real: StickyReal,
    App: TasksApp,
    mess: {
      wide: { x: 20, y: 28, w: 12, h: 21, r: -14 },
      tall: { x: 25, y: 17, w: 27, h: 21.6, r: -12 },
    },
    slot: {
      wide: { x: 24, y: 34, w: 24, h: 38 },
      tall: { x: 27, y: 54.5, w: 44, h: 28 },
    },
  },
  {
    id: "chart",
    Real: SheetReal,
    App: ChartApp,
    mess: {
      wide: { x: 55, y: 31, w: 26, h: 40, r: 5 },
      tall: { x: 68, y: 22, w: 44, h: 30, r: 6 },
    },
    slot: {
      wide: { x: 66.5, y: 34, w: 57, h: 38 },
      tall: { x: 50, y: 25, w: 90, h: 26 },
    },
  },
  {
    id: "chat",
    Real: PhoneReal,
    App: ChatApp,
    mess: {
      wide: { x: 30, y: 70, w: 10, h: 35, r: 16 },
      tall: { x: 22, y: 52, w: 21, h: 33.6, r: 14 },
    },
    slot: {
      wide: { x: 24, y: 75, w: 24, h: 38 },
      tall: { x: 73, y: 54.5, w: 44, h: 28 },
    },
  },
  {
    id: "calendar",
    Real: NotebookReal,
    App: CalendarApp,
    mess: {
      wide: { x: 52, y: 74, w: 18, h: 34, r: -7 },
      tall: { x: 62, y: 56, w: 38, h: 27, r: -6 },
    },
    slot: {
      wide: { x: 47, y: 75, w: 18, h: 38 },
      tall: { x: 19.3, y: 83.5, w: 28.7, h: 25 },
    },
  },
  {
    id: "invoice",
    Real: ReceiptReal,
    App: InvoiceApp,
    mess: {
      wide: { x: 75, y: 66, w: 8.5, h: 42, r: 12 },
      tall: { x: 31, y: 83, w: 19, h: 28, r: 10 },
    },
    slot: {
      wide: { x: 66.5, y: 75, w: 18, h: 38 },
      tall: { x: 50, y: 83.5, w: 28.7, h: 25 },
    },
  },
  {
    id: "reminders",
    Real: ClockReal,
    App: RemindersApp,
    mess: {
      wide: { x: 85, y: 28, w: 11, h: 19.25, r: -8 },
      tall: { x: 75, y: 84, w: 24, h: 19.2, r: -8 },
    },
    slot: {
      wide: { x: 86, y: 75, w: 18, h: 38 },
      tall: { x: 80.7, y: 83.5, w: 28.7, h: 25 },
    },
  },
];

const FRAME = {
  wide: { x: 3, y: 4, w: 94, h: 92, bar: 8.5, side: 7 },
  tall: { x: 2, y: 2, w: 96, h: 96, bar: 7.5, side: 0 },
};

function Card({
  p,
  item,
  i,
  wide,
}: {
  p: MotionValue<number>;
  item: Item;
  i: number;
  wide: boolean;
}) {
  const m = wide ? item.mess.wide : item.mess.tall;
  const s = wide ? item.slot.wide : item.slot.tall;
  const u = (v: number) => smooth(seg(v, 0.1 + i * 0.014, 0.32 + i * 0.014));
  const f0 = 0.36 + i * 0.045;
  const f = (v: number) => seg(v, f0, f0 + 0.11);
  // Size changes while the card is edge-on, so the swap is invisible.
  const k = (v: number) => smooth(seg(f(v), 0.32, 0.68));
  const left = useTransform(p, (v) => `${lerp(m.x, s.x, u(v))}%`);
  const top = useTransform(p, (v) => `${lerp(m.y, s.y, u(v))}%`);
  const width = useTransform(p, (v) => `${lerp(m.w, s.w, k(v))}%`);
  const height = useTransform(p, (v) => `${lerp(m.h, s.h, k(v))}%`);
  const rotateZ = useTransform(p, (v) => (m.r ?? 0) * (1 - u(v)));
  const z = useTransform(
    p,
    (v) => Math.sin(u(v) * Math.PI) * 70 + Math.sin(f(v) * Math.PI) * 60,
  );
  const rotateY = useTransform(p, (v) => f(v) * 180);
  const wobble = useTransform(p, (v) => 1 - seg(v, 0.04, 0.12));
  const glint = useTransform(
    p,
    (v) => `${lerp(-60, 160, seg(v, f0 + 0.1, f0 + 0.16))}%`,
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width,
        height,
        x: "-50%",
        y: "-50%",
        rotateZ,
        z,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="flip-wobble relative w-full h-full"
        style={
          {
            ["--w" as string]: wobble,
            transformStyle: "preserve-3d",
            animationDelay: `${-i * 0.6}s`,
          } as never
        }
      >
        <motion.div
          className="relative w-full h-full"
          style={{ rotateY, transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden] [container-type:size]">
            <item.Real />
          </div>
          <div
            className="absolute inset-0 [backface-visibility:hidden] [container-type:size] overflow-hidden rounded-[7cqmin]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <item.App />
            <motion.span
              className="pointer-events-none absolute inset-y-0 w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              style={{ left: glint }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- heading words that react to the scroll ---------------- */

function ProblemWords({ p }: { p: MotionValue<number> }) {
  // The squiggle under "real-world problems" straightens out as the mess is untangled.
  const d = useTransform(p, (v) => {
    const t = smooth(seg(v, 0.08, 0.34));
    const pts = Array.from({ length: 25 }, (_, i) => {
      const x = (i / 24) * 300;
      const y =
        10 + Math.sin(i * 1.7) * 7 * (1 - t) + Math.cos(i * 0.9) * 3 * (1 - t);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    return pts.join(" ");
  });
  const stroke = useTransform(p, [0.08, 0.34], ["#FB923C", "#60A5FA"]);
  return (
    <span className="relative inline-block whitespace-nowrap text-orange-300">
      real-world problems
      <svg
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
        className="absolute left-0 -bottom-[0.28em] w-full h-[0.4em] overflow-visible"
        aria-hidden
      >
        <motion.path
          d={d}
          fill="none"
          style={{ stroke }}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

function SoftwareWords({ p }: { p: MotionValue<number> }) {
  const clip = useTransform(
    p,
    (v) => `inset(0 ${100 - seg(v, 0.6, 0.86) * 100}% 0 0)`,
  );
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="text-[#2b3650]">working software.</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-neon via-accent-soft to-emerald-300 bg-clip-text text-transparent"
        style={{ clipPath: clip }}
      >
        working software.
      </motion.span>
    </span>
  );
}

/* ---------------- the stage ---------------- */

function Stage({
  p,
  wide,
  size,
}: {
  p: MotionValue<number>;
  wide: boolean;
  size: { w: number; h: number };
}) {
  const F = wide ? FRAME.wide : FRAME.tall;
  const U = (v: number) => smooth(seg(v, 0.08, 0.34));

  // Pointer tilt adds a little life on top of the scroll-driven camera.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotateX = useTransform(
    [p, sy] as MotionValue[],
    ([v, y]: number[]) => lerp(wide ? 52 : 40, 0, U(v)) + y * 4,
  );
  const rotateY = useTransform(sx, (x) => x * 5);
  const rotateZ = useTransform(p, (v) => lerp(wide ? -14 : -8, 0, U(v)));
  const scale = useTransform(p, (v) => lerp(wide ? 0.9 : 0.9, 1, U(v)));

  const deskOpacity = useTransform(p, (v) => 1 - seg(v, 0.3, 0.62));
  const planOpacity = useTransform(
    p,
    (v) => seg(v, 0.13, 0.26) * (1 - seg(v, 0.5, 0.66)),
  );
  const chrome = useTransform(p, (v) => smooth(seg(v, 0.64, 0.76)));
  const chromeScale = useTransform(chrome, (c) => lerp(1.05, 1, c));
  const clicked = useTransform(p, (v) => seg(v, 0.775, 0.79));
  const deploy = useTransform(clicked, (c) => 1 - c);
  const pulse = useTransform(p, (v) => seg(v, 0.78, 0.9));
  const pulseScale = useTransform(pulse, (t) => 1 + t * 0.06);
  const pulseOpacity = useTransform(pulse, (t) => (t > 0 && t < 1 ? 1 - t : 0));
  const glow = useTransform(p, (v) => {
    const g = seg(v, 0.78, 0.84);
    return `0 0 0 1px rgba(52,211,153,${0.15 + g * 0.35}), 0 40px 120px -30px rgba(52,211,153,${g * 0.55})`;
  });
  const url = useTransform(
    p,
    (v) => `inset(0 ${100 - seg(v, 0.68, 0.76) * 100}% 0 0)`,
  );
  // A cursor glides in and presses "Deploy".
  const cx = useTransform(
    p,
    (v) => `${lerp(70, F.x + F.w - 7, smooth(seg(v, 0.7, 0.775)))}%`,
  );
  const cy = useTransform(
    p,
    (v) =>
      `${lerp(wide ? 70 : 60, F.y + F.bar / 2 + 1, smooth(seg(v, 0.7, 0.775)))}%`,
  );
  const cursorOpacity = useTransform(
    p,
    (v) => seg(v, 0.69, 0.71) * (1 - seg(v, 0.84, 0.88)),
  );
  const cursorScale = useTransform(p, (v) =>
    v > 0.772 && v < 0.79 ? 0.82 : 1,
  );

  const onMove = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(-((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <div
      className="relative mx-auto"
      style={{ width: size.w, height: size.h, perspective: wide ? 1600 : 1100 }}
      onPointerMove={onMove}
      onPointerLeave={() => (mx.set(0), my.set(0))}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          rotateX,
          rotateY,
          rotateZ,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* The desk */}
        <motion.div
          className="absolute inset-[1%] rounded-[2.2cqmin] [container-type:size]"
          style={{
            opacity: deskOpacity,
            z: -6,
            background:
              "radial-gradient(80% 70% at 30% 20%, rgba(255,214,170,0.10), transparent 60%), repeating-linear-gradient(100deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(135deg,#3a2718,#22160e 60%,#1a110b)",
            boxShadow:
              "0 50px 80px -30px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        />
        {/* The plan: blueprint grid + dashed slots */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: planOpacity, z: -3 }}
        >
          <div className="absolute inset-[1%] rounded-xl grid-bg opacity-70" />
          {ITEMS.map((it) => {
            const s = wide ? it.slot.wide : it.slot.tall;
            return (
              <span
                key={it.id}
                className="absolute rounded-xl border border-dashed border-neon/60 bg-neon/[0.04]"
                style={{
                  left: `${s.x - s.w / 2}%`,
                  top: `${s.y - s.h / 2}%`,
                  width: `${s.w}%`,
                  height: `${s.h}%`,
                }}
              />
            );
          })}
        </motion.div>
        {/* The app frame */}
        <motion.div
          className="absolute rounded-2xl bg-[#070b16]/95 border border-line-strong overflow-hidden"
          style={{
            left: `${F.x}%`,
            top: `${F.y}%`,
            width: `${F.w}%`,
            height: `${F.h}%`,
            opacity: chrome,
            scale: chromeScale,
            z: -2,
            boxShadow: glow,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 flex items-center gap-2 px-3 border-b border-line bg-panel/60"
            style={{ height: `${(F.bar / F.h) * 100}%` }}
          >
            <span className="w-2 h-2 rounded-full bg-red-400/70" />
            <span className="w-2 h-2 rounded-full bg-amber-300/70" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
            <span className="ml-2 flex-1 max-w-[260px] h-[62%] rounded-md bg-void/70 border border-line flex items-center gap-1.5 px-2 overflow-hidden">
              <Lock className="w-3 h-3 shrink-0 text-emerald-300" />
              <motion.span
                className="font-mono text-[10px] sm:text-[11px] text-dim whitespace-nowrap"
                style={{ clipPath: url }}
              >
                yourbusiness.app
              </motion.span>
            </span>
            <span className="relative ml-auto h-[62%] min-w-[64px] sm:min-w-[74px]">
              <motion.span
                style={{ opacity: deploy }}
                className="absolute inset-0 rounded-md bg-accent text-white text-[10px] sm:text-[11px] font-semibold flex items-center justify-center"
              >
                Deploy
              </motion.span>
              <motion.span
                style={{ opacity: clicked }}
                className="absolute inset-0 rounded-md bg-emerald-400/15 border border-emerald-400/50 text-emerald-300 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                Live
              </motion.span>
            </span>
          </div>
          {F.side > 0 && (
            <div
              className="absolute left-0 bottom-0 border-r border-line flex flex-col items-center gap-3 pt-4"
              style={{
                top: `${(F.bar / F.h) * 100}%`,
                width: `${(F.side / F.w) * 100}%`,
              }}
            >
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-neon" />
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-5 h-5 rounded-md ${i === 0 ? "bg-accent/30" : "bg-panel-2"}`}
                />
              ))}
            </div>
          )}
        </motion.div>
        <motion.span
          className="pointer-events-none absolute rounded-2xl border-2 border-emerald-300"
          style={{
            left: `${F.x}%`,
            top: `${F.y}%`,
            width: `${F.w}%`,
            height: `${F.h}%`,
            scale: pulseScale,
            opacity: pulseOpacity,
          }}
        />

        {ITEMS.map((it, i) => (
          <Card key={it.id} p={p} item={it} i={i} wide={wide} />
        ))}

        <motion.svg
          viewBox="0 0 24 24"
          className="absolute w-6 h-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          style={{
            left: cx,
            top: cy,
            opacity: cursorOpacity,
            scale: cursorScale,
            z: 120,
          }}
        >
          <path
            d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.3 13.6 L17.5 13.4 Z"
            fill="#fff"
            stroke="#0b1020"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

function Steps({ p }: { p: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const a = STEPS.reduce((acc, s, i) => (v >= s.at ? i : acc), 0);
    setActive((prev) => (prev === a ? prev : a));
  });
  const fill = useTransform(p, (v) => seg(v, 0, 0.84));
  return (
    <div className="mx-auto w-full max-w-[520px] pr-12 sm:pr-0">
      <div className="relative">
        <div className="absolute left-[12.5%] right-[12.5%] top-[5px] h-px bg-line-strong">
          <motion.div
            className="absolute inset-0 origin-left bg-gradient-to-r from-orange-400 via-accent to-emerald-400"
            style={{ scaleX: fill }}
          />
        </div>
        <div className="relative grid grid-cols-4">
          {STEPS.map((s, i) => {
            const c = i === 0 ? "#FB923C" : i === 3 ? "#34D399" : "#60A5FA";
            return (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <span
                  className="w-[11px] h-[11px] rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: i <= active ? c : "rgba(148,163,199,0.3)",
                    background: i === active ? c : "#070a12",
                    boxShadow: i === active ? `0 0 12px ${c}` : "none",
                  }}
                />
                <span
                  className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${i === active ? "text-bone" : "text-faint"}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ProblemFlip() {
  const track = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const [wide, setWide] = useState(true);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const isWide = window.innerWidth >= 768;
      const ratio = isWide ? 1.75 : 0.8;
      const w = Math.min(el.clientWidth, el.clientHeight * ratio);
      setWide(isWide);
      setSize({ w: Math.round(w), h: Math.round(w / ratio) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const warm = useTransform(p, (v) => 1 - seg(v, 0.25, 0.8));
  const cool = useTransform(p, (v) => seg(v, 0.25, 0.8));

  return (
    <section id="approach" className="relative border-t border-line">
      <div ref={track} className="relative h-[420vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div
            style={{ opacity: warm }}
            className="pointer-events-none absolute -top-40 left-[10%] w-[700px] h-[520px] rounded-full bg-orange-500/[0.13] blur-[120px]"
          />
          <motion.div
            style={{ opacity: cool }}
            className="pointer-events-none absolute bottom-[-10%] right-[5%] w-[760px] h-[560px] rounded-full bg-emerald-400/[0.12] blur-[130px]"
          />
          <motion.div
            style={{ opacity: cool }}
            className="pointer-events-none absolute top-[20%] left-[30%] w-[600px] h-[420px] rounded-full bg-accent/[0.10] blur-[120px]"
          />

          <div className="relative h-full w-full max-w-[1240px] mx-auto px-5 sm:px-10 pt-20 sm:pt-24 pb-5 sm:pb-7 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent-soft">02</span>
              <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
              <span className="eyebrow !text-faint">What I do</span>
            </div>
            <h2 className="mt-3 font-semibold text-[1.75rem] sm:text-5xl leading-[1.12] tracking-tight text-bone text-balance">
              I turn <ProblemWords p={p} /> into <SoftwareWords p={p} />
            </h2>

            <div
              ref={box}
              className="relative flex-1 min-h-0 my-4 sm:my-6 flex items-center justify-center"
            >
              {size.w > 0 && (
                <Stage key={wide ? "w" : "t"} p={p} wide={wide} size={size} />
              )}
            </div>

            <Steps p={p} />
          </div>
        </div>
      </div>
    </section>
  );
}
