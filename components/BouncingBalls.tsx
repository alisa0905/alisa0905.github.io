"use client";

import { useEffect, useRef } from "react";

type Ball = { x: number; y: number; vx: number; vy: number; r: number; inside?: boolean };

const COUNT = 10;
const GRAVITY = 0.45;
const BOUNCE = 0.78;
const CURSOR_R = 70;

/**
 * Ten big cream balls in the home hero. On computers they drop in, bounce
 * and get knocked around by the cursor. On phones the same physics runs
 * once, instantly, and the settled pile is drawn as a still picture, so
 * there's no animation running in the background.
 */
export function BouncingBalls({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const live =
      window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--cream").trim() || "#ecedd8";

    let w = 0;
    let h = 0;
    let balls: Ball[] = [];
    let frame = 0;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      // Sizes scale with the space so they stay big on every screen
      const unit = Math.min(w, h * 1.2);
      balls = Array.from({ length: COUNT }, (_, i) => {
        const r = unit * (0.09 + ((i * 7) % 5) * 0.018);
        return {
          r,
          x: r + Math.random() * Math.max(1, w - 2 * r),
          y: -r - i * r * 1.4,
          vx: (Math.random() - 0.5) * 6,
          vy: 0,
        };
      });
    };

    const walls = (b: Ball) => {
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
      if (b.x > w - b.r) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
      // The ceiling only kicks in once a ball has dropped in from above
      if (b.y >= b.r) b.inside = true;
      if (b.inside && b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * BOUNCE; }
      if (b.y > h - b.r) {
        b.y = h - b.r;
        b.vy = -Math.abs(b.vy) * BOUNCE;
        b.vx *= 0.97;
        if (Math.abs(b.vy) < 1) b.vy = 0;
      }
    };

    const step = () => {
      for (const b of balls) {
        b.vy += GRAVITY;
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.995;

        // Cursor acts like a moving ball that shoves anything it touches
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const d = Math.hypot(dx, dy);
        const min = b.r + CURSOR_R;
        if (d < min && d > 0) {
          const nx = dx / d;
          const ny = dy / d;
          b.x += nx * (min - d);
          b.y += ny * (min - d);
          b.vx += nx * 4 + mouse.vx * 0.5;
          b.vy += ny * 4 + mouse.vy * 0.5;
        }

        walls(b);
      }

      // Ball-to-ball collisions
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          const min = a.r + b.r;
          if (d >= min || d === 0) continue;
          const nx = dx / d;
          const ny = dy / d;
          // Bigger balls get pushed less
          const ma = a.r * a.r;
          const mb = b.r * b.r;
          const overlap = min - d;
          a.x -= nx * overlap * (mb / (ma + mb));
          a.y -= ny * overlap * (mb / (ma + mb));
          b.x += nx * overlap * (ma / (ma + mb));
          b.y += ny * overlap * (ma / (ma + mb));
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            const impulse = (-(1 + BOUNCE) * rel) / (1 / ma + 1 / mb);
            a.vx -= (impulse / ma) * nx;
            a.vy -= (impulse / ma) * ny;
            b.vx += (impulse / mb) * nx;
            b.vy += (impulse / mb) * ny;
          }
        }
      }
      for (const b of balls) walls(b);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const b of balls) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const settle = () => {
      resize();
      spawn();
      for (let i = 0; i < 900; i++) step();
      draw();
    };

    if (!live) {
      settle();
      window.addEventListener("resize", settle);
      return () => window.removeEventListener("resize", settle);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.vx = Math.max(-40, Math.min(40, x - mouse.x));
      mouse.vy = Math.max(-40, Math.min(40, y - mouse.y));
      mouse.x = x;
      mouse.y = y;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    // Only animate while the hero is on screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });

    const loop = () => {
      if (!visible) {
        frame = 0;
        return;
      }
      step();
      draw();
      mouse.vx *= 0.8;
      mouse.vy *= 0.8;
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      const oldW = w;
      const oldH = h;
      resize();
      if (!oldW || !oldH) return;
      for (const b of balls) {
        b.x *= w / oldW;
        b.y *= h / oldH;
      }
    };

    resize();
    spawn();
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none ${className ?? ""}`} />;
}
