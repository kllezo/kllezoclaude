"use client";

import { useEffect, useRef, useState } from "react";
import s from "./LeadFlow.module.css";

/* Signature interaction 04 — a live system visualisation of how
   leads move through Kllezo's AI communication layer. Illustrative:
   the event log cycles through example scenarios, not real data. */

const channels = ["WhatsApp", "Website chat", "Inbound call", "Lead form"];
const outcomes = ["Answered", "Qualified", "Booked", "Routed to team"];

const events: [number, number, string][] = [
  [0, 0, "Price question answered from the knowledge base"],
  [2, 2, "Caller booked into an available slot"],
  [3, 1, "Form lead qualified and followed up on WhatsApp"],
  [1, 3, "Complex request handed to your team with context"],
  [0, 2, "Appointment rescheduled and confirmation sent"],
  [3, 1, "Outbound follow-up call qualified a new lead"],
];

// Coordinates in a 600 × 300 viewBox
const cy = (i: number) => 45 + i * 70;
const CORE = { x: 300, y: 150 };
const inPath = (k: number) => `M118 ${cy(k)} C 210 ${cy(k)}, 220 ${CORE.y}, ${CORE.x - 42} ${CORE.y}`;
const outPath = (k: number) => `M${CORE.x + 42} ${CORE.y} C 380 ${CORE.y}, 390 ${cy(k)}, 482 ${cy(k)}`;
type Smil = SVGAnimationElement;

export default function LeadFlow() {
  // `seq` increases forever; the event shown is seq % events.length.
  const [seq, setSeq] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSeq((x) => x + 1), 2600);
    return () => window.clearInterval(id);
  }, []);

  const showIn = useRef<Smil>(null);
  const moveIn = useRef<Smil>(null);
  const showOut = useRef<Smil>(null);
  const moveOut = useRef<Smil>(null);

  // SMIL elements added after load would start "in the past", so restart them explicitly.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const r of [showIn, moveIn, showOut, moveOut]) r.current?.endElement?.();
    showIn.current?.beginElement();
    moveIn.current?.beginElement();
    showOut.current?.beginElementAt(1.2);
    moveOut.current?.beginElementAt(1.2);
  }, [seq]);

  const i = seq % events.length;
  const log = Array.from({ length: Math.min(4, seq + 1) }, (_, k) => seq - k);
  const [from, to] = events[i];

  return (
    <div className={s.flow}>
      <div className={s.stage}>
        <svg viewBox="0 0 600 300" className={s.svg} role="img" aria-label="Diagram: messages and calls from four channels flow into a Kllezo AI agent, which answers, qualifies, books or routes each lead, then syncs to your CRM.">
          {channels.map((c, k) => (
            <path key={c} id={`lf-in-${k}`} d={inPath(k)} className={s.path} data-on={k === from || undefined} />
          ))}
          {outcomes.map((o, k) => (
            <path key={o} id={`lf-out-${k}`} d={outPath(k)} className={s.path} data-on={k === to || undefined} />
          ))}

          {/* travelling lead for the current event (started from the effect below) */}
          <circle r="5" className={s.dot} opacity="0">
            <set ref={showIn} attributeName="opacity" to="1" begin="indefinite" />
            <animateMotion ref={moveIn} dur="1.1s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.65 0 0.35 1" keyTimes="0;1" path={inPath(from)} />
          </circle>
          <circle r="5" className={s.dot} opacity="0">
            <set ref={showOut} attributeName="opacity" to="1" begin="indefinite" />
            <animateMotion ref={moveOut} dur="1.1s" begin="indefinite" fill="freeze" calcMode="spline" keySplines="0.65 0 0.35 1" keyTimes="0;1" path={outPath(to)} />
          </circle>

          {channels.map((c, k) => (
            <g key={c} className={s.node} data-on={k === from || undefined} transform={`translate(10 ${cy(k) - 17})`}>
              <rect width="108" height="34" rx="10" />
              <text x="54" y="21" textAnchor="middle">
                {c}
              </text>
            </g>
          ))}
          <g className={s.core} transform={`translate(${CORE.x} ${CORE.y})`}>
            <circle r="56" className={s.halo} />
            <circle r="42" />
            <text y="-2" textAnchor="middle">
              AI Agent
            </text>
            <text y="14" textAnchor="middle" className={s.coreSub}>
              Kllezo
            </text>
          </g>
          {outcomes.map((o, k) => (
            <g key={o} className={`${s.node} ${s.out}`} data-on={k === to || undefined} transform={`translate(482 ${cy(k) - 17})`}>
              <rect width="108" height="34" rx="10" />
              <text x="54" y="21" textAnchor="middle">
                {o}
              </text>
            </g>
          ))}
        </svg>
        <div className={s.crm}>
          <span>Synced to your CRM, inbox &amp; calendar</span>
        </div>
      </div>

      <div className={s.log} aria-live="off">
        <div className={s.logHead}>
          <span className={s.liveDot} /> System activity <em>example scenarios</em>
        </div>
        <ul>
          {log.map((n, k) => {
            const [c, o, text] = events[n % events.length];
            return (
              <li key={n} data-first={k === 0 || undefined}>
                <span className={s.ch}>{channels[c]}</span>
                <span>{text}</span>
                <b>{outcomes[o]}</b>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
