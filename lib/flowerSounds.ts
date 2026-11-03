/**
 * Silly sound effects for the hero flowers, made on the fly with the
 * browser's audio synthesizer (no sound files). Phones only allow sound
 * after a tap, so `unlockSounds()` must be called from a tap first.
 */

let ctx: AudioContext | null = null;
// Everything plays through this, so one number sets how loud the flowers are
let master: GainNode | null = null;
const VOLUME = 0.2;
let lastBoing = 0;
let lastWhee = 0;

type WithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

export function unlockSounds() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as WithWebkit).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
}

const ready = () => (ctx && ctx.state === "running" ? ctx : null);

/** Quick volume shape: snap up, then fade out over `length` seconds */
function envelope(a: AudioContext, peak: number, length: number) {
  const g = a.createGain();
  const t = a.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  g.connect(master ?? a.destination);
  return g;
}

/**
 * A cartoon "boing" when a flower bumps something. `size` is the flower's
 * radius in px (big flowers boing lower) and `force` how hard it hit.
 */
export function boing(size: number, force: number) {
  const a = ready();
  const now = performance.now();
  // A pile hitting all at once would be a wall of noise, so space them out
  if (!a || now - lastBoing < 55) return;
  lastBoing = now;
  const base = (240 + 9000 / Math.max(size, 12)) * (0.92 + Math.random() * 0.16);
  const vol = Math.min(0.22, 0.05 + force * 0.015);
  const t = a.currentTime;
  const len = 0.32;

  const out = envelope(a, vol, len);
  const osc = a.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(base * 1.7, t);
  osc.frequency.exponentialRampToValueAtTime(base, t + 0.09);
  // The wobble is what makes it a "boing" rather than a beep
  const wobble = a.createOscillator();
  const depth = a.createGain();
  wobble.frequency.value = 22;
  depth.gain.setValueAtTime(base * 0.18, t);
  depth.gain.exponentialRampToValueAtTime(1, t + len);
  wobble.connect(depth).connect(osc.frequency);
  osc.connect(out);
  osc.start(t);
  wobble.start(t);
  osc.stop(t + len);
  wobble.stop(t + len);
}

/** A soft, bubbly "bloop" for tapping the flowers: two gentle rising notes */
export function pop() {
  const a = ready();
  if (!a) return;
  const t = a.currentTime;
  [
    { at: 0, from: 520, to: 760 },
    { at: 0.07, from: 780, to: 1050 },
  ].forEach(({ at, from, to }) => {
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t + at);
    g.gain.exponentialRampToValueAtTime(0.18, t + at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.16);
    g.connect(master ?? a.destination);
    const osc = a.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(from, t + at);
    osc.frequency.exponentialRampToValueAtTime(to, t + at + 0.06);
    osc.connect(g);
    osc.start(t + at);
    osc.stop(t + at + 0.18);
  });
}

/** A rising slide whistle for shaking the phone, at most about once a second */
export function whee() {
  const a = ready();
  const now = performance.now();
  if (!a || now - lastWhee < 900) return;
  lastWhee = now;
  const t = a.currentTime;
  const len = 0.45;
  const out = envelope(a, 0.12, len);
  const osc = a.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(380, t);
  osc.frequency.exponentialRampToValueAtTime(1500, t + len * 0.85);
  const wobble = a.createOscillator();
  const depth = a.createGain();
  wobble.frequency.value = 7;
  depth.gain.value = 25;
  wobble.connect(depth).connect(osc.frequency);
  osc.connect(out);
  osc.start(t);
  wobble.start(t);
  osc.stop(t + len);
  wobble.stop(t + len);
}
