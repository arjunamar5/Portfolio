"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

// The everyday problems I get handed — and what I turn them into.
const PAIRS = [
  { short: "Manual work", problem: "Hours lost to repetitive manual work", solution: "Automated billing, bookings & reminders", tag: "Automation" },
  { short: "Scattered data", problem: "Data scattered across paper & spreadsheets", solution: "Full-stack apps on one clean database", tag: "Full-stack" },
  { short: "Guesswork", problem: "Decisions made on guesswork", solution: "AI/ML models, analytics & RAG assistants", tag: "AI · ML" },
  { short: "Clunky UX", problem: "Clunky ways to book, enquire or plan", solution: "Fast web & WhatsApp experiences", tag: "Frontend" },
  { short: "Fragile systems", problem: "Systems that break when usage grows", solution: "Cloud deployments that scale", tag: "Cloud" },
];

const ACTS = [
  { label: "Understand", line: "Every project starts with the people affected — what's slow, manual or broken?" },
  { label: "Build", line: "I design and build the fix end to end: interface, API, database — and AI where it genuinely helps." },
  { label: "Ship", line: "Then I deploy it to the cloud, measure it, and keep improving it." },
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
    const ch = 30;
    const gap = 5;
    const y0 = H - 84 - (PAIRS.length * ch + (PAIRS.length - 1) * gap); // clear of the back-to-top button
    const cards = PAIRS.map((_, i) => ({ x: 16, y: y0 + i * (ch + gap), w: W - 32, h: ch }));
    const core = { x: W * 0.5, y: y0 - 56 };
    const zoneTop = Math.max(176, H * 0.07 + 130); // below the headline
    const zoneBottom = core.y - 50;
    const spacing = Math.min(44, (zoneBottom - zoneTop - 26) / (PAIRS.length - 1));
    const chaos = { cx: W * 0.5, cy: (zoneTop + zoneBottom) / 2, rx: W * 0.44, ry: (zoneBottom - zoneTop) / 2 + 12 };
    const slots = PAIRS.map((_, i) => ({ x: W * (i % 2 === 0 ? 0.3 : 0.7), y: zoneTop + 13 + i * spacing, rot: i % 2 ? 3 : -3 }));
    return { W, H, mobile, chaos, core, cards, slots };
  }
  const chaos = { cx: W * 0.2, cy: H * 0.62, rx: Math.min(W * 0.15, 230), ry: H * 0.19 };
  const core = { x: W * 0.47, y: H * 0.62 };
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
  glyph: number; // index of the idea-glyph cluster this particle sketches, or -1 for the free nebula
  lx: number; ly: number; // offset within its glyph
  ox: number; oy: number; oz: number; // offset within the nebula (3D)
  tx: number; ty: number; // target on its card, in the card's flat (screen) plane
  card: number;
  delay: number;
  a1: number; a2: number; f1: number; f2: number; p1: number; p2: number;
  pal: number;
  size: number;
};

type Glyph = { cx: number; cy: number; cz: number; phase: number; spin: number };

// Rough ideas & open questions the swarm sketches before anything is built.
const GLYPH_KINDS = ["?", "bulb", "!", "{ }", "bulb"];

/** Rasterizes a glyph off-screen and returns its filled pixels as centred offsets. */
function sampleGlyph(kind: string, size: number): [number, number][] {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g) return [];
  g.fillStyle = "#fff";
  g.strokeStyle = "#fff";
  g.lineCap = "round";
  if (kind === "bulb") {
    const r = size * 0.27;
    const cx = size / 2;
    const cy = size * 0.4;
    g.lineWidth = size * 0.075;
    g.beginPath();
    g.arc(cx, cy, r, Math.PI * 0.78, Math.PI * 2.22);
    g.stroke();
    g.beginPath();
    g.moveTo(cx - r * 0.62, cy + r * 0.78);
    g.lineTo(cx - r * 0.45, cy + r * 1.3);
    g.lineTo(cx + r * 0.45, cy + r * 1.3);
    g.lineTo(cx + r * 0.62, cy + r * 0.78);
    g.stroke();
    g.fillRect(cx - r * 0.42, cy + r * 1.5, r * 0.84, size * 0.055);
    g.fillRect(cx - r * 0.28, cy + r * 1.78, r * 0.56, size * 0.055);
    g.lineWidth = size * 0.045;
    g.beginPath();
    g.moveTo(cx - r * 0.35, cy + r * 0.25);
    g.lineTo(cx - r * 0.12, cy - r * 0.2);
    g.lineTo(cx + r * 0.12, cy + r * 0.25);
    g.lineTo(cx + r * 0.35, cy - r * 0.2);
    g.stroke();
  } else {
    g.font = `700 ${Math.round(size * (kind.length > 1 ? 0.6 : 0.86))}px ui-sans-serif, system-ui, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(kind, size / 2, size / 2 + size * 0.04);
  }
  const data = g.getImageData(0, 0, size, size).data;
  const step = Math.max(2, Math.round(size / 30));
  const pts: [number, number][] = [];
  for (let y = 0; y < size; y += step)
    for (let x = 0; x < size; x += step) if (data[(y * size + x) * 4 + 3] > 140) pts.push([x - size / 2, y - size / 2]);
  return pts;
}

function buildGlyphs(L: Layout): Glyph[] {
  const spots = L.mobile
    ? [[-0.62, -0.35, -40], [0.55, -0.25, 30], [0.02, 0.2, 0], [-0.5, 0.75, 50], [0.62, 0.7, -30]]
    : [[-0.62, -0.5, -90], [0.38, -0.62, 60], [-0.05, 0.08, -20], [0.62, 0.42, -50], [-0.48, 0.66, 80]];
  return spots.map(([ux, uy, z], i) => ({ cx: ux * L.chaos.rx, cy: uy * L.chaos.ry, cz: z, phase: i * 1.3, spin: 0.45 + (i % 3) * 0.2 }));
}

function buildParticles(L: Layout, glyphPts: [number, number][][]): Particle[] {
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
      const useGlyph = glyphPts.length > 0 && Math.random() < 0.58;
      const glyph = useGlyph ? Math.floor(Math.random() * glyphPts.length) : -1;
      const gp = useGlyph ? glyphPts[glyph][Math.floor(Math.random() * glyphPts[glyph].length)] ?? [0, 0] : [0, 0];
      // Nebula: a point inside a 3D ellipsoid around the chaos centre.
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.cbrt(Math.random());
      const sq = Math.sqrt(1 - u * u);
      out.push({
        glyph,
        lx: gp[0],
        ly: gp[1],
        ox: r * sq * Math.cos(th) * L.chaos.rx,
        oy: r * u * L.chaos.ry,
        oz: r * sq * Math.sin(th) * L.chaos.rx * 0.8,
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
        size: 1.4 + Math.random() * 1.0,
      });
    });
  });
  return out;
}

/** Looping 3D scribbles through the nebula — the "tangle". */
function buildScribbles(L: Layout) {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 16 }, () => ({
      ox: (Math.random() * 2 - 1) * L.chaos.rx * 0.9,
      oy: (Math.random() * 2 - 1) * L.chaos.ry * 0.9,
      oz: (Math.random() * 2 - 1) * L.chaos.rx * 0.6,
      ph: Math.random() * 6.28,
    }))
  );
}

// Icosahedron — the wireframe "engine" at the core.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map(([a, b, c]) => {
  const n = Math.hypot(a, b, c);
  return [a / n, b / n, c / n] as [number, number, number];
});
const ICO_E: [number, number][] = [];
ICO_V.forEach((a, i) =>
  ICO_V.forEach((b, j) => {
    if (j > i && Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - 1.0515) < 0.01) ICO_E.push([i, j]);
  })
);

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
    const glyphSize = () => (L.mobile ? 66 : 116);
    let glyphPts = GLYPH_KINDS.map((k) => sampleGlyph(k, glyphSize()));
    let glyphs = buildGlyphs(L);
    let particles = buildParticles(L, glyphPts);
    let scribbles = buildScribbles(L);
    let raf = 0;
    // Pointer tilts the whole scene a little (desktop only).
    let yaw = 0;
    let yawTarget = 0;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      yawTarget = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    if (fine && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });
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
      glyphPts = GLYPH_KINDS.map((k) => sampleGlyph(k, glyphSize()));
      glyphs = buildGlyphs(L);
      particles = buildParticles(L, glyphPts);
      scribbles = buildScribbles(L);
      setLayout(L);
    };
    size();

    const frame = (now: number) => {
      const time = reduce ? 0 : now / 1000;
      const p = scrollYProgress.get();
      const m = remap(p, M_START, M_END);
      const { W, H, core, chaos } = L;
      ctx.clearRect(0, 0, W, H);

      // Camera: simple perspective around a vanishing point.
      const F = L.mobile ? 560 : 950;
      const vx = W / 2;
      const vy = H * 0.55;
      const proj = (x: number, y: number, z: number) => {
        const sc = F / (F + z);
        return [vx + (x - vx) * sc, vy + (y - vy) * sc, sc] as const;
      };
      yaw += (yawTarget - yaw) * 0.05;
      const phi = time * 0.22 + yaw * 0.6; // nebula rotation
      const cphi = Math.cos(phi);
      const sphi = Math.sin(phi);

      // The tangle: 3D scribbles orbiting with the nebula, fading as problems get pulled in.
      const tangle = 1 - remap(m, 0, 0.45);
      if (tangle > 0) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(249,115,22,${0.26 * tangle})`;
        for (const pts of scribbles) {
          const q = pts.map((pt) => {
            const ox = pt.ox + Math.sin(time * 0.8 + pt.ph) * 8;
            const oy = pt.oy + Math.cos(time * 0.7 + pt.ph) * 8;
            const [sx, sy] = proj(chaos.cx + ox * cphi + pt.oz * sphi, chaos.cy + oy, -ox * sphi + pt.oz * cphi);
            return [sx, sy];
          });
          ctx.beginPath();
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
      const glowR = 80 + flow * 120;
      const g = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, glowR);
      g.addColorStop(0, `rgba(125,211,252,${0.16 + flow * 0.32})`);
      g.addColorStop(0.4, `rgba(59,130,246,${0.07 + flow * 0.16})`);
      g.addColorStop(1, "rgba(59,130,246,0)");
      ctx.fillStyle = g;
      ctx.fillRect(core.x - glowR, core.y - glowR, glowR * 2, glowR * 2);

      // Card hinge: each card starts swung away (right edge deep in Z) and closes flat as it forms.
      const theta = L.cards.map((_, k) => (1 - easeOut(remap(m, cardFormedAt(k) - 0.2, cardFormedAt(k) + 0.05))) * 1.15);

      // Beams from the core to each card while data is flowing into it.
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

      // Particles: rough-idea nebula (3D) → helix into the core → ordered, hinged card outlines.
      ctx.globalCompositeOperation = "lighter";
      for (const pt of particles) {
        const t = clamp((m - pt.delay * 0.35) / 0.65);
        const e = easeInOut(t);

        // Home position in the idea nebula.
        let hx: number;
        let hy: number;
        let hz: number;
        if (pt.glyph >= 0) {
          const G = glyphs[pt.glyph];
          const psi = time * G.spin + G.phase + yaw;
          const c6 = Math.cos(phi * 0.6);
          const s6 = Math.sin(phi * 0.6);
          const gx = G.cx * c6 + G.cz * s6;
          const gz = -G.cx * s6 + G.cz * c6;
          const lx = pt.lx + Math.sin(time * pt.f1 + pt.p1) * 1.8;
          const ly = pt.ly + Math.cos(time * pt.f2 + pt.p2) * 1.8;
          hx = chaos.cx + gx + lx * Math.cos(psi);
          hz = gz + lx * Math.sin(psi);
          hy = chaos.cy + G.cy + ly + Math.sin(time * 0.9 + G.phase) * 6;
        } else {
          const ox = pt.ox + Math.sin(time * pt.f1 + pt.p1) * pt.a1 * 0.5;
          const oy = pt.oy + Math.cos(time * pt.f2 + pt.p2) * pt.a2 * 0.5;
          hx = chaos.cx + ox * cphi + pt.oz * sphi;
          hz = -ox * sphi + pt.oz * cphi;
          hy = chaos.cy + oy;
        }

        // Target on the (hinged) card plane.
        const c = L.cards[pt.card];
        const th = theta[pt.card];
        const dxCard = pt.tx - c.x;
        const TX = c.x + dxCard * Math.cos(th);
        const TZ = dxCard * Math.sin(th);
        const TY = pt.ty;

        let x: number;
        let y: number;
        let z: number;
        if (e < 0.5) {
          const s2 = easeInOut(e * 2);
          x = hx + (core.x - hx) * s2;
          y = hy + (core.y - hy) * s2;
          z = hz * (1 - s2);
          // Helix around the path so the stream visibly spirals in depth.
          const r = 34 * Math.sin(Math.PI * s2);
          const ang = s2 * 5 * Math.PI + pt.p1;
          y += r * Math.cos(ang);
          z += r * Math.sin(ang) * 1.4;
        } else if (L.mobile) {
          const s2 = easeOut((e - 0.5) * 2);
          x = core.x + (TX - core.x) * s2;
          y = core.y + (TY - core.y) * s2;
          z = TZ * s2;
        } else {
          const post = (e - 0.5) * 2;
          const ex = c.x - 4;
          const ey = c.y + c.h / 2 + (pt.p1 - 3.14) * 1.1;
          if (post < 0.6) {
            const u = easeInOut(post / 0.6);
            const mx = core.x + (ex - core.x) * 0.5;
            const iu = 1 - u;
            x = iu * iu * iu * core.x + 3 * iu * iu * u * mx + 3 * iu * u * u * mx + u * u * u * ex;
            y = iu * iu * iu * core.y + 3 * iu * iu * u * core.y + 3 * iu * u * u * ey + u * u * u * ey;
            z = 0;
          } else {
            const u = easeOut((post - 0.6) / 0.4);
            x = ex + (TX - ex) * u;
            y = ey + (TY - ey) * u;
            z = TZ * u;
          }
        }

        // Orbit around the core's vertical axis while passing through it.
        const near = 1 - Math.abs(e * 2 - 1);
        if (near > 0) {
          const ang = near * near * 2.4;
          const dx = x - core.x;
          x = core.x + dx * Math.cos(ang) - z * Math.sin(ang);
          z = dx * Math.sin(ang) + z * Math.cos(ang);
        }

        const [sx, sy, sc] = proj(x, y, z);
        const depth = clamp(0.3 + (sc - 0.72) * 1.4, 0.22, 1);
        if (e >= 1 && !reduce) {
          const shimmer = 0.5 + 0.5 * Math.sin(time * 2.2 - pt.tx * 0.02 + pt.card);
          ctx.globalAlpha = (0.55 + shimmer * 0.45) * depth;
        } else {
          ctx.globalAlpha = (0.55 + near * 0.45) * depth;
        }
        const mix = clamp((e - 0.4) / 0.2);
        ctx.fillStyle = COLOR_TABLE[pt.pal][Math.round(mix * MIX_STEPS)];
        const sz = (pt.size + near * 0.9) * sc;
        ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // The engine: a rotating wireframe icosahedron inside two tilted orbit rings.
      const R = (L.mobile ? 26 : 40) * (0.92 + flow * 0.35);
      const ra = time * 0.55 + yaw * 1.5;
      const rb = time * 0.33 + 0.4;
      const verts = ICO_V.map(([a, b, cz]) => {
        const x1 = a * Math.cos(ra) + cz * Math.sin(ra);
        const z1 = -a * Math.sin(ra) + cz * Math.cos(ra);
        const y2 = b * Math.cos(rb) - z1 * Math.sin(rb);
        const z2 = b * Math.sin(rb) + z1 * Math.cos(rb);
        const [px, py] = proj(core.x + x1 * R, core.y + y2 * R, z2 * R);
        return { px, py, d: z2 };
      });
      ctx.lineWidth = 1.2;
      for (const [i, j] of ICO_E) {
        const d = (verts[i].d + verts[j].d) / 2; // -1 near … +1 far
        ctx.strokeStyle = `rgba(125,211,252,${(0.2 + 0.7 * (1 - (d + 1) / 2)) * (0.75 + flow * 0.25)})`;
        ctx.beginPath();
        ctx.moveTo(verts[i].px, verts[i].py);
        ctx.lineTo(verts[j].px, verts[j].py);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(186,230,253,0.9)";
      for (const v of verts) ctx.fillRect(v.px - 1.2, v.py - 1.2, 2.4, 2.4);

      [0, 1].forEach((i) => {
        const Rr = R * (i ? 2.35 : 1.8);
        const tilt = i ? 1.12 : 1.32;
        const spin = time * (i ? -0.35 : 0.25);
        const pt3 = (a: number) => {
          const px = Rr * Math.cos(a);
          const py0 = Rr * Math.sin(a);
          const py = py0 * Math.cos(tilt);
          const pz = py0 * Math.sin(tilt);
          const x2 = px * Math.cos(spin) - py * Math.sin(spin);
          const y2 = px * Math.sin(spin) + py * Math.cos(spin);
          return proj(core.x + x2, core.y + y2, pz);
        };
        ctx.strokeStyle = `rgba(34,211,238,${0.18 + flow * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let s = 0; s <= 64; s++) {
          const [px, py] = pt3((s / 64) * Math.PI * 2);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        const [dx, dy, dsc] = pt3(time * (1.1 + i * 0.5));
        ctx.fillStyle = "rgba(34,211,238,0.95)";
        ctx.beginPath();
        ctx.arc(dx, dy, 2.4 * dsc, 0, Math.PI * 2);
        ctx.fill();
      });

      // DOM overlays driven from the same clock (no React re-renders per frame).
      if (coreRef.current) coreRef.current.style.transform = `translate(-50%, -50%) scale(${0.9 + flow * 0.3})`;
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
          card.style.transform = `perspective(900px) rotateY(${(theta[k] * 180) / Math.PI}deg)`;
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
      window.removeEventListener("pointermove", onPointer);
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

        {/* Headline: what I do (constant) + the current step */}
        <div className="absolute inset-x-0 top-[7%] sm:top-[8%] z-10">
          <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent-soft">02</span>
              <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
              <span className="eyebrow !text-faint">What I do</span>
            </div>
            <h2 className="mt-3 sm:mt-4 max-w-3xl font-semibold text-[1.35rem] sm:text-5xl leading-[1.12] sm:leading-[1.08] tracking-tight text-bone text-balance">
              I turn real-world problems into <span className="text-gradient">working software.</span>
            </h2>
            <div className="relative mt-3 h-6 sm:h-[3.25rem] max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={act}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 flex items-start gap-3"
                >
                  <span
                    className={`shrink-0 mt-0.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] ${
                      act === 0 ? "border-orange-400/40 text-orange-300 bg-orange-400/10" : "border-accent/40 text-accent-soft bg-accent/10"
                    }`}
                  >
                    {String(act + 1).padStart(2, "0")} · {ACTS[act].label}
                  </span>
                  <p className="hidden sm:block text-dim leading-relaxed">{ACTS[act].line}</p>
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

        {/* The core label — the 3D engine itself is drawn on the canvas */}
        {layout && (
          <div
            ref={coreRef}
            style={{ left: layout.core.x, top: layout.core.y, transform: "translate(-50%, -50%)" }}
            className="absolute z-10 pointer-events-none"
          >
            <span className="font-mono text-[11px] sm:text-sm font-semibold text-white [text-shadow:0_0_12px_rgba(34,211,238,0.9)]">&lt;/&gt;</span>
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
                className="absolute z-10 rounded-[12px] bg-accent/[0.05] flex items-center gap-2.5 pl-6 pr-3 sm:pr-4 [transform-origin:left_center]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-neon" />
                <span className="flex-1 min-w-0 text-[11px] sm:text-[13px] text-bone leading-tight truncate">{pair.solution}</span>
                <span className="hidden sm:inline shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent-soft/80">
                  {pair.tag}
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
                See it in real projects <ArrowDown className="w-3.5 h-3.5" />
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
