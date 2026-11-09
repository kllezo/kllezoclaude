"use client";

import { useEffect, useRef, useState } from "react";

/* The verdict: both days, one frame. Drag the divider (or use the arrow keys)
   to wipe between the day without a system and the day with one. */

const ROWS = [
  { at: "08:10", lost: "Post scrolled past", won: "Post stopped the scroll", by: "Content" },
  { at: "11:42", lost: "Visitor left in seconds", won: "Visitor sent an enquiry", by: "Website" },
  { at: "14:45", lost: "DM unread until tomorrow", won: "Replied in seconds, booked", by: "AI Texting" },
  { at: "18:20", lost: "Missed call, rang out", won: "Answered, appointment booked", by: "AI Calling" },
  { at: "22:30", lost: "Booked with someone else", won: "Booked with you", by: "Follow-up" },
];

export default function Compare() {
  const box = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);
  const drag = useRef(false);

  useEffect(() => {
    const el = box.current!;
    const set = (clientX: number) => {
      const r = el.getBoundingClientRect();
      setX(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
    };
    const down = (e: PointerEvent) => {
      drag.current = true;
      el.setPointerCapture(e.pointerId);
      set(e.clientX);
    };
    const move = (e: PointerEvent) => drag.current && set(e.clientX);
    const up = () => (drag.current = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  const panel = (mode: "lost" | "won") => (
    <div className={`cx-cmp-panel is-${mode}`}>
      <p className="cx-cmp-head">
        <b>{mode === "lost" ? "Without a system" : "With Kllezo"}</b>
        <span>{mode === "lost" ? "5 customers lost" : "5 customers won"}</span>
      </p>
      <ol>
        {ROWS.map((r) => (
          <li key={r.at}>
            <span className="cx-cmp-at">{r.at}</span>
            <span className="cx-cmp-what">{mode === "lost" ? r.lost : r.won}</span>
            <span className="cx-cmp-by">{mode === "lost" ? "✕" : r.by}</span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <section className="cx-compare cx-wrap" aria-labelledby="cmp-h">
      <p className="cx-kicker">The verdict</p>
      <h2 id="cmp-h" className="cx-display-md" data-cx-fade>
        Same day. <em>Different business.</em>
      </h2>
      <div
        ref={box}
        className="cx-cmp"
        style={{ ["--x" as string]: `${x}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Compare the day without a system and with Kllezo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(x)}
        aria-valuetext={x < 50 ? "Mostly with Kllezo" : "Mostly without a system"}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setX((v) => Math.max(4, v - 6));
          if (e.key === "ArrowRight") setX((v) => Math.min(96, v + 6));
        }}
        data-cursor="Drag"
      >
        {panel("won")}
        <div className="cx-cmp-top">{panel("lost")}</div>
        <div className="cx-cmp-handle" aria-hidden="true">
          <i>⟷</i>
        </div>
      </div>
      <p className="cx-cmp-note">Drag the line. Moments are illustrative — the difference is the system.</p>
    </section>
  );
}
