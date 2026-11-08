"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { orbs } from "@/content/creativeMedia";
import { sfx } from "@/components/creative/kit/sfx";

/* 03 · AI CALLING — "2:14 a.m."
   The office is dark. The phone rings. Before the third ring, the Kllezo voice agent
   picks up, talks it through, and books it. Plays once when you arrive; call again
   whenever you like. Illustrative call, not a recording. */

const SCRIPT: { who: "agent" | "caller"; t: string }[] = [
  { who: "agent", t: "Good evening, Azure Villas. How can I help?" },
  { who: "caller", t: "Hi — is there a villa free this weekend?" },
  { who: "agent", t: "There is. The Sea Villa, Friday to Sunday. Shall I hold it for you?" },
  { who: "caller", t: "Yes, please." },
  { who: "agent", t: "Done. Confirmation is on its way to your WhatsApp." },
];

type Phase = "idle" | "ringing" | "live" | "booked";

export default function NightCall() {
  const root = useRef<HTMLElement>(null);
  const wave = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lines, setLines] = useState(0);
  const [secs, setSecs] = useState(0);
  const timers = useRef<number[]>([]);
  const speaking = useRef<"agent" | "caller" | null>(null);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const call = useCallback(() => {
    clear();
    setLines(0);
    setSecs(0);
    setPhase("ringing");
    speaking.current = null;
    sfx.ring();
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(1700, () => {
      setPhase("live");
      sfx.pickup();
    });
    let t = 2100;
    SCRIPT.forEach((l, i) => {
      at(t, () => {
        speaking.current = l.who;
        setLines(i + 1);
      });
      t += 700 + l.t.length * 24;
    });
    at(t, () => {
      speaking.current = null;
      setPhase("booked");
      sfx.chime();
    });
  }, []);

  // Start the first call when the section is properly in view.
  useEffect(() => {
    const el = root.current!;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          call();
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [call]);

  // Call timer
  useEffect(() => {
    if (phase !== "live") return;
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Voice waveform — bars move only while someone is speaking.
  useEffect(() => {
    const c = wave.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let amp = 0;
    const bars = 42;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const w = (c.width = c.clientWidth * 2);
      const h = (c.height = c.clientHeight * 2);
      const target = speaking.current ? 1 : 0.06;
      amp += (target - amp) * 0.12;
      ctx.clearRect(0, 0, w, h);
      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        const n = Math.sin(now / 140 + i * 0.7) * 0.5 + Math.sin(now / 77 + i * 1.9) * 0.35 + Math.sin(now / 310 + i) * 0.25;
        const env = Math.sin((i / (bars - 1)) * Math.PI);
        const bh = Math.max(3, Math.abs(n) * env * amp * h * 0.9);
        ctx.fillStyle = speaking.current === "caller" ? "rgba(251,245,233,0.85)" : "#c8a25a";
        ctx.fillRect(i * bw + bw * 0.25, (h - bh) / 2, bw * 0.5, bh);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <section ref={root} className="cx-toy cx-night" data-phase={phase} aria-labelledby="night-h">
      <Image className="cx-night-orb" src={orbs.calling.src} alt="" width={1024} height={1024} sizes="40vw" unoptimized aria-hidden="true" />
      <div className="cx-wrap cx-toy-grid">
        <div className="cx-toy-copy">
          <p className="cx-kicker">
            <span className="cx-gold">03</span> / 04 — AI Calling Agents
          </p>
          <h2 id="night-h" className="cx-toy-title">
            It&apos;s 2:14 a.m.
            <br />
            <em>Someone answers.</em>
          </h2>
          <p className="cx-toy-body">
            Your office is dark. Your team is asleep. The voice agent picks up on the first ring, qualifies the caller and books the appointment — then leaves your team a summary for the morning.
          </p>
          <div className="cx-night-office">
            <span>Your office</span>
            <b>Closed · voicemail</b>
            <span>Kllezo voice agent</span>
            <b className="cx-gold">{phase === "idle" ? "Waiting" : phase === "ringing" ? "Picking up…" : phase === "live" ? `On a call · ${mm}:${ss}` : "Booked ✓"}</b>
          </div>
          <div className="cx-toy-actions">
            <button type="button" className="cx-pill" onClick={call} data-cx-magnetic>
              {phase === "idle" ? "Ring the business" : "Call again"}
            </button>
            <Link href="/creative/services/ai-calling" className="cx-arrow-link">
              AI Calling Agents <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="cx-callphone" aria-live="polite">
          <div className="cx-callphone-top">
            <span>02:14</span>
            <span>●●●● 5G</span>
          </div>
          <div className="cx-call-who">
            <div className="cx-call-avatar">
              <i />
              <i />
              <i />
              <b>K</b>
            </div>
            <p className="cx-call-name">{phase === "ringing" ? "Incoming call" : "Kllezo Voice Agent"}</p>
            <p className="cx-call-sub">{phase === "ringing" ? "+91 98•• ••4410" : phase === "booked" ? "Call ended · 00:" + ss : `Azure Villas · ${mm}:${ss}`}</p>
          </div>
          <canvas ref={wave} className="cx-call-wave" />
          <div className="cx-call-lines">
            {SCRIPT.slice(0, lines).map((l, i) => (
              <p key={i} className={`is-${l.who}`}>
                <b>{l.who === "agent" ? "Agent" : "Caller"}</b> {l.t}
              </p>
            ))}
          </div>
          <div className="cx-call-booked">
            <i>✓</i>
            <div>
              <b>Appointment booked</b>
              <span>Sea Villa · Fri → Sun · summary sent to your team</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
