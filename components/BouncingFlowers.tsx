"use client";

import { useEffect, useRef } from "react";
import { FLOWER } from "@/lib/flower";

type Petal = {
  /** Pre-drawn image of this one petal */
  img: HTMLCanvasElement;
  /** Where the image sits relative to the flower's centre, in screen px */
  ox: number;
  oy: number;
  w: number;
  h: number;
};

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  /** Rotation and its speed, so flowers roll as they move */
  angle: number;
  spin: number;
  /** Squish spring per petal: amount (negative = pressed in) and its speed */
  sq: number[];
  sqv: number[];
  /** Has dropped into the box (the ceiling only applies after this) */
  inside: boolean;
  /** The whole flower pre-drawn once, used when nothing is squished */
  whole?: HTMLCanvasElement;
  petals?: Petal[];
};

const COUNT = 10;
const COLORS = ["#7cb9e4", "#f3c11b", "#3883de", "#ecedd8", "#518c2d", "#b83244"];
// Tuned for a fixed 60 steps a second, so it feels the same on 60Hz and 120Hz screens
const STEP_MS = 1000 / 60;
const GRAVITY = 0.28;
const DRAG = 0.992;
const BOUNCE = 0.55;
const CURSOR_R = 60;
// Extra passes that untangle piles, so flowers in a corner settle instead of jittering
const SOLVER_PASSES = 4;
// Petals reach a little past the hit circle so neighbours tuck together
const REACH = 1.12;

// The petals' inner points meet in the middle: that's the flower's centre
const PETAL_POINTS = FLOWER.petals.map((d) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number));
const CX = PETAL_POINTS.reduce((s, p) => s + p[0], 0) / PETAL_POINTS.length;
const CY = PETAL_POINTS.reduce((s, p) => s + p[1], 0) / PETAL_POINTS.length;
// Each petal's bounds and the direction it points, measured from the centre
const PETAL_BOXES = PETAL_POINTS.map((nums) => {
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const pad = FLOWER.strokeWidth;
  const box = {
    x0: Math.min(...xs) - pad,
    y0: Math.min(...ys) - pad,
    x1: Math.max(...xs) + pad,
    y1: Math.max(...ys) + pad,
  };
  const mx = xs.reduce((s, v) => s + v, 0) / xs.length;
  const my = ys.reduce((s, v) => s + v, 0) / ys.length;
  return { ...box, dir: Math.atan2(my - CY, mx - CX) };
});
// Sprite size (petal bounds, with room for the outline)
const FLOWER_R = Math.max(
  ...PETAL_BOXES.flatMap((b) => [CX - b.x0, b.x1 - CX, CY - b.y0, b.y1 - CY]),
);
// How big the flower looks, used to size it against its hit circle
const [, , VB_W, VB_H] = FLOWER.viewBox.split(" ").map(Number);
const FLOWER_LOOK_R = Math.max(VB_W, VB_H) / 2;

/**
 * Ten colourful, squishy flowers in the home hero. On computers they drop in,
 * bounce and drift away from the cursor; each petal squishes on its own when
 * it's hit. On phones the same physics runs once, instantly, and the settled
 * pile is drawn as a still picture, so nothing keeps running.
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
    const paths = FLOWER.petals.map((d) => new Path2D(d));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let bodies: Body[] = [];
    let frame = 0;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, tx: -9999, ty: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
          x: r * REACH + Math.random() * Math.max(1, w - 2 * r * REACH),
          y: -r - i * r * 1.5,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          color: COLORS[i % COLORS.length],
          angle: Math.random() * Math.PI * 2,
          spin: 0,
          sq: PETAL_BOXES.map(() => 0),
          sqv: PETAL_BOXES.map(() => 0),
          inside: false,
        };
      });
    };

    // Draw each flower (and each of its petals) once, so frames only stamp images
    const paint = (g: CanvasRenderingContext2D, color: string, scale: number, which: number[]) => {
      g.scale(scale, scale);
      g.fillStyle = color;
      g.strokeStyle = color;
      g.lineWidth = FLOWER.strokeWidth;
      g.lineJoin = "round";
      for (const k of which) {
        g.fill(paths[k]);
        g.stroke(paths[k]);
      }
    };

    const makeSprites = () => {
      for (const b of bodies) {
        const unitPx = (b.r * REACH) / FLOWER_LOOK_R; // screen px per flower unit
        const px = Math.ceil(FLOWER_R * 2 * unitPx * dpr);
        const whole = document.createElement("canvas");
        whole.width = whole.height = px;
        const g = whole.getContext("2d");
        if (!g) continue;
        g.translate(px / 2, px / 2);
        g.scale(dpr, dpr);
        g.translate(-CX * unitPx, -CY * unitPx);
        paint(g, b.color, unitPx, PETAL_BOXES.map((_, k) => k));
        b.whole = whole;

        b.petals = PETAL_BOXES.map((box, k) => {
          const pw = (box.x1 - box.x0) * unitPx;
          const ph = (box.y1 - box.y0) * unitPx;
          const img = document.createElement("canvas");
          img.width = Math.ceil(pw * dpr);
          img.height = Math.ceil(ph * dpr);
          const pg = img.getContext("2d")!;
          pg.scale(dpr, dpr);
          pg.translate(-box.x0 * unitPx, -box.y0 * unitPx);
          paint(pg, b.color, unitPx, [k]);
          return { img, ox: (box.x0 - CX) * unitPx, oy: (box.y0 - CY) * unitPx, w: pw, h: ph };
        });
      }
    };

    // A hit presses in the petals facing it (and puffs out the opposite ones a touch)
    const squish = (b: Body, speed: number, towardX: number, towardY: number) => {
      // Ignore the tiny nudges of flowers resting in a pile
      if (speed < 2) return;
      const hit = Math.atan2(towardY, towardX);
      const strength = Math.min(speed, 12) * 0.01;
      PETAL_BOXES.forEach((p, k) => {
        const facing = Math.cos(p.dir + b.angle - hit);
        if (facing > 0) b.sqv[k] -= strength * facing * facing;
        else b.sqv[k] += strength * 0.3 * facing * facing;
      });
    };

    // Keeps a flower inside the box. Only the first pass bounces and squishes;
    // later passes just nudge positions, which stops corner jitter.
    const walls = (b: Body, bounce: boolean) => {
      const side = b.r * REACH;
      if (b.x < side) {
        if (bounce && b.vx < 0) {
          squish(b, -b.vx, -1, 0);
          b.vx = -b.vx * BOUNCE;
        }
        b.x = side;
      }
      if (b.x > w - side) {
        if (bounce && b.vx > 0) {
          squish(b, b.vx, 1, 0);
          b.vx = -b.vx * BOUNCE;
        }
        b.x = w - side;
      }
      if (b.y >= b.r) b.inside = true;
      if (b.inside && b.y < b.r) {
        if (bounce && b.vy < 0) {
          squish(b, -b.vy, 0, -1);
          b.vy = -b.vy * BOUNCE;
        }
        b.y = b.r;
      }
      if (b.y > h - b.r) {
        if (bounce && b.vy > 0) {
          squish(b, b.vy, 0, 1);
          b.vy = b.vy < 1.2 ? 0 : -b.vy * BOUNCE;
          b.vx *= 0.96;
        }
        b.y = h - b.r;
      }
    };

    const collide = (bounce: boolean) => {
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
          // Move apart a little at a time over several passes. Capping it stops a
          // flower squeezed in a pile from being shot out and kicking everything again.
          const overlap = Math.min((min - d) * 0.5, 2);
          a.x -= nx * overlap * (mb / (ma + mb));
          a.y -= ny * overlap * (mb / (ma + mb));
          b.x += nx * overlap * (ma / (ma + mb));
          b.y += ny * overlap * (ma / (ma + mb));
          if (!bounce) continue;
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            squish(a, -rel, nx, ny);
            squish(b, -rel, -nx, -ny);
            // Slow touches don't bounce, so resting flowers stay put
            const e = rel > -1.5 ? 0 : BOUNCE;
            const impulse = (-(1 + e) * rel) / (1 / ma + 1 / mb);
            a.vx -= (impulse / ma) * nx;
            a.vy -= (impulse / ma) * ny;
            b.vx += (impulse / mb) * nx;
            b.vy += (impulse / mb) * ny;
            // Friction: flowers touching stop sliding along each other
            const tx = -ny;
            const ty = nx;
            const slide = ((b.vx - a.vx) * tx + (b.vy - a.vy) * ty) * 0.15;
            a.vx += tx * slide * (mb / (ma + mb));
            a.vy += ty * slide * (mb / (ma + mb));
            b.vx -= tx * slide * (ma / (ma + mb));
            b.vy -= ty * slide * (ma / (ma + mb));
          }
        }
      }
    };

    const step = () => {
      // The cursor eases towards the real mouse, so pushes feel soft rather than snappy
      if (mouse.tx > -9000) {
        const px = mouse.x < -9000 ? mouse.tx : mouse.x;
        const py = mouse.y < -9000 ? mouse.ty : mouse.y;
        mouse.x = px + (mouse.tx - px) * 0.25;
        mouse.y = py + (mouse.ty - py) * 0.25;
        mouse.vx += (mouse.x - px - mouse.vx) * 0.3;
        mouse.vy += (mouse.y - py - mouse.vy) * 0.3;
      }

      for (const b of bodies) {
        b.vy += GRAVITY;
        b.vx *= DRAG;
        b.vy *= DRAG;
        b.x += b.vx;
        b.y += b.vy;
        // Roll smoothly with sideways movement
        b.spin += ((b.vx / b.r) * 0.6 - b.spin) * 0.15;
        b.angle += b.spin;

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
          squish(b, Math.hypot(mouse.vx, mouse.vy) * 0.5, -nx, -ny);
        }

        // Each petal springs back with a little wobble
        for (let k = 0; k < b.sq.length; k++) {
          b.sqv[k] += -b.sq[k] * 0.16;
          b.sqv[k] *= 0.84;
          b.sq[k] += b.sqv[k];
        }
      }

      for (let pass = 0; pass < SOLVER_PASSES; pass++) {
        const first = pass === 0;
        collide(first);
        for (const b of bodies) walls(b, first);
      }

      // Barely moving flowers come to rest instead of creeping
      for (const b of bodies) {
        if (Math.hypot(b.vx, b.vy) < 0.6) {
          b.vx *= 0.8;
          b.vy *= 0.8;
          b.spin *= 0.8;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of bodies) {
        if (!b.whole || !b.petals) continue;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        const squished = b.sq.some((v) => Math.abs(v) > 0.003);
        if (!squished) {
          const half = b.whole.width / dpr / 2;
          ctx.drawImage(b.whole, -half, -half, half * 2, half * 2);
        } else {
          b.petals.forEach((p, k) => {
            // Pressed-in petals get shorter and a little wider, like squeezing a cushion
            const s = Math.max(-0.28, Math.min(0.14, b.sq[k]));
            const dir = PETAL_BOXES[k].dir;
            ctx.save();
            ctx.rotate(dir);
            ctx.scale(1 + s, 1 - s * 0.5);
            ctx.rotate(-dir);
            ctx.drawImage(p.img, p.ox, p.oy, p.w, p.h);
            ctx.restore();
          });
        }
        ctx.restore();
      }
    };

    const settle = () => {
      resize();
      spawn();
      makeSprites();
      for (let i = 0; i < 900; i++) step();
      for (const b of bodies) b.sq.fill(0);
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
    makeSprites();
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
