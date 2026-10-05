"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const EASE = [0.16, 1, 0.3, 1] as const;
const { title, education, leadership, location } = PORTFOLIO_DATA.personal;
const cgpa = education.detail.replace("CGPA: ", "");

/** The name drawn in particles; they scatter from the pointer and drift back home. */
function ParticleName({ text = "ARJUN" }: { text?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let pts: { hx: number; hy: number; x: number; y: number; vx: number; vy: number; c: string; r: number }[] = [];
    const mouse = { x: -9999, y: -9999 };
    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = async () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      try {
        await document.fonts.load(`700 200px "Space Grotesk Variable"`);
      } catch {}
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d")!;
      let size = H * 0.95;
      o.font = `700 ${size}px "Space Grotesk Variable", system-ui, sans-serif`;
      const wText = o.measureText(text).width;
      if (wText > W * 0.96) size *= (W * 0.96) / wText;
      o.font = `700 ${size}px "Space Grotesk Variable", system-ui, sans-serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText(text, W / 2, H / 2 + size * 0.04);
      const data = o.getImageData(0, 0, W, H).data;
      const step = W > 900 ? 6 : 5;
      const next: typeof pts = [];
      const stops = ["#22D3EE", "#60A5FA", "#818CF8", "#C084FC", "#F472B6"];
      for (let y = 0; y < H; y += step)
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 128) {
            const c = stops[Math.min(stops.length - 1, Math.floor((x / W) * stops.length))];
            next.push({ hx: x, hy: y, x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, c, r: 1.3 + Math.random() * 1.2 });
          }
        }
      pts = next;
      if (reduce) pts.forEach((p) => ((p.x = p.hx), (p.y = p.hy)));
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 9000) {
          const f = (9000 - d2) / 9000;
          const d = Math.sqrt(d2) || 1;
          p.vx += (dx / d) * f * 3.2;
          p.vy += (dy / d) * f * 3.2;
        }
        p.vx += (p.hx - p.x) * 0.045;
        p.vy += (p.hy - p.y) * 0.045;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => ((mouse.x = -9999), (mouse.y = -9999));
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        build().then(() => (raf = requestAnimationFrame(tick)));
      } else if (!e.isIntersecting && started) {
        cancelAnimationFrame(raf);
        started = false;
      }
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);
  return <canvas ref={ref} className="w-full h-[300px] sm:h-[380px]" aria-label="Arjun" />;
}

const FACTS = [
  { big: cgpa, small: "CGPA · B.Tech CSE, Amrita", c: "#22D3EE" },
  { big: leadership.role, small: "Computer Society of India · ASEB", c: "#818CF8" },
  { big: "3", small: "Live products, used every day", c: "#C084FC" },
  { big: "8", small: "Research papers · IEEE & Springer", c: "#F472B6" },
];

export function AboutParticles() {
  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent-soft">01</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-neon" />
          <span className="eyebrow !text-faint">About</span>
          <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.25em] text-faint">Move your cursor over the name</span>
        </div>
        <div className="mt-6">
          <ParticleName />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span className="font-grotesk text-2xl sm:text-3xl font-semibold text-bone">{title}</span>
          <span className="text-dim">
            Building products with <span className="text-fuchsia-300">AI inside</span> · {location}
          </span>
        </div>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border-y border-line">
          {FACTS.map((f, i) => (
            <motion.div
              key={f.small}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className={`py-7 px-5 ${i ? "lg:border-l border-line" : ""} ${i % 2 ? "border-l border-line lg:border-l" : ""}`}
            >
              <div className="font-grotesk text-[2.8rem] font-bold leading-none tracking-[-0.03em]" style={{ color: f.c }}>
                {f.big}
              </div>
              <div className="mt-2 text-[13.5px] text-dim">{f.small}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
