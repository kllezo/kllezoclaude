"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { sfx } from "@/components/creative/kit/sfx";

/* 04 · AI TEXTING — "Flood the inbox".
   Hold the button and enquiries pour in from every channel at midnight —
   faster and faster. Every single one gets a reply. Reach 100 and the
   inbox celebrates. Messages are illustrative. */

const CHANNELS = [
  { id: "wa", label: "WhatsApp", c: "#25d366" },
  { id: "ig", label: "Instagram", c: "#e1306c" },
  { id: "web", label: "Website", c: "#c8a25a" },
  { id: "sms", label: "SMS", c: "#7aa7ff" },
];
const ASKS = [
  "Are you open on Sunday?",
  "How much for a family of 4?",
  "Can I book for tomorrow?",
  "Do you deliver to Banjara Hills?",
  "Is the gold edition in stock?",
  "Can someone call me back?",
  "What are your timings?",
  "Do you have parking?",
  "Is there a slot at 7?",
  "Can I change my booking?",
  "Do you do corporate orders?",
  "Price for the weekend package?",
];
const NAMES = ["Aisha", "Rohan", "Meera", "Karthik", "Sana", "Vikram", "Priya", "Arjun", "Neha", "Imran", "Divya", "Rahul"];
const GOAL = 100;

type Msg = { id: number; ch: (typeof CHANNELS)[number]; name: string; ask: string; replied: boolean };

function burst(host: HTMLDivElement | null) {
  if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 46; i++) {
    const sp = document.createElement("i");
    host.appendChild(sp);
    const a = Math.random() * Math.PI * 2;
    const d = 120 + Math.random() * 260;
    gsap.fromTo(
      sp,
      { x: 0, y: 0, opacity: 1, scale: Math.random() * 0.8 + 0.4 },
      { x: Math.cos(a) * d, y: Math.sin(a) * d + 80, opacity: 0, rotate: Math.random() * 360, duration: 1.4 + Math.random(), ease: "expo.out", onComplete: () => sp.remove() },
    );
  }
}

export default function Flood() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [count, setCount] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  const sparks = useRef<HTMLDivElement>(null);
  const state = useRef({ holding: false, n: 0, acc: 0, rate: 0 });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(50, now - last);
      last = now;
      const s = state.current;
      if (!s.holding || s.n >= GOAL) return;
      s.rate = Math.min(26, s.rate + dt * 0.012); // messages per second, accelerating
      s.acc += (s.rate * dt) / 1000;
      while (s.acc >= 1 && s.n < GOAL) {
        s.acc -= 1;
        s.n += 1;
        const id = s.n;
        const m: Msg = {
          id,
          ch: CHANNELS[id % CHANNELS.length],
          name: NAMES[(id * 7) % NAMES.length],
          ask: ASKS[(id * 5) % ASKS.length],
          replied: false,
        };
        setMsgs((cur) => [m, ...cur].slice(0, 7));
        setCount(id);
        if (id % 3 === 0) sfx.pop();
        window.setTimeout(
          () => {
            setMsgs((cur) => cur.map((x) => (x.id === id ? { ...x, replied: true } : x)));
            setAnswered((a) => Math.max(a, id));
          },
          260 + Math.random() * 260,
        );
        if (id >= GOAL) {
          s.holding = false;
          setHolding(false);
          window.setTimeout(() => {
            setDone(true);
            sfx.chime();
            burst(sparks.current);
          }, 520);
        }
      }
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - s.n / GOAL);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const start = () => {
    if (state.current.n >= GOAL) reset();
    state.current.holding = true;
    setHolding(true);
  };
  const stop = () => {
    state.current.holding = false;
    state.current.rate = Math.max(0, state.current.rate * 0.3);
    setHolding(false);
  };
  const reset = () => {
    state.current = { holding: false, n: 0, acc: 0, rate: 0 };
    setMsgs([]);
    setCount(0);
    setAnswered(0);
    setDone(false);
    if (ring.current) ring.current.style.strokeDashoffset = "1";
  };

  return (
    <section className="cx-toy cx-flood" data-holding={holding ? "" : undefined} data-done={done ? "" : undefined} aria-labelledby="flood-h">
      <div className="cx-wrap cx-toy-grid">
        <div className="cx-toy-copy">
          <p className="cx-kicker">
            <span className="cx-gold">04</span> / 04 — AI Texting Agents
          </p>
          <h2 id="flood-h" className="cx-toy-title">
            Midnight.
            <br />
            <em>Every message</em> answered.
          </h2>
          <p className="cx-toy-body">
            WhatsApp, Instagram, your website, SMS — enquiries don&apos;t wait for office hours. The texting agent replies in seconds, qualifies, follows up and books, however many arrive at once.
          </p>
          <div className="cx-flood-counts" aria-live="polite">
            <div>
              <b>{String(count).padStart(3, "0")}</b>
              <span>enquiries</span>
            </div>
            <div>
              <b className="cx-gold">{String(answered).padStart(3, "0")}</b>
              <span>answered</span>
            </div>
          </div>
          <div className="cx-toy-actions">
            <button
              type="button"
              className="cx-hold"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                start();
              }}
              onPointerUp={stop}
              onPointerCancel={stop}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                  e.preventDefault();
                  start();
                }
              }}
              onKeyUp={(e) => (e.key === " " || e.key === "Enter") && stop()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="54" pathLength={1} />
                <circle ref={ring} cx="60" cy="60" r="54" pathLength={1} className="cx-hold-fill" />
              </svg>
              <span>{done ? "Again?" : holding ? "Keep holding" : count ? "Hold to continue" : "Hold to flood the inbox"}</span>
            </button>
            <Link href="/creative/services/ai-texting" className="cx-arrow-link">
              AI Texting Agents <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="cx-inbox" aria-label="Inbox">
          <div className="cx-inbox-head">
            <b>Inbox</b>
            <span>{holding ? "Incoming…" : done ? "All caught up" : "00:00 — quiet"}</span>
          </div>
          <ul>
            {msgs.map((m) => (
              <li key={m.id} className="cx-msg" style={{ ["--ch" as string]: m.ch.c }}>
                <i className="cx-msg-ch">{m.ch.label[0]}</i>
                <div>
                  <p>
                    <b>{m.name}</b> · {m.ch.label}
                  </p>
                  <p className="cx-msg-ask">{m.ask}</p>
                </div>
                <span className="cx-msg-st" data-on={m.replied ? "" : undefined}>
                  {m.replied ? "Replied ✓" : "…"}
                </span>
              </li>
            ))}
            {!msgs.length && <li className="cx-inbox-empty">No messages yet. Hold the button.</li>}
          </ul>
          <div ref={sparks} className="cx-sparks" aria-hidden="true" />
          <p className="cx-inbox-done">{GOAL} enquiries. {GOAL} replies. Nobody woke up.</p>
        </div>
      </div>
    </section>
  );
}
