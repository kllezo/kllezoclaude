"use client";

/* Tiny synthesized sound kit — no audio files. Off until the visitor turns it on
   (nav toggle); every toy calls these and they no-op while muted. */

let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

export const sound = {
  get on() {
    return enabled;
  },
  set(on: boolean) {
    enabled = on;
    try {
      sessionStorage.setItem("kz-sound", on ? "1" : "0");
    } catch {}
    if (on) audio();
    listeners.forEach((l) => l(on));
  },
  subscribe(fn: (on: boolean) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  restore() {
    try {
      enabled = sessionStorage.getItem("kz-sound") === "1";
    } catch {}
    return enabled;
  },
};

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, { type = "sine" as OscillatorType, gain = 0.08, slide = 0, delay = 0 } = {}) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  tick: () => tone(1800, 0.03, { type: "square", gain: 0.02 }),
  pop: () => tone(620, 0.09, { slide: 420, gain: 0.07 }),
  sent: () => {
    tone(880, 0.07, { gain: 0.05 });
    tone(1320, 0.09, { gain: 0.05, delay: 0.06 });
  },
  like: () => {
    tone(660, 0.12, { type: "triangle", gain: 0.07 });
    tone(990, 0.16, { type: "triangle", gain: 0.06, delay: 0.07 });
  },
  ring: () => {
    for (let i = 0; i < 6; i++) tone(i % 2 ? 480 : 440, 0.12, { gain: 0.05, delay: i * 0.13 });
  },
  pickup: () => tone(523, 0.18, { type: "triangle", gain: 0.07, slide: 260 }),
  chime: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.5, { type: "triangle", gain: 0.05, delay: i * 0.08 }));
  },
  pluck: (f: number) => tone(f, 0.6, { type: "triangle", gain: 0.05, slide: -f * 0.02 }),
};
