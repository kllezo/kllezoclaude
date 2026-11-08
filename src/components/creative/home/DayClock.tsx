"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sfx } from "@/components/creative/kit/sfx";

gsap.registerPlugin(ScrollTrigger);

/* "24 hours of Kllezo" — scroll runs the clock from 6 a.m. to 8 a.m. the next day.
   The sky turns from dawn to night and back while the system works through one
   ordinary day: the reel, the visit, the enquiry, the reply, the 2 a.m. call. */

const START = 6 * 60; // 06:00
const END = 32 * 60; // 08:00 next day

const EVENTS = [
  { m: 7 * 60 + 30, tag: "Content", t: "Today's reel goes live." },
  { m: 9 * 60 + 15, tag: "Content", t: "It reaches people who have never heard of you." },
  { m: 12 * 60 + 40, tag: "Website", t: "One of them opens your website." },
  { m: 12 * 60 + 43, tag: "Website", t: "…and sends an enquiry from their phone." },
  { m: 12 * 60 + 44, tag: "AI Texting", t: "A reply lands before they've put the phone down." },
  { m: 18 * 60 + 30, tag: "AI Texting", t: "A follow-up reaches everyone still deciding." },
  { m: 23 * 60 + 50, tag: "AI Calling", t: "A missed call? The agent calls back." },
  { m: 26 * 60 + 14, tag: "AI Calling", t: "2:14 a.m. Someone calls. The agent answers and books." },
  { m: 32 * 60, tag: "Your team", t: "8:00 a.m. Your team wakes up to a full calendar." },
];

// sky colour stops across the day (progress 0..1)
const SKY = [
  "#14110c", // 06:00 first light
  "#2b2213", // morning gold
  "#0d3a34", // midday forest
  "#0f4a42", // afternoon
  "#3a2410", // sunset amber
  "#0b1714", // evening
  "#070a09", // midnight
  "#070a09", // 02:00
  "#0d1a17", // pre-dawn
  "#2b2213", // 08:00 morning again
];

const fmt = (m: number) => {
  const mm = Math.floor(m) % (24 * 60);
  return `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(Math.floor(mm % 60)).padStart(2, "0")}`;
};

export default function DayClock() {
  const root = useRef<HTMLElement>(null);
  const [min, setMin] = useState(START);

  useLayoutEffect(() => {
    const el = root.current!;
    const sky = gsap.utils.interpolate(SKY);
    let lastEvent = -1;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: el,
        pin: el.querySelector(".cx-day-pin"),
        start: "top top",
        end: "+=320%",
        scrub: true,
        onUpdate: (st) => {
          const p = st.progress;
          const m = START + (END - START) * p;
          setMin(m);
          el.style.setProperty("--sky", sky(p));
          // light text on dark sky, dark text on light sky
          const lum = gsap.utils.splitColor(sky(p)).reduce((a: number, c: number) => a + c, 0) / 765;
          el.dataset.light = lum > 0.55 ? "" : "dark";
          // sun arc by day (06:00–19:00), moon arc by night (19:00–06:00)
          const h = m % (24 * 60);
          const arc = h >= 6 * 60 && h < 19 * 60 ? (h - 6 * 60) / (13 * 60) : (((h - 19 * 60 + 24 * 60) % (24 * 60)) / (11 * 60));
          el.style.setProperty("--arc", arc.toFixed(4));
          const ev = EVENTS.filter((e) => e.m <= m).length - 1;
          if (ev !== lastEvent) {
            if (ev > lastEvent && st.isActive) sfx.pop();
            lastEvent = ev;
          }
        },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      setMin(END - 1);
    });
    return () => mm.revert();
  }, []);

  const night = min % (24 * 60) >= 19 * 60 || min % (24 * 60) < 6 * 60;
  const dayLabel = min < 24 * 60 ? (night ? "Tonight" : "Today") : night ? "Tonight" : "Tomorrow";

  return (
    <section ref={root} className="cx-day" aria-labelledby="day-h">
      <div className="cx-day-pin">
        <div className="cx-day-sun" data-night={night ? "" : undefined} aria-hidden="true" />
        <div className="cx-wrap cx-day-grid">
          <div className="cx-day-clock">
            <p className="cx-kicker" id="day-h">
              24 hours of Kllezo
            </p>
            <p className="cx-day-time" aria-hidden="true">
              {fmt(min)}
            </p>
            <p className="cx-day-label">
              {dayLabel} — <em>the system keeps working.</em>
            </p>
          </div>
          <ol className="cx-day-events">
            {EVENTS.map((e) => (
              <li key={e.m} data-on={min >= e.m ? "" : undefined} data-now={min >= e.m && min < e.m + 150 ? "" : undefined}>
                <span className="cx-day-at">{fmt(e.m)}</span>
                <span className="cx-day-tag">{e.tag}</span>
                <p>{e.t}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
