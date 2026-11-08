"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/components/creative/kit/sfx";

/* The opening: the visitor's own clock, live — and while they read, the things a
   business misses quietly pile up in the corner. Problem first, before a word
   about Kllezo. Notifications are illustrative. */

const PILE = [
  { icon: "☎", t: "Missed call", s: "+91 98•• ••4410 · no voicemail" },
  { icon: "✉", t: "Instagram DM", s: "“Is this still available?” · unread" },
  { icon: "◐", t: "Website visitor left", s: "Pricing page · 6 seconds" },
  { icon: "✎", t: "Enquiry form abandoned", s: "Stopped at “Phone number”" },
  { icon: "☎", t: "Missed call", s: "Unknown number · after hours" },
  { icon: "✉", t: "WhatsApp", s: "“Can I book for Saturday?” · unread" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function LiveHero() {
  const [now, setNow] = useState<Date | null>(null);
  const [pile, setPile] = useState<number[]>([]);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    let n = 0;
    const add = () => {
      const key = n++;
      setPile((p) => [key, ...p].slice(0, 4));
      sfx.pop();
    };
    const t0 = window.setTimeout(add, 1600);
    const pileId = window.setInterval(add, 3400);
    return () => {
      clearTimeout(first);
      clearTimeout(t0);
      clearInterval(id);
      clearInterval(pileId);
    };
  }, []);

  const h = now ? pad(now.getHours()) : "--";
  const m = now ? pad(now.getMinutes()) : "--";
  const s = now ? pad(now.getSeconds()) : "--";

  return (
    <section className="cx-live" aria-labelledby="live-h">
      <div className="cx-live-grain" aria-hidden="true" />
      <div className="cx-wrap cx-live-inner">
        <p className="cx-kicker" data-cx-fade="0.1">
          <span className="cx-rec" aria-hidden="true" /> Live — your time
        </p>
        <p className="cx-live-clock" aria-hidden="true">
          {h}
          <span className="cx-live-colon">:</span>
          {m}
          <small>{s}</small>
        </p>
        <h1 id="live-h" className="cx-live-title" data-cx-fade="0.3">
          Right now, someone is trying to reach a business like yours.
          <br />
          <em>Most of them never get an answer.</em>
        </h1>
        <div className="cx-live-foot" data-cx-fade="0.5">
          <p>Watch one ordinary day — what it costs without a system, and what changes with one.</p>
          <a href="#act-1" className="cx-scroll">
            <span>Start the day</span>
            <i aria-hidden="true" />
          </a>
        </div>
      </div>

      <ol className="cx-pile" aria-label="Notifications piling up">
        {pile.map((key) => {
          const item = PILE[key % PILE.length];
          return (
            <li key={key} className="cx-note">
              <i aria-hidden="true">{item.icon}</i>
              <div>
                <b>{item.t}</b>
                <span>{item.s}</span>
              </div>
              <time>now</time>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
