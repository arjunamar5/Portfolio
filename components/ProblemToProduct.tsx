"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Each real-world problem (from an actual project) and the solution it became.
const PAIRS = [
  { short: "Double-booked courts", problem: "Courts double-booked over phone calls", solution: "Real-time court blocking + WhatsApp booking", project: "CueCourtOS" },
  { short: "Paper registers", problem: "Attendance & fees kept in paper registers", solution: "Automated attendance, fees & seating", project: "Perfect Study Space" },
  { short: "Black-box AI", problem: "Black-box AI that doctors can't trust", solution: "Explainable Grad-CAM + local RAG insights", project: "Brain Tumor AI" },
  { short: "Trip-planning overload", problem: "Trip planning feels overwhelming", solution: "Compass AI builds a personalized itinerary", project: "AlpenGlow Global" },
  { short: "Circling for parking", problem: "Drivers circling for a free parking spot", solution: "Live IoT slot map with pre-booking", project: "QuickPark" },
];

const ACTS = [
  {
    label: "Problem",
    title: "It starts with a messy, real-world problem.",
    sub: "Double bookings. Paper registers. Black-box AI. Too many choices.",
  },
  {
    label: "Code",
    title: "I untangle it — and engineer the fix in code.",
    sub: "Model the data, automate the busywork, add AI where it truly helps.",
  },
  {
    label: "Product",
    title: "Out comes a product people actually use.",
    sub: "Five real problems. Five shipped solutions.",
  },
];

// Palette pairs: each particle travels from a warm "problem" hue to a cool "solution" hue.
const WARM: [number, number, number][] = [
  [249, 115, 22],
  [239, 68, 68],
  [245, 158, 11],
];
const COOL: [number, number, number][] = [
  [59, 130, 246],
  [34, 211, 238],
  [96, 165, 250],
];
const MIX_STEPS = 16;
const COLOR_TABLE = WARM.map((w, j) =>
  Array.from({ length: MIX_STEPS + 1 }, (_, s) => {
    const k = s / MIX_STEPS;
    const c = COOL[j];
    return `rgb(${Math.round(w[0] + (c[0] - w[0]) * k)},${Math.round(w[1] + (c[1] - w[1]) * k)},${Math.round(w[2] + (c[2] - w[2]) * k)})`;
  })
);

type Rect = { x: number; y: number; w: number; h: number };
type Layout = {
  W: number;
  H: number;
  mobile: boolean;
  chaos: { cx: number; cy: number; rx: number; ry: number };
  core: { x: number; y: number };
  cards: Rect[];
  slots: { x: number; y: number; rot: number }[];
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function computeLayout(W: number, H: number): Layout {
  const mobile = W < 768;
  if (mobile) {
    const ch = 34;
    const gap = 6;
    const y0 = H - 84 - (PAIRS.length * ch + (PAIRS.length - 1) * gap); // clear of the back-to-top button
    const cards = PAIRS.map((_, i) => ({ x: 16, y: y0 + i * (ch + gap), w: W - 32, h: ch }));
    const core = { x: W * 0.5, y: y0 - 58 };
    const zoneTop = Math.max(160, H * 0.07 + 110); // below the headline
    const zoneBottom = core.y - 56;
    const spacing = Math.min(44, (zoneBottom - zoneTop - 26) / (PAIRS.length - 1));
    const chaos = { cx: W * 0.5, cy: (zoneTop + zoneBottom) / 2, rx: W * 0.44, ry: (zoneBottom - zoneTop) / 2 + 12 };
    const slots = PAIRS.map((_, i) => ({ x: W * (i % 2 === 0 ? 0.3 : 0.7), y: zoneTop + 13 + i * spacing, rot: i % 2 ? 3 : -3 }));
    return { W, H, mobile, chaos, core, cards, slots };
  }
  const chaos = { cx: W * 0.2, cy: H * 0.6, rx: Math.min(W * 0.15, 230), ry: H * 0.2 };
  const core = { x: W * 0.47, y: H * 0.6 };
  const cw = Math.min(W * 0.36, 480);
  const ch = 50;
  const gap = 12;
  const total = PAIRS.length * ch + (PAIRS.length - 1) * gap;
  const x0 = Math.min(W * 0.6, W - cw - 40);
  const y0 = core.y - total / 2;
  const cards = PAIRS.map((_, i) => ({ x: x0, y: y0 + i * (ch + gap), w: cw, h: ch }));
  const off = [
    [-0.35, -0.95, -4],
    [0.55, -0.5, 3],
    [-0.55, 0.0, 2],
    [0.45, 0.45, -3],
    [-0.2, 0.95, 4],
  ];
  const slots = off.map(([ox, oy, rot]) => ({ x: chaos.cx + ox * chaos.rx, y: chaos.cy + oy * chaos.ry, rot }));
  return { W, H, mobile, chaos, core, cards, slots };
}

/** Evenly spaced points along a rounded rectangle's outline. */
function roundedRectPoints(r: Rect, radius: number, count: number) {
  const straightW = r.w - 2 * radius;
  const straightH = r.h - 2 * radius;
  const arc = (Math.PI / 2) * radius;
  const perim = 2 * straightW + 2 * straightH + 4 * arc;
  const pts: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    let d = (i / count) * perim;
    const segs: [number, (t: number) => [number, number]][] = [
      [straightW, (t) => [r.x + radius + t, r.y]],
      [arc, (t) => { const a = -Math.PI / 2 + t / radius; return [r.x + r.w - radius + Math.cos(a) * radius, r.y + radius + Math.sin(a) * radius]; }],
      [straightH, (t) => [r.x + r.w, r.y + radius + t]],
      [arc, (t) => { const a = t / radius; return [r.x + r.w - radius + Math.cos(a) * radius, r.y + r.h - radius + Math.sin(a) * radius]; }],
      [straightW, (t) => [r.x + r.w - radius - t, r.y + r.h]],
      [arc, (t) => { const a = Math.PI / 2 + t / radius; return [r.x + radius + Math.cos(a) * radius, r.y + r.h - radius + Math.sin(a) * radius]; }],
      [straightH, (t) => [r.x, r.y + r.h - radius - t]],
      [arc, (t) => { const a = Math.PI + t / radius; return [r.x + radius + Math.cos(a) * radius, r.y + radius + Math.sin(a) * radius]; }],
    ];
    for (const [len, fn] of segs) {
      if (d <= len) {
        pts.push(fn(d));
        break;
      }
      d -= len;
    }
  }
  return pts;
}

type Particle = {
  cx: number; cy: number; // chaos home
  tx: number; ty: number; // ordered target
  card: number;
  delay: number;
  a1: number; a2: number; f1: number; f2: number; p1: number; p2: number;
  pal: number;
  size: number;
};

function buildParticles(L: Layout): Particle[] {
  const N = L.mobile ? 640 : 1300;
  const perCard = Math.floor(N / PAIRS.length);
  const out: Particle[] = [];
  L.cards.forEach((rect, k) => {
    const accentCount = Math.floor(perCard * 0.14);
    const outline = roundedRectPoints(rect, 12, perCard - accentCount);
    const accent: [number, number][] = Array.from({ length: accentCount }, (_, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2) / Math.max(1, Math.ceil(accentCount / 2) - 1);
      return [rect.x + 13 + col * 2, rect.y + 11 + row * (rect.h - 22)];
    });
    [...outline, ...accent].forEach(([tx, ty]) => {
      // Gaussian-ish scatter inside the chaos ellipse.
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * (0.55 + Math.random() * 0.5);
      out.push({
        cx: L.chaos.cx + Math.cos(ang) * rad * L.chaos.rx,
        cy: L.chaos.cy + Math.sin(ang) * rad * L.chaos.ry,
        tx,
        ty,
        card: k,
        delay: (k / PAIRS.length) * 0.8 + Math.random() * 0.2,
        a1: 6 + Math.random() * 16,
        a2: 6 + Math.random() * 16,
        f1: 0.6 + Math.random() * 1.6,
        f2: 0.6 + Math.random() * 1.6,
        p1: Math.random() * 6.28,
        p2: Math.random() * 6.28,
        pal: Math.floor(Math.random() * 3),
        size: 1.3 + Math.random() * 0.9,
      });
    });
  });
  return out;
}

/** A few looping scribbles through the chaos zone — the "tangle". */
function buildScribbles(L: Layout) {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 16 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * 0.95;
      return { x: L.chaos.cx + Math.cos(ang) * rad * L.chaos.rx, y: L.chaos.cy + Math.sin(ang) * rad * L.chaos.ry, ph: Math.random() * 6.28 };
    })
  );
}

// Scroll progress p → morph progress m (the stream runs through the middle of the section).
const M_START = 0.22;
const M_END = 0.88;
const cardFormedAt = (k: number) => 0.62 + 0.35 * ((k / PAIRS.length) * 0.8 + 0.1);
const problemPullAt = (k: number) => (k / PAIRS.length) * 0.8 * 0.35;

export function ProblemToProduct() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const strikeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [act, setAct] = useState(0);
  const [done, setDone] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setAct(p < 0.3 ? 0 : p < 0.64 ? 1 : 2);
    setDone(p > 0.88);
  });

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stage || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let L = computeLayout(stage.clientWidth, stage.clientHeight);
    let particles = buildParticles(L);
    let scribbles = buildScribbles(L);
    let raf = 0;
    let running = false;
    let lastW = 0;
    let lastH = 0;

    const size = () => {
      L = computeLayout(stage.clientWidth, stage.clientHeight);
      lastW = L.W;
      lastH = L.H;
      canvas.width = L.W * dpr;
      canvas.height = L.H * dpr;
      canvas.style.width = `${L.W}px`;
      canvas.style.height = `${L.H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(L);
      scribbles = buildScribbles(L);
      setLayout(L);
    };
    size();

    const frame = (now: number) => {
      const time = reduce ? 0 : now / 1000;
      const p = scrollYProgress.get();
      const m = remap(p, M_START, M_END);
      const { W, H, core } = L;
      ctx.clearRect(0, 0, W, H);

      // The tangle: scribbled loops that fade as the problems get pulled in.
      const tangle = 1 - remap(m, 0, 0.45);
      if (tangle > 0) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(249,115,22,${0.28 * tangle})`;
        for (const pts of scribbles) {
          ctx.beginPath();
          const q = pts.map((pt) => [pt.x + Math.sin(time * 0.8 + pt.ph) * 8, pt.y + Math.cos(time * 0.7 + pt.ph) * 8]);
          ctx.moveTo((q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2);
          for (let i = 1; i < q.length; i++) {
            const n = q[(i + 1) % q.length];
            ctx.quadraticCurveTo(q[i][0], q[i][1], (q[i][0] + n[0]) / 2, (q[i][1] + n[1]) / 2);
          }
          ctx.stroke();
        }
      }

      // Flow intensity through the core peaks mid-transition.
      const flow = Math.sin(Math.PI * clamp(m * 1.05));
      const glowR = 70 + flow * 110;
      const g = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, glowR);
      g.addColorStop(0, `rgba(125,211,252,${0.18 + flow * 0.35})`);
      g.addColorStop(0.4, `rgba(59,130,246,${0.08 + flow * 0.18})`);
      g.addColorStop(1, "rgba(59,130,246,0)");
      ctx.fillStyle = g;
      ctx.fillRect(core.x - glowR, core.y - glowR, glowR * 2, glowR * 2);

      // Beams from the core to every card that has formed.
      L.cards.forEach((c, k) => {
        const f = L.mobile ? remap(m, cardFormedAt(k) - 0.08, cardFormedAt(k)) : remap(m, cardFormedAt(k) - 0.3, cardFormedAt(k) - 0.18);
        if (f <= 0) return;
        const ex = c.x - 4;
        const ey = c.y + c.h / 2;
        ctx.strokeStyle = `rgba(96,165,250,${0.22 * f})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.bezierCurveTo(core.x + (ex - core.x) * 0.5, core.y, core.x + (ex - core.x) * 0.5, ey, ex, ey);
        ctx.stroke();
        if (!reduce) {
          const t = (time * 0.6 + k * 0.2) % 1;
          const bx = Math.pow(1 - t, 3) * core.x + 3 * Math.pow(1 - t, 2) * t * (core.x + (ex - core.x) * 0.5) + 3 * (1 - t) * t * t * (core.x + (ex - core.x) * 0.5) + t * t * t * ex;
          const by = Math.pow(1 - t, 3) * core.y + 3 * Math.pow(1 - t, 2) * t * core.y + 3 * (1 - t) * t * t * ey + t * t * t * ey;
          ctx.fillStyle = `rgba(34,211,238,${0.9 * f})`;
          ctx.fillRect(bx - 1.5, by - 1.5, 3, 3);
        }
      });

      // Particles: chaos → through the core (with a swirl) → ordered card outlines.
      ctx.globalCompositeOperation = "lighter";
      for (const pt of particles) {
        const t = clamp((m - pt.delay * 0.35) / 0.65);
        const e = easeInOut(t);
        const jitter = 1 - clamp(e * 2);
        const hx = pt.cx + (Math.sin(time * pt.f1 + pt.p1) * pt.a1 + Math.sin(time * 2.3 * pt.f2 + pt.p2) * 4) * jitter;
        const hy = pt.cy + (Math.cos(time * pt.f2 + pt.p2) * pt.a2 + Math.cos(time * 1.9 * pt.f1 + pt.p1) * 4) * jitter;

        let x: number;
        let y: number;
        if (e < 0.5) {
          const s = easeInOut(e * 2);
          x = hx + (core.x - hx) * s;
          y = hy + (core.y - hy) * s;
        } else if (L.mobile) {
          const s = easeOut((e - 0.5) * 2);
          x = core.x + (pt.tx - core.x) * s;
          y = core.y + (pt.ty - core.y) * s;
        } else {
          const post = (e - 0.5) * 2;
          const c = L.cards[pt.card];
          const ex = c.x - 4;
          const ey = c.y + c.h / 2 + (pt.p1 - 3.14) * 1.1; // a narrow band, not a single line
          if (post < 0.6) {
            const u = easeInOut(post / 0.6);
            const mx = core.x + (ex - core.x) * 0.5;
            const iu = 1 - u;
            x = iu * iu * iu * core.x + 3 * iu * iu * u * mx + 3 * iu * u * u * mx + u * u * u * ex;
            y = iu * iu * iu * core.y + 3 * iu * iu * u * core.y + 3 * iu * u * u * ey + u * u * u * ey;
          } else {
            const u = easeOut((post - 0.6) / 0.4);
            x = ex + (pt.tx - ex) * u;
            y = ey + (pt.ty - ey) * u;
          }
        }
        // Vortex: spin around the core while passing through it.
        const near = 1 - Math.abs(e * 2 - 1);
        if (near > 0) {
          const ang = near * near * near * 1.9;
          const dx = x - core.x;
          const dy = y - core.y;
          x = core.x + dx * Math.cos(ang) - dy * Math.sin(ang);
          y = core.y + dx * Math.sin(ang) + dy * Math.cos(ang);
        }
        // Formed cards shimmer gently so the product feels alive.
        if (e >= 1 && !reduce) {
          const shimmer = 0.5 + 0.5 * Math.sin(time * 2.2 - pt.tx * 0.02 + pt.card);
          ctx.globalAlpha = 0.55 + shimmer * 0.45;
        } else {
          ctx.globalAlpha = 0.55 + near * 0.45;
        }
        const mix = clamp((e - 0.4) / 0.2);
        ctx.fillStyle = COLOR_TABLE[pt.pal][Math.round(mix * MIX_STEPS)];
        const s = pt.size + near * 0.8;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // DOM overlays driven from the same clock (no React re-renders per frame).
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(-50%, -50%) scale(${0.9 + flow * 0.3})`;
        coreRef.current.style.setProperty("--flow", String(flow));
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      PAIRS.forEach((_, k) => {
        const tag = tagRefs.current[k];
        const slot = L.slots[k];
        if (tag && slot) {
          const appear = easeOut(remap(p, 0.01 + k * 0.03, 0.08 + k * 0.03));
          const strike = remap(m, problemPullAt(k), problemPullAt(k) + 0.06);
          const pull = easeInOut(remap(m, problemPullAt(k) + 0.05, problemPullAt(k) + 0.3));
          const bob = reduce ? 0 : Math.sin(time * 1.3 + k) * 4 * (1 - pull);
          const x = slot.x + (core.x - slot.x) * pull;
          const y = slot.y + (core.y - slot.y) * pull + bob;
          tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${slot.rot * (1 - pull)}deg) scale(${(0.85 + appear * 0.15) * (1 - pull * 0.85)})`;
          tag.style.opacity = String(appear * (1 - remap(pull, 0.6, 1)));
          tag.style.filter = pull > 0.3 ? `blur(${(pull - 0.3) * 6}px)` : "none";
          const strikeEl = strikeRefs.current[k];
          if (strikeEl) strikeEl.style.transform = `scaleX(${strike})`;
          // A faint, crossed-out "before" stays behind where the problem was.
          const ghost = ghostRefs.current[k];
          if (ghost) {
            ghost.style.transform = `translate(${slot.x}px, ${slot.y}px) translate(-50%, -50%)`;
            ghost.style.opacity = String(0.32 * remap(pull, 0.55, 1));
          }
        }
        const card = cardRefs.current[k];
        if (card) {
          const f = easeOut(remap(m, cardFormedAt(k) - 0.02, cardFormedAt(k) + 0.06));
          card.style.opacity = String(f);
          card.style.transform = `translateX(${(1 - f) * -14}px)`;
        }
      });

      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(stage);
    // Mobile URL-bar show/hide fires resize without changing the (svh) stage — don't reshuffle then.
    const onResize = () => {
      if (stage.clientWidth !== lastW || stage.clientHeight !== lastH) size();
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [scrollYProgress]);

  const goToWork = () => {
    const el = document.getElementById("work");
    const lenis = (window as any).__lenis;
    if (el && lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="approach" className="relative h-[340vh] border-t border-line">
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_55%,black,transparent_85%)]" />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />

        {/* Headline — swaps per act */}
        <div className="absolute inset-x-0 top-[7%] sm:top-[9%] z-10">
          <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent-soft">03</span>
              <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
              <span className="eyebrow !text-faint">Approach</span>
            </div>
            <div className="relative mt-4 h-[5.5rem] sm:h-[7.5rem] max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={act}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute inset-0"
                >
                  <h2 className="font-semibold text-2xl sm:text-5xl leading-[1.08] tracking-tight text-bone text-balance">
                    {ACTS[act].title.split(" ").map((w, i, arr) => (
                      <span key={i} className={i >= arr.length - 2 ? (act === 0 ? "text-orange-400" : "text-gradient") : ""}>
                        {w}
                        {i < arr.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </h2>
                  <p className="hidden sm:block text-dim mt-3">{ACTS[act].sub}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Ghosts: the crossed-out "before" left behind once each problem is pulled in */}
        {PAIRS.map((pair, k) => (
          <div
            key={`ghost-${pair.problem}`}
            ref={(el) => {
              ghostRefs.current[k] = el;
            }}
            style={{ opacity: 0 }}
            aria-hidden
            className="absolute left-0 top-0 z-0 sm:max-w-[230px] rounded-xl border border-dashed border-line-strong px-3 py-1.5 sm:py-2 text-[10.5px] sm:text-[12.5px] leading-snug text-dim line-through decoration-orange-400/70 whitespace-nowrap sm:whitespace-normal"
          >
            <span className="sm:hidden">{pair.short}</span>
            <span className="hidden sm:inline">{pair.problem}</span>
          </div>
        ))}

        {/* Problem notes (driven imperatively from the canvas clock) */}
        {PAIRS.map((pair, k) => (
          <div
            key={pair.problem}
            ref={(el) => {
              tagRefs.current[k] = el;
            }}
            style={{ opacity: 0 }}
            className="absolute left-0 top-0 z-10 will-change-transform sm:max-w-[230px] rounded-xl border border-orange-400/35 bg-[#170d08]/90 px-3 py-1.5 sm:py-2 shadow-[0_12px_30px_-12px_rgba(249,115,22,0.45)]"
          >
            <div className="relative flex items-start gap-2 text-[10.5px] sm:text-[12.5px] leading-snug text-orange-100/90">
              <AlertTriangle className="w-3.5 h-3.5 mt-[1px] shrink-0 text-orange-400" />
              <span className="sm:hidden whitespace-nowrap">{pair.short}</span>
              <span className="hidden sm:inline">{pair.problem}</span>
              <span
                ref={(el) => {
                  strikeRefs.current[k] = el;
                }}
                className="absolute left-5 right-0 top-1/2 h-[1.5px] bg-orange-300/90 origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        ))}

        {/* The core */}
        {layout && (
          <div
            ref={coreRef}
            style={{ left: layout.core.x, top: layout.core.y, transform: "translate(-50%, -50%)" }}
            className="absolute z-10 w-[92px] h-[92px] sm:w-[120px] sm:h-[120px] pointer-events-none"
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-accent-soft/50 animate-[spin_14s_linear_infinite]" />
            <div className="absolute inset-[14%] rounded-full border border-neon/40 animate-[spin_9s_linear_infinite_reverse]" />
            <div className="absolute inset-[28%] rounded-full bg-gradient-to-br from-accent/60 to-neon/40 shadow-[0_0_40px_rgba(34,211,238,0.55)] flex items-center justify-center">
              <span className="font-mono text-[11px] sm:text-sm font-semibold text-white">&lt;/&gt;</span>
            </div>
          </div>
        )}

        {/* Solution cards — particles draw the outlines, this is the content */}
        {layout &&
          PAIRS.map((pair, k) => {
            const c = layout.cards[k];
            return (
              <div
                key={pair.solution}
                ref={(el) => {
                  cardRefs.current[k] = el;
                }}
                style={{ left: c.x, top: c.y, width: c.w, height: c.h, opacity: 0 }}
                className="absolute z-10 rounded-[12px] bg-accent/[0.05] flex items-center gap-2.5 pl-6 pr-3 sm:pr-4"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-neon" />
                <span className="flex-1 min-w-0 text-[11px] sm:text-[13px] text-bone leading-tight truncate">{pair.solution}</span>
                <span className="hidden sm:inline shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent-soft/80">
                  {pair.project}
                </span>
              </div>
            );
          })}

        {/* Act progress */}
        <div className="absolute inset-x-0 bottom-[4%] z-10 hidden sm:flex flex-col items-center gap-3 px-6">
          <AnimatePresence>
            {done && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: EASE }}
                onClick={goToWork}
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-soft transition-colors"
              >
                See the work behind them <ArrowDown className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="w-full max-w-md">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] mb-2">
              {ACTS.map((a, i) => (
                <span key={a.label} className={`transition-colors duration-500 ${i <= act ? (i === 0 ? "text-orange-300" : "text-accent-soft") : "text-faint"}`}>
                  {String(i + 1).padStart(2, "0")} {a.label}
                </span>
              ))}
            </div>
            <div className="h-px bg-line overflow-hidden rounded-full">
              <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-orange-400 via-accent to-neon" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
