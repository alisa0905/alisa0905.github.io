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
  /** Rotation and its speed, so flowers roll as they move */
  angle: number;
  spin: number;
  /**
   * Squish as a stretch in x, y and diagonal (so hits from several sides add
   * up), plus how fast each part is springing back
   */
  sq: [number, number, number];
  sqv: [number, number, number];
  /** Has dropped into the box (the ceiling only applies after this) */
  inside: boolean;
  /** The flower pre-drawn once, so each frame just stamps it */
  sprite?: HTMLCanvasElement;
};

/**
 * Where the flowers live, per screen size (Alisa's sketches): everything below
 * a slanted line from `a` to `b`, given as fractions of the hero's width and
 * height. `size` scales the flowers and `fill` is how much of that area their
 * circles cover (lower = fewer flowers, so phones don't get a crowded pile).
 */
const AREAS = {
  desktop: { a: [0.409, 1], b: [0.738, 0], size: 0.95, fill: 0.62 },
  tablet: { a: [0, 0.96], b: [1, 0.2], size: 1.25, fill: 0.85 },
  phone: { a: [0, 1], b: [1, 0.45], size: 1.6, fill: 0.95 },
};
const MAX_COUNT = 60;
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
// Sprite size: furthest point from the centre, with room for the outline
const FLOWER_R =
  Math.max(...PETAL_POINTS.flatMap((n) => n.map((v, i) => Math.abs(v - (i % 2 ? CY : CX))))) +
  FLOWER.strokeWidth;
// How big the flower looks, used to size it against its hit circle
const [, , VB_W, VB_H] = FLOWER.viewBox.split(" ").map(Number);
const FLOWER_LOOK_R = Math.max(VB_W, VB_H) / 2;

/**
 * Ten colourful, squishy flowers in the home hero. On computers they drop in,
 * bounce, drift away from the cursor and squish from whichever side they're
 * hit. On phones the same physics runs once, instantly, and the settled
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

    // The slanted edge of the flower area, in px: the line through (ax, ay) and
    // (bx, by); flowers stay on the side below it
    let area = AREAS.desktop;
    let ax = 0, ay = 0, slope = 0;
    const lineY = (x: number) => ay + slope * (x - ax);
    const pickArea = () => {
      const vw = window.innerWidth;
      area = vw >= 1024 ? AREAS.desktop : vw >= 640 ? AREAS.tablet : AREAS.phone;
      ax = area.a[0] * w;
      ay = area.a[1] * h;
      slope = (area.b[1] * h - ay) / (area.b[0] * w - ax);
    };
    const inArea = (x: number, y: number) => y >= lineY(x);

    const spawn = () => {
      pickArea();
      // Size of the flower area, measured column by column
      let areaPx = 0;
      for (let i = 0; i < 100; i++) {
        const x = ((i + 0.5) / 100) * w;
        areaPx += (h - Math.max(0, Math.min(h, lineY(x)))) * (w / 100);
      }
      const unit = Math.sqrt(areaPx) * area.size;
      // As many flowers as fit the space, so small screens get fewer and they
      // don't pile on top of each other
      const room = areaPx * area.fill;
      const radii: number[] = [];
      for (let i = 0, used = 0; i < MAX_COUNT; i++) {
        const r = unit * (0.068 + ((i * 7) % 5) * 0.014);
        if (i >= 3 && used + Math.PI * r * r > room) break;
        used += Math.PI * r * r;
        radii.push(r);
      }
      // Highest x where the area reaches the top, for dropping flowers in
      const topX = Math.min(w, Math.max(0, ax + (0 - ay) / slope));
      bodies = radii.map((r, i) => {
        // Phones: start somewhere inside the area
        let sx = w - r, sy = h - r;
        for (let t = 0; t < 40; t++) {
          const x = r + Math.random() * (w - 2 * r);
          const y = r + Math.random() * (h - 2 * r);
          if (inArea(x, y - r)) {
            sx = x;
            sy = y;
            break;
          }
        }
        return {
          r,
          // Computers: drop in from above where the area meets the top
          x: live ? topX + Math.random() * Math.max(1, w - topX - r * REACH) : sx,
          y: live ? -r - i * r * 1.2 : sy,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          color: COLORS[i % COLORS.length],
          angle: Math.random() * Math.PI * 2,
          spin: 0,
          sq: [0, 0, 0],
          sqv: [0, 0, 0],
          inside: false,
        };
      });
    };

    // Draw each flower once, so frames only stamp an image
    const makeSprites = () => {
      for (const b of bodies) {
        const unitPx = (b.r * REACH) / FLOWER_LOOK_R; // screen px per flower unit
        const px = Math.ceil(FLOWER_R * 2 * unitPx * dpr);
        const c = document.createElement("canvas");
        c.width = c.height = px;
        const g = c.getContext("2d");
        if (!g) continue;
        g.translate(px / 2, px / 2);
        g.scale(dpr * unitPx, dpr * unitPx);
        g.translate(-CX, -CY);
        g.fillStyle = b.color;
        g.strokeStyle = b.color;
        g.lineWidth = FLOWER.strokeWidth;
        g.lineJoin = "round";
        for (const p of paths) {
          g.fill(p);
          g.stroke(p);
        }
        b.sprite = c;
      }
    };

    // A hit flattens the whole flower along the hit and bulges it out sideways
    const squish = (b: Body, speed: number, towardX: number, towardY: number) => {
      // Ignore the tiny nudges of flowers resting in a pile
      if (speed < 2) return;
      const k = Math.min(speed, 12) * 0.008;
      const nx = towardX;
      const ny = towardY;
      // Press in along the hit (n·nᵀ), puff out across it (t·tᵀ, t = n turned 90°)
      b.sqv[0] += -k * nx * nx + 0.6 * k * ny * ny;
      b.sqv[1] += -k * ny * ny + 0.6 * k * nx * nx;
      b.sqv[2] += -k * nx * ny - 0.6 * k * nx * ny;
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
      // The slanted edge of the flower area works like a wall
      {
        const len = Math.hypot(slope, 1);
        const d = (b.y - lineY(b.x)) / len;
        if (d < b.r) {
          const nx = -slope / len;
          const ny = 1 / len;
          b.x += nx * (b.r - d);
          b.y += ny * (b.r - d);
          // Stop moving into the wall, and let friction stop sliding along it
          const into = b.vx * nx + b.vy * ny;
          if (into < 0) {
            b.vx -= into * nx;
            b.vy -= into * ny;
          }
          b.vx *= 0.9;
          b.vy *= 0.9;
        }
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
          const overlap = Math.min((min - d) * 0.5, 4);
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

        // Springs back with one soft wobble, not a jiggle
        for (let k = 0; k < 3; k++) {
          b.sqv[k] += -b.sq[k] * 0.16;
          b.sqv[k] *= 0.76;
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
      const lim = (v: number) => Math.max(-0.16, Math.min(0.16, v));
      for (const b of bodies) {
        if (!b.sprite) continue;
        const half = b.sprite.width / dpr / 2;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.transform(1 + lim(b.sq[0]), lim(b.sq[2]), lim(b.sq[2]), 1 + lim(b.sq[1]), 0, 0);
        ctx.rotate(b.angle);
        ctx.drawImage(b.sprite, -half, -half, half * 2, half * 2);
        ctx.restore();
      }
    };

    const settle = () => {
      resize();
      spawn();
      makeSprites();
      for (let i = 0; i < 900; i++) step();
      for (const b of bodies) b.sq = [0, 0, 0];
      draw();
    };

    if (!live) {
      settle();
      // Phones: scrolling gives the pile a little bounce. The animation only
      // runs until they settle again, then stops, so it costs almost nothing.
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let lastScroll = window.scrollY;
      let still = 0;
      let ticks = 0;
      const run = () => {
        ticks++;
        step();
        draw();
        const moving = bodies.some(
          (b) => Math.hypot(b.vx, b.vy) > 0.3 || Math.abs(b.sq[0]) + Math.abs(b.sq[1]) + Math.abs(b.sq[2]) > 0.004,
        );
        still = moving ? 0 : still + 1;
        // Always switch off a few seconds after the last scroll, even if a flower is still creeping
        frame = still > 20 || ticks > 240 ? 0 : requestAnimationFrame(run);
      };
      const onScroll = () => {
        const dy = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        if (calm || !dy) return;
        const rect = canvas.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        // Scrolling down jolts them up a little, like shaking a box
        const kick = Math.max(-6, Math.min(6, dy * 0.12));
        for (const b of bodies) {
          b.vy -= kick * (0.6 + Math.random() * 0.4);
          b.vx += (Math.random() - 0.5) * Math.abs(kick) * 0.4;
        }
        still = 0;
        ticks = 0;
        if (!frame) frame = requestAnimationFrame(run);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      // Redo the pile whenever the box changes size (not just the window), so the
      // picture is never stretched out of shape
      let lastSize = `${Math.round(w)}x${Math.round(h)}`;
      const ro = new ResizeObserver(() => {
        const r = canvas.getBoundingClientRect();
        const size = `${Math.round(r.width)}x${Math.round(r.height)}`;
        if (size === lastSize) return;
        lastSize = size;
        settle();
      });
      ro.observe(canvas);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        ro.disconnect();
      };
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
      pickArea();
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
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none ${className ?? ""}`} />;
}
