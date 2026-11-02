"use client";

import { useEffect, useRef } from "react";
import { FLOWER } from "@/lib/flower";

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  /** Rotation, so flowers roll as they move */
  angle: number;
  /** Squish spring: amount (negative = squashed), its speed, and the direction it was hit from */
  sq: number;
  sqv: number;
  sqAngle: number;
  /** Has dropped into the box (the ceiling only applies after this) */
  inside: boolean;
};

const COUNT = 10;
const COLORS = ["#7cb9e4", "#f3c11b", "#3883de", "#ecedd8", "#518c2d", "#b83244"];
// Tuned for a fixed 60 steps a second, so it feels the same on 60Hz and 120Hz screens
const STEP_MS = 1000 / 60;
const GRAVITY = 0.28;
const DRAG = 0.992;
const BOUNCE = 0.55;
const CURSOR_R = 60;

// Flower outline from the portfolio, centred on 0,0 at roughly radius 1
const [vx0, vy0, vw, vh] = FLOWER.viewBox.split(" ").map(Number);
const FLOWER_CX = vx0 + vw / 2;
const FLOWER_CY = vy0 + vh / 2;
const FLOWER_R = Math.max(vw, vh) / 2;

/**
 * Ten colourful, squishy flowers in the home hero. On computers they drop in,
 * bounce and drift away from the cursor. On phones the same physics runs once,
 * instantly, and the settled pile is drawn as a still picture, so nothing
 * keeps running in the background.
 */
export function BouncingFlowers({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const live =
      window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const petals = FLOWER.petals.map((d) => new Path2D(d));

    let w = 0;
    let h = 0;
    let bodies: Body[] = [];
    let frame = 0;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, tx: -9999, ty: -9999 };

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
      const unit = Math.min(w, h * 1.2);
      bodies = Array.from({ length: COUNT }, (_, i) => {
        const r = unit * (0.068 + ((i * 7) % 5) * 0.014);
        return {
          r,
          x: r + Math.random() * Math.max(1, w - 2 * r),
          y: -r - i * r * 1.5,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          color: COLORS[i % COLORS.length],
          angle: Math.random() * Math.PI * 2,
          sq: 0,
          sqv: 0,
          sqAngle: 0,
          inside: false,
        };
      });
    };

    // A hit squashes the flower along the direction of the hit; harder hits squash more
    const squish = (b: Body, speed: number, nx: number, ny: number) => {
      if (speed < 1) return;
      b.sqAngle = Math.atan2(ny, nx);
      b.sqv -= Math.min(speed, 14) * 0.016;
    };

    const walls = (b: Body) => {
      // Side walls leave room for the petals, which reach past the hit circle
      const side = b.r * 1.12;
      if (b.x < side) {
        squish(b, Math.abs(b.vx), 1, 0);
        b.x = side;
        b.vx = Math.abs(b.vx) * BOUNCE;
      }
      if (b.x > w - side) {
        squish(b, Math.abs(b.vx), 1, 0);
        b.x = w - side;
        b.vx = -Math.abs(b.vx) * BOUNCE;
      }
      if (b.y >= b.r) b.inside = true;
      if (b.inside && b.y < b.r) {
        squish(b, Math.abs(b.vy), 0, 1);
        b.y = b.r;
        b.vy = Math.abs(b.vy) * BOUNCE;
      }
      if (b.y > h - b.r) {
        squish(b, Math.abs(b.vy), 0, 1);
        b.y = h - b.r;
        b.vy = -Math.abs(b.vy) * BOUNCE;
        b.vx *= 0.96;
        if (Math.abs(b.vy) < 0.8) b.vy = 0;
      }
    };

    const step = () => {
      // The cursor eases towards the real mouse, so pushes feel soft rather than snappy
      if (mouse.tx > -9000) {
        const px = mouse.x < -9000 ? mouse.tx : mouse.x;
        const py = mouse.y < -9000 ? mouse.ty : mouse.y;
        mouse.x = px + (mouse.tx - px) * 0.25;
        mouse.y = py + (mouse.ty - py) * 0.25;
        mouse.vx += ((mouse.x - px) - mouse.vx) * 0.3;
        mouse.vy += ((mouse.y - py) - mouse.vy) * 0.3;
      }

      for (const b of bodies) {
        b.vy += GRAVITY;
        b.vx *= DRAG;
        b.vy *= DRAG;
        b.x += b.vx;
        b.y += b.vy;
        b.angle += (b.vx / b.r) * 0.6;

        // Gentle push away from the cursor instead of a hard knock
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const d = Math.hypot(dx, dy);
        const min = b.r + CURSOR_R;
        if (d < min && d > 0) {
          const nx = dx / d;
          const ny = dy / d;
          const push = (min - d) * 0.02;
          b.vx += nx * push + mouse.vx * 0.06;
          b.vy += ny * push + mouse.vy * 0.06;
        }

        walls(b);

        // Squish springs back with a little wobble
        b.sqv += -b.sq * 0.16;
        b.sqv *= 0.84;
        b.sq += b.sqv;
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          const min = a.r + b.r;
          if (d >= min || d === 0) continue;
          const nx = dx / d;
          const ny = dy / d;
          const ma = a.r * a.r;
          const mb = b.r * b.r;
          const overlap = min - d;
          a.x -= nx * overlap * (mb / (ma + mb));
          a.y -= ny * overlap * (mb / (ma + mb));
          b.x += nx * overlap * (ma / (ma + mb));
          b.y += ny * overlap * (ma / (ma + mb));
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            squish(a, -rel, nx, ny);
            squish(b, -rel, nx, ny);
            const impulse = (-(1 + BOUNCE) * rel) / (1 / ma + 1 / mb);
            a.vx -= (impulse / ma) * nx;
            a.vy -= (impulse / ma) * ny;
            b.vx += (impulse / mb) * nx;
            b.vy += (impulse / mb) * ny;
          }
        }
      }
      for (const b of bodies) walls(b);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of bodies) {
        // Petals reach a little past the hit circle so neighbours tuck together
        const s = (b.r * 1.12) / FLOWER_R;
        const sq = Math.max(-0.3, Math.min(0.3, b.sq));
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.sqAngle);
        ctx.scale(1 + sq, 1 - sq * 0.7);
        ctx.rotate(b.angle - b.sqAngle);
        ctx.scale(s, s);
        ctx.translate(-FLOWER_CX, -FLOWER_CY);
        ctx.fillStyle = b.color;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = FLOWER.strokeWidth;
        ctx.lineJoin = "round";
        for (const p of petals) {
          ctx.fill(p);
          ctx.stroke(p);
        }
        ctx.restore();
      }
    };

    const settle = () => {
      resize();
      spawn();
      for (let i = 0; i < 900; i++) step();
      for (const b of bodies) b.sq = b.sqv = 0;
      draw();
    };

    if (!live) {
      settle();
      window.addEventListener("resize", settle);
      return () => window.removeEventListener("resize", settle);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = mouse.tx = mouse.ty = -9999;
      mouse.vx = mouse.vy = 0;
    };

    let visible = true;
    let last = 0;
    let acc = 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = 0;
        frame = requestAnimationFrame(loop);
      }
    });

    const loop = (t: number) => {
      if (!visible) {
        frame = 0;
        return;
      }
      acc += last ? Math.min(t - last, 100) : STEP_MS;
      last = t;
      while (acc >= STEP_MS) {
        step();
        acc -= STEP_MS;
      }
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      const oldW = w;
      const oldH = h;
      resize();
      if (!oldW || !oldH) return;
      for (const b of bodies) {
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
