"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  baseX: number;
  baseY: number;
  ampX: number;
  ampY: number;
  speed: number;
  phaseX: number;
  phaseY: number;
  pulsePhase: number;
  pulseSpeed: number;
  r: number;
  neon: boolean;
}

const ACCENT: [number, number, number] = [59, 130, 246]; // matches tailwind `accent`
const NEON: [number, number, number] = [34, 211, 238]; // matches tailwind `neon`

const REPEL_RADIUS = 130;
const REPEL_STRENGTH = 46;

/**
 * Soft floating dots with a gentle glow — each drifts on its own slow,
 * looping orbit (no edge-bouncing, no connecting web) and eases away from
 * the cursor when it comes near. Pure canvas, themed off the existing
 * accent/neon tokens. Pauses outside the viewport and settles to a single
 * static, non-interactive frame under prefers-reduced-motion.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(40, Math.min(110, Math.round((width * height) / 8000)));
      particles = Array.from({ length: count }, () => {
        const ampX = 18 + Math.random() * 26;
        const ampY = 18 + Math.random() * 26;
        return {
          baseX: ampX + Math.random() * (width - ampX * 2),
          baseY: ampY + Math.random() * (height - ampY * 2),
          ampX,
          ampY,
          speed: 0.00035 + Math.random() * 0.00045,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0006 + Math.random() * 0.0008,
          r: Math.random() * 1.3 + 1.1,
          neon: Math.random() > 0.72,
        };
      });
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        let x = p.baseX + Math.sin(t * p.speed + p.phaseX) * p.ampX;
        let y = p.baseY + Math.cos(t * p.speed * 0.85 + p.phaseY) * p.ampY;

        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const push = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }

        const alpha = 0.38 + Math.sin(t * p.pulseSpeed + p.pulsePhase) * 0.2;
        const [r, g, b] = p.neon ? NEON : ACCENT;

        ctx!.save();
        ctx!.shadowBlur = p.r * 7;
        ctx!.shadowColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, p.r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.active = x >= -REPEL_RADIUS && x <= width + REPEL_RADIUS && y >= -REPEL_RADIUS && y <= height + REPEL_RADIUS;
      if (mouse.active) {
        mouse.x = x;
        mouse.y = y;
      }
    }
    function onMouseLeave() {
      mouse.active = false;
    }

    resize();
    draw(0);

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);
    }
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting && !reduceMotion) raf = requestAnimationFrame(draw);
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
